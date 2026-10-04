begin;

alter table bpv.promotion_versions
  drop constraint promotion_versions_draft_path_check,
  drop constraint promotion_versions_public_path_check,
  add constraint promotion_versions_draft_path_check
    check (draft_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/source[.](pdf|jpg|png|webp)$'),
  add constraint promotion_versions_public_path_check
    check (public_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}[.](pdf|jpg|png|webp)$');

alter table bpv.application_intents
  drop constraint application_intents_object_path_check,
  add constraint application_intents_object_path_check
    check (object_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}[.]pdf$');

commit;
