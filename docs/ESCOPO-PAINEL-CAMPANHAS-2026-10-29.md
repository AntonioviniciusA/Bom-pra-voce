# Reformulação completa do painel: nova vitrine

Atualizado em 29/10/2026. Escopo definido pelo usuário. Esta etapa altera somente documentação, sem implementar ou remover telas do aplicativo.

Este documento prevalece sobre o planejamento anterior que mantinha panfletos, currículos e publicações no painel. A retirada abaixo é do escopo futuro; a remoção funcional depende da etapa de implementação.

## Decisões confirmadas

- O painel inteiro será dedicado à nova vitrine de produtos.
- Layouts, cores, fontes, fundos, decorações e composição de cada tema ficam prontos no site, para computador e celular. No painel, apenas escolher o tema.
- Selecionar produtos do catálogo existente. Se não houver cadastro, cadastrar durante a inclusão e retornar à mesma campanha, preservando preenchimento e seleção.
- Editar preço e **vencimento da embalagem/lote** de cada item. O usuário confirmou esse significado de validade; não criar validade individual do preço por interpretação deste pedido.
- Cada campanha terá início e fim. No máximo uma campanha ativa no site em qualquer instante, independentemente do tema.
- Ter um calendário com as campanhas marcadas.
- Gerar imagem de qualquer layout ainda sem referência antes de implementar. Revisar as referências existentes contra este escopo.
- Não implementar nesta etapa.

## Fluxo e navegação

Navegação principal: **Campanhas**, **Calendário** e **Produtos**. Conferência e publicação são etapas da campanha.

1. Criar ou abrir campanha, informar nome operacional, escolher tema pronto e definir início/fim.
2. Buscar produtos por nome, código ou GTIN e selecionar os já cadastrados.
3. Se não houver produto, escolher “Cadastrar novo produto”, salvar de verdade e retornar para incluí-lo na campanha de origem. Preservar a seleção anterior e evitar duplicação em novas tentativas.
4. Ajustar preço, unidade de venda e vencimento da embalagem/lote dos itens; reutilizar identidade, variantes/códigos e foto aprovadas do catálogo.
5. Conferir pendências e prévia com o componente real do site, em computador e celular.
6. Confirmar publicação/agendamento e mostrar sucesso somente após confirmação do servidor.
7. Acompanhar datas, situação e conflitos no calendário.

Catálogo permanente, independente das campanhas. Remover um item não exclui seu cadastro. Alterações de preço ou vencimento em uma campanha não mudam outra campanha nem uma publicação anterior. Não transformar esse fluxo em controle completo de estoque por lotes.

Preservar salvamento automático, rascunhos recuperáveis, confirmação real da gravação e proteção ao sair com alterações pendentes, conforme o [plano de fluxo](PAINEL-NOVEMBRO-FLUXO-E-ESTADOS-2026-10-29.md). Salvar não publica. Diferenciar catálogo vazio, busca sem resultado, falha de leitura e campanha sem itens.

## Datas e exclusividade

### Fragrâncias, seleção e imagens — complemento de 29/10/2026

- O cadastro deverá permitir uma imagem geral para o conjunto de fragrâncias e uma imagem individual associada a cada fragrância e respectivo GTIN.
- Ao incluir o produto na campanha, escolher quais fragrâncias participam. Selecionar uma não coloca as demais em promoção nem altera o catálogo para removê-las.
- Para uma única fragrância em promoção, mostrar sua imagem individual, nome e código correspondentes. Não usar automaticamente uma imagem coletiva que sugira promoção das demais. Se faltar imagem individual, sinalizar a pendência antes da publicação.
- Para todas as fragrâncias em promoção pelo mesmo preço, usar a imagem geral aprovada e identificar as participantes. Para um subconjunto de várias fragrâncias, a apresentação ainda precisa de referência visual: não presumir que a foto geral represente corretamente esse subconjunto.
- Preço e vencimento da embalagem/lote devem acompanhar as fragrâncias selecionadas. Se diferirem, separar os itens comerciais; não estender um valor ou vencimento às demais por herança silenciosa.
- Revisar as imagens de cadastro, seleção, itens e prévia para mostrar foto geral, fotos por fragrância e seleção das participantes antes de implementar.

