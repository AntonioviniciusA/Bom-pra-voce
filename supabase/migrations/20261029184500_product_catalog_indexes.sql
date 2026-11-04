begin;
create index products_updated_by_idx on bpv.products(updated_by);
create index product_revisions_actor_idx on bpv.product_revisions(actor);
commit;
