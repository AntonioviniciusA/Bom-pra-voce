begin;

insert into bpv.promotion_campaigns
  (id, title, summary, conditions, starts_at, ends_at, state, revision, created_source, category_key, display_order)
values
  ('11111111-1111-4111-8111-111111111111', 'Limpeza, higiene e beleza', 'Ofertas de limpeza, higiene e beleza da promoção da semana.', 'Ofertas válidas até 09/10/2026. Produtos sujeitos à disponibilidade de estoque. Preços à vista. Em caso de divergência, prevalece o menor preço.', '2026-10-05T00:00:00-03:00', '2026-10-10T00:00:00-03:00', 'draft', 0, 'system_import', 'cleaning-beauty', 40),
  ('11111111-1111-4111-8111-222222222222', 'Mercearia e bebidas', 'Ofertas de mercearia e bebidas da promoção da semana.', 'Ofertas válidas até 09/10/2026. Produtos sujeitos à disponibilidade de estoque. Preços à vista. Em caso de divergência, prevalece o menor preço.', '2026-10-05T00:00:00-03:00', '2026-10-10T00:00:00-03:00', 'draft', 0, 'system_import', 'grocery-drinks', 30),
  ('11111111-1111-4111-8111-333333333333', 'Utilidades e bebê', 'Ofertas de utilidades e produtos para bebê da promoção da semana.', 'Ofertas válidas até 09/10/2026. Produtos sujeitos à disponibilidade de estoque. Preços à vista. Em caso de divergência, prevalece o menor preço.', '2026-10-05T00:00:00-03:00', '2026-10-10T00:00:00-03:00', 'draft', 0, 'system_import', 'home-baby', 20),
  ('11111111-1111-4111-8111-444444444444', 'Açougue, frios e congelados', 'Ofertas de açougue, frios e congelados da promoção da semana.', 'Ofertas válidas até 05/10/2026. Produtos sujeitos à disponibilidade de estoque. Preços à vista. Em caso de divergência, prevalece o menor preço.', '2026-10-05T00:00:00-03:00', '2026-10-06T00:00:00-03:00', 'draft', 0, 'system_import', 'meat-frozen', 10)
on conflict (id) do nothing;

insert into bpv.promotion_versions
  (id, campaign_id, version_no, publication_key, draft_path, public_path, sha256, mime_type, size_bytes, validation, created_source)
values
  ('21111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111', 1, '31111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111/21111111-1111-4111-8111-111111111111/source.png', '11111111-1111-4111-8111-111111111111/21111111-1111-4111-8111-111111111111.png', 'Oxk268WrNMBi7zEXtw4YRepa1W_fQBkMsq69wnX23LE', 'image/png', 2164633, '{"source":"authorized attachment","width":1055,"height":1491}'::jsonb, 'system_import'),
  ('21111111-1111-4111-8111-222222222222', '11111111-1111-4111-8111-222222222222', 1, '31111111-1111-4111-8111-222222222222', '11111111-1111-4111-8111-222222222222/21111111-1111-4111-8111-222222222222/source.png', '11111111-1111-4111-8111-222222222222/21111111-1111-4111-8111-222222222222.png', '8U_hHZJcrsbBZeuy1iCNbSYwCzudkEKpxwc6GkGjbUs', 'image/png', 2167261, '{"source":"authorized attachment","width":1055,"height":1491}'::jsonb, 'system_import'),
  ('21111111-1111-4111-8111-333333333333', '11111111-1111-4111-8111-333333333333', 1, '31111111-1111-4111-8111-333333333333', '11111111-1111-4111-8111-333333333333/21111111-1111-4111-8111-333333333333/source.png', '11111111-1111-4111-8111-333333333333/21111111-1111-4111-8111-333333333333.png', '8VKLKn3d8Z7PpINV_Db-5_JlVhYCHhFC8m4G7yTxKxQ', 'image/png', 2098644, '{"source":"authorized attachment","width":1024,"height":1536}'::jsonb, 'system_import'),
  ('21111111-1111-4111-8111-444444444444', '11111111-1111-4111-8111-444444444444', 1, '31111111-1111-4111-8111-444444444444', '11111111-1111-4111-8111-444444444444/21111111-1111-4111-8111-444444444444/source.png', '11111111-1111-4111-8111-444444444444/21111111-1111-4111-8111-444444444444.png', 'CCARauRhUzTm9ipDYOt8S3u1tY9lUiSaXRQon06XRH4', 'image/png', 2388908, '{"source":"authorized attachment","width":1024,"height":1536}'::jsonb, 'system_import')
on conflict (id) do nothing;

update bpv.promotion_campaigns
set active_version_id = case id
  when '11111111-1111-4111-8111-111111111111' then '21111111-1111-4111-8111-111111111111'::uuid
  when '11111111-1111-4111-8111-222222222222' then '21111111-1111-4111-8111-222222222222'::uuid
  when '11111111-1111-4111-8111-333333333333' then '21111111-1111-4111-8111-333333333333'::uuid
  when '11111111-1111-4111-8111-444444444444' then '21111111-1111-4111-8111-444444444444'::uuid
end,
state = 'published', revision = 1, updated_at = statement_timestamp()
where id in (
  '11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-222222222222',
  '11111111-1111-4111-8111-333333333333', '11111111-1111-4111-8111-444444444444'
);

insert into bpv.audit_events(operation, target_type, target_id, outcome, metadata)
select 'promotion.system_import', 'promotion_campaign', id, 'success', jsonb_build_object('source', 'authorized attachments', 'valid_through', case when category_key = 'meat-frozen' then '2026-10-05' else '2026-10-09' end)
from bpv.promotion_campaigns
where id in (
  '11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-222222222222',
  '11111111-1111-4111-8111-333333333333', '11111111-1111-4111-8111-444444444444'
);

commit;
