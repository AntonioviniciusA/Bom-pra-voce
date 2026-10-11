begin;

alter table bpv.promotion_campaigns
  add column instagram_feed_enabled boolean not null default false,
  add column instagram_story_enabled boolean not null default false,
  add column instagram_caption text not null default '' check (char_length(instagram_caption) <= 2200);

create table bpv.social_publications (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references bpv.promotion_campaigns(id) on delete cascade,
  promotion_version_id uuid not null references bpv.promotion_versions(id) on delete cascade,
  provider text not null default 'instagram' check (provider = 'instagram'),
  surface text not null check (surface in ('feed', 'story')),
  status text not null default 'queued' check (status in ('queued', 'processing', 'published', 'failed', 'cancelled', 'expired')),
  caption text not null default '' check (char_length(caption) <= 2200),
  public_path text not null,
  scheduled_at timestamptz not null default statement_timestamp(),
  locked_until timestamptz,
  attempts integer not null default 0 check (attempts >= 0),
  container_id text,
  external_media_id text,
  permalink text,
  failure_code text,
  failure_message text,
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  unique (promotion_version_id, provider, surface),
  check ((status <> 'published') or published_at is not null),
  check ((surface <> 'story') or expires_at is null or expires_at > created_at)
);

create index social_publications_worker_idx on bpv.social_publications (scheduled_at, id)
  where status = 'queued';
create index social_publications_campaign_idx on bpv.social_publications (campaign_id, created_at desc);
alter table bpv.social_publications enable row level security;
revoke all on bpv.social_publications from public, anon, authenticated;
grant all on bpv.social_publications to service_role;

create or replace function public.bpv_create_campaign(p_actor uuid, p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare campaign bpv.promotion_campaigns;
begin
  if not public.bpv_has_permission(p_actor, 'promotions.manage') then raise exception using errcode='P0001', message='FORBIDDEN'; end if;
  insert into bpv.promotion_campaigns(
    title,summary,conditions,starts_at,ends_at,created_by,category_key,display_order,hud_label,icon_key,theme_key,
    instagram_feed_enabled,instagram_story_enabled,instagram_caption
  ) values (
    p_payload->>'title',p_payload->>'summary',p_payload->>'conditions',(p_payload->>'starts_at')::timestamptz,(p_payload->>'ends_at')::timestamptz,p_actor,
    coalesce(p_payload->>'category_key','other'),coalesce((p_payload->>'display_order')::integer,100),coalesce(p_payload->>'hud_label',''),p_payload->>'icon_key',p_payload->>'theme_key',
    coalesce((p_payload->>'instagram_feed_enabled')::boolean,false),coalesce((p_payload->>'instagram_story_enabled')::boolean,false),coalesce(p_payload->>'instagram_caption','')
  ) returning * into campaign;
  insert into bpv.audit_events(actor_id,operation,target_type,target_id,outcome) values(p_actor,'promotion.create','promotion_campaign',campaign.id,'success');
  return to_jsonb(campaign);
end;
$$;

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
    instagram_feed_enabled = coalesce((p_payload->>'instagram_feed_enabled')::boolean,false),
    instagram_story_enabled = coalesce((p_payload->>'instagram_story_enabled')::boolean,false),
    instagram_caption = coalesce(p_payload->>'instagram_caption',''),
    revision = revision + 1, updated_at = statement_timestamp()
  where id = p_campaign_id and revision = p_expected_revision returning * into campaign;
  if campaign.id is null then raise exception using errcode='P0001', message='REVISION_CONFLICT'; end if;
  insert into bpv.audit_events(actor_id,operation,target_type,target_id,outcome)
    values(p_actor,'promotion.update','promotion_campaign',campaign.id,'success');
  return to_jsonb(campaign);
end;
$$;

create or replace function bpv.enqueue_instagram_publications()
returns trigger language plpgsql security definer set search_path = '' as $$
declare version bpv.promotion_versions; due_at timestamptz;
begin
  if new.state <> 'published' or new.active_version_id is null then return new; end if;
  if new.active_version_id is not distinct from old.active_version_id
    and new.instagram_feed_enabled is not distinct from old.instagram_feed_enabled
    and new.instagram_story_enabled is not distinct from old.instagram_story_enabled then return new; end if;
  select * into version from bpv.promotion_versions where id = new.active_version_id and campaign_id = new.id;
  due_at := greatest(new.starts_at, statement_timestamp());
  if new.instagram_feed_enabled then
    insert into bpv.social_publications(campaign_id,promotion_version_id,surface,status,caption,public_path,scheduled_at,failure_code,failure_message)
    values(new.id,version.id,'feed',case when version.mime_type = 'image/jpeg' then 'queued' else 'failed' end,new.instagram_caption,version.public_path,due_at,
      case when version.mime_type = 'image/jpeg' then null else 'UNSUPPORTED_MEDIA' end,
      case when version.mime_type = 'image/jpeg' then null else 'Para publicar automaticamente no Instagram, envie o panfleto como JPG.' end)
    on conflict (promotion_version_id,provider,surface) do nothing;
  end if;
  if new.instagram_story_enabled then
    insert into bpv.social_publications(campaign_id,promotion_version_id,surface,status,caption,public_path,scheduled_at,failure_code,failure_message)
    values(new.id,version.id,'story',case when version.mime_type = 'image/jpeg' then 'queued' else 'failed' end,new.instagram_caption,version.public_path,due_at,
      case when version.mime_type = 'image/jpeg' then null else 'UNSUPPORTED_MEDIA' end,
      case when version.mime_type = 'image/jpeg' then null else 'Para publicar automaticamente no Instagram, envie o panfleto como JPG.' end)
    on conflict (promotion_version_id,provider,surface) do nothing;
  end if;
  return new;
end;
$$;

create trigger promotion_enqueue_instagram_publications
after update of active_version_id on bpv.promotion_campaigns
for each row execute function bpv.enqueue_instagram_publications();

create or replace function public.bpv_list_social_publications(p_actor uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  if not public.bpv_has_permission(p_actor, 'promotions.manage') then raise exception using errcode='P0001', message='FORBIDDEN'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id',p.id,'campaign_id',p.campaign_id,'campaign_title',c.title,'surface',p.surface,'status',p.status,'caption',p.caption,
    'scheduled_at',p.scheduled_at,'published_at',p.published_at,'expires_at',p.expires_at,'permalink',p.permalink,
    'failure_code',p.failure_code,'failure_message',p.failure_message,'attempts',p.attempts,'created_at',p.created_at
  ) order by p.scheduled_at desc,p.created_at desc) from bpv.social_publications p join bpv.promotion_campaigns c on c.id=p.campaign_id),'[]'::jsonb);
