begin;
-- Only the existing permission-checked administrative RPC exposes this metadata.
create or replace function public.bpv_list_campaigns(p_actor uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  if not public.bpv_has_permission(p_actor, 'promotions.manage') then
    raise exception using errcode = 'P0001', message = 'FORBIDDEN';
  end if;
  return (
    select coalesce(jsonb_agg(to_jsonb(c) || jsonb_build_object(
      'public_path', v.public_path, 'mime_type', v.mime_type
    ) order by c.created_at desc), '[]'::jsonb)
    from bpv.promotion_campaigns c
    left join bpv.promotion_versions v on v.id = c.active_version_id and v.campaign_id = c.id
  );
end;
$$;
revoke all on function public.bpv_list_campaigns(uuid) from public, anon, authenticated;
grant execute on function public.bpv_list_campaigns(uuid) to service_role;
commit;
