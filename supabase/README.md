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
3. Criar widgets Turnstile distintos para homologação e produção, limitados aos respectivos domínios.
4. Manter `APPLICATIONS_ENABLED=false` até o aviso de privacidade ser aprovado e o scanner privado estar operacional.
5. Aplicar a migração apenas em ambiente local/homologação, executar `supabase/tests/database/001_foundation.sql` e os testes Deno.
6. Conceder permissões a usuários convidados inserindo `staff_permissions` por um procedimento administrativo controlado. Não existe autocadastro nem autopromoção.

## Segredos e rotação

O token de intent é derivado por HMAC. Ao rotacionar, crie `APPLICATION_TOKEN_SECRET_V2`, mude `APPLICATION_TOKEN_KEY_VERSION` para `2` e mantenha V1 por pelo menos a janela máxima das sessões existentes. Nunca registre a chave de idempotência, o token, dados do candidato ou conteúdo do currículo.

## Pendências operacionais que bloqueiam produção

- trabalhador privado de inspeção que mova `pending` para `clean`, `rejected` ou `error`;
- rotina diária retomável de retenção e limpeza de órfãos;
- alertas, backup separado dos objetos e ensaio de restauração;
- identidade/canal do controlador, texto e versão do aviso de privacidade;
- teste remoto com contas sem permissão, editor, RH, gestor e conta revogada.

