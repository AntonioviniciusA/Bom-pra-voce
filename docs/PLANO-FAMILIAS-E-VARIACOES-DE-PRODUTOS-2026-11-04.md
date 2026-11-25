# Plano de famílias e variações de produtos no painel BPV

**Data:** 04/11/2026  
**Status:** planejamento atualizado com decisões do usuário; nenhuma funcionalidade foi alterada por este documento  
**Origem:** análise da especificação `BPV_painel_familias_e_variacoes_de_produtos.md` contra o código local atual

## Resultado recomendado

Adotar **um produto cadastrado por SKU/apresentação comercial** e usar a família apenas como agrupador. Cada fragrância, sabor, tamanho ou embalagem que possua identidade comercial própria deve conservar `product_id`, código interno, GTIN, foto e dados de oferta próprios.

O modelo atual de “várias fragrâncias dentro de um produto” deve ser migrado e retirado. Ele não pode coexistir indefinidamente com famílias, pois criaria duas maneiras concorrentes de representar a mesma relação:

1. fragrâncias embutidas em `product.fragrances`;
2. produtos individuais ligados por `family_id`.

A família não será item de campanha, não receberá preço e não substituirá o SKU. Uma campanha continuará armazenando uma lista congelada de SKUs participantes, como já ocorre conceitualmente nos snapshots publicados.

## Decisões confirmadas em 04/11/2026

- A navegação e a pesquisa devem permitir agrupamento por **marca** e por **família**, chegando aos SKUs e suas fragrâncias.
- Ao pesquisar uma fragrância, o SKU correspondente aparece primeiro e as demais fragrâncias da mesma família aparecem no mesmo resultado, claramente identificadas como relacionadas.
- Produtos da mesma família podem ter **preços e vencimentos diferentes**. Nenhum valor ou data será herdado automaticamente da família ou de outro SKU.
- `Refil` e `frasco` são tipos de embalagem diferentes, mas podem pertencer à **mesma família e marca**.
- Cada produto/SKU terá sua própria imagem.
- A família também terá imagem própria, separada das imagens dos produtos. A finalidade exata dessa imagem no fluxo público ainda depende da conclusão da frase do usuário interrompida em “assim quando forem”.

Hierarquia definida para apresentação e busca:

```text
Marca
└─ Família
   ├─ SKU · fragrância · tipo de embalagem · conteúdo · foto própria
   ├─ SKU · fragrância · tipo de embalagem · conteúdo · foto própria
   └─ SKU · fragrância · tipo de embalagem · conteúdo · foto própria
```

## O que existe de fato hoje

### Painel ativo

- `painel-local/src/OffersWorkspace.jsx` carrega somente `OfferCampaignPanel.jsx`.
- O painel ativo já reúne Campanhas, Calendário e Produtos.
- O cadastro atual permite até oito entradas em `fragrances`, cada uma com nome e GTIN, dentro de um único produto.
- O cadastro mantém uma foto compartilhada, um código interno e uma categoria para esse conjunto.
- Ao salvar, o primeiro GTIN também é copiado para `barcode` e os nomes são concatenados em `variant`.
- O seletor da campanha adiciona `productId`, não uma fragrância específica.
- Preço, unidade e vencimento são associados ao item do produto na campanha. Portanto, todas as fragrâncias embutidas herdam a mesma condição comercial.

### Banco e publicação

- `bpv.products` armazena `code` e um `snapshot` JSON, com revisões históricas; não existe hoje uma tabela de famílias.
- A validação e a função de gravação procuram GTINs dentro de `snapshot.fragrances`.
- `bpv.product_campaigns` mantém snapshots publicados e revisões. O snapshot da campanha já congela produtos, preços e datas, o que é compatível com a regra de que uma nova variação não entra automaticamente em campanha antiga.
- A API pública entrega campanhas ativas; o site renderiza o produto publicado a partir do snapshot da campanha.

### Implementações antigas ainda presentes

- `ProductCampaigns.jsx` é uma implementação anterior do fluxo e ainda é carregada pela prancha `seasonal-visual.jsx`, mas não pelo painel operacional atual.
- `Offers.jsx` mantém o editor antigo de panfletos/PDF, porém não é importado pelo painel ativo.
- `SidebarLayout.jsx`, `InstagramPublications.jsx` e `Resumes.jsx` continuam no repositório, mas não estão conectados ao `AdminPanel.jsx` atual.
- Esses arquivos não devem receber uma segunda implementação de famílias. Primeiro é necessário decidir se a demonstração antiga continua útil; depois, aposentar o código sem uso operacional.

