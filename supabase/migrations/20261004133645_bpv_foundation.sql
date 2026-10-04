begin;

create schema if not exists bpv;
revoke all on schema bpv from public, anon, authenticated;
grant usage on schema bpv to service_role;

create table bpv.staff_permissions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  permission text not null check (permission in ('promotions.manage', 'applications.read', 'access.manage')),
  enabled boolean not null default true,
  granted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, permission)
);

create table bpv.promotion_campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  summary text not null check (char_length(summary) between 1 and 280),
  conditions text not null check (char_length(conditions) between 1 and 2000),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  state text not null default 'draft' check (state in ('draft', 'published', 'withdrawn')),
  active_version_id uuid,
  revision bigint not null default 0 check (revision >= 0),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table bpv.promotion_versions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references bpv.promotion_campaigns(id) on delete cascade,
  version_no integer not null check (version_no > 0),
  publication_key uuid not null,
  draft_path text not null unique check (draft_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/source\\.(pdf|jpg|png|webp)$'),
  public_path text not null unique check (public_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\\.(pdf|jpg|png|webp)$'),
  thumbnail_path text,
  sha256 text not null check (sha256 ~ '^[A-Za-z0-9_-]{43}$'),
  mime_type text not null check (mime_type in ('application/pdf', 'image/jpeg', 'image/png', 'image/webp')),
  size_bytes integer not null check (size_bytes between 1 and 10000000),
  validation jsonb not null default '{}'::jsonb check (jsonb_typeof(validation) = 'object'),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  unique (campaign_id, version_no),
  unique (campaign_id, publication_key),
  unique (campaign_id, id)
);

alter table bpv.promotion_campaigns
  add constraint promotion_active_version_same_campaign
  foreign key (id, active_version_id) references bpv.promotion_versions(campaign_id, id)
  deferrable initially deferred;

create table bpv.application_intents (
  id uuid primary key default gen_random_uuid(),
  idempotency_hash text not null unique check (char_length(idempotency_hash) = 43),
  token_hash text not null check (char_length(token_hash) = 43),
  token_key_version integer not null check (token_key_version > 0),
  payload_hash text check (payload_hash is null or char_length(payload_hash) = 43),
  object_path text not null unique check (object_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\\.pdf$'),
  state text not null default 'ready' check (state in ('ready', 'processing', 'received', 'expired', 'error')),
  processing_started_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  check (expires_at > created_at)
);

create table bpv.applications (
  id uuid primary key default gen_random_uuid(),
  intent_id uuid not null unique references bpv.application_intents(id),
  candidate_name text not null check (char_length(candidate_name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  phone text check (phone is null or char_length(phone) <= 24),
  birth_date date check (birth_date is null or birth_date <= current_date),
  city text check (city is null or char_length(city) <= 100),
  area text check (area is null or char_length(area) <= 100),
  privacy_notice_version text not null check (char_length(privacy_notice_version) between 1 and 80),
  received_at timestamptz not null default now(),
  delete_after timestamptz not null,
  access_blocked_at timestamptz,
  deleted_at timestamptz,
  check (delete_after > received_at)
);

create table bpv.application_files (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references bpv.applications(id) on delete cascade,
  bucket_id text not null default 'resumes-private' check (bucket_id = 'resumes-private'),
  object_path text not null unique,
  original_name text not null check (char_length(original_name) between 1 and 255 and original_name !~ E'[\\r\\n]'),
  mime_type text not null check (mime_type = 'application/pdf'),
  size_bytes integer not null check (size_bytes between 1 and 5000000),
  sha256 text not null check (char_length(sha256) = 43),
  inspection_state text not null default 'pending' check (inspection_state in ('pending', 'clean', 'rejected', 'error')),
  inspected_at timestamptz,
  created_at timestamptz not null default now()
);

create table bpv.application_receipts (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references bpv.applications(id) on delete cascade,
  protocol text not null unique check (protocol ~ '^BPV-[0-9]{4}-[A-Za-z0-9_-]{22,64}$'),
  issued_at timestamptz not null default now(),
  template_version text not null default '1',
  candidate_name text not null,
  file_name text not null
);

create table bpv.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  operation text not null check (char_length(operation) between 1 and 80),
  target_type text not null check (char_length(target_type) between 1 and 60),
  target_id uuid,
  occurred_at timestamptz not null default now(),
  outcome text not null check (outcome in ('success', 'denied', 'error')),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object')
);

create table bpv.maintenance_jobs (
  id bigint generated always as identity primary key,
  job_type text not null check (job_type in ('orphan_cleanup', 'retention_delete', 'inspection')),
  target_type text not null,
  target_id uuid,
  object_path text,
  state text not null default 'pending' check (state in ('pending', 'running', 'done', 'error')),
  attempts integer not null default 0 check (attempts >= 0),
  available_at timestamptz not null default now(),
  locked_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table bpv.rate_limit_windows (
  scope text not null,
  subject_hash text not null,
  window_start timestamptz not null,
  request_count integer not null default 1 check (request_count > 0),
  byte_count bigint not null default 0 check (byte_count >= 0),
  expires_at timestamptz not null,
  primary key (scope, subject_hash, window_start)
);

create index staff_permissions_lookup_idx on bpv.staff_permissions (user_id, permission) where enabled;
create index promotion_campaigns_public_idx on bpv.promotion_campaigns (starts_at, ends_at) where state = 'published' and active_version_id is not null;
create index application_intents_expiry_idx on bpv.application_intents (expires_at) where state in ('ready', 'processing', 'error');
create index applications_received_idx on bpv.applications (received_at desc, id desc) where deleted_at is null;
create index applications_retention_idx on bpv.applications (delete_after) where deleted_at is null;
create index application_files_inspection_idx on bpv.application_files (inspection_state, created_at) where inspection_state <> 'clean';
create index maintenance_jobs_pending_idx on bpv.maintenance_jobs (available_at, id) where state in ('pending', 'error');
create index rate_limit_expiry_idx on bpv.rate_limit_windows (expires_at);

alter table bpv.staff_permissions enable row level security;
alter table bpv.promotion_campaigns enable row level security;
alter table bpv.promotion_versions enable row level security;
alter table bpv.application_intents enable row level security;
alter table bpv.applications enable row level security;
alter table bpv.application_files enable row level security;
alter table bpv.application_receipts enable row level security;
alter table bpv.audit_events enable row level security;
alter table bpv.maintenance_jobs enable row level security;
alter table bpv.rate_limit_windows enable row level security;

revoke all on all tables in schema bpv from public, anon, authenticated;
grant all on all tables in schema bpv to service_role;
grant usage, select on all sequences in schema bpv to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('promotion-drafts', 'promotion-drafts', false, 10000000, array['application/pdf','image/jpeg','image/png','image/webp']),
  ('promotion-public', 'promotion-public', true, 10000000, array['application/pdf','image/jpeg','image/png','image/webp']),
  ('resumes-private', 'resumes-private', false, 5000000, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.bpv_has_permission(p_user_id uuid, p_permission text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from bpv.staff_permissions p
    where p.user_id = p_user_id and p.permission = p_permission and p.enabled
  );
$$;

create or replace function public.bpv_public_promotions()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'server_time', statement_timestamp(),
    'campaigns', coalesce(jsonb_agg(jsonb_build_object(
      'id', c.id,
      'title', c.title,
      'summary', c.summary,
      'conditions', c.conditions,
      'starts_at', c.starts_at,
      'ends_at', c.ends_at,
      'public_path', v.public_path,
      'mime_type', v.mime_type,
      'size_bytes', v.size_bytes,
      'thumbnail_path', v.thumbnail_path
    ) order by c.starts_at desc), '[]'::jsonb)
  )
  from bpv.promotion_campaigns c
  join bpv.promotion_versions v on v.id = c.active_version_id and v.campaign_id = c.id
  where c.state = 'published' and c.starts_at <= statement_timestamp() and c.ends_at > statement_timestamp();
$$;

create or replace function public.bpv_get_application_intent(p_idempotency_hash text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select case when i.id is null then null else jsonb_build_object(
    'id', i.id, 'token_hash', i.token_hash, 'key_version', i.token_key_version,
    'expires_at', i.expires_at, 'state', i.state
  ) end
  from (select 1) seed
  left join bpv.application_intents i on i.idempotency_hash = p_idempotency_hash;
$$;

create or replace function public.bpv_get_application_intent_by_id(p_intent_id uuid, p_token_hash text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select case when i.id is null then null else jsonb_build_object('object_path', i.object_path) end
  from (select 1) seed
  left join bpv.application_intents i on i.id = p_intent_id and i.token_hash = p_token_hash;
$$;

create or replace function public.bpv_create_application_intent(
  p_id uuid, p_idempotency_hash text, p_token_hash text, p_key_version integer,
  p_object_path text, p_subject_hash text
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare result bpv.application_intents; current_count integer;
begin
  insert into bpv.rate_limit_windows(scope, subject_hash, window_start, request_count, expires_at)
  values ('application-init', p_subject_hash, date_trunc('hour', statement_timestamp()), 1, date_trunc('hour', statement_timestamp()) + interval '2 hours')
  on conflict (scope, subject_hash, window_start) do update set request_count = bpv.rate_limit_windows.request_count + 1
  returning request_count into current_count;
  if current_count > 10 then raise exception using errcode = 'P0001', message = 'RATE_LIMIT'; end if;
  insert into bpv.application_intents(id, idempotency_hash, token_hash, token_key_version, object_path, expires_at)
  values (p_id, p_idempotency_hash, p_token_hash, p_key_version, p_object_path, statement_timestamp() + interval '30 minutes')
  on conflict (idempotency_hash) do update set idempotency_hash = excluded.idempotency_hash
  returning * into result;
  return jsonb_build_object('id', result.id, 'token_hash', result.token_hash, 'key_version', result.token_key_version, 'expires_at', result.expires_at, 'state', result.state);
end;
$$;

create or replace function public.bpv_finalize_application(
  p_intent_id uuid, p_token_hash text, p_payload_hash text, p_name text, p_email text,
  p_phone text, p_birth_date date, p_city text, p_area text, p_privacy_version text,
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
  insert into bpv.applications(intent_id, candidate_name, email, phone, birth_date, city, area, privacy_notice_version, received_at, delete_after)
  values (intent.id, p_name, p_email, nullif(p_phone,''), p_birth_date, nullif(p_city,''), nullif(p_area,''), p_privacy_version, now_at,
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

create or replace function public.bpv_create_campaign(p_actor uuid, p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare campaign bpv.promotion_campaigns;
begin
  if not public.bpv_has_permission(p_actor, 'promotions.manage') then raise exception using errcode = 'P0001', message = 'FORBIDDEN'; end if;
  insert into bpv.promotion_campaigns(title, summary, conditions, starts_at, ends_at, created_by)
  values (p_payload->>'title', p_payload->>'summary', p_payload->>'conditions', (p_payload->>'starts_at')::timestamptz, (p_payload->>'ends_at')::timestamptz, p_actor)
  returning * into campaign;
  insert into bpv.audit_events(actor_id, operation, target_type, target_id, outcome) values (p_actor, 'promotion.create', 'promotion_campaign', campaign.id, 'success');
  return to_jsonb(campaign);
end;
$$;

create or replace function public.bpv_list_campaigns(p_actor uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  if not public.bpv_has_permission(p_actor, 'promotions.manage') then raise exception using errcode = 'P0001', message = 'FORBIDDEN'; end if;
  return (select coalesce(jsonb_agg(to_jsonb(c) order by c.created_at desc), '[]'::jsonb) from bpv.promotion_campaigns c);
end;
$$;

create or replace function public.bpv_publish_campaign(
  p_actor uuid, p_campaign_id uuid, p_expected_revision bigint, p_publication_key uuid,
  p_draft_path text, p_public_path text, p_sha256 text, p_mime_type text, p_size_bytes integer
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare campaign bpv.promotion_campaigns; version bpv.promotion_versions; next_no integer;
begin
  if not public.bpv_has_permission(p_actor, 'promotions.manage') then raise exception using errcode = 'P0001', message = 'FORBIDDEN'; end if;
  select * into campaign from bpv.promotion_campaigns where id = p_campaign_id for update;
  if campaign.id is null then raise exception using errcode = 'P0001', message = 'NOT_FOUND'; end if;
  select * into version from bpv.promotion_versions where campaign_id = p_campaign_id and publication_key = p_publication_key;
  if version.id is not null then return jsonb_build_object('campaign_id',campaign.id,'version_id',version.id,'revision',campaign.revision); end if;
  if campaign.revision <> p_expected_revision then raise exception using errcode = 'P0001', message = 'REVISION_CONFLICT'; end if;
  select coalesce(max(version_no),0)+1 into next_no from bpv.promotion_versions where campaign_id = p_campaign_id;
  insert into bpv.promotion_versions(campaign_id, version_no, publication_key, draft_path, public_path, sha256, mime_type, size_bytes, created_by, validation)
  values (p_campaign_id, next_no, p_publication_key, p_draft_path, p_public_path, p_sha256, p_mime_type, p_size_bytes, p_actor, jsonb_build_object('validated_at',statement_timestamp())) returning * into version;
  update bpv.promotion_campaigns set active_version_id = version.id, state = 'published', revision = revision + 1, updated_at = statement_timestamp() where id = campaign.id returning * into campaign;
  insert into bpv.audit_events(actor_id, operation, target_type, target_id, outcome, metadata) values (p_actor, 'promotion.publish', 'promotion_campaign', campaign.id, 'success', jsonb_build_object('version_id',version.id));
  return jsonb_build_object('campaign_id',campaign.id,'version_id',version.id,'revision',campaign.revision);
end;
$$;

create or replace function public.bpv_withdraw_campaign(p_actor uuid, p_campaign_id uuid, p_expected_revision bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare campaign bpv.promotion_campaigns;
begin
  if not public.bpv_has_permission(p_actor, 'promotions.manage') then raise exception using errcode = 'P0001', message = 'FORBIDDEN'; end if;
  update bpv.promotion_campaigns set state = 'withdrawn', revision = revision + 1, updated_at = statement_timestamp()
  where id = p_campaign_id and revision = p_expected_revision returning * into campaign;
  if campaign.id is null then raise exception using errcode = 'P0001', message = 'REVISION_CONFLICT'; end if;
  insert into bpv.audit_events(actor_id, operation, target_type, target_id, outcome) values (p_actor, 'promotion.withdraw', 'promotion_campaign', campaign.id, 'success');
  return to_jsonb(campaign);
end;
$$;

create or replace function public.bpv_list_applications(p_actor uuid, p_before timestamptz default null, p_limit integer default 50)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  if not public.bpv_has_permission(p_actor, 'applications.read') then raise exception using errcode = 'P0001', message = 'FORBIDDEN'; end if;
  insert into bpv.audit_events(actor_id, operation, target_type, outcome) values (p_actor, 'applications.list', 'application', 'success');
  return (select coalesce(jsonb_agg(row_data order by received_at desc), '[]'::jsonb) from (
    select jsonb_build_object('id',a.id,'candidate_name',a.candidate_name,'email',a.email,'phone',a.phone,'birth_date',a.birth_date,'city',a.city,'area',a.area,'received_at',a.received_at,'delete_after',a.delete_after,'inspection_state',f.inspection_state) row_data, a.received_at
    from bpv.applications a join bpv.application_files f on f.application_id = a.id
    where a.deleted_at is null and a.access_blocked_at is null and a.delete_after > statement_timestamp() and (p_before is null or a.received_at < p_before)
    order by a.received_at desc limit least(greatest(p_limit,1),100)
  ) listed);
end;
$$;

create or replace function public.bpv_authorize_application_download(p_actor uuid, p_application_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare result jsonb;
begin
  if not public.bpv_has_permission(p_actor, 'applications.read') then raise exception using errcode = 'P0001', message = 'FORBIDDEN'; end if;
  select jsonb_build_object('path',f.object_path,'file_name',f.original_name,'mime_type',f.mime_type)
  into result from bpv.applications a join bpv.application_files f on f.application_id = a.id
  where a.id = p_application_id and a.deleted_at is null and a.access_blocked_at is null and a.delete_after > statement_timestamp() and f.inspection_state = 'clean';
  if result is null then raise exception using errcode = 'P0001', message = 'DOWNLOAD_BLOCKED'; end if;
  insert into bpv.audit_events(actor_id, operation, target_type, target_id, outcome) values (p_actor, 'application.download', 'application', p_application_id, 'success');
  return result;
end;
$$;

revoke all on function public.bpv_has_permission(uuid,text) from public, anon, authenticated;
revoke all on function public.bpv_public_promotions() from public, anon, authenticated;
revoke all on function public.bpv_get_application_intent(text) from public, anon, authenticated;
revoke all on function public.bpv_get_application_intent_by_id(uuid,text) from public, anon, authenticated;
revoke all on function public.bpv_create_application_intent(uuid,text,text,integer,text,text) from public, anon, authenticated;
revoke all on function public.bpv_finalize_application(uuid,text,text,text,text,text,date,text,text,text,text,text,text,integer,text) from public, anon, authenticated;
revoke all on function public.bpv_create_campaign(uuid,jsonb) from public, anon, authenticated;
revoke all on function public.bpv_list_campaigns(uuid) from public, anon, authenticated;
revoke all on function public.bpv_publish_campaign(uuid,uuid,bigint,uuid,text,text,text,text,integer) from public, anon, authenticated;
revoke all on function public.bpv_withdraw_campaign(uuid,uuid,bigint) from public, anon, authenticated;
revoke all on function public.bpv_list_applications(uuid,timestamptz,integer) from public, anon, authenticated;
revoke all on function public.bpv_authorize_application_download(uuid,uuid) from public, anon, authenticated;
grant execute on function public.bpv_has_permission(uuid,text) to service_role;
grant execute on function public.bpv_public_promotions() to service_role;
grant execute on function public.bpv_get_application_intent(text) to service_role;
grant execute on function public.bpv_get_application_intent_by_id(uuid,text) to service_role;
grant execute on function public.bpv_create_application_intent(uuid,text,text,integer,text,text) to service_role;
grant execute on function public.bpv_finalize_application(uuid,text,text,text,text,text,date,text,text,text,text,text,text,integer,text) to service_role;
grant execute on function public.bpv_create_campaign(uuid,jsonb) to service_role;
grant execute on function public.bpv_list_campaigns(uuid) to service_role;
grant execute on function public.bpv_publish_campaign(uuid,uuid,bigint,uuid,text,text,text,text,integer) to service_role;
grant execute on function public.bpv_withdraw_campaign(uuid,uuid,bigint) to service_role;
grant execute on function public.bpv_list_applications(uuid,timestamptz,integer) to service_role;
grant execute on function public.bpv_authorize_application_download(uuid,uuid) to service_role;

commit;
