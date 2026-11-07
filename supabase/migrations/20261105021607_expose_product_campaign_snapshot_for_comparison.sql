begin;

create or replace function public.bpv_list_product_campaigns(p_actor uuid)
returns jsonb
language plpgsql
security definer
set search_path=pg_catalog,bpv
as $$
begin
  if not public.bpv_has_permission(p_actor,'promotions.manage') then raise exception 'FORBIDDEN'; end if;
  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id',id,
        'revision',revision,
        'state',state,
        'title',snapshot->>'title',
        'starts_at',starts_at,
        'ends_at',ends_at,
        'snapshot',snapshot
      ) order by updated_at desc
    )
    from bpv.product_campaigns
  ),'[]');
end $$;

revoke all on function public.bpv_list_product_campaigns(uuid) from public,anon,authenticated;
grant execute on function public.bpv_list_product_campaigns(uuid) to service_role;

commit;
