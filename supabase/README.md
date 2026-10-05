# Backend Supabase — Bom Pra Você

Implementação local dos fluxos de panfletos e candidaturas. Nada nesta pasta aplica mudanças ao projeto remoto automaticamente.

## Componentes

- `migrations/`: schema privado `bpv`, buckets, restrições, índices e RPCs acessíveis somente pela chave secreta do servidor.
- `functions/public-promotions`: lista somente campanhas publicadas e vigentes.
- `functions/application-init`: valida Turnstile, limite de abuso e cria/recupera uma sessão idempotente de 30 minutos.
- `functions/application-submit`: valida campos e bytes do PDF, grava em quarentena e finaliza candidatura/comprovante em uma transação de banco.
- `functions/promotion-admin`: cria, publica e retira campanhas com JWT de usuário e permissão ativa.
- `functions/rh-applications`: lista candidaturas e transmite apenas PDFs marcados como `clean`, com autorização e auditoria.

## Configuração obrigatória antes de homologar

1. Instalar a CLI oficial do Supabase e iniciar um ambiente local limpo.
2. Copiar as variáveis de `.env.example` para um arquivo local não versionado. Gere `APPLICATION_TOKEN_SECRET_V1` com 32 bytes aleatórios ou mais.
3. Configurar `ALLOWED_ORIGINS` com as origens exatas dos ambientes. A origem pública `https://bom-pra-voce-vert.vercel.app` já é permitida por padrão; inclua aqui domínios adicionais de homologação e produção.
4. Criar widgets Turnstile distintos para homologação e produção, limitados aos respectivos domínios.
5. Manter `APPLICATIONS_ENABLED=false` até o aviso de privacidade ser aprovado e o scanner privado estar operacional.
6. Aplicar a migração apenas em ambiente local/homologação, executar `supabase/tests/database/001_foundation.sql` e os testes Deno.
7. Conceder permissões a usuários convidados inserindo `staff_permissions` por um procedimento administrativo controlado. Não existe autocadastro nem autopromoção.

## Segredos e rotação

O token de intent é derivado por HMAC. Ao rotacionar, crie `APPLICATION_TOKEN_SECRET_V2`, mude `APPLICATION_TOKEN_KEY_VERSION` para `2` e mantenha V1 por pelo menos a janela máxima das sessões existentes. Nunca registre a chave de idempotência, o token, dados do candidato ou conteúdo do currículo.

## Pendências operacionais que bloqueiam produção

- trabalhador privado de inspeção que mova `pending` para `clean`, `rejected` ou `error`;
- rotina diária retomável de retenção e limpeza de órfãos;
- alertas, backup separado dos objetos e ensaio de restauração;
- identidade/canal do controlador, texto e versão do aviso de privacidade;
- teste remoto com contas sem permissão, editor, RH, gestor e conta revogada.

## Decisão temporária — 04/10/2026

O recebimento de currículos permanece desativado até a compra/configuração do domínio definitivo. Não usar chaves de teste do Turnstile no site público e não remover a validação do servidor como atalho.

Antes de ativar:

1. comprar e apontar o domínio definitivo;
2. criar um widget Cloudflare Turnstile em modo `Managed`, limitado ao domínio definitivo;
3. configurar a `site key` no frontend e a `secret key` somente nos segredos das Edge Functions;
4. substituir `privacidade@example.com` por um canal verdadeiro;
5. preencher a razão social e o CNPJ do controlador;
6. validar juridicamente se a retenção de currículos por 6 meses é adequada à finalidade e à operação da empresa;
7. aprovar/versionar o aviso de privacidade e somente então definir `APPLICATIONS_ENABLED=true` no frontend e no Supabase;
8. testar com PDF fictício, confirmar protocolo, quarentena privada, inspeção, acesso do RH e eliminação.
