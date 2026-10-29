begin;
create table bpv.product_campaigns (
 id uuid primary key,
 revision bigint not null default 0,
 state text not null check (state in ('published','withdrawn')),
 snapshot jsonb not null,
 starts_at timestamptz not null,
 ends_at timestamptz not null check (ends_at>starts_at),
 updated_at timestamptz not null default now(),
 updated_by uuid not null references auth.users(id)
);
create table bpv.product_campaign_revisions (
 campaign_id uuid not null references bpv.product_campaigns(id),
 revision bigint not null,
 snapshot jsonb not null,
 state text not null,
 actor uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 primary key(campaign_id,revision)
);
alter table bpv.product_campaigns enable row level security;
alter table bpv.product_campaign_revisions enable row level security;
revoke all on bpv.product_campaigns,bpv.product_campaign_revisions from public,anon,authenticated;
grant select,insert,update on bpv.product_campaigns to service_role;
grant select,insert on bpv.product_campaign_revisions to service_role;

create function public.bpv_write_product_campaign(p_actor uuid,p_id uuid,p_expected_revision bigint,p_snapshot jsonb)
returns jsonb language plpgsql security definer set search_path=pg_catalog,bpv as $$
declare c bpv.product_campaigns; s timestamptz; e timestamptz;
begin
 if not public.bpv_has_permission(p_actor,'promotions.manage') then raise exception 'FORBIDDEN'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_id::text,0));
 select * into c from bpv.product_campaigns where id=p_id for update;
 if p_expected_revision is null or p_expected_revision<>coalesce(c.revision,0) then raise exception 'REVISION_CONFLICT'; end if;
 if p_snapshot is null then
   if c.id is null then raise exception 'NOT_FOUND'; end if;
   update bpv.product_campaigns set state='withdrawn',revision=revision+1,updated_at=now(),updated_by=p_actor where id=p_id returning * into c;
 else
   s=(p_snapshot->>'starts_at')::timestamptz; e=(p_snapshot->>'ends_at')::timestamptz;
   if s is null or e is null or e<=s or e<=now() or jsonb_typeof(p_snapshot->'items') is distinct from 'array' then raise exception 'INVALID_CAMPAIGN'; end if;
   if jsonb_array_length(p_snapshot->'items') not between 1 and 100 or coalesce(length(trim(p_snapshot->>'title')),0)=0 then raise exception 'INVALID_CAMPAIGN'; end if;
   insert into bpv.product_campaigns(id,revision,state,snapshot,starts_at,ends_at,updated_by)
     values(p_id,1,'published',p_snapshot,s,e,p_actor)
   on conflict(id) do update set revision=product_campaigns.revision+1,state='published',snapshot=excluded.snapshot,starts_at=s,ends_at=e,updated_at=now(),updated_by=p_actor returning * into c;
 end if;
 insert into bpv.product_campaign_revisions(campaign_id,revision,snapshot,state,actor) values(c.id,c.revision,c.snapshot,c.state,p_actor);
 return jsonb_build_object('id',c.id,'revision',c.revision,'state',c.state);
end $$;

create function public.bpv_list_product_campaigns(p_actor uuid)
returns jsonb language plpgsql security definer set search_path=pg_catalog,bpv as $$
begin
 if not public.bpv_has_permission(p_actor,'promotions.manage') then raise exception 'FORBIDDEN'; end if;
 return coalesce((select jsonb_agg(jsonb_build_object('id',id,'revision',revision,'state',state,'title',snapshot->>'title','starts_at',starts_at,'ends_at',ends_at) order by updated_at desc) from bpv.product_campaigns),'[]');
end $$;

-- Single database statement: clock, version, schedule and snapshots are atomic.
create function public.bpv_product_showcase()
returns jsonb language sql security definer set search_path=pg_catalog,bpv as $$
 select jsonb_build_object(
 'server_time',now(),
 'version',md5(coalesce((select string_agg(id::text||':'||revision::text,',' order by id) from bpv.product_campaigns),'')),
 'next_change_at',(select min(t) from (select starts_at t from bpv.product_campaigns where state='published' and starts_at>now() union all select ends_at from bpv.product_campaigns where state='published' and ends_at>now()) schedule),
 'campaigns',coalesce((select jsonb_agg(
   (snapshot - 'items') || jsonb_build_object('id',id,'revision',revision,'items',
     (select jsonb_agg(item || jsonb_build_object('product',(item->'product') - 'imageSource' - 'imageAuthorized' - 'imageApproved' - 'noGtinReason')) from jsonb_array_elements(snapshot->'items') item))
   order by starts_at desc,id)
 from bpv.product_campaigns where state='published' and starts_at<=now() and ends_at>now()),'[]'));
$$;
revoke all on function public.bpv_write_product_campaign(uuid,uuid,bigint,jsonb),public.bpv_list_product_campaigns(uuid),public.bpv_product_showcase() from public,anon,authenticated;
grant execute on function public.bpv_write_product_campaign(uuid,uuid,bigint,jsonb),public.bpv_list_product_campaigns(uuid),public.bpv_product_showcase() to service_role;
commit;