Evidência do código local: `painel-local/src/services/productImages.js` converte PNG/JPG/WebP em WebP, qualidade 0,82, com versões quadradas de 1200 e 480 pixels, sem recortar a embalagem e com limite de 2 MB por versão. `productDrafts.js` chama essa preparação na seleção; `adminApi.js` prepara imagens antes do envio. Os arquivos são enviados ao Storage e os dados publicados referenciam suas URLs. O cadastro atual em `ProductCampaigns.jsx` tem uma foto compartilhada e informa que o preço vale para todas as fragrâncias; fotos individuais e seleção parcial são requisitos futuros, não comportamento já entregue. Esta inspeção não confirma a versão instalada ou remota.

Campos separados: **Início da campanha**, **Fim da campanha** e **Vencimento da embalagem/lote**. O preço acompanha o período da campanha.

Direção proposta para implementação futura:

- Operação em `America/Sao_Paulo`, com fuso visível. Se forem usadas apenas datas, considerar início às 00h do primeiro dia e término exclusivo às 00h do dia seguinte ao último dia. Campanhas consecutivas podem se encostar sem sobreposição.
- Estados: rascunho, agendada, ativa, encerrada e retirada. Ativa exige publicação confirmada e período vigente pelo relógio do servidor.
- Rascunhos podem se sobrepor para planejamento, com aviso. Bloquear publicação/agendamento de períodos sobrepostos, inclusive em solicitações simultâneas de operadores distintos.
- Mostrar campanha e datas em conflito. Não retirar ou substituir outra campanha silenciosamente.
- Permitir várias campanhas futuras em períodos diferentes, inclusive do mesmo tema.
- Sem campanha publicada vigente, encerrar a exibição das ofertas. Não reativar campanha encerrada. A expiração deve funcionar com o painel fechado.
- Vencimento da embalagem/lote informado não pode ser anterior ao último dia da campanha. Não inventar data quando ausente. A obrigatoriedade para todos os tipos de produto ainda precisa de decisão.
- Publicação preserva tema, itens, preços, datas e fotos na mesma revisão. Mudanças posteriores exigem nova publicação.

A exclusividade deverá ser garantida no servidor; validação apenas na tela não atende ao requisito. Esta etapa não altera banco ou contratos.

## Condições padronizadas e informação ao consumidor

Decisão do usuário em 29/10/2026: condições da campanha serão padronizadas e deverão observar a legislação aplicável. Não oferecer um campo livre para inventar ressalvas ou substituir direitos do consumidor. Usar modelo versionado, preenchido com os dados reais da campanha, comum a todos os temas.

