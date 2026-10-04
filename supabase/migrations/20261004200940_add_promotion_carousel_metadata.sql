begin;

alter table bpv.promotion_campaigns
  add column category_key text not null default 'other'
    check (category_key in ('meat-frozen', 'home-baby', 'grocery-drinks', 'cleaning-beauty', 'other')),
  add column display_order integer not null default 100
    check (display_order between 0 and 999);

update bpv.promotion_campaigns
set category_key = case id
  when '11111111-1111-4111-8111-444444444444' then 'meat-frozen'
  when '11111111-1111-4111-8111-333333333333' then 'home-baby'
  when '11111111-1111-4111-8111-222222222222' then 'grocery-drinks'
  when '11111111-1111-4111-8111-111111111111' then 'cleaning-beauty'
  else category_key
end,
display_order = case id
  when '11111111-1111-4111-8111-444444444444' then 10
  when '11111111-1111-4111-8111-333333333333' then 20
  when '11111111-1111-4111-8111-222222222222' then 30
  when '11111111-1111-4111-8111-111111111111' then 40
  else display_order
end;

create index promotion_campaigns_carousel_idx
  on bpv.promotion_campaigns (display_order, starts_at desc)
  where state = 'published' and active_version_id is not null;

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
      'category_key', c.category_key,
      'display_order', c.display_order,
      'public_path', v.public_path,
      'mime_type', v.mime_type,
      'size_bytes', v.size_bytes,
      'thumbnail_path', v.thumbnail_path
    ) order by c.display_order, c.starts_at desc, c.id), '[]'::jsonb)
  )
  from bpv.promotion_campaigns c
  join bpv.promotion_versions v on v.id = c.active_version_id and v.campaign_id = c.id
  where c.state = 'published'
    and c.starts_at <= statement_timestamp()
    and c.ends_at > statement_timestamp();
$$;

revoke all on function public.bpv_public_promotions() from public, anon, authenticated;
grant execute on function public.bpv_public_promotions() to service_role;

commit;
