begin;

create or replace function public.bpv_public_promotions_meta()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with clock as (
    select statement_timestamp() as now
  ), active as (
    select c.id, c.revision, c.active_version_id, c.starts_at, c.ends_at, c.updated_at
    from bpv.promotion_campaigns c, clock
    where c.state = 'published'
      and c.active_version_id is not null
      and c.starts_at <= clock.now
      and c.ends_at > clock.now
  ), boundaries as (
    select min(boundary) as next_change_at
    from (
      select c.starts_at as boundary
      from bpv.promotion_campaigns c, clock
      where c.state = 'published' and c.active_version_id is not null and c.starts_at > clock.now
      union all
      select c.ends_at as boundary
      from bpv.promotion_campaigns c, clock
      where c.state = 'published' and c.active_version_id is not null and c.ends_at > clock.now
    ) changes
  )
  select jsonb_build_object(
    'server_time', clock.now,
    'version', md5(coalesce((
      select string_agg(concat_ws(':', id, revision, active_version_id, starts_at, ends_at, updated_at), '|' order by id)
      from active
    ), '')),
    'next_change_at', boundaries.next_change_at
  )
  from clock cross join boundaries;
$$;

revoke all on function public.bpv_public_promotions_meta() from public, anon, authenticated;
grant execute on function public.bpv_public_promotions_meta() to service_role;

commit;
