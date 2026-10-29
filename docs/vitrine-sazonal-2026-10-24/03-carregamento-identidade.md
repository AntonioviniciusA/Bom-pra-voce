# Carregamento seguro e identidade das ofertas

Planejamento. A captura do site mostra erro de consulta, mas não identifica a causa. Não atribuir a falha à conexão do cliente, ao banco ou ao tema sem diagnóstico.

## Proteções existentes que devem ser preservadas

Em `services/promotions.js`: metadados de versão, cache condicionado a versão consultada, horário do servidor, validação do payload, rejeição de IDs repetidos, filtro de vigência e nova tentativa se a versão mudar durante a consulta.

Em `hooks/usePromotions.js`: AbortController, geração de consulta para ignorar respostas antigas, timer de expiração, consulta periódica e revalidação ao voltar à aba.

Isso é evidência de código, não teste de operação. A evolução para produtos deve manter esses mecanismos e ampliar a unidade de consistência.

## Riscos observados na leitura, ainda não reproduzidos

1. A seleção do showcase usa índice; uma reordenação pode trocar a campanha exibida sem intenção do visitante. Planejar seleção por `campaign_id` estável.
2. No refresh, o hook conserva o estado anterior quando está `ready`. Quando o refresh é disparado por término da validade, o conteúdo antigo pode continuar visível até a requisição terminar. Planejar retirada local imediata no limite conhecido, independentemente da resposta.
3. O estado público do hook preserva campanhas, mas não expõe a versão como parte do estado da tela. A proposta precisa tornar versão/instante/validade parte explícita do snapshot exibido.
4. O schema atual exige arquivo de panfleto. Adicionar produto sem mudar contrato e estratégia de compatibilidade pode gerar “sem ofertas” falso ou erro de validação. Migrar de forma aditiva e versionada, nunca interpretar formatos diferentes por tentativa.

## Unidade indivisível de exibição

Cada item publicado contém IDs estáveis de campanha, versão, item, produto/revisão e imagem/revisão, junto com descrição, preço, unidade, categoria e período efetivo. A resposta deve representar um snapshot coerente. Não buscar preço e foto separadamente por nome nem combinar revisões durante o carregamento.

Chave de card: identidade estável do item da campanha. Chave do recurso de imagem: ID/revisão/hash da imagem. Código de barras ajuda o operador a localizar o produto; não substitui a chave relacional e não autoriza associação por semelhança.

Caminho de imagem imutável e ligado à revisão aprovada. Não sobrescrever `produto.jpg` mantendo a mesma URL. O tema não escolhe quais ofertas existem; campanha/versão/intervalo determinam o conteúdo, e o tema apenas apresenta.

## Estados da interface

| Estado | Comportamento |
|---|---|
| Carregamento inicial | Skeleton estável sem preço fictício; nunca “sem ofertas” antes da resposta |
| Pronto com resultados | Snapshot validado, identidade e período confirmados |
| Pronto sem resultados | “Sem ofertas vigentes” somente após consulta válida; filtros vazios usam mensagem distinta |
| Atualizando | Pode manter snapshot ainda válido, com indicação discreta; nunca ultrapassar seu limite conhecido |
| Erro inicial | Mensagem de falha e Tentar novamente; não interpretar como catálogo vazio |
| Validade não confirmável | Retirar preços/ofertas vencidos ou sem validade segura; não persistir indefinidamente “última oferta” |
| Falha de foto | Placeholder neutro reservado para aquele ID, sem usar foto de outro produto; informar indisponibilidade e registrar pendência |
| Sem configuração | Estado próprio; não acusar conexão do visitante sem evidência |

Após erro de revalidação, a política conservadora proposta é esconder as ofertas cuja vigência não pode ser confirmada e permitir nova tentativa. Se futuramente houver modo offline, precisa de desenho específico; não prometer disponibilidade offline neste plano.

## Datas, timers e navegação

Servidor informa `server_time`, versão e próximo limite relevante. Calcular uma referência conservadora com relógio monotônico; não confiar apenas no relógio civil do computador. Períodos no domínio: `[início, fim)`. Retirar item localmente ao chegar ao fim conhecido, mesmo com rede lenta.

Ao voltar de suspensão/aba oculta, revalidar antes de mostrar itens potencialmente vencidos. Tratar timers longos, diferença de relógio e múltiplos eventos de foco sem disparos desordenados. Resposta antiga não substitui consulta mais recente, mesmo se abortar não interromper o processamento remoto.

Ao mudar categoria/campanha: limpar seleção inválida, cancelar consulta anterior, usar geração/ID da solicitação e aplicar resposta somente se ainda corresponder à seleção atual. Categoria sem resultados não muda automaticamente para outra sem informar. URL/deep link de oferta encerrada mostra encerramento, nunca outro produto no mesmo lugar.

## Estabilidade visual

Reservar largura/altura/proporção de fotos e skeletons. Imagens assíncronas não podem deslocar preço ou o alvo de um clique. Skeleton não deve parecer uma promoção válida. Decoração e fonte não podem alterar a identidade/ordem dos cards. Na troca de imagem, limpar o recurso anterior antes de carregar o novo se o produto mudou.

Separar status de conteúdo, de foto e de tema. Uma decoração que falhou pode voltar ao tema padrão mantendo o mesmo snapshot, mas uma oferta inválida não pode ser “corrigida” por fallback visual. Não adicionar outro banner para esconder problema de consulta.

## Publicação e cache

Publicação futura: preparar todos os derivados → validar dados e arquivos → aprovar snapshot → ativar versão atomicamente. Cache por loja/canal/versão, com invalidação em mudança de foto, preço, período, categoria ou retirada. Não publicar metadados apontando para imagens ainda indisponíveis.

Leitura deve tratar conflito de versão com tentativa limitada e estado explícito. Falha global de integridade não deve virar catálogo parcial silencioso. Se um item isolado inválido for suprimido por política futura, registrar o incidente e informar no painel; não inventar valores faltantes.

Social: chave de tarefa inclui versão da campanha, lista/revisões dos itens, tema/versão, formato, conta e horário. Validar novamente antes de enviar. Retentativa não cria post duplicado; status “publicado” só após confirmação da plataforma. Mudança no site não altera arte social já publicada.

