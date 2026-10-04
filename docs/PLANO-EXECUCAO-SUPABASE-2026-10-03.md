# Implementação Supabase — panfletos e currículos

Data: 03/10/2026. Status: planejamento, com inspeção remota somente de leitura. Nenhuma migração, função, bucket, conta ou configuração remota criada/alterada.

Este documento detalha a execução do [plano consolidado](PLANO-CONSOLIDADO-SITE-SUPABASE-PAINEL-LOCAL.md). Preserva a decisão de aplicativo instalado somente no computador do usuário, separado do site. Complementa o [modelo de dados anterior](PLANO-SUPABASE-DADOS-CURRICULOS-FUNCOES-2026-10-01.md); em divergências sobre o estado atual e os contratos, considerar esta revisão e o código atual.

## 1. O que foi verificado

- Projeto remoto `Bom pra voce`, referência `jcyffbjsvwkmzgvilxha`, região `sa-east-1`, estado `ACTIVE_HEALTHY`, Postgres 17.
- Consultas retornaram: nenhuma tabela em `public`, nenhum bucket, nenhuma Edge Function e nenhuma migração registrada. Isso não constitui inventário completo de outros schemas, Auth ou configuração de segurança.
- Frontend já possui `services/publicApi.js`, `services/promotions.js`, `services/applications.js`, formulário e comprovante. Usa fetch e chave publicável; não precisa de SDK administrativo no site.
- Recebimento depende de configuração e aviso de privacidade aprovado; `.env.example` mantém a opção desativada. `storeConfig.privacy` ainda está incompleto.
- Não há diretório de implementação `supabase/` nem `painel-local/` na árvore examinada. O backend e o painel precisam ser construídos.
- Há numerosas alterações locais preexistentes. Implementação futura deve preservar esse trabalho, revisar diferenças e separar os commits por domínio.

## 2. Escopo e arquitetura

Site público → Edge Functions → Postgres e Storage. Painel instalado → Supabase Auth → funções administrativas → os mesmos dados na nuvem. O computador não é servidor do site e pode ficar desligado sem interromper os recebimentos.

MVP: publicar/substituir/retirar panfletos, programar validade, receber um PDF por candidatura, emitir comprovante confirmado e permitir consulta/download pelo RH autorizado. Sem cadastro de candidato, consulta pública de protocolo, envio de e-mail ao candidato, seleção automática, geração automática de panfletos ou integração com PDV.

Recomendação: entregar panfletos primeiro, depois currículos. Ambos compartilham autenticação administrativa e auditoria, mas panfletos não dependem da definição de guarda e inspeção de currículos.

## 3. Banco, arquivos e permissões

Usar o modelo já documentado, incluindo explicitamente:

| Entidade | Regra necessária |
|---|---|
| `staff_permissions` | Usuário Auth + permissão única e ativa; `promotions.manage`, `applications.read`, `access.manage`. Uma não implica a outra. |
| `promotion_campaigns` | Título, **summary**, condições, início/fim UTC, estado, versão ativa e revisão para concorrência. Fim maior que início. |
| `promotion_versions` | Objeto imutável, hash, MIME validado, tamanho, autor e validação. Vínculo da versão ativa deve garantir mesma campanha. |
| `application_intents` | Identidade efêmera, hashes de credenciais, expiração fixa, estado e reserva do objeto. |
| `applications` | Nome, e-mail, opcionais aprovados, recebimento, prazo de exclusão e versão do aviso apresentado. |
| `application_files` | Um arquivo por candidatura, caminho único, SHA-256 e estado `pending/clean/rejected/error`. |
| `application_receipts` | Uma candidatura/um comprovante; protocolo único e snapshot mínimo. |
| `audit_events` | Ator, operação, alvo interno, horário e resultado; sem conteúdo do currículo ou credenciais. |
| `maintenance_jobs` e `rate_limit_windows` | Trabalho retomável e contadores atômicos de abuso. |