## Conflitos entre a especificação recebida e o sistema atual

| Tema | Situação atual | Direção necessária |
|---|---|---|
| Identidade | Um produto pode conter vários GTINs/fragrâncias | Um produto representa um SKU; em regra, um GTIN verificável |
| Agrupamento | `fragrances[]` agrupa versões dentro do produto | Família relaciona produtos independentes |
| Foto | Uma foto compartilhada pelo cadastro | Foto própria por SKU e imagem própria da família, com papéis distintos |
| Oferta | Preço aplicado ao produto agregado | Preço por SKU; edição em lote só replica dados após seleção explícita |
| Busca | Busca percorre produto e `fragrances[]` | Busca SKU, GTIN, atributos e família, priorizando a correspondência exata |
| Publicação | Snapshot contém `fragrances[]` | Snapshot contém o SKU selecionado; família serve à navegação, não à elegibilidade |
| Site | Um card descreve várias fragrâncias embutidas | Card conjunto somente como apresentação de SKUs explicitamente participantes |
| Persistência | Produtos são snapshots JSON revisionados | Preservar revisões e acrescentar família sem reescrever o histórico publicado |

## O que retirar ou consolidar para não duplicar funções

### Retirar após a migração dos dados

1. **Editor `fragrances[]` do formulário de produto.** Substituir por atributos do SKU e vínculo opcional com uma família.
2. **Regra “o preço vale para todas as fragrâncias deste cadastro”.** Preço passa a pertencer somente ao SKU no item da campanha.
3. **Limite de oito fragrâncias por produto.** A quantidade de membros pertence à família e não deve ser limitada silenciosamente a oito.
4. **Cópia do primeiro GTIN para `barcode`.** Manter uma representação canônica de identidade; durante a transição, aceitar o legado apenas para leitura/migração.
5. **Concatenação de fragrâncias em `variant`.** `variant` deixa de ser resumo derivado de uma lista e passa a ser atributo do SKU, ou é substituído por atributos estruturados.
6. **Validações de duplicidade baseadas em `snapshot.fragrances`.** Trocar por unicidade do GTIN canônico do SKU e por validações de vínculo familiar.
7. **Renderização pública que anuncia várias fragrâncias a partir de um único produto.** O site deve receber os SKUs participantes da campanha.

### Consolidar, sem criar uma segunda função

| Função | Dono único recomendado | Não criar em paralelo |
|---|---|---|
| Cadastro e edição de produto | Catálogo em `OfferCampaignPanel.jsx` | Outro CRUD dentro do montador |
| Associação de família | Tela/detalhe do catálogo | Campo livre duplicado na campanha |
| Seleção em lote | Seletor de produtos da campanha | “Item família” com preço próprio |
| Aplicação do mesmo preço | Ação sobre SKUs marcados | Preço armazenado na família |
| Revisão de imagem | Cadastro/revisão do SKU | Segunda biblioteca de fotos por campanha |
| Busca | Um serviço de busca reutilizado por catálogo e seletor | Filtros com regras diferentes em cada tela |
| Histórico de publicação | Snapshot revisionado da campanha | Relação dinâmica que recalcula membros atuais da família |

### Aposentar código antigo, mas somente após verificar dependências

1. Migrar ou refazer a prancha `seasonal-visual.jsx` para usar o painel ativo; então retirar `ProductCampaigns.jsx` e seus estilos/testes exclusivos.
2. Confirmar que o editor antigo de panfletos não possui rota, operação ou dependência externa ainda necessária; então retirar `Offers.jsx` e contratos exclusivos desse fluxo.
3. Confirmar o destino operacional de Instagram e Currículos antes de excluir componentes ou serviços. Estar fora da navegação atual não prova que os dados e endpoints podem ser apagados.
4. Retirar `SidebarLayout.jsx` apenas se nenhuma entrada futura ou prancha ainda o usar.

Não apagar tabelas, Storage, revisões, campanhas publicadas ou serviços remotos como consequência automática da limpeza do frontend.

## Modelo de dados adaptado ao BPV atual

O documento recebido propõe normalização completa de produtos e atributos. O sistema atual, porém, grava produtos como snapshots JSON revisionados. Para reduzir risco, recomenda-se uma evolução híbrida em vez de reescrever todo o catálogo de uma vez.

### Novas entidades

