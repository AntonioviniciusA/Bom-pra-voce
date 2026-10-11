# Plano — várias contas de Instagram no painel

**Data:** 10 de outubro de 2026. **Estado:** planejamento; nenhuma implementação deste plano.

## Decisão e resultado esperado

O administrador conecta várias contas profissionais pela interface do painel local. Ao publicar um panfleto, escolhe **uma ou mais contas**, e para cada uma escolhe Feed, Story ou ambos. A confirmação mostra os perfis `@usuario`, os formatos e o horário antes de criar as tarefas. Não há escolha implícita quando nenhuma conta está marcada. Publicar somente no site continua possível.

Cada tarefa pertence a uma combinação imutável de versão do panfleto, conta e formato. A fila e o histórico mostram sempre o destino escolhido, mesmo se o perfil for renomeado ou desconectado depois.

## Situação encontrada no código

- `painel-local/src/Offers.jsx` oferece caixas globais de Feed e Story e uma legenda, sem seleção de conta.
- `supabase/migrations/20261009110000_instagram_publications.sql` guarda uma tarefa por versão e formato, com chave única `(promotion_version_id, provider, surface)`; não há `account_id`.
- `supabase/functions/instagram-publisher/index.ts` lê um único `INSTAGRAM_BUSINESS_ACCOUNT_ID` e `INSTAGRAM_ACCESS_TOKEN` dos segredos da função. O trabalhador, portanto, não consegue distinguir destinos por tarefa.
- `painel-local/src/InstagramPublications.jsx` lista e reenvia tarefas, mas não exibe conta ou gerencia conexões.
- As peças atuais de Instagram estão no diretório de trabalho sem commit; antes de implementar, confirmar qual versão será a base e preservar as alterações paralelas.

## Experiência proposta

### Conexões

Na aba **Instagram**, seção **Contas conectadas**:

1. **Conectar conta** abre a autorização oficial da Meta. O painel nunca pede senha nem token colado pelo operador.
2. A volta da autorização exibe `@usuario`, nome, tipo de conta, capacidade de Feed/Story, estado e última verificação. O administrador confirma a inclusão.
3. É possível conectar outras contas, reconectar uma expirada e desativar/desconectar uma conta. O mesmo ID externo não cria duas conexões ativas.
4. Desconectar informa quantas tarefas futuras serão suspensas. Não apaga histórico e não redireciona tarefas automaticamente para outro perfil.
5. Apenas administradores com permissão específica de **gerenciar conexões sociais** podem conectar ou desconectar; quem tem permissão de **publicar promoções** pode selecionar somente contas ativas e autorizadas.

### Publicação de panfleto

No editor de ofertas, a seção **Publicar também no Instagram** lista cartões por `@usuario` com seleção múltipla. Em cada cartão selecionado há Feed, Story e estado de elegibilidade. O botão final mostra, por exemplo, `Site + @loja1 Feed/Story + @loja2 Story`. A prévia e a confirmação mostram o mesmo resumo.

Sem conta escolhida, nenhuma tarefa social é criada. Conta desconectada, token inválido ou falta de permissão bloqueiam somente aquele destino e pedem correção explícita. Story só aparece para conta Comercial validada; para conta Criador, permitir Feed quando autorizado. O arquivo atual precisa ser JPG para a automação existente. Se o usuário mantiver um panfleto antigo sem subir arquivo novo, validar o tipo real da versão ativa no servidor antes de aceitar a seleção.

Na fila, mostrar `@usuario` e ID/identificador interno da conta, formato, horário, estado, erro e link quando a Meta devolver um. Permitir filtrar por conta. O reenvio mantém a mesma conta; mudar destino é uma **nova solicitação**, com confirmação e registro de quem fez.

## Dados e contratos

- Criar `bpv.social_accounts`: ID interno, provedor, ID externo da Meta, nome de usuário, tipo, capacidades/permissões, estado (`active`, `needs_reauth`, `disabled`), datas de conexão e verificação, criador e referência ao segredo. Unicidade por provedor e ID externo no escopo do produto.
- Guardar token por conta em armazenamento criptografado, com acesso exclusivo de funções servidoras. Preferir Supabase Vault após validar o acesso restrito no projeto; a tabela de metadados e as respostas ao painel nunca incluem token ou segredo. O app ID/segredo da aplicação Meta continuam em segredos do servidor.
- Adicionar `account_id` obrigatório às **novas** `bpv.social_publications`, além de um snapshot de `@usuario` para auditoria. Alterar a unicidade para `(promotion_version_id, account_id, surface)`. Preservar a identidade da conta na tarefa mesmo após desconexão.
- Representar as escolhas por conta e formato num contrato explícito de publicação (por exemplo, lista de `{account_id, feed, story}`), validado no servidor contra contas ativas e capacidades. Não confiar nos nomes ou capacidades enviados pelo painel.
- Criar tarefas na mesma transação da publicação da versão no site. Uma intenção por conta/formato; a chave de idempotência considera versão + conta + formato. Não recriar tarefas publicadas ao repetir a requisição.
- O worker recebe `account_id` da tarefa, obtém somente o token dessa conta, chama a Meta para o ID externo correspondente e grava o resultado nessa mesma tarefa. Nunca usa um token global como fallback para outra conta.
- Separar tentativas e estado da intenção. Antes de repetir uma chamada cujo resultado é incerto, consultar o contêiner ou mídia externa e reconciliar. Falha após resposta da Meta, antes de gravar no banco, não pode virar repostagem cega.
- Restringir tabelas privadas e funções privilegiadas a chamadas servidoras autenticadas; conferir escopo e permissão em cada ação. Auditar conectar, reconectar, desativar, seleção, cancelamento e reenvio sem registrar tokens.

