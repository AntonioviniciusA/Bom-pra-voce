# Auditoria de produtos e tributação — Bom Pra Você Supermercado

**Versão:** 1.1  
**Abertura:** 14/11/2026  
**Fonte indicada:** `D:\GitHub\Bom-pra-voce\Mercado\PRODUDOS.xlsx` (cópia recebida; integridade registrada)  
**Status geral:** Etapas 0 e 1 concluídas; Etapa 2 aguardando autorização  
**Modo de trabalho:** uma etapa de cada vez, com resultados documentados e validação antes de prosseguir.

## Objetivos

1. Verificar a integridade e a qualidade do cadastro de produtos.
2. Identificar duplicatas, inconsistências e candidatos à inativação, preservando dados históricos.
3. Avaliar códigos e regras de tributação de produtos e operações, inclusive risco de tributar a maior ou a menor.
4. Confrontar os tributos destacados/documentados com apurações e pagamentos quando esses registros forem disponibilizados.

**Limite importante:** `PRODUDOS.xlsx` é uma planilha, não necessariamente o banco operacional. Ela sozinha não prova que um produto deixou de ser usado, nem que um imposto foi efetivamente pago corretamente. Para isso são necessários vínculos com movimentações, estoque, NF-e/NFC-e, regime tributário, apurações e comprovantes.

## Regras de segurança e rastreabilidade

- O arquivo original é imutável durante a auditoria; trabalhar em cópias.
- Nenhuma exclusão física de produto, alteração fiscal ou sincronização com produção sem aprovação específica.
- Não excluir produtos que constem em histórico de notas, estoque, pedidos, compras ou vendas; preferir **inativação** com integridade referencial.
- Antes de qualquer execução, gerar backup e inventário de registros afetados, com possibilidade de reversão.
- Cada divergência deve incluir identificação do produto, situação encontrada, evidência, risco, correção proposta e status da revisão.
- Não presumir enquadramento fiscal apenas por descrição, NCM ou CEST; considerar contexto da operação, regime tributário, vigência e localidade.
- Conclusões sobre impostos devidos/pagos devem ser validadas com a contabilidade a partir da escrituração, declarações e recolhimentos.

## Plano de execução em etapas

| Etapa | Escopo | Produto esperado | Estado |
|---|---|---|---|
| 0. Acesso e preservação | Obter `PRODUDOS.xlsx`, confirmar versão e integridade, identificar origem e data de extração | Arquivo-base preservado e ficha da fonte | **Concluída — 14/11/2026** |
| 1. Inventário da planilha | Ler abas, colunas, tipos, total de linhas, presença de SKU/GTIN, dados fiscais, vazios e inconsistências de formato | Diagnóstico estrutural, sem modificações | **Concluída — 14/11/2026** |
| 2. Qualidade cadastral | Localizar possíveis duplicatas, GTIN inválidos, descrições divergentes, NCM/CEST/CFOP/CST/CSOSN faltantes e outros campos disponíveis | Lista de divergências classificadas | Não iniciada |
| 3. Critérios de uso | Cruzar com vendas, compras, estoque e vínculos com ofertas; definir janela de inatividade | Lista de manter / revisar / candidato à inativação | Não iniciada |
| 4. Auditoria fiscal de cadastro e XML | Comparar cadastro, documentos de entrada/saída e regras vigentes da operação no DF | Divergências fiscais com evidências e referências normativas | Não iniciada |
| 5. Apuração e recolhimento | Confrontar documentos e receita segregada com PGDAS-D ou SPED/EFD, guias e comprovantes, conforme regime | Mapa de riscos de pagamento a maior/a menor | Não iniciada |
| 6. Plano de correção | Priorizar ações, estimar impacto, preparar alterações em ambiente seguro com testes e rollback | Plano de saneamento para aprovação | Não iniciada |
| 7. Aplicação aprovada | Executar somente correções autorizadas e validar sistema, emissão fiscal, relatórios e histórico | Registro de mudanças e testes | Não iniciada |

## Etapa 0 — Acesso e preservação: CONCLUÍDA

- **Origem indicada pelo usuário:** `D:\GitHub\Bom-pra-voce\Mercado\PRODUDOS.xlsx`.
- **Cópia recebida:** `PRODUDOS.xlsx`, tamanho **3.9 MB** (4,059,051 bytes).
- **SHA-256 da cópia analisada:** `e7bba286b01cfa5cd73e47ad0fb1ca52c4e9e9a1907b9a4f0ebed103d8dc8d2e`.
- **Aba:** `Plan1`; intervalo declarado `A1:Z41748`.
- **Metadados internos do arquivo:** criado e modificado em **12/08/2026 às 19:04:39 UTC**. Atenção: isso **não comprova** a data de extração do sistema, apenas a data registrada no arquivo; validar se o material representa o cadastro atual (14/11/2026).
- **Método de leitura:** somente leitura do formato XLSX (pacote ZIP/XML), interpretação de cadeias compartilhadas e valores do Excel. A importação de alta camada excedeu o tempo de execução; não houve gravação da fonte.
- **Alterações realizadas no cadastro:** **nenhuma**.