```text
bpv.product_families
  id uuid primary key
  revision bigint
  name text
  normalized_name text
  brand text
  line text
  presentation text
  default_content text nullable
  image_url text
  image_source text nullable
  image_approved boolean
  status active | archived
  notes text nullable
  updated_at, updated_by

bpv.product_family_revisions
  family_id, revision, snapshot, actor, created_at

bpv.product_family_members
  family_id
  product_id unique
  sort_order
  created_at, created_by
```

Não incluir `tenant_id` ou `store_id` até confirmar que o BPV realmente possui esse conceito no catálogo atual. Criar isolamento fictício agora adicionaria complexidade sem proteção real.

### Evolução do snapshot de produto

Adicionar uma versão explícita do modelo, por exemplo `schemaVersion: 2`, e adotar:

```json
{
  "id": "uuid-do-sku",
  "code": "codigo-interno",
  "barcode": "gtin-canonico-ou-vazio",
  "identifierType": "gtin",
  "name": "nome comercial completo",
  "brand": "marca",
  "content": "750 ml",
  "category": "limpeza",
  "familyId": "uuid-opcional",
  "variantAttributes": {
    "fragrance": "Brisa de Verão",
    "packageType": "refil"
  },
  "image": "url-da-foto-do-sku"
}
```

Evitar manter `family_id` simultaneamente no snapshot e em uma tabela de membros como duas fontes graváveis. A recomendação é:

- `product_family_members` como fonte de verdade do vínculo;
- `familyId` retornado pela API como campo calculado para facilitar a interface;
- snapshots de campanha continuam congelando somente os dados editoriais necessários do SKU publicado.

### Restrições necessárias

- Um produto pertence a no máximo uma família ativa como vínculo primário.
- GTIN normalizado não pode identificar dois produtos distintos.
- Código interno continua único sem diferenciar maiúsculas e minúsculas.
- Excluir/arquivar família nunca exclui produtos ou snapshots de campanha.
- Remover um membro não altera campanhas já publicadas.
- Ações de vínculo, desvínculo e aplicação comercial em lote devem registrar ator e horário.

## Fluxos planejados

### Catálogo

1. Buscar por nome do SKU, GTIN, código interno, marca, conteúdo, atributo de variação ou família.
2. Mostrar primeiro a correspondência exata; ao pesquisar uma fragrância, manter no mesmo resultado a seção “Outras fragrâncias desta família”.
3. Permitir alternar entre lista simples, agrupamento por marca e agrupamento por família. No modo hierárquico, usar `Marca → Família → SKUs`.
4. Abrir uma família para editar seus metadados, ordenar membros, vincular produto existente ou criar novo SKU a partir de dados compartilháveis.
5. Ao duplicar como nova variação, copiar somente marca, linha, categoria, apresentação e conteúdo quando aplicável. Nunca copiar GTIN, código interno, foto, aprovação da foto, preço, estoque, IDs externos ou condições comerciais.
6. Tratar fragrância e tipo de embalagem como atributos independentes. Assim, `Brisa de Verão · refil` e `Brisa de Verão · frasco` podem ser SKUs distintos dentro da mesma família.

#### Regras da pesquisa por fragrância

Para a pesquisa não esconder resultados nem duplicar produtos:

1. Localizar todos os SKUs cuja fragrância corresponda ao texto pesquisado.
2. Ordenar primeiro correspondência exata, depois início do nome e por último correspondência parcial.
3. Agrupar os resultados por marca e família.
4. Dentro de cada família encontrada, destacar os SKUs correspondentes e mostrar os demais membros na subseção “Outras fragrâncias desta família”.
5. Se a mesma fragrância existir em marcas ou famílias diferentes, mostrar cada grupo separadamente; não misturar famílias somente porque a fragrância possui o mesmo nome.
6. Exibir cada SKU uma única vez por resultado, mesmo quando nome, marca, família e fragrância correspondam simultaneamente à busca.
7. Permitir recolher as fragrâncias relacionadas, mas manter visível a quantidade total de membros da família.

Exemplo esperado:

```text
Pesquisa: Brisa de Verão

Marca: Downy
└─ Família: Downy Concentrado 750 ml · 4 produtos
   ├─ Correspondência: Brisa de Verão · refil · R$ A · validade A
   ├─ Correspondência: Brisa de Verão · frasco · R$ B · validade B
   └─ Outras fragrâncias: Lírios do Campo, Místico
```

Preço e validade aparecem apenas quando o contexto for uma campanha. No catálogo permanente, a pesquisa mostra identidade, tipo de embalagem, conteúdo, foto e situação do cadastro, evitando transformar preço promocional em atributo permanente do produto.

### Campanha