## Migração e compatibilidade

1. Verificar se a migração de publicação atual já foi aplicada em cada ambiente e se há tarefas reais. Não presumir implantação a partir dos arquivos locais.
2. Se houver conta única em produção, conectá-la pelo novo fluxo e associar tarefas antigas apenas depois de confirmar que o ID da Meta é o mesmo. Tarefas antigas sem vínculo comprovado ficam suspensas para reconciliação manual, nunca atribuídas por aproximação.
3. Fazer migração aditiva, preservar histórico e substituir a chave única antiga. Planejar a transição de colunas obrigatórias em etapas para não bloquear registros legados.
4. Retirar `INSTAGRAM_BUSINESS_ACCOUNT_ID` e `INSTAGRAM_ACCESS_TOKEN` somente após migrar e validar a fila; manter a versão da Graph API e o segredo do worker no servidor.
5. Publicar backend e painel de forma compatível durante a transição. Impedir que um painel antigo envie opções globais para uma fila que exige conta sem uma regra de compatibilidade explícita.

## Falhas, segurança e operação

- Conexão usa OAuth com `state` de uso único, proteção de sessão, callback autorizado e troca de código exclusivamente no servidor. Validar a conta retornada pela Meta; não aceitar ID digitado pelo cliente como prova de posse.
- Atualizar/revalidar tokens conforme o fluxo de login escolhido; marcar `needs_reauth` e suspender só as tarefas daquela conta ao perder autorização. Não registrar token em logs, URL de interface ou eventos de auditoria.
- Desativação de conta suspende tarefas futuras e em processamento seguro; publicação já confirmada permanece no histórico. Reconexão só libera tarefas após o administrador revisar destinos e datas vencidas.
- Tratar limites e erros por conta, com atraso para falhas transitórias e aviso para falhas permanentes. Um destino com falha não impede o envio às demais contas nem altera o site.
- Confirmar na integração real o fluxo escolhido da Meta, os endpoints corretos para esse fluxo, disponibilidade de Stories, permissões aprovadas e limites atuais. Não misturar token de Instagram Login com endpoints e permissões do fluxo Facebook Login sem validação.
- A aprovação do aplicativo Meta e o teste com contas reais continuam exigências externas. Arquivo local, testes simulados ou deploy não demonstram que um post apareceu no Instagram.

## Ordem de implementação futura

1. Confirmar aplicativo Meta, fluxo Instagram Login, permissões, callback e contas de teste; verificar ambientes e dados já implantados.
2. Criar modelo de contas, armazenamento seguro de tokens, autorização do administrador e rotas de conectar/listar/reconectar/desativar.
3. Migrar publicação/fila para destinos explícitos e idempotência por conta, com estratégia para tarefas antigas.
4. Construir gestão de contas, seleção múltipla e resumo de confirmação no painel.
5. Adaptar worker, reconciliação, lista, filtros e reenvio por conta.
6. Testar com duas contas reais: uma publicação para ambas, formatos diferentes, conta Criador sem Story, token revogado em uma, reconexão, repetição de requisição, falha após publicar na Meta, desconexão com tarefa futura e ausência de tarefa quando só o site foi escolhido. Conferir cada perfil no próprio Instagram e registrar IDs/horários sem expor credenciais.

## Critérios de aceite

- O operador vê qual `@usuario` receberá cada formato antes de confirmar.
- Uma campanha pode gerar tarefas independentes para duas ou mais contas na mesma operação.
- O servidor rejeita conta inexistente, não autorizada, desativada ou sem capacidade para o formato.
- Nenhuma tarefa muda de conta por reconexão, renomeação ou reenvio.
- Repetir uma publicação ou recuperar uma falha não duplica post já confirmado.
- O painel mostra resultado por conta; falha de uma não oculta resultado das demais.
- Tokens não aparecem no cliente, banco de metadados, logs ou respostas administrativas.
- O teste externo confirma Feed e Story nos perfis escolhidos antes de chamar a funcionalidade de operacional.

## Fontes verificadas em 10/10/2026

- Meta, documentação oficial da Instagram API no Postman: https://www.postman.com/meta/workspace/instagram/documentation/23987686-9386f468-7714-490f-9bfc-9442db5c8f00
- Meta, Instagram API with Instagram Login: https://www.postman.com/meta/instagram/folder/6raa77c/instagram-api-with-instagram-login
- Meta, limites de Stories por tipo de conta: https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api
- Supabase, Vault: https://supabase.com/docs/guides/database/vault
- Supabase, segredos de Edge Functions: https://supabase.com/docs/guides/functions/secrets
- Supabase, recomendações de segredos por linha/organização: https://supabase.com/docs/guides/troubleshooting/working-around-the-edge-function-secrets-limit
