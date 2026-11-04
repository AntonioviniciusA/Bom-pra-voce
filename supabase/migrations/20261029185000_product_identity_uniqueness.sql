begin;
create unique index products_code_ci_key on bpv.products(lower(code));
create or replace function public.bpv_write_product(p_actor uuid,p_id uuid,p_expected_revision bigint,p_product jsonb)
returns jsonb language plpgsql security definer set search_path=pg_catalog,bpv as $$
declare current bpv.products;saved bpv.products;normalized_code text;
begin
 if not public.bpv_has_permission(p_actor,'promotions.manage') then raise exception 'FORBIDDEN'; end if;
 perform pg_advisory_xact_lock(hashtextextended('bpv.products.write',0));
 select * into current from bpv.products where id=p_id for update;
 if p_expected_revision is null or p_expected_revision<>coalesce(current.revision,0) then raise exception 'REVISION_CONFLICT'; end if;
 if p_product is null or p_product->>'id'<>p_id::text then raise exception 'INVALID_PRODUCT'; end if;
 normalized_code=trim(p_product->>'code');
 if coalesce(length(normalized_code),0)=0 then raise exception 'INVALID_PRODUCT'; end if;
 if exists(select 1 from bpv.products where id<>p_id and lower(code)=lower(normalized_code)) then raise exception 'PRODUCT_IDENTITY_CONFLICT'; end if;
 if exists(
   select 1 from bpv.products existing
   cross join lateral jsonb_array_elements(coalesce(existing.snapshot->'fragrances','[]')) old_variant
   join lateral jsonb_array_elements(coalesce(p_product->'fragrances','[]')) new_variant
     on nullif(old_variant->>'barcode','')=nullif(new_variant->>'barcode','')
   where existing.id<>p_id
 ) then raise exception 'PRODUCT_IDENTITY_CONFLICT'; end if;
 insert into bpv.products(id,revision,code,snapshot,updated_by) values(p_id,1,normalized_code,p_product,p_actor)
 on conflict(id) do update set revision=bpv.products.revision+1,code=excluded.code,snapshot=excluded.snapshot,updated_at=now(),updated_by=p_actor returning * into saved;
 insert into bpv.product_revisions(product_id,revision,snapshot,actor) values(saved.id,saved.revision,saved.snapshot,p_actor);
 return saved.snapshot||jsonb_build_object('remoteRevision',saved.revision);
end $$;
commit;