## Etapa 1 — Inventário e diagnóstico estrutural: CONCLUÍDA

### Resumo numérico

| Indicador | Registros | Interpretação |
|---|---:|---|
| Produtos (linhas de dados) | **41.747** | 41.748 linhas incluindo cabeçalho |
| Abas / colunas | **1 / 26** | Somente `Plan1` |
| Marcados ativos (`ATIVO=S`) | **41.746** | Praticamente todo o catálogo está ativo |
| Marcados inativos (`ATIVO=N`) | **1** | Campo não ajuda a selecionar antigos sem cruzar movimentos |
| Estoque positivo | **0** | Nenhum registro na exportação apresenta saldo maior que zero |
| Estoque zerado | **35.348** | Não prova que nunca foi vendido |
| Estoque negativo | **6.399** | Requer verificação do estoque original e suas regras |
| NCM exatamente `00000000` | **41.409** | **99,19%** do catálogo; problema crítico de qualidade do cadastro **se esses dados forem os usados na emissão** |
| NCM diferente de `00000000` e com 8 dígitos | **338** | Formato presente não equivale a classificação fiscal correta |
| Preço de custo igual a zero | **41.747** | Todos; impede margem/custo confiável nesta extração |
| Preço de venda igual a zero | **8.244** | Revisar se são itens legados, kits, cadastros de serviço etc. |
| Sem código de barras | **738** | Pode incluir itens internos/pesáveis; não concluir erro automaticamente |
| Sem CEST | **41.747** | Avaliação de obrigatoriedade deve ser produto/tributação/operação específica |
| Sem CST de Cofins | **41.746** | Exige verificar se campo é consumido pelo emissor e regime aplicável |
| CST de ICMS vazio | **1.004** | CSOSN coexistente pode indicar perfil de Simples Nacional, mas depende de confirmação |
| Códigos internos repetidos | **10 valores / 21 linhas** | Chaves `CODIGO`; forte indicação para investigação de integridade |
| Códigos de barras repetidos | **5 valores / 10 linhas** | Validar variações, reutilizações e referências antes de mesclar |
| Descrições normalizadas repetidas | **354 valores / 725 linhas** | Igualdade textual não significa duplicidade do mesmo produto |
| Células com fórmulas | **0** | Todos os valores são literais no XML analisado |

### Campos mapeados

**Identificação e apresentação:** `CODIGO`, `CODIGO_BARRAS`, `DESCRICAO`, `GRUPO`, `UNIDADE`, `ATIVO`, `EXIBIR_TELA`, `SOLICITA_QUANTIDADE`, `PERMITIR_COMBINACAO`.

**Preços e estoque:** `PRECO_CUSTO`, `MARGEM_LUCRO`, `PRECO_VENDA`, `ESTOQUE_MINIMO`, `ESTOQUE_MAXIMO`, `ESTOQUE_ATUAL`, `CONTROLA_ESTOQUE`.

**Tributação:** `NCM`, `CFOP`, `CSOSN`, `CST`, `ICMS`, `CEST`, `CST_PIS`, `PIS`, `CST_COFINS`, `COFINS`.

**Campos operacionais ausentes nesta exportação:** data da última venda, data de cadastro, datas/quantidades de compra, histórico de movimentos, empresa/filial, XML de NF-e/NFC-e, origem das mercadorias, enquadramento tributário confirmado, apurações e guias pagas. Sem essas informações, **não é possível concluir quais produtos deixaram de ser usados ou quanto imposto foi pago corretamente**.

### Distribuição dos principais campos fiscais

| Campo | Valores encontrados mais frequentes | Observação |
|---|---|---|
| `NCM` | `00000000` (41.409); demais 338 | A grande predominância do marcador zero é alerta prioritário |
| `CFOP` | `5102` (41.423); `5405` (323); `5103` (1) | CFOP é dependente da natureza da operação, não somente do produto |
| `CSOSN` | `102` (41.416); `500` (331) | Não valida o regime nem a tributação correta |
| `CST` | `40` (40.743); vazio (1.004) | Coexistência de CST/CSOSN precisa ser interpretada no sistema emissor |
| `ICMS` | `0` (41.747) | Campo numérico zerado não permite concluir tributo devido ou recolhido |
| `CST_PIS` | `49` (41.746); `99` (1) | Pode depender do cenário; conferir XMLs efetivos |
| `PIS` | `0` (41.747) | Apenas valor exportado do cadastro |
| `CST_COFINS` | vazio (41.746); `99` (1) | Preenchimento incompleto |
| `COFINS` | `0` (41.747) | Apenas valor exportado do cadastro |
| `CEST` | vazio (41.747) | A ausência não indica irregularidade em todos os produtos |

### Estrutura de estoque e sinais de possível exportação antiga/incompleta

