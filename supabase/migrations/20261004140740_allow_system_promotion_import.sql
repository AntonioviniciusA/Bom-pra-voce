begin;

alter table bpv.promotion_campaigns
  alter column created_by drop not null,
  add column created_source text not null default 'staff'
    check (created_source in ('staff', 'system_import')),
  add constraint promotion_campaigns_author_required
    check ((created_source = 'staff' and created_by is not null) or (created_source = 'system_import' and created_by is null));

alter table bpv.promotion_versions
  alter column created_by drop not null,
  add column created_source text not null default 'staff'
    check (created_source in ('staff', 'system_import')),
  add constraint promotion_versions_author_required
    check ((created_source = 'staff' and created_by is not null) or (created_source = 'system_import' and created_by is null));

commit;
