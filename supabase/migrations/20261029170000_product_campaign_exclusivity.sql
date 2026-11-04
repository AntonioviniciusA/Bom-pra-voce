begin;

-- Serializa todas as publicações e impede duas campanhas publicadas no mesmo instante.
create or replace function public.bpv_write_product_campaign(p_actor uuid,p_id uuid,p_expected_revision bigint,p_snapshot jsonb)
returns jsonb language plpgsql security definer set search_path=pg_catalog,bpv as $$
declare c bpv.product_campaigns; s timestamptz; e timestamptz; conflict bpv.product_campaigns;
begin
 if not public.bpv_has_permission(p_actor,'promotions.manage') then raise exception 'FORBIDDEN'; end if;
 perform pg_advisory_xact_lock(hashtextextended('bpv.product_campaigns.publish',0));
 select * into c from bpv.product_campaigns where id=p_id for update;
 if p_expected_revision is null or p_expected_revision<>coalesce(c.revision,0) then raise exception 'REVISION_CONFLICT'; end if;
 if p_snapshot is null then
   if c.id is null then raise exception 'NOT_FOUND'; end if;
   update bpv.product_campaigns set state='withdrawn',revision=revision+1,updated_at=now(),updated_by=p_actor where id=p_id returning * into c;
 else
   s=(p_snapshot->>'starts_at')::timestamptz; e=(p_snapshot->>'ends_at')::timestamptz;
   if s is null or e is null or e<=s or e<=now() or jsonb_typeof(p_snapshot->'items') is distinct from 'array' then raise exception 'INVALID_CAMPAIGN'; end if;
   if jsonb_array_length(p_snapshot->'items') not between 1 and 100 or coalesce(length(trim(p_snapshot->>'title')),0)=0 then raise exception 'INVALID_CAMPAIGN'; end if;
   select * into conflict from bpv.product_campaigns where id<>p_id and state='published' and tstzrange(starts_at,ends_at,'[)') && tstzrange(s,e,'[)') limit 1;
   if conflict.id is not null then raise exception 'CAMPAIGN_PERIOD_CONFLICT: %', conflict.snapshot->>'title'; end if;
   insert into bpv.product_campaigns(id,revision,state,snapshot,starts_at,ends_at,updated_by)
     values(p_id,1,'published',p_snapshot,s,e,p_actor)
   on conflict(id) do update set revision=product_campaigns.revision+1,state='published',snapshot=excluded.snapshot,starts_at=s,ends_at=e,updated_at=now(),updated_by=p_actor returning * into c;
 end if;
 insert into bpv.product_campaign_revisions(campaign_id,revision,snapshot,state,actor) values(c.id,c.revision,c.snapshot,c.state,p_actor);
 return jsonb_build_object('id',c.id,'revision',c.revision,'state',c.state);
end $$;

commit;