- **Todos** os 41.747 produtos têm `CONTROLA_ESTOQUE=S`, mas **nenhum** tem estoque positivo.
- Foram identificados **6.399 saldos negativos**, inclusive em produtos marcados ativos.
- Todos os custos constam como zero, e **41.746 dos 41.747 registros estão ativos**.
- Essas combinações exigem conferir a **origem da exportação** antes de tratar estoques, custos ou status como dados atuais e confiáveis.
- Como os metadados internos apontam para agosto/2026 e a auditoria ocorre em novembro/2026, é **prioritário conferir a data real da exportação** e, se possível, gerar uma cópia atual diretamente do sistema de caixa/ERP.

### Checagem preliminar de códigos

| Resultado dos códigos de barras preenchidos | Registros |
|---|---:|
| GTIN/EAN com comprimento 8/12/13/14 e dígito verificador coerente | 39.330 |
| Comprimento 8/12/13/14, porém dígito verificador não confere | 766 |
| Comprimento diferente dos formatos GTIN usuais | 874 |
| Contém caracteres não numéricos | 39 |
| Código de barras vazio | 738 |

**Nota:** essas contagens são estruturais. Produtos fracionados, pesáveis, sem GTIN de fábrica, códigos internos, regras de prefixo e embalagens podem exigir tratamento especial. Não editar códigos automaticamente.

### Problemas detectados: separação entre fato e hipótese

1. **Fato:** quase todos os NCM são `00000000`. **Risco a verificar:** divergência entre cadastro e classificação efetiva dos XMLs emitidos.
2. **Fato:** nenhum estoque positivo na cópia. **Hipóteses:** extração incompleta, saldos não conciliados, movimentações fora do arquivo, exportação histórica; não é possível escolher uma sem a fonte operacional.
3. **Fato:** custos todos zero. **Consequência:** nenhuma análise de margem/resultado confiável a partir da planilha.
4. **Fato:** código interno, código de barras e descrições possuem repetição. **Limite:** sem confirmar identificação composta, variantes e vínculo com vendas não há base para remover registros.
5. **Fato:** CST/CSOSN e tributos numéricos foram exportados com forte padronização. **Limite:** não é possível determinar adequação fiscal nem recolhimento com esta base isolada.

### Decisão da Etapa 1

**Diagnóstico estrutural concluído, nenhuma alteração executada.** Não há elementos suficientes para excluir/inativar produtos nem para afirmar recolhimento de impostos a maior ou a menor. Para a etapa seguinte, a análise de inconsistências será orientada por códigos duplicados e validação cadastral; a decisão de uso/tributação permanece bloqueada até cruzamento com as fontes operacionais e fiscais.

**Recomendação antes da Etapa 2:** confirmar se `PRODUDOS.xlsx` é a exportação atual do sistema operacional (os metadados apontam 12/08/2026). Se houver exportação mais recente, substituí-la **somente para uma nova auditoria** e preservar esta cópia com o hash acima.

### Checklist da Etapa 1

- [x] Validar abertura e enumerar planilhas.
- [x] Informar total de registros e colunas.
- [x] Identificar campos de identificação, estoque, preços, status e tributação.
- [x] Tratar códigos como texto, preservando zeros à esquerda.
- [x] Contabilizar células vazias, zeros, duplicidades e formatos suspeitos.
- [x] Registrar limitações para limpeza e revisão fiscal.
- [x] Documentar diagnóstico e manter fonte original inalterada.
- [ ] Receber autorização para iniciar Etapa 2 (qualidade cadastral detalhada).

## Histórico de execução

| Data | Etapa | Ação | Resultado |
|---|---|---|---|
| 14/11/2026 | 0 | Arquivo recebido, assinatura SHA-256 calculada, metadados inspecionados | **Concluída; somente leitura** |
| 14/11/2026 | 1 | Leitura de 41.747 produtos / 26 colunas; perfil de cadastro, estoque, campos fiscais e duplicidades | **Concluída; nenhuma alteração** |
| A definir | 2 | Verificação detalhada de qualidade, padronização e duplicações | **Não iniciada; aguardando autorização** |

### Artefatos de rastreabilidade

- `DIAGNOSTICO_ETAPA_1_BPV.json` — contagens por coluna, distribuições, exemplos e hash para auditoria/reprodução.
- `analise_inventario_bpv_etapa1.py` — script de leitura integral, sem escrita na planilha original.
- `AUDITORIA_PRODUTOS_E_FISCAL_BPV.md` — documento mestre e log de etapas.

## Campos do futuro relatório de ocorrências

`id_ocorrencia`, `etapa`, `fonte/aba/linha`, `sku/codigo`, `gtin`, `descricao`, `campo`, `valor_atual`, `problema`, `evidencia`, `risco`, `recomendacao`, `status_validacao`, `responsavel`, `data_revisao`.

## Critérios de aprovação

A cada etapa: compartilhar quantidades e exemplos, indicar incertezas, registrar decisões e somente então iniciar a próxima. Alterações em produção exigem aprovação separada e backup verificado.