Dados internos em schema não exposto. Acesso por funções com operações delimitadas; revogar execução pública de rotinas privilegiadas. RLS em tabelas expostas, concessões mínimas e RLS defensiva nas internas. Nenhuma leitura ou escrita direta anônima de candidaturas. Usar índices para permissões, vigência, recebimento paginado, expiração e tarefas pendentes; unicidade de intent, protocolo, caminho e versão.

Buckets: `promotion-drafts` privado; `promotion-public` público exclusivamente para materiais aprovados; `resumes-private` privado. Nomes de objetos aleatórios, sem nome/e-mail do candidato. Gravação mediada pelo servidor, nunca permissão ampla de upload anônimo.

Login administrativo por convite, MFA e permissão ativa verificada em cada operação. Cadastro público administrativo desativado. Chaves secretas só nas funções. Não confiar em `user_metadata` para autorização. Downloads de RH devem passar por autorização e auditoria, preferencialmente por resposta autenticada; se usar URL assinada, expiração curta e risco residual até expirar documentado. RLS, permissões de tabela e privilégios do servidor precisam ser testados separadamente. [RLS oficial](https://supabase.com/docs/guides/database/postgres/row-level-security) e [Storage](https://supabase.com/docs/guides/storage/security/access-control).

## 4. Panfletos

1. Editor autenticado cria campanha/rascunho, informa título, resumo, condições e validade.
2. Envia PDF, JPEG, PNG ou WebP ao bucket privado; teto de 10.000.000 bytes, validado no servidor. Validar conteúdo real, dimensões/limites de decodificação e rejeitar formatos ativos não aceitos, como SVG.
3. Painel mostra prévia sem cortar preços. Orientações: imagem vertical 1080 × 1350 px ou PDF A4, mantendo proporção.
4. Publicação cria novo objeto público imutável e só depois troca a versão ativa em transação, exigindo a revisão esperada. Conflito retorna 409; retentativa da mesma publicação deve recuperar resultado, sem criar versões duplicadas.
5. Se houver falha antes da ativação, preservar a versão anterior; reconciliar objetos órfãos. Não existe transação única entre Storage e Postgres.
6. `public-promotions` retorna somente campanhas publicadas com `starts_at <= agora < ends_at`, usando horário do banco. Expiração não depende de cron. Retirar elimina a oferta da consulta, mas não revoga cópias públicas já baixadas.

Contrato preservado: `{ server_time, campaigns: [{ id, title, summary, conditions, starts_at, ends_at, file_url, mime_type, size_bytes, thumbnail_url? }] }`. URLs HTTPS do próprio projeto em `promotion-public`, sem query/hash. Resposta sem cache compartilhado no MVP; mídia imutável pode ter cache. Conferir agendamento, expiração com página aberta e falhas de rede.

## 5. Currículos e recuperação de falhas

1. Formulário obtém desafio antiabuso e chama `application-init` com UUID aleatório de idempotência. Validar desafio no servidor, limitar tentativas/bytes e ter chave geral de suspensão no backend. O flag React não protege a API.
2. Init devolve `{ intent_id, token, server_time, expires_at }`. Janela proposta de 30 minutos, sem renovação ilimitada.
3. `application-submit` recebe multipart com dados e PDF, `Idempotency-Key` e `X-Application-Token`. Teto do arquivo: 5.000.000 bytes; limitar também o corpo total com margem explícita para campos e multipart. Conferir bytes reais, estrutura PDF, tamanho, nome e campos; não confiar no MIME declarado.
4. Persistir objeto privado imutável. Calcular hash do conteúdo e dos campos normalizados. Finalizar candidatura, arquivo e comprovante na mesma transação de banco, com lock e restrição única por intent.
5. Responder `{ status: "received", intent_id, receipt: { protocol, received_at, candidate_name, file_name } }` somente depois da persistência. Protocolo `BPV-AAAA-<sufixo>` com pelo menos 128 bits aleatórios, compatível com o validador atual. Não dá acesso ao arquivo.
6. Repetição idêntica retorna o mesmo comprovante dentro da janela. Payload diferente retorna 409; expirado 410; excesso 429. Resposta perdida não pode causar segunda candidatura. Arquivo órfão deve ser reconciliado após margem e ausência de processamento ativo.
7. Arquivo recebido fica em quarentena até inspeção. Recebimento não significa arquivo seguro ou candidatura aprovada. Scanner indisponível mantém download bloqueado, produz tentativa posterior e alerta.

**Decisão técnica necessária para init:** o contrato atual precisa recuperar o mesmo token quando a primeira resposta se perde. Guardar somente um hash aleatório não permite reconstruí-lo. Proposta: token derivado por HMAC com segredo versionado do servidor, intent e hash da chave de recuperação; guardar verificador e versão da chave. Manter a chave antiga até expirar sua janela. A chave de idempotência funciona como credencial de recuperação e não pode aparecer em logs. Testar duas inicializações simultâneas e retomada sem revalidar cegamente um CAPTCHA já consumido; a recuperação continua sujeita a limites e à posse da chave. Não implementar algoritmo criptográfico próprio.

Não persistir dados/tokens do candidato em localStorage. Fechar/recarregar a página perde a recuperação em memória; informar isso antes do envio e orientar contato em caso de estado incerto após expiração. Não prometer recuperação pública pelo protocolo.

## 6. Ajustes do frontend antes de habilitar

- Código atual envia `name`, `email`, `phone`, `birth_date`, `city`, `area`, `file`. O documento anterior descrevia menos campos. Decisão do usuário nesta revisão: manter nascimento por necessidade do RH. Armazenar como date, validar data existente e não futura; não inferir idade mínima nem criar filtro automático por idade. Manter opcional no MVP, como no formulário atual, até definição explícita de obrigatoriedade. Telefone/cidade/área opcionais devem ter justificativa e limites no servidor.
- Adicionar desafio antiabuso ao fluxo; ainda não existe no payload de init. Escolher provedor e testar renovação, acessibilidade e retentativa.
- Registrar versão do aviso de privacidade apresentada e validá-la no servidor, evitando registrar versão nova não vista pelo candidato.
- Diferenciar rejeição definitiva antes da gravação (400/413/415/422, permitindo corrigir) de resultado incerto (timeout/falha após possível commit, preservando envio). Hoje erros HTTP se tornam mensagens genéricas e podem impedir correção dos campos.
- Preservar os contratos já usados, inclusive `summary`, nomes dos headers e formato do comprovante. Testar timeout de 25 segundos em rede móvel com PDF no limite.
- Funções públicas recebem chave publicável sem JWT de usuário: configurar conscientemente o gateway e validar o modo público no handler. Chave publicável não autentica uma pessoa. Funções administrativas exigem JWT válido e permissão. CORS deve permitir apenas origens aprovadas, métodos e headers necessários, incluindo preflight. [Autenticação de funções](https://supabase.com/docs/guides/functions/auth).

## 7. Ordem de implementação e critérios de conclusão

| Etapa | Entregáveis | Critério verificável |
|---|---|---|
| 1. Preparar | Inventário restante de schemas/Auth/configuração; ambiente local ou homologação; contratos e versões de ferramentas | Projeto correto e diferenças conhecidas, sem usar dados reais em testes |
| 2. Fundação | `supabase/`, migrações aditivas, buckets, permissões, helpers e testes | Recriar ambiente do zero; visitante e funcionário sem permissão bloqueados por API direta |
| 3. Panfletos | `promotion-admin`, `public-promotions`, testes e integração do site | Publicar, substituir, retirar e expirar; falha preserva anterior; concorrência não sobrescreve |
| 4. Recebimento | `application-init`, `application-submit`, comprovante, antirrobô e correções pontuais no site | PDF fictício gera um único recibo; resposta perdida e repetição concorrente não duplicam |
| 5. Painel local | Projeto separado, login/MFA, campanhas, RH paginado, download autorizado | Editor não lê currículos; RH não publica sem permissão; revogação efetiva |
| 6. Operação | Worker de inspeção, manutenção, retenção, auditoria, backup e manual | Quarentena bloqueia download; exclusão retoma falhas; restauração de banco e arquivos demonstrada |
| 7. Homologar/liberar | Testes remotos fictícios, configuração de domínio, instalador e publicação autorizada | Site funciona com painel/PC desligado; jornada móvel; nenhuma credencial secreta no cliente |

Backend pode avançar antes da escolha do runtime do painel. Confirmar SO/versão antes de decidir Electron/Tauri, instalação e atualização. Não reabrir a decisão de painel local nem construir administração no site público.

Arquivos futuros: `supabase/config.toml`, migrações, `supabase/functions/{public-promotions,application-init,application-submit,promotion-admin,rh-applications}`, rotinas internas de manutenção, testes de banco/contrato e `painel-local/`. Gerar migrações com a CLI, revisar SQL e provar reprodução antes de aplicar remotamente. Nesta etapa, nenhum desses componentes foi criado.

## 8. Operação e bloqueios para liberação

Escolher inspeção privada compatível com confidencialidade e custo. Não enviar currículos a scanners públicos nem assumir antivírus embutido no Storage. Processamento pesado precisa de worker adequado; não colocar inspeção pesada síncrona no recebimento. Verificar [limites de Edge Functions](https://supabase.com/docs/guides/functions/limits) na implementação.

Definir responsável pelo RH, identificação/canal do controlador, finalidade e prazo de guarda, texto de privacidade e cópias baixadas no computador. Decisão do usuário: guardar currículos por 6 meses contados do recebimento. Calcular delete_after no servidor por seis meses de calendário, com referência America/Sao_Paulo e instante persistido em UTC; negar acesso ao vencer e processar exclusão por rotina diária retomável. Esse prazo é política escolhida, não obrigação legal afirmada neste plano. Abranger dados, nascimento, anexo e recibo; definir separadamente o ciclo de expiração dos backups e a orientação de descarte das cópias baixadas. Não habilitar recebimento com placeholders.

Exclusão: bloquear acesso, excluir objeto pela API Storage e dados pessoais/recibo, registrar conclusão mínima; falhas ficam pendentes com nova tentativa. Backups precisam incluir objetos separadamente: [backup de banco não inclui arquivos Storage](https://supabase.com/docs/guides/platform/backups). Definir destino, frequência, criptografia e retenção; restauração deve reaplicar exclusões antes de reabrir acesso.

Alertar sobre erros de upload/finalização, fila de inspeção, falhas de exclusão e uso de armazenamento. Medir volume e downloads antes de estimar custo; plano da organização, orçamento, scanner e destino de backup ainda não foram verificados. Não contratar serviços neste planejamento.

Rollback: desativar recebimento no servidor e cliente, preservar confirmações existentes, reverter versões de funções compatíveis; migrações aditivas não devem apagar candidaturas. Para panfletos, permitir reativar versão anterior explicitamente. Restaurar backup é procedimento distinto e exige reconciliação de dados/objetos.

## 9. Testes indispensáveis

- Permissões por API direta: visitante, conta sem papel, editor, RH, gestor de acessos e conta revogada; tentativa de autopromoção negada.
- Arquivos inválidos, PDF criptografado/não inspecionável, MIME falso, tamanho excessivo e caminho arbitrário; nenhum recibo falso ou liberação indevida.
- Mesma chave em concorrência, inicialização com resposta perdida, falha entre Storage/banco e falha após commit; uma candidatura/um protocolo.
- Publicação concorrente, cópia interrompida, validade futura, expiração e retirada; rascunho nunca acessível publicamente.
- Exclusão parcial, indisponibilidade do scanner, backup/restauração, ausência de PII em logs e segredo em bundles.
- Jornada real com dados fictícios: celular envia e guarda comprovante; painel publica e RH baixa apenas arquivo liberado. Testes locais/mocks não substituem esses testes remotos.

## 10. Fontes e limites desta revisão

Documentação oficial consultada em 03/10/2026, vinculada nas seções correspondentes. O índice `changelog.md` falhou por tipo de conteúdo no leitor; consultado o [changelog HTML](https://supabase.com/changelog) como alternativa. Revalidar mudanças relevantes e versões exatas no início da implementação.

O status saudável do projeto comprova disponibilidade informada pela plataforma, não funcionamento dos fluxos. Permanecem pendentes inventário completo de Auth/schemas, implementação, testes, configuração operacional e liberação.

