# Painel local adotado — Supabase e site público

Data: 01/10/2026. Estado: arquitetura adotada pelo usuário; implementação não autorizada por esta decisão. Tecnologia desktop ainda a definir.

Complementa o [plano do frontend](PLANO-FRONTEND-CORRECOES-AUDITORIA-2026-10-01.md) e o [plano de dados e funções](PLANO-SUPABASE-DADOS-CURRICULOS-FUNCOES-2026-10-01.md). Substitui a proposta anterior de painel web. O [plano consolidado](PLANO-CONSOLIDADO-SITE-SUPABASE-PAINEL-LOCAL.md) organiza a entrega completa. Nome do arquivo preservado para compatibilidade dos links.

## Divisão adotada

| Parte | Responsabilidade |
|---|---|
| Site público hospedado | Informações da loja, ofertas vigentes, envio de currículo e comprovante após confirmação. Sem painel administrativo ou consulta pública de currículo/protocolo. |
| Supabase na nuvem | Fonte oficial dos dados, arquivos, autenticação, permissões, validação de envios, publicação de campanhas, protocolo, auditoria e rotinas de manutenção. |
| Programa no computador do usuário | Login individual, envio/prévia/publicação de panfletos, instruções de tamanho e consulta restrita dos currículos pelo RH. |

O painel faz conexões de saída HTTPS ao Supabase. O site não chama o computador da loja. Não abrir portas do roteador nem depender de o programa estar aberto para receber currículos. Com o PC desligado, a parte pública continua operando enquanto hospedagem e Supabase estiverem disponíveis.

O backend continua existindo como serviço gerenciado e funções na nuvem. O painel local é um cliente administrativo, não o servidor responsável pelo recebimento público.

## Integridade e segurança

- Programa instalado usa chave publicável e login individual, nunca chave secreta, service_role ou senha do banco embutida no executável. Instalação local não torna segredos incorporados seguros.
- Permissões de marketing e RH distintas, verificadas no servidor; esconder um botão não constitui autorização. RLS nas tabelas expostas e regras de Storage; operações privilegiadas passam por funções autenticadas e autorizadas.
- Currículos privados, acessados somente por RH autorizado. Evitar sincronizar todos os currículos para disco. Downloads explícitos deixam cópias locais que precisam de controle de acesso e política de descarte.
- Preferir sessão protegida pelo mecanismo do sistema operacional, bloqueio após inatividade e encerramento de sessão em equipamento compartilhado. MFA recomendado para equipe; definir recuperação antes da implantação.
- Publicação de panfleto confirmada pela nuvem: material anterior permanece até a nova versão ser validada e ativada. Conflitos de edição não podem sobrescrever alterações silenciosamente.
- Currículo e comprovante conservam validação, armazenamento privado, idempotência e confirmação descritos no plano de dados. O protocolo não dá acesso ao arquivo nem habilita consulta pública.
- Retenção, exclusão, limpeza de arquivos órfãos e backups não devem depender do computador ligado. Backup do banco e dos arquivos deve ser planejado separadamente, com teste de restauração.

## Internet e funcionamento offline

Recomendação para a primeira versão: painel conectado, sem banco local de currículos e sem sincronização offline. Sem internet, mostrar indisponibilidade e não afirmar publicação ou atualização concluída. Um rascunho local de panfleto pode ser avaliado posteriormente; não é uma publicação.

Se o Supabase ficar indisponível, o site deve indicar falha no recebimento, nunca gerar confirmação fictícia. A exibição de ofertas deve respeitar sua validade mesmo quando houver cache. Não existe promessa de operação totalmente offline nesta arquitetura.

## Benefícios e custos de manutenção

O site público fica com menos telas e dependências administrativas. O programa pode oferecer integração com arquivos e impressão do computador. Contudo, não elimina o custo de Supabase, hospedagem pública e domínio, nem garante mais segurança por estar instalado.

Há trabalho adicional com instalador, atualização, compatibilidade com Windows, armazenamento seguro de sessão, recuperação e suporte aos computadores. Assinatura de distribuição pode acrescentar custo; não foi cotada. Não há motivo comprovado para afirmar economia mensal relevante frente ao painel web separado.

Para um único computador e preferência operacional por programa instalado, a alternativa é viável. Para acesso frequente de vários dispositivos, um painel web separado com login tende a simplificar distribuição e atualizações. A escolha depende do uso, não de uma exigência do Supabase. Não selecionar Electron/Tauri nem criar integração com PDV nesta etapa.

## Impacto sobre os planos anteriores

Com a adoção desta arquitetura, implementar futuramente:

1. Manter as correções A01–A19 e as páginas públicas do plano do frontend.
2. Transferir login, gestão de panfletos e RH das rotas `/admin/*` para um projeto administrativo separado; não entregar esses módulos no pacote público.
3. Reutilizar os contratos de funções, permissões, armazenamento e dados já planejados. Revisar autenticação e recuperação de conta para o cliente instalado.
4. Acrescentar empacotamento, atualização, sessão segura e testes no computador real ao plano de entrega.
5. Testar site com painel desligado; falha de internet durante publicação; repetição de envio; permissões marketing/RH; logout/revogação; conflitos entre computadores; instalação e atualização preservando a configuração.

O usuário confirmou uso **somente no próprio computador**. Isso favorece operacionalmente um painel instalado, conforme escolha confirmada; não cria necessidade de servidor local, banco offline ou acesso pela rede da loja. Recomenda-se um aplicativo pequeno, conectado, com duas áreas: Panfletos e Currículos. Tecnologia, sistema operacional alvo e forma de atualização ainda devem ser definidos antes da implementação. Informações institucionais, pagamentos e FAQ continuam no escopo público até indicação explícita do usuário para removê-las.

## Fontes verificadas

- [Supabase: chaves de API e clientes desktop](https://supabase.com/docs/guides/getting-started/api-keys).
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security).
- [Supabase: controle de acesso ao Storage](https://supabase.com/docs/guides/storage/security/access-control).

Análise arquitetural, sem inspeção remota, alteração de código ou validação de funcionamento de um painel existente.

