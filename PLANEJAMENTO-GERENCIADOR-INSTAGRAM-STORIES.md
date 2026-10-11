# Planejamento — gerenciador de publicações no Instagram e Stories

**Status:** planejamento e pesquisa; nenhuma alteração de produto foi realizada.

**Data da pesquisa:** 8 de outubro de 2026.

**Objetivo:** ao publicar um panfleto no site Bom Pra Você, permitir que ele seja enviado ao Instagram configurado sem novo upload manual, com opção de Feed, carrossel e Story.

## 1. Resultado esperado

O painel passará a tratar a publicação social como uma consequência rastreável da publicação do panfleto no site:

```text
Rascunho de panfleto
  -> aprovação/publicação no site
  -> geração de tarefas independentes por canal
  -> Instagram: Feed / carrossel / Story
  -> confirmação, falha ou reenvio no painel
```

O arquivo será enviado uma única vez ao Bom Pra Você. O site fornecerá à Meta uma URL HTTPS pública e temporariamente estável da mídia; o painel nunca deve solicitar login ou senha do Instagram ao operador.

## 2. Escopo da primeira versão

### Incluído

- Conectar uma conta do Instagram por organização/loja por OAuth da Meta.
- Selecionar, para cada panfleto, `somente site`, `Feed`, `Story`, ou `Feed e Story`.
- Publicação imediata quando o panfleto entrar no ar e agendamento pelo painel.
- Legenda editável com modelo inicial (título, período de validade, chamada e URL do panfleto).
- Histórico por tentativa: solicitada, preparando, publicada, falhou, cancelada e expirada.
- Reenvio seguro após falha, sem duplicar publicação já confirmada.
- Tela de conexões, calendário/fila e detalhe da publicação.
- Auditoria de quem conectou, aprovou, agendou, cancelou ou reenviou.

### Deliberadamente fora da primeira versão

- Login por senha ou automação de navegador.
- Postagem em contas pessoais do Instagram.
- Responder comentários, DMs, anúncios pagos, colaboração, marcações comerciais, música, enquete, link sticker, GIF ou outros stickers interativos em Stories.
- Apagar/editar uma publicação já feita diretamente no Instagram a partir do painel; inicialmente o painel apenas registra e encaminha o usuário ao Instagram quando necessário.
- Múltiplas redes sociais. A modelagem deve permitir extensão futura, mas a entrega inicial será Instagram.

## 3. Fatos e limites que orientam o desenho

1. A publicação programática deve usar a **Instagram Platform / Content Publishing API** da Meta. Ela cria um contêiner de mídia e, após o processamento, publica-o em uma segunda chamada.
2. Apenas contas profissionais são elegíveis. Para Feed e carrossel, podem ser Comercial ou Criador; para **Stories, a documentação da Meta informa que a conta deve ser Comercial**. Portanto, o painel deve bloquear o modo Story e explicar a pendência se a conexão não for Business.
3. O fluxo moderno de conexão pode usar Instagram Login, sem vínculo obrigatório com Página do Facebook. As permissões relevantes são `instagram_business_basic` e `instagram_business_content_publish`. O caminho legado, baseado em Facebook Login, tem permissões diferentes e exige uma Página vinculada; não deve ser o padrão de uma integração nova.
4. A mídia não pode ficar só no computador ou atrás de autenticação do site. A Meta precisa buscá-la por URL HTTPS pública durante a publicação.
5. Stories ficam visíveis por aproximadamente 24 horas. O painel deve preservar o histórico mesmo quando o Story já tiver expirado na plataforma.
6. A cota de publicação deve ser consultada pela API antes de disparar tarefas. A referência pública descreve limite de 100 publicações por janela móvel de 24 horas; a aplicação não deve codificar isso como garantia permanente.
7. Uma publicação solicitada não é uma publicação concluída: o worker deve consultar o status do contêiner, publicar somente quando pronto e armazenar o identificador/permalink retornado.

## 4. Decisões recomendadas

| Tema | Decisão |
| --- | --- |
| Gatilho | Criar tarefas no mesmo ato de publicar o panfleto no site, nunca por varredura da página pública. |
| Segurança editorial | Padrão: `revisar antes de publicar`; permitir automático somente em configurações explicitamente habilitadas. |
| Conta de Story | Exigir conexão validada de Instagram Comercial. |
| Arte | Criar derivada vertical 9:16 para Story; não recortar silenciosamente o panfleto quadrado/retangular. |
| Link | Incluir URL na legenda do Feed. Não prometer link clicável no Story: sticker de link não entra no escopo da API. |
| Agendamento | O Bom Pra Você mantém a fila e envia à Meta na hora marcada; o agendamento é responsabilidade do produto. |
| Idempotência | Uma chave por `panfleto + revisão + destino + formato + horário planejado`. |
| Falhas | Retry com atraso progressivo apenas para falhas transitórias; erros de credencial, mídia e permissão exigem ação no painel. |