Base federal consultada em 29/10/2026: [CDC, especialmente arts. 18, § 6º, 30, 31, 35, 37 e 39](https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm) e [Decreto 5.903/2006, arts. 2º e 3º](https://presidencia.gov.br/ccivil_03/_ato2004-2006/2006/decreto/d5903.htm). A oferta vincula o fornecedor; informação relevante precisa ser clara e publicidade não pode induzir a erro. Um texto padrão sozinho não garante conformidade: depende também da veracidade dos dados, estoque, operação da loja e normas locais aplicáveis.

Requisitos do modelo futuro:

- Exibir período real, estabelecimento/local de validade e produtos/fragrâncias participantes, com conteúdo da embalagem, preço total à vista e unidade de venda legíveis. Não confundir preço por unidade de medida com preço da embalagem.
- Distinguir período da campanha e vencimento da embalagem/lote. Quando a oferta se referir a lote com vencimento específico, mostrá-lo junto ao item, com destaque adequado; não vender produto vencido.
- Restrições reais de pagamento, quantidade ou disponibilidade devem ser informadas antes da compra e próximas à oferta. Não presumir limite por cliente ou condição de pagamento; qualquer exceção precisa de fundamento e revisão antes de integrar o padrão.
- Não incluir automaticamente “enquanto durarem os estoques” como dispensa de cumprir a oferta. Se houver campanha limitada por estoque, definir disponibilidade real e como informar/retirar item esgotado; a frase não afasta os direitos previstos no CDC.
- Não usar ressalvas genéricas como “não nos responsabilizamos por erros”, “preços sujeitos a alteração sem aviso” ou “imagem meramente ilustrativa” para justificar divergência de preço, embalagem ou fragrância.
- Não mostrar desconto percentual ou preço “de/por” sem referência verdadeira e verificável. Não criar desconto por aumentar previamente o preço de referência.
- Preservar condições e dados da revisão publicada no histórico. Trocar o modelo não deve reescrever retroativamente ofertas publicadas.
- Site, prévia e eventuais materiais de compartilhamento devem manter as informações essenciais e as restrições relevantes legíveis; não escondê-las somente em rodapé ou detalhes.

Texto-base proposto para preenchimento automático: **“Ofertas válidas de {início} a {fim}, em {estabelecimento/local confirmado}, para os produtos e fragrâncias identificados nesta campanha. Preços à vista por {unidade de venda indicada em cada item}. Vencimentos específicos de embalagem/lote, quando aplicáveis, estão informados junto ao produto.”** Os marcadores nunca são publicados vazios. A linha de vencimento só deve aparecer quando houver informação correspondente; restrições adicionais só entram se verdadeiras, claras e previamente revisadas.

Antes de implementar/publicar o padrão, confirmar estabelecimento/local e meios de pagamento efetivamente abrangidos e verificar normas estaduais/municipais pertinentes. Não declarar o texto como homologado juridicamente. Nesta etapa, somente requisitos documentados, sem mudança de código.

## Apresentação do calendário

- Visão mensal, navegação entre meses, ação “Hoje” e legenda; lista equivalente para celular e teclado.
- Marcar todo o intervalo, inclusive quando cruza meses, com nome, tema, datas e situação. Não depender apenas da cor.
- Destacar a ativa e diferenciar rascunhos, agendadas, encerradas e retiradas.
- Abrir edição ao selecionar campanha. Uma data pode iniciar rascunho preenchido, sem publicar.
- Sinalizar sobreposição e permitir abrir as campanhas envolvidas. Arrastar para reagendar não faz parte deste escopo.
- Tratar carregamento, vazio e falha separadamente. Estado local não comprova publicação no site.

## O que sai do painel na futura reformulação

| Área ou função atual | Destino |
|---|---|
| Panfletos existentes e editor antigo de ofertas | Retirar da navegação e do fluxo. Sem upload de panfleto/PDF para compor a nova vitrine. |
| Controles de cores, fontes, fundos, ícones, nome do cartão/HUD e composição | Retirar. Aparência pertence aos temas prontos no site. |
| Currículos, consultas e downloads de RH | Retirar deste painel. Destinação operacional do RH fica pendente fora deste escopo. |
| Instagram/Publicações, contas e agendamento social | Retirar deste painel. O calendário solicitado é de campanhas da vitrine. |
| Prévia antiga de panfleto | Substituir por prévia da nova vitrine com o componente do site. |
| Segundo botão geral para persistir um cadastro | Retirar como requisito; cadastro confirma gravação real, edição salva automaticamente. |
| Estrutura exclusiva de novembro | Usar campanhas genéricas por tema e período; preservar campanhas existentes. |

Manter login, MFA, permissões, troca de senha, saída, erros e confirmação de publicação, necessários à operação da vitrine.

Retirar módulos não significa apagar currículos, arquivos, campanhas, histórico, permissões ou serviços remotos. Não alterar candidatura pública, banners, setores ou outras áreas institucionais por consequência desta reforma. Inventariar dependências e preservar dados antes da limpeza futura.

## Imagens obrigatórias antes de implementar

Existem seis estudos em [painel-novembro-2026-10-29](painel-novembro-2026-10-29/) e referências de temas em [vitrine-imagens](vitrine-imagens.md). Existência de imagem não comprova aprovação nem fidelidade do aplicativo.

| Layout | Referência existente | Próxima etapa visual |
|---|---|---|
| Lista de campanhas | `01-campanhas.png` | Revisar temas genéricos, início/fim, exclusividade e navegação. |
| Calendário desktop | Sem imagem específica no conjunto de seis estudos | Gerar mês com intervalos, estados, ativa e conflito. |
| Calendário mobile/lista | Sem imagem específica no conjunto | Gerar visão estreita legível e acesso à campanha. |
| Criação/edição da campanha | Sem estudo dedicado ao fluxo completo | Gerar nome, seleção de tema pronto e início/fim, sem editor visual. |
| Seleção no catálogo | `03-catalogo.png` | Revisar seleção, ausência de resultado e retorno à campanha. |
| Cadastro durante inclusão | `04-cadastro.png` | Revisar contexto, gravação real e retorno sem perda. |
| Itens, preço e vencimento | `02-produtos-da-campanha.png` e `06-produtos-da-campanha-mobile.png` | Revisar vencimento da embalagem/lote separado do período da campanha. |
| Conferência/publicação | `05-conferencia-publicacao.png` | Revisar prévia real, agendamento, conflitos e confirmação remota. |
| Tema do site sem referência adequada | Inventário em `vitrine-imagens.md` | Gerar referência faltante antes de implementar esse layout. |

Produzir uma imagem por página e tamanho necessário, identificar dados ilustrativos e apresentar antes de implementar. Não regenerar todos os temas sem necessidade. Esta entrega somente registra as pendências: nenhuma imagem nova foi gerada e nenhuma tela está liberada para implementação por este documento.

## Pontos para decidir antes de implementar

1. Vencimento da embalagem/lote será obrigatório para todos os produtos ou opcional conforme o tipo? O significado do campo está confirmado.
2. Períodos terão apenas dias ou também horários? A convenção por dias acima é proposta.
3. Se um produto tiver lotes com vencimentos diferentes, permitir mais de um item ou informar um vencimento representativo? Não deduzir controle de lotes sem essa decisão.

## Critérios de aceite futuros

- Navegação dedicada à nova vitrine; acessos antigos não reabrem módulos retirados.
- Escolher tema pronto, selecionar catálogo e cadastrar produto durante inclusão sem perder contexto.
- Editar preço e vencimento sem confundir datas ou afetar outras campanhas.
- Exigir início/fim válidos e bloquear sobreposição no servidor, inclusive com edições simultâneas.
- Garantir no máximo uma ativa nas fronteiras dos períodos e com o painel fechado.
- Calendário e lista mostram datas e estados equivalentes, com teclado e sem dependência exclusiva de cor.
- Cadastro permanece ao reabrir; falhas preservam preenchimento e não mostram sucesso fictício.
- Prévia e site exibem mesma revisão, tema, preços e itens, respeitando expiração.
- Referências visuais apresentadas antes da implementação; verificar computador, celular e estados de falha.
- Preservar dados anteriores e serviços fora do escopo.

## Evidências e limites

Inspeção local: `AdminPanel.jsx` contém ofertas, currículos e Instagram. `OffersWorkspace.jsx` alterna “Campanhas e produtos” e “Panfletos existentes”. O README descreve HUD, temas antigos, panfletos e RH. Isso fundamenta a lista de retirada, sem confirmar a versão instalada ou publicada.

Havia alterações de outros trabalhos no código e na documentação ao iniciar esta tarefa. Foram preservadas. Não houve alteração de código, remoção operacional, consulta remota, migração ou publicação nesta entrega.
