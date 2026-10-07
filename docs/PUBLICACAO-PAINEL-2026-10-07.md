# Publicação do painel e das promoções — 07/10/2026

## Escopo autorizado e entregue

O usuário autorizou aplicar as alterações e pediu documentação. A administração permanece no aplicativo Electron `painel-local`, separado do site público.

- Currículos: dados enviados, busca nos registros carregados, paginação por data/ID, situação de inspeção e download individual autorizado.
- Promoções: edição de campanha existente, nome do HUD, seleção visual de oito ícones e cinco temas, ordem, validade e substituição de imagem/PDF. Metadados e nova versão do arquivo são publicados na mesma transação.
- 2FA: QR Code/chave manual, código TOTP, retomada de matrícula incompleta e validação de AAL2. Autenticadores verificados não são removidos.
- CORS: correção para as URLs internas do gateway Supabase, permitindo as origens do Electron e do Vite somente nos endpoints administrativos.

## Publicações e configuração

| Item | Evidência |
| --- | --- |
| Supabase | `jcyffbjsvwkmzgvilxha`, projeto Bom pra voce, região sa-east-1 |
| Migração | `20261006234947_admin_campaign_customization`, aplicada em 06/10/2026 e confirmada no histórico remoto em 07/10 |
| `promotion-admin` | versão 6, ACTIVE; SHA `5479cd8eeec554bc769fe14e0782b68dae2e5d6aed2fab895d77edc98c589e77` |
| `rh-applications` | versão 6, ACTIVE; SHA `936f4e885b4c8ee88208b779725bc3c6a5d511d56cd43e1a856f480ef04f66ca` |
| Acesso RH | `applications.read` concedido à conta administrativa já existente; evento `permission.grant` com resultado `success` |
| Autenticador | consulta remota em 07/10 confirmou um fator TOTP verificado; a consulta anterior de 06/10 não encontrava fatores |
| Vercel | projeto `prj_BMkFrRB8YPAVBxtmiy4D2OihF7hz`, nome `bom-pra-voce`, equipe `antoniovinialvinosilva-7418s-projects` |
| Deployment | `dpl_D6EW35ptpjhe7fLiESd8hxwEapHE`, READY, production, promovido em 07/10 |
| URL do build | https://bom-pra-voce-3ugpfoooe-antoniovinialvinosilva-7418s-projects.vercel.app |
| URL pública | https://bom-pra-voce-vert.vercel.app |

O site foi preparado a partir do HEAD `4dc61610296bea5dfae2841263137ba165112184`, acrescido somente dos arquivos desta tarefa: `Tabloide.jsx`, `Tabloide.test.jsx` e `promotionThemes.css`. As alterações concorrentes em `Cards.jsx`, `index.css` e `design-qa.md` não entraram na publicação. Os metadados Git da Vercel identificam o HEAD de base; a origem efetiva é CLI com esses arquivos adicionais. Na continuação, o usuário autorizou commits locais e reservou o push para si.

O nome inicial do arquivo de migração local terminava no timestamp `20261006233412`; ele foi ajustado para `20261006234947`, atribuído pelo Supabase ao aplicar a migração, para coincidir com o histórico remoto.

## Verificações executadas

- Sete testes do painel; testes do site existentes e três testes específicos do carrossel; compilação do painel e do site.
- PostgreSQL em memória aplicando as migrações: permissões, rollback de publicação, conflito de revisão, invalidação de cache, paginação com horários iguais e bloqueio de downloads por quarentena/expiração.
- Três testes Deno de CORS, incluindo a URL interna sem `/functions/v1`; `deno check` das funções administrativas.
- Teste SQL remoto de criação/edição de tema e rejeição de revisão antiga, dentro de transação revertida por `ROLLBACK`. Nenhuma oferta comercial fictícia permaneceu no banco.
- Leitura de RH por RPC no servidor retornou lista vazia; permissão de RH confirmada. Não equivale a um download feito por sessão AAL2 no aplicativo.
- Origem Electron `null` e origem Vite receberam HTTP 204 no preflight; POST sem token recebeu HTTP 401 `UNAUTHENTICATED`; origem desconhecida recebeu HTTP 403 `ORIGIN_NOT_ALLOWED`.
- `public-promotions?meta=1` recebeu HTTP 200. A consulta de ofertas vigentes retornou zero campanhas; não foram alteradas datas comerciais para fabricar ofertas vigentes.
- `application-init` com chave idempotente válida e sem desafio recebeu HTTP 400 `CHALLENGE_REQUIRED`. Isso demonstra que o backend está habilitado e rejeita a ausência do desafio; não comprova envio legítimo completo.
- HTML do novo build obtido com autenticação Vercel; bundle `main.f83d240b.js` conferido com `hud_label`, `icon_key`, `theme_key` e `data-theme`.
- Depois da promoção, o endereço público respondeu HTTP 200 com esse mesmo bundle. Navegador real carregou início e `/trabalhe-conosco` sem erros JavaScript. Capturas: `painel-local/artifacts/live-site-desktop.png` e `painel-local/artifacts/live-careers-mobile.png`.
- Revisão visual local em 1440 e 390 pixels com dados fictícios: editor e dados da candidatura sem erro de página nem rolagem horizontal.

## Recebimento público: estado e pendências

Os documentos antigos não representavam integralmente a configuração atual. O código do aviso usa a versão `2026-10-05` e contém controlador/canal provisórios aprovados anteriormente. A Vercel tem uma variável de produção `REACT_APP_TURNSTILE_SITE_KEY`; o documento de ativação registra um widget provisório limitado a `bom-pra-voce-vert.vercel.app`. A chave não foi exposta nem trocada.