## 5. Jornada no painel

### 5.1 Configurar conexão

1. Administrador abre **Configurações > Canais sociais > Instagram**.
2. Escolhe **Conectar Instagram** e conclui o OAuth da Meta.
3. O backend guarda os tokens criptografados e obtém os dados mínimos da conta (ID, nome de usuário, tipo e permissões).
4. O painel apresenta diagnóstico: Feed disponível, Story disponível/não disponível, token válido e última verificação.
5. O administrador escolhe se a publicação automática começa desligada, com revisão, ou habilitada para regras específicas.

### 5.2 Publicar um panfleto

No formulário de publicação do panfleto, adicionar a seção **Distribuição no Instagram**:

- Destino: conta conectada.
- Formato: Feed, Story, ambos ou não publicar.
- Momento: agora ou data/hora.
- Legenda: prévia editável para Feed.
- Arte de Story: escolher/gerar versão vertical e revisar prévia.
- Regra: solicitar aprovação ou publicar automaticamente (apenas se a organização habilitou isso).

Ao confirmar, o panfleto vai ao site e as tarefas sociais entram na fila. A resposta não deve depender de a Meta terminar o processamento naquela mesma requisição.

### 5.3 Operação e exceções

- **Fila:** próxima execução, canal, formato, conta, responsável e estado.
- **Detalhe:** prévia enviada, legenda, erros sanitizados, tentativas, IDs externos, data de expiração do Story e link quando fornecido.
- **Falhou:** botão `Corrigir e reenviar` cria uma nova tentativa associada à mesma intenção, nunca executa uma postagem duplicada às cegas.
- **Conta desconectada:** suspender tarefas futuras e orientar a reconexão; não descartar o agendamento.
- **Story vencido:** mostrar `Expirado no Instagram`, preservando o registro interno.

## 6. Arquitetura proposta

```text
Painel administrativo
  -> API Bom Pra Você
      -> banco: panfletos, conexões e intenções de publicação
      -> armazenamento/CDN: original e derivadas públicas HTTPS
      -> fila durável de publicação
          -> worker Instagram
              -> Meta: criar contêiner
              -> Meta: consultar processamento
              -> Meta: publicar
          -> auditoria e notificações do painel
```

### 6.1 Entidades mínimas

- `social_accounts`: organização/loja, provedor, ID externo, usuário, tipo de conta, estado, escopos e datas de validação. Tokens criptografados ficam separados dos campos de exibição.
- `social_publications`: referência ao panfleto e à sua revisão, destino, formato, legenda, mídia, agendamento, estado, chave de idempotência e IDs externos.
- `social_publication_attempts`: tentativa, requisição mascarada, resposta normalizada, erro, horário e correlação.
- `social_media_assets`: mídia original e derivadas, hash, URL pública de curta governança, largura/altura, formato, tamanho e validade.
- `audit_events`: autor e ação humana relevante.

### 6.2 Máquina de estados

```text
RASCUNHO -> AGENDADA -> ENVIANDO -> PROCESSANDO -> PUBLICADA
                 |            |             |
                 v            v             v
             CANCELADA     FALHOU       CONFIRMACAO_PENDENTE

STORY_PUBLICADA -> EXPIRADA (evento interno calculado após 24h)
```

`FALHOU` deve separar `transitória`, `credencial`, `permissão`, `mídia inválida`, `cota` e `regra editorial`, pois as ações corretivas são diferentes.

## 7. Regras de mídia e conteúdo

- Validar antes de enfileirar: tipo, dimensões, peso, URL pública e prazo de disponibilidade da mídia.
- Guardar hash do binário para detectar a reutilização ou mudança indevida do arquivo.
- Feed pode usar a arte do panfleto; Story recebe uma composição própria 9:16, com área segura para textos importantes.
- A geração de derivada deve manter preços, validade e condições legíveis. Se não houver versão adequada, bloquear apenas o Story e permitir a publicação no site/Feed conforme escolha do usuário.
- Nunca inserir, por conta própria, informações promocionais que não estavam aprovadas no panfleto. O modelo de legenda deve ser uma sugestão editável e auditável.
- Disponibilizar texto alternativo quando suportado pelo formato publicado.

## 8. Segurança, privacidade e confiabilidade

- OAuth apenas no servidor; tokens nunca chegam ao navegador nem entram em logs.
- Criptografar tokens em repouso, minimizar escopos e registrar somente metadados necessários.
- Usar URLs de mídia de origem controlada e limitar sua validade após conclusão da publicação.
- Validar o redirecionamento OAuth contra CSRF (`state`), restringir retornos permitidos e proteger a tela por perfil administrativo.
- Implementar rate limit próprio e consulta da cota da Meta antes de executar a fila.
- Tratar a publicação como operação ao menos uma vez e torná-la efetivamente idempotente no domínio. Não retentar automaticamente quando não houver certeza se a Meta publicou.
- Monitorar falhas de token, permissão, cota e mídia; alertar administradores antes de vencimentos de conexão quando a plataforma permitir identificá-los.