1. O seletor usa o mesmo serviço de busca do catálogo.
2. A família aparece como agrupamento visual, com caixas de seleção por SKU.
3. “Selecionar todas” marca apenas os membros exibidos e elegíveis, apresentando a quantidade antes da confirmação.
4. Cada seleção cria um item de campanha por `productId`.
5. “Aplicar mesmo preço” é uma edição em lote sobre itens selecionados; não cria um preço da família.
6. Unidade, preço, vencimento e condição pertencem ao item de cada SKU. Mesmo dentro da mesma família, valores e datas diferentes permanecem separados.
7. Produto já adicionado permanece visível como “Já adicionado” e não pode ser duplicado.

### Site público

Na primeira entrega, manter cards individuais por SKU. Esse é o comportamento mais seguro e reduz o risco de anunciar variações não participantes.

Um card conjunto com seletor de fragrância deve ser uma fase posterior e somente pode agrupar SKUs que:

- estejam explicitamente presentes na mesma campanha publicada;
- pertençam à mesma família no snapshot editorial usado para publicação;
- exibam foto, nome, conteúdo, preço e disponibilidade do SKU escolhido;
- não escondam diferenças de preço, unidade, vencimento ou condição.

Não implementar “a partir de” nem inserir automaticamente membros atuais da família.

## Migração segura dos cadastros atuais

### Inventário obrigatório

Antes de gerar migrations, produzir relatório para cada produto atual:

- quantidade de entradas em `fragrances`;
- GTINs válidos, vazios, repetidos ou conflitantes;
- foto compartilhada e respectiva aprovação/origem;
- campanhas publicadas ou rascunhos que referenciam o produto;
- possibilidade de separar o nome comum do atributo de variação.

### Classificação

| Caso legado | Tratamento |
|---|---|
| Produto sem `fragrances[]` ou com uma única entrada | Converter para um SKU canônico após validação |
| Várias fragrâncias com GTIN próprio | Criar um SKU por entrada e uma família comum |
| Várias fragrâncias sem GTIN individual | Bloquear divisão automática e pedir identificação manual |
| Foto compartilhada mostra somente uma variação | Associar apenas ao SKU correspondente; demais ficam pendentes |
| Foto mostra várias variações | Avaliar como imagem própria da família; ela nunca substitui a foto individual obrigatória de cada SKU |
| Campanha histórica publicada | Não reescrever; preservar snapshot original |
| Rascunho atual | Migrar os itens para SKUs explícitos e exigir revisão antes de publicar |

### Estratégia de transição

1. Introduzir leitura compatível com `schemaVersion` antigo e novo.
2. Criar famílias e membros sem mudar ainda a publicação.
3. Executar migração idempotente em modo de prévia e exportar relatório de conflitos.
4. Confirmar manualmente casos ambíguos.
5. Converter cadastros e rascunhos; preservar campanhas publicadas.
6. Alterar formulário, busca, seletor e validação do servidor para o modelo novo.
7. Impedir novas gravações de `fragrances[]`, mantendo leitura legada temporária.
8. Após cobertura e auditoria, retirar a leitura legada do painel operacional.

Não fazer uma migração que replique a mesma foto compartilhada como se ela tivesse sido aprovada para todos os SKUs.

## Plano de implementação por etapas

### Etapa 0 — decisões e inventário

- Responder às decisões em aberto no fim deste documento.
- Inventariar produtos, GTINs, fotos, campanhas e conflitos.
- Definir amostra real de famílias para teste, incluindo uma com preços diferentes.
- Definir como representar produtos sem GTIN.

**Saída:** relatório de migração e decisões aprovadas; nenhuma alteração de produção.

### Etapa 1 — domínio e banco

- Criar famílias, revisões, membros, restrições e permissões.
- Criar RPCs/serviços de listar, salvar, vincular, desvincular e arquivar.
- Atualizar validação do produto para um SKU por registro.
- Preservar controle de revisão e conflito já usado pelo catálogo.

**Saída:** backend testado, ainda protegido por ativação controlada no painel.

### Etapa 2 — migração assistida

- Implementar prévia idempotente.
- Separar produtos legados não ambíguos.
- Gerar fila de revisão para GTIN, nome e foto incertos.
- Migrar rascunhos somente após mapear o SKU correto.

**Saída:** catálogo convertido e relatório de tudo que não foi convertido.

### Etapa 3 — catálogo único

- Substituir editor de fragrâncias pelo editor de atributos do SKU.
- Criar gestão de família dentro da área Produtos.
- Unificar busca e agrupamento.
- Implementar “Criar variação” com lista explícita dos campos copiados e limpos.

