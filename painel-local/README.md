# Painel local Bom Pra Você

Aplicativo administrativo separado do site público e executado em Electron.

## Configuração

1. Copie `.env.example` para `.env.local`.
2. Preencha a URL e a chave publicável do projeto Supabase. Não use `service_role`.
3. Execute `npm install`.

## Execução

- Desenvolvimento: `npm run dev`
- Compilar e abrir no Electron: `npm start`
- Apenas compilar a interface: `npm run build`

O aplicativo usa estados internos `#ofertas` e `#curriculos`; nenhuma rota administrativa é adicionada ao site público.

## Controle de ofertas e currículos

- Ofertas: edição do título, resumo, condições, validade, categoria, ordem, nome do cartão (HUD), oito ícones e cinco temas com seleção visual e prévia. Envio de imagem/PDF de até 10 MB para substituir o panfleto.
- A publicação grava os dados e a nova versão do panfleto na mesma transação. Conflitos de revisão não sobrescrevem alterações de outro operador.
- Currículos: consulta dos dados enviados, busca nos registros carregados, paginação e download individual. Arquivos em inspeção, rejeitados ou expirados não são liberados.
- 2FA: cadastro por QR Code ou chave manual, confirmação de seis dígitos, retomada de cadastro abandonado e exigência de AAL2 antes de abrir a gestão. Não remove autenticadores já verificados.

## Atualização do backend

A migração `supabase/migrations/20261006234947_admin_campaign_customization.sql` foi aplicada ao projeto `jcyffbjsvwkmzgvilxha`. As funções `promotion-admin` e `rh-applications` foram publicadas na versão 6 em 07/10/2026. O site com nomes, ícones e temas dos cartões foi publicado e promovido na Vercel. Veja o [registro de publicação e pendências](../docs/PUBLICACAO-PAINEL-2026-10-07.md).

Conservar as permissões `promotions.manage` e `applications.read`, TOTP habilitado e as origens autorizadas do painel nas Edge Functions. Os endpoints administrativos aceitam explicitamente `null` (Electron), `http://127.0.0.1:5174` e `http://localhost:5174`. A permissão de RH foi concedida à conta administrativa existente e auditada. Não ampliar essa lista com curingas.

O painel não transforma PDFs pendentes em seguros. A consulta remota confirmou um autenticador TOTP verificado, acesso de RH concedido e nenhuma candidatura disponível. Upload/publicação e download completos com uma sessão do operador ainda precisam de validação. A ativação de candidaturas deve seguir o estado real registrado no documento de publicação; os arquivos locais de ambiente e a configuração hospedada não são equivalentes.

## Validação local

- `npm test`: testes de MFA, contratos da API, publicação com metadados, download e telas.
- `npm run test:database`: aplica todas as migrações em PostgreSQL em memória (PGlite) e verifica permissões, rollback, revisão, cache, paginação por data/ID e bloqueios de download por quarentena/expiração.
- `npm run build`: compilação Vite.
- `node scripts/check-remote.mjs`: verifica CORS, bloqueio sem autenticação, ofertas públicas e rejeição de candidatura sem Turnstile no Supabase real, usando somente URL/chave pública de `.env.local`.
- `scripts/visual-check.cjs`: revisão automatizada em navegador com API simulada; requer Playwright disponível em `PLAYWRIGHT_MODULE`, Edge e servidor Vite em `127.0.0.1:5175` com variáveis públicas de teste. Capturas em `artifacts/` usam somente dados fictícios.

Em 06/10/2026: sete testes do painel passaram, as verificações SQL passaram e as telas foram conferidas a 1440 e 390 pixels. O site compilou; sua suíte existente (29 testes) e o teste adicional de personalização passaram. As duas Edge Functions passaram em `deno check`. Esses resultados não substituem a validação de Auth, Storage, CORS e inspeção no Supabase hospedado.