Os arquivos `.env` e `.env.local` do checkout têm `REACT_APP_APPLICATIONS_ENABLED=false` e não têm site key Turnstile. O valor da flag de produção é protegido como `sensitive` e não foi retornado pela consulta de ambiente. Entretanto, a conferência pública em navegador confirmou o formulário ativo, com campos de candidatura e anexo PDF: a produção está habilitada na interface. Nenhuma flag de recebimento foi modificada nesta publicação; o build utiliza as variáveis já existentes na Vercel. Essa observação substitui a suposição anterior de que o formulário público estivesse desativado.

O backend respondeu como habilitado, mas ainda faltam evidências de:

1. inspeção privada que processe `pending` para `clean`/`rejected`/`error` — o trabalhador não consta do repositório;
2. rotina operacional de retenção e exclusão, com verificação de remoção do PDF e dos dados;
3. inspeção e download com a sessão real do RH — envio com PDF fictício e protocolo confirmado na continuação abaixo;
4. configuração do domínio definitivo e atualização do widget quando esse domínio for adotado.

Não foi feita liberação manual de arquivos em quarentena. A exigência de 2FA não foi removida. O Turnstile não foi burlado. A conferência inicial não submeteu formulário; na continuação, o envio fictício foi confirmado, conforme evidência abaixo. Não há confirmação de operação completa de inspeção/download em produção. Portanto, formulário visível e backend habilitado não significam que o RH já receberá PDFs liberados para download.

## Observações operacionais

### Investigação dos panfletos em 07/10

As quatro campanhas continuam com estado `published`, revisão 1 e objetos presentes no bucket público. Todas têm término em `2026-10-06T03:00:00Z`, equivalente a 06/10 às 00h em Brasília. Portanto, foram ocultadas por expiração; não houve exclusão dos arquivos.

A inspeção visual das quatro imagens efetivamente baixadas do Storage confirmou a inscrição **“Ofertas válidas até 05/10/2026”** em todas. Os hashes remotos são diferentes das imagens atuais em `supabase/seeds/promotion-assets`: três imagens locais dizem 09/10, mas essas versões não estão publicadas. Alterar o seed no Git não atualiza a campanha existente (`ON CONFLICT DO NOTHING`) e fazer push do site não publica arquivos no Supabase.

Não foram prorrogadas ofertas comerciais. Para renová-las, usar **Editar / trocar panfleto**, selecionar a nova imagem e informar validade e condições correspondentes. O painel agora explicita **Expirada — não aparece no site** ou **Agendada — ainda não aparece no site**, além do estado de publicação e das datas.

### Tentativa de envio real em 07/10

No Chrome, o formulário público recebeu nome/e-mail fictícios (`TESTE TECNICO - NAO E CANDIDATURA`, `qa-bpv@example.com`) e área “Outra área”. O Turnstile concluiu automaticamente e o botão de envio ficou habilitado, sem intervenção no desafio. O aviso de idioma `pt-BR` com fallback para `pt-br` não impediu essa etapa.

Após o usuário habilitar acesso a arquivos, o teste foi retomado e concluído em 07/10/2026 às 12h25 de Brasília. O site exibiu **Currículo recebido**, protocolo `BPV-2026-o6pVwfThtDWJdw3Dzn2atw`. A consulta ao banco confirmou a candidatura `082b09aa-4cef-4918-a7b9-a1c5e9f76a6f`, o PDF sintético `curriculo-teste.pdf` de 672 bytes e o objeto presente no bucket privado (`public=false`). Nenhum dado pessoal real foi utilizado.

O arquivo permanece em `pending`, aguardando inspeção. O envio e o armazenamento foram comprovados em produção; a liberação e o download pelo RH ainda não foram comprovados. Não foi alterado manualmente o estado de inspeção. O registro fictício foi mantido identificado como teste.

- O histórico remoto já não registrava as migrações locais `20261004234500_rename_application_city_to_address` e `20261005174319_promotion_cache_version`, embora o schema e as funções correspondentes estivessem presentes e tenham sido consultados. Essa divergência é anterior à publicação e não foi corrigida alterando o histórico manualmente. Antes de um futuro `db push`, reconciliar essas entradas para evitar reaplicar a renomeação de `city`.
- Os advisors de segurança apontaram dez avisos informativos de RLS sem policies no schema privado `bpv`, cujo acesso direto de clientes está revogado, e um aviso de proteção contra senhas vazadas desabilitada. Não foram ampliados grants nem alterada essa configuração de Auth.
- A primeira tentativa da continuação foi interrompida por limite de uso da revisão automática de aprovação. Em 07/10 a execução foi retomada, os testes passaram e as funções foram republicadas.
- Para abrir o aplicativo atualizado: `cd painel-local` e `npm start`. O painel já tem arquivo local ignorado pelo Git com somente URL e chave pública do mesmo projeto Supabase.

## Reversão

Para reverter o site, promover o deployment anterior `dpl_JDx6BCpyADtfyi1eqoqJ5JPnhhWZ` após confirmar o destino. A migração é aditiva; conservar colunas e RPCs evita perda de configuração. Não apagar tabelas, versões de panfletos nem currículos como mecanismo de rollback. A versão anterior das funções administrativas pode ser recuperada pelo histórico Supabase, observando que ela volta a apresentar os problemas corrigidos de CORS/edição.
