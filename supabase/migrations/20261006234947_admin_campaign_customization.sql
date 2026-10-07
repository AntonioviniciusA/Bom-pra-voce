begin;

alter table bpv.promotion_campaigns
  add column hud_label text not null default '' check (char_length(hud_label) <= 60),
  add column icon_key text check (icon_key in ('tag','cart','snowflake','baby','droplets','package','star','sparkles')),
  add column theme_key text check (theme_key in ('purple','green','red','blue','orange'));

create or replace function public.bpv_update_campaign(p_actor uuid, p_campaign_id uuid, p_expected_revision bigint, p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare campaign bpv.promotion_campaigns;
begin
  if not public.bpv_has_permission(p_actor, 'promotions.manage') then raise exception using errcode='P0001', message='FORBIDDEN'; end if;
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' then raise exception 'INVALID_PAYLOAD'; end if;
  update bpv.promotion_campaigns set
    title = p_payload->>'title', summary = p_payload->>'summary', conditions = p_payload->>'conditions',
    starts_at = (p_payload->>'starts_at')::timestamptz, ends_at = (p_payload->>'ends_at')::timestamptz,
    category_key = coalesce(p_payload->>'category_key','other'), display_order = coalesce((p_payload->>'display_order')::integer,100),
    hud_label = coalesce(p_payload->>'hud_label',''), icon_key = p_payload->>'icon_key', theme_key = p_payload->>'theme_key',
    revision = revision + 1, updated_at = statement_timestamp()
  where id = p_campaign_id and revision = p_expected_revision returning * into campaign;
  if campaign.id is null then raise exception using errcode='P0001', message='REVISION_CONFLICT'; end if;
  insert into bpv.audit_events(actor_id,operation,target_type,target_id,outcome)
    values(p_actor,'promotion.update','promotion_campaign',campaign.id,'success');
  return to_jsonb(campaign);
end;
$$;

create or replace function public.bpv_create_campaign(p_actor uuid, p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare campaign bpv.promotion_campaigns;
begin
  if not public.bpv_has_permission(p_actor, 'promotions.manage') then raise exception using errcode='P0001', message='FORBIDDEN'; end if;
  insert into bpv.promotion_campaigns(title,summary,conditions,starts_at,ends_at,created_by,category_key,display_order,hud_label,icon_key,theme_key)
    values(p_payload->>'title',p_payload->>'summary',p_payload->>'conditions',(p_payload->>'starts_at')::timestamptz,(p_payload->>'ends_at')::timestamptz,p_actor,
      coalesce(p_payload->>'category_key','other'),coalesce((p_payload->>'display_order')::integer,100),coalesce(p_payload->>'hud_label',''),p_payload->>'icon_key',p_payload->>'theme_key')
    returning * into campaign;
  insert into bpv.audit_events(actor_id,operation,target_type,target_id,outcome) values(p_actor,'promotion.create','promotion_campaign',campaign.id,'success');
  return to_jsonb(campaign);
end;
$$;

-- Keep publication and metadata in the same transaction. The old version stays active on any error.
create or replace function public.bpv_publish_campaign_details(
  p_actor uuid, p_campaign_id uuid, p_expected_revision bigint, p_publication_key uuid,
  p_draft_path text, p_public_path text, p_sha256 text, p_mime_type text, p_size_bytes integer, p_payload jsonb
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare campaign bpv.promotion_campaigns; existing bpv.promotion_versions; result jsonb;
begin
  if not public.bpv_has_permission(p_actor, 'promotions.manage') then raise exception using errcode='P0001', message='FORBIDDEN'; end if;
  select * into campaign from bpv.promotion_campaigns where id=p_campaign_id for update;
  if campaign.id is null then raise exception using errcode='P0001', message='NOT_FOUND'; end if;
  select * into existing from bpv.promotion_versions where campaign_id=p_campaign_id and publication_key=p_publication_key;
  if existing.id is not null then
    if existing.sha256 <> p_sha256 then raise exception using errcode='P0001', message='PAYLOAD_CONFLICT'; end if;
    return jsonb_build_object('campaign_id',campaign.id,'version_id',existing.id,'revision',campaign.revision);
  end if;
  if campaign.revision <> p_expected_revision then raise exception using errcode='P0001', message='REVISION_CONFLICT'; end if;
  if p_payload is not null then
    perform public.bpv_update_campaign(p_actor,p_campaign_id,p_expected_revision,p_payload);
    p_expected_revision := p_expected_revision + 1;
  end if;
  result := public.bpv_publish_campaign(p_actor,p_campaign_id,p_expected_revision,p_publication_key,p_draft_path,p_public_path,p_sha256,p_mime_type,p_size_bytes);
  return result;
end;
$$;

create or replace function public.bpv_public_promotions()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('server_time',statement_timestamp(),'campaigns',coalesce(jsonb_agg(jsonb_build_object(
    'id',c.id,'title',c.title,'summary',c.summary,'conditions',c.conditions,'starts_at',c.starts_at,'ends_at',c.ends_at,
    'category_key',c.category_key,'display_order',c.display_order,'hud_label',c.hud_label,'icon_key',c.icon_key,'theme_key',c.theme_key,
    'public_path',v.public_path,'mime_type',v.mime_type,'size_bytes',v.size_bytes,'thumbnail_path',v.thumbnail_path
  ) order by c.display_order,c.starts_at desc,c.id),'[]'::jsonb))
  from bpv.promotion_campaigns c join bpv.promotion_versions v on v.id=c.active_version_id and v.campaign_id=c.id
  where c.state='published' and c.starts_at<=statement_timestamp() and c.ends_at>statement_timestamp();
$$;

create or replace function public.bpv_list_applications_page(p_actor uuid, p_before timestamptz default null, p_before_id uuid default null, p_limit integer default 50)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  if not public.bpv_has_permission(p_actor,'applications.read') then raise exception using errcode='P0001',message='FORBIDDEN'; end if;
  insert into bpv.audit_events(actor_id,operation,target_type,outcome) values(p_actor,'applications.list','application','success');
  return (select coalesce(jsonb_agg(row_data order by received_at desc,id desc),'[]'::jsonb) from (
    select a.id,a.received_at,jsonb_build_object('id',a.id,'candidate_name',a.candidate_name,'email',a.email,'phone',a.phone,
      'birth_date',a.birth_date,'address',a.address,'area',a.area,'received_at',a.received_at,'delete_after',a.delete_after,
      'inspection_state',f.inspection_state,'file_name',f.original_name) row_data
    from bpv.applications a join bpv.application_files f on f.application_id=a.id
    where a.deleted_at is null and a.access_blocked_at is null and a.delete_after>statement_timestamp()
      and (p_before is null or a.received_at<p_before or (a.received_at=p_before and a.id<p_before_id))
    order by a.received_at desc,a.id desc limit least(greatest(p_limit,1),100)
  ) listed);
end;
$$;

revoke all on function public.bpv_update_campaign(uuid,uuid,bigint,jsonb) from public,anon,authenticated;
revoke all on function public.bpv_publish_campaign_details(uuid,uuid,bigint,uuid,text,text,text,text,integer,jsonb) from public,anon,authenticated;
revoke all on function public.bpv_list_applications_page(uuid,timestamptz,uuid,integer) from public,anon,authenticated;
grant execute on function public.bpv_update_campaign(uuid,uuid,bigint,jsonb) to service_role;
grant execute on function public.bpv_publish_campaign_details(uuid,uuid,bigint,uuid,text,text,text,text,integer,jsonb) to service_role;
grant execute on function public.bpv_list_applications_page(uuid,timestamptz,uuid,integer) to service_role;

commit;