## 9. Fases de implementação e critérios de aceite

### Fase 0 — Descoberta técnica e aprovação Meta

- Confirmar stack atual, hospedagem de imagens, modelo de organização/loja e worker/fila já existente.
- Criar aplicativo Meta e testar somente com conta de desenvolvimento autorizada.
- Confirmar qual fluxo de login será usado e preparar material para App Review se o produto atender contas além das controladas pela equipe.

**Aceite:** conta Business de teste conectada; publicação de imagem de teste comprovada no Feed e Story, sem segredos expostos.

### Fase 1 — Conexão e publicação de Feed

- Persistência segura de conexão, publicação assíncrona, estados, logs e reenvio controlado.
- Acionar a tarefa ao publicar um panfleto no site.

**Aceite:** um mesmo panfleto pode ser publicado no site e uma única vez no Feed; falha simulada é visível, explicada e pode ser recuperada sem duplicar o post.

### Fase 2 — Story e arte vertical

- Arte específica de Story, validações, agendamento e expiração no painel.

**Aceite:** panfleto com versão 9:16 aprovada aparece no Story da conta Business; após 24h o painel marca o item como expirado sem apagar a auditoria.

### Fase 3 — Operação e governança

- Calendário, permissões internas, regras de aprovação, métricas operacionais e alertas.

**Aceite:** administrador consegue identificar, por data e panfleto, o que foi publicado, por qual conta, sob qual aprovação e com qual resultado.

## 10. Testes necessários

- Unitários: montagem de legenda, chave de idempotência, transições de estado, elegibilidade de Story e classificação de falhas.
- Integração simulada: criação/processamento/publicação, timeouts, retorno duplicado, token inválido e mídia inacessível.
- Integração real em conta de teste: Feed, Story, reautorização e consulta de cota.
- E2E do painel: conectar, publicar no site com Feed/Story, agendar, cancelar antes do envio, corrigir uma falha e auditar o resultado.
- Segurança: nenhum token em HTML, logs, telemetria ou exportações administrativas.

## 11. Riscos, premissas e decisões pendentes

| Item | Risco/decisão | Encaminhamento proposto |
| --- | --- | --- |
| Conta-alvo | Story exige conta Comercial. | Confirmar se o Instagram da marca já é Business; caso contrário, converter antes da fase 2. |
| Aprovação Meta | Produção para contas de terceiros pode exigir App Review/controles adicionais. | Começar em desenvolvimento com conta da própria operação e não prometer disponibilidade pública até a aprovação. |
| Arte | Um encarte horizontal pode ficar ilegível no Story. | Tornar a criação/revisão da peça 9:16 obrigatória para Story. |
| CTA de Story | A API não deve ser tratada como suporte garantido a sticker de link ou itens interativos. | Direcionar a chamada para bio/URL curta visível até haver suporte oficial comprovado. |
| Custo | A API não cobra por post; infraestrutura, operação e eventual criação de mídia continuam sendo custos próprios. | Medir volume e definir retenção de arquivos/logs antes de estimar infraestrutura. |
| Horário | O Instagram não faz o agendamento pelo painel do Bom Pra Você. | Worker próprio com relógio, fila durável e tolerância a indisponibilidade. |

## 12. Perguntas para fechar o escopo antes de programar

1. O Bom Pra Você terá uma única conta da marca ou cada loja/cliente poderá conectar sua própria conta?
2. O Instagram de destino já é uma conta Comercial? Está sob administração de quem terá acesso ao Meta Business?
3. Todo panfleto deve ir para Feed e Story, ou a publicação automática começa apenas no Feed?
4. Quem aprova uma postagem: o mesmo usuário que publica o panfleto ou alguém de marketing?
5. O sistema já gera uma arte vertical 9:16, ou devemos planejar um editor/modelo de Story?
6. O site já possui fila/worker e armazenamento público de imagens, ou a solução deve incluir esses componentes?

## 13. Fontes de pesquisa

- [Meta — Instagram API Documentation no Postman](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api?entity=request-23987686-d785a76f-5a0d-4766-ba59-8b587770422c): tipos de conta, limitações de Stories e permissões do fluxo com Facebook Login.
- [Meta — Instagram API Documentation no Postman](https://www.postman.com/meta/workspace/instagram/documentation/23987686-9386f468-7714-490f-9bfc-9442db5c8f00): fluxo Instagram Login e nomes atuais de permissões.
- [Espelho técnico do guia Meta de Content Publishing](https://github.com/thedivergentai/Divergent-Skills/blob/master/skills/meta-socials/references/full-docs/instagram-platform/content-publishing.md): fluxo de contêiner, necessidade de mídia pública e autorização de publicação.

As fontes externas resumem documentação sujeita a mudança. Antes da implementação, a equipe deve confirmar versão de API, limites, formatos e permissões no painel Meta do aplicativo criado.