end;
$$;

create or replace function public.bpv_retry_social_publication(p_actor uuid, p_publication_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare publication bpv.social_publications;
begin
  if not public.bpv_has_permission(p_actor, 'promotions.manage') then raise exception using errcode='P0001', message='FORBIDDEN'; end if;
  update bpv.social_publications set status='queued', scheduled_at=statement_timestamp(), locked_until=null, container_id=null,
    failure_code=null, failure_message=null, updated_at=statement_timestamp()
  where id=p_publication_id and status='failed' returning * into publication;
  if publication.id is null then raise exception using errcode='P0001', message='RETRY_NOT_ALLOWED'; end if;
  insert into bpv.audit_events(actor_id,operation,target_type,target_id,outcome,metadata)
    values(p_actor,'instagram.retry','social_publication',publication.id,'success',jsonb_build_object('surface',publication.surface));
  return to_jsonb(publication);
end;
$$;

create or replace function public.bpv_claim_social_publications(p_limit integer default 10)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare claimed jsonb;
begin
  with candidates as (
    select id from bpv.social_publications
    where (status='queued' or (status='processing' and locked_until < statement_timestamp()))
      and scheduled_at<=statement_timestamp()
    order by scheduled_at,id limit least(greatest(coalesce(p_limit,10),1),25)
    for update skip locked
  ), updated as (
    update bpv.social_publications p set status='processing',attempts=p.attempts+1,locked_until=statement_timestamp()+interval '10 minutes',updated_at=statement_timestamp()
    from candidates c where p.id=c.id
    returning p.*
  ) select coalesce(jsonb_agg(jsonb_build_object('id',id,'surface',surface,'caption',caption,'public_path',public_path,'container_id',container_id)),'[]'::jsonb) into claimed from updated;
  return claimed;
end;
$$;

revoke all on function public.bpv_list_social_publications(uuid) from public,anon,authenticated;
revoke all on function public.bpv_retry_social_publication(uuid,uuid) from public,anon,authenticated;
revoke all on function public.bpv_claim_social_publications(integer) from public,anon,authenticated;
grant execute on function public.bpv_list_social_publications(uuid) to service_role;
grant execute on function public.bpv_retry_social_publication(uuid,uuid) to service_role;
grant execute on function public.bpv_claim_social_publications(integer) to service_role;

commit;
