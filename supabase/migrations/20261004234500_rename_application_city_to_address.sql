begin;

alter table bpv.applications rename column city to address;
alter table bpv.applications drop constraint if exists applications_city_check;
alter table bpv.applications
  add constraint applications_address_check
  check (address is null or char_length(address) <= 200);

drop function if exists public.bpv_finalize_application(uuid,text,text,text,text,text,date,text,text,text,text,text,text,integer,text);

create function public.bpv_finalize_application(
  p_intent_id uuid, p_token_hash text, p_payload_hash text, p_name text, p_email text,
  p_phone text, p_birth_date date, p_address text, p_area text, p_privacy_version text,
  p_object_path text, p_file_name text, p_file_sha256 text, p_file_size integer, p_protocol text
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare intent bpv.application_intents; app bpv.applications; receipt bpv.application_receipts; now_at timestamptz := statement_timestamp();
begin
  select * into intent from bpv.application_intents where id = p_intent_id for update;
  if intent.id is null or intent.token_hash <> p_token_hash then raise exception using errcode = 'P0001', message = 'INVALID_TOKEN'; end if;
  if intent.expires_at <= now_at then update bpv.application_intents set state = 'expired' where id = intent.id; raise exception using errcode = 'P0001', message = 'EXPIRED'; end if;
  if intent.state = 'received' then
    if intent.payload_hash <> p_payload_hash then raise exception using errcode = 'P0001', message = 'PAYLOAD_CONFLICT'; end if;
    select a.* into app from bpv.applications a where a.intent_id = intent.id;
    select r.* into receipt from bpv.application_receipts r where r.application_id = app.id;
    return jsonb_build_object('status','received','intent_id',intent.id,'receipt',jsonb_build_object('protocol',receipt.protocol,'received_at',receipt.issued_at,'candidate_name',receipt.candidate_name,'file_name',receipt.file_name));
  end if;
  if intent.object_path <> p_object_path then raise exception using errcode = 'P0001', message = 'OBJECT_CONFLICT'; end if;
  update bpv.application_intents set state = 'processing', processing_started_at = now_at, payload_hash = p_payload_hash where id = intent.id;
  insert into bpv.applications(intent_id, candidate_name, email, phone, birth_date, address, area, privacy_notice_version, received_at, delete_after)
  values (intent.id, p_name, p_email, nullif(p_phone,''), p_birth_date, nullif(p_address,''), nullif(p_area,''), p_privacy_version, now_at,
    (((now_at at time zone 'America/Sao_Paulo') + interval '6 months') at time zone 'America/Sao_Paulo')) returning * into app;
  insert into bpv.application_files(application_id, object_path, original_name, mime_type, size_bytes, sha256)
  values (app.id, p_object_path, p_file_name, 'application/pdf', p_file_size, p_file_sha256);
  insert into bpv.application_receipts(application_id, protocol, issued_at, candidate_name, file_name)
  values (app.id, p_protocol, now_at, p_name, p_file_name) returning * into receipt;
  insert into bpv.maintenance_jobs(job_type, target_type, target_id, object_path)
  values ('inspection', 'application', app.id, p_object_path);
  update bpv.application_intents set state = 'received', completed_at = now_at where id = intent.id;
  return jsonb_build_object('status','received','intent_id',intent.id,'receipt',jsonb_build_object('protocol',receipt.protocol,'received_at',receipt.issued_at,'candidate_name',receipt.candidate_name,'file_name',receipt.file_name));
end;
$$;

create or replace function public.bpv_list_applications(p_actor uuid, p_before timestamptz default null, p_limit integer default 50)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  if not public.bpv_has_permission(p_actor, 'applications.read') then raise exception using errcode = 'P0001', message = 'FORBIDDEN'; end if;
  insert into bpv.audit_events(actor_id, operation, target_type, outcome) values (p_actor, 'applications.list', 'application', 'success');
  return (select coalesce(jsonb_agg(row_data order by received_at desc), '[]'::jsonb) from (
    select jsonb_build_object('id',a.id,'candidate_name',a.candidate_name,'email',a.email,'phone',a.phone,'birth_date',a.birth_date,'address',a.address,'area',a.area,'received_at',a.received_at,'delete_after',a.delete_after,'inspection_state',f.inspection_state) row_data, a.received_at
    from bpv.applications a join bpv.application_files f on f.application_id = a.id
    where a.deleted_at is null and a.access_blocked_at is null and a.delete_after > statement_timestamp() and (p_before is null or a.received_at < p_before)
    order by a.received_at desc limit least(greatest(p_limit,1),100)
  ) listed);
end;
$$;

revoke all on function public.bpv_finalize_application(uuid,text,text,text,text,text,date,text,text,text,text,text,text,integer,text) from public, anon, authenticated;
grant execute on function public.bpv_finalize_application(uuid,text,text,text,text,text,date,text,text,text,text,text,text,integer,text) to service_role;

commit;
