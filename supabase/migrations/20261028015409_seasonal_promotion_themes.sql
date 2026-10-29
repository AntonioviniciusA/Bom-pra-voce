begin;

-- Additive allowlist: existing colour themes and campaigns remain valid.
alter table bpv.promotion_campaigns drop constraint promotion_campaigns_theme_key_check;
alter table bpv.promotion_campaigns add constraint promotion_campaigns_theme_key_check
  check (theme_key in ('purple','green','red','blue','orange',
    'padrao','verao','volta-a-rotina','carnaval','volta-as-aulas','consumidor','pascoa',
    'maes','festa-junina','namorados','ferias','inverno','pais','primavera',
    'setembro-amarelo','criancas','outubro-rosa','black-friday','natal','ano-novo','aniversario-loja'));

-- Existing RPCs already carry theme_key and check permissions/revisions.
-- Existing cache metadata includes campaign revision, changed by the update RPC.
commit;
