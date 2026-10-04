begin;

do $$
begin
  if has_schema_privilege('anon', 'bpv', 'usage') then raise exception 'anon must not use bpv schema'; end if;
  if has_schema_privilege('authenticated', 'bpv', 'usage') then raise exception 'authenticated must not use bpv schema'; end if;
  if has_function_privilege('anon', 'public.bpv_public_promotions()', 'execute') then raise exception 'anon must not execute internal RPC'; end if;
  if has_function_privilege('authenticated', 'public.bpv_list_applications(uuid,timestamptz,integer)', 'execute') then raise exception 'authenticated must not execute RH RPC directly'; end if;
  if not (select relrowsecurity from pg_class where oid = 'bpv.applications'::regclass) then raise exception 'applications RLS must be enabled'; end if;
  if not (select relrowsecurity from pg_class where oid = 'bpv.staff_permissions'::regclass) then raise exception 'permissions RLS must be enabled'; end if;
  if (select public from storage.buckets where id = 'resumes-private') then raise exception 'resume bucket must be private'; end if;
  if not (select public from storage.buckets where id = 'promotion-public') then raise exception 'published promotion bucket must be public'; end if;
end;
$$;

rollback;