**Saída:** uma única forma de cadastrar identidade e agrupamento.

### Etapa 4 — campanhas

- Adaptar seletor para expansão de família e multisseleção de SKUs.
- Adicionar aplicação em lote com prévia e confirmação.
- Manter um item por SKU e proteção contra repetição.
- Atualizar pendências, revisão de foto e publicação.

**Saída:** publicação continua por SKU, com edição em lote segura.

### Etapa 5 — site e limpeza

- Primeiro validar cards individuais por SKU.
- Só depois avaliar card conjunto com seletor, mediante referência visual aprovada.
- Atualizar helpers públicos e remover dependência operacional de `fragrances[]`.
- Migrar a prancha antiga ou substituí-la pelo painel ativo.
- Retirar componentes antigos confirmadamente sem uso.

**Saída:** frontend público sem anúncio implícito de variações e repositório sem implementações concorrentes.

## Testes e critérios de aceite

- Três fragrâncias com GTINs diferentes resultam em três `product_id` e uma família.
- O mesmo GTIN não pode ser salvo em dois produtos, inclusive em requisições simultâneas.
- Buscar GTIN abre o SKU exato; buscar família mostra todos os membros.
- Buscar uma fragrância mostra primeiro o SKU correspondente e, no mesmo resultado, as demais fragrâncias da família.
- A visualização pode ser agrupada por marca e por família sem duplicar o mesmo SKU nos resultados.
- Refil e frasco podem permanecer na mesma família, identificados como tipos de embalagem distintos.
- Criar variação não copia GTIN, código, foto, aprovação nem condição comercial.
- Cada SKU mantém sua própria foto e histórico de revisão; a família mantém imagem separada.
- Selecionar duas de três variações cria exatamente dois itens na campanha.
- Nova variação criada depois não entra em campanha existente.
- Aplicar preço em lote modifica somente os IDs confirmados.
- Preços ou unidades diferentes aparecem separadamente no painel, prévia e site.
- Desvincular ou arquivar família não exclui produto nem altera publicação histórica.
- Campanhas antigas continuam legíveis durante a transição.
- Falha parcial de migração pode ser repetida sem criar famílias ou SKUs duplicados.
- Busca com acentos, GTIN normalizado e catálogo grande possui teste de desempenho.
- Permissões, histórico, conflitos de revisão e auditoria são testados no servidor.
- Painel, prévia e site são verificados em desktop e celular.

## Decisões que ainda precisam de resposta antes de implementar

1. **Uso da imagem da família:** completar a intenção iniciada em “assim quando forem...”. Ela aparecerá no resultado agrupado, no card conjunto do site, na campanha/panfleto quando vários SKUs forem selecionados, ou em todos esses locais?
2. **Produto sem GTIN:** um PLU diferente deve sempre ser outro SKU, ou há casos em que várias apresentações sem GTIN usam o mesmo código interno?
3. **Card conjunto:** o site precisa dessa apresentação na primeira versão ou começará com cards individuais?
4. **Atributos:** além de fragrância e tipo de embalagem, quais serão obrigatórios no primeiro ciclo: sabor, cor, tamanho e volume, ou um subconjunto por categoria?
5. **Código interno:** cada SKU já possui código próprio no processo real da loja? Se não, é necessário definir geração e responsabilidade antes da migração.
6. **Integração com PDV:** existe hoje uma origem real a consultar, ou isso permanece fora do escopo? Não implementar sincronização com base apenas na hipótese da especificação.

## Fora do primeiro ciclo

- Integração com PDV sem contrato e fonte de verdade confirmados.
- Sugestão automática de família por inteligência probabilística.
- Importação CSV de famílias antes de estabilizar o modelo manual.
- Card público conjunto, preço “a partir de” ou escolha dinâmica de fragrância.
- Estoque por loja, controle de lotes ou múltiplas famílias por produto.
- Exclusão física de dados antigos ou históricos.

## Evidências e limites desta análise

Foram inspecionados o painel ativo, o formulário de produtos, o seletor de campanha, os helpers de identidade, a validação do servidor, as migrations de catálogo/campanha e a entrega pública de ofertas. A análise é local: não comprova o esquema remoto aplicado, o conteúdo real do banco nem a versão instalada do Electron.

O repositório já continha alteração não relacionada em `docs/MODO-ASSISTIDO-OPERACAO.md`; ela foi preservada. Este documento não executa migrations, não altera código, não remove componentes e não publica nada.
