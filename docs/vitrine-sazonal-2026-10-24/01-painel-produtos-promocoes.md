# Painel, catálogo e controle das promoções

Estado: proposta aprovada na direção visual, **não implementada**.

## 1. Organização do painel

Manter Ofertas, Instagram e Currículos. Dentro de Ofertas, usar três áreas: **Campanhas**, **Produtos** e **Imagens para revisão**. Não misturar o cadastro permanente de um produto com sua participação temporária em uma promoção.

Campanhas: criar, duplicar como rascunho, editar, revisar, agendar, publicar e retirar. Filtros: rascunho, agendada, vigente, encerrada, retirada e com pendências. Mostrar período, tema, quantidade de produtos e estado de publicação. “Vigente” depende da versão publicada e do horário, não da mera existência do cadastro.

Produtos: catálogo reutilizável, buscável por descrição, marca, código interno e código de barras. Um leitor que funciona como teclado deve preencher a busca; Enter resolve a consulta sem salvar/publicar implicitamente. Câmera fica como possibilidade futura, não requisito deste planejamento.

## 2. Lista de produtos da campanha

Tabela em notebook; linhas empilhadas em telas estreitas. Colunas:

| Campo | Comportamento |
|---|---|
| Seleção | Ações em lote, com quantidade selecionada explícita |
| Foto | Miniatura da revisão vinculada e estado de aprovação |
| Produto | Nome, marca, variante, conteúdo e unidade |
| Identificação | Código interno e código de barras em texto copiável |
| Categoria | Uma das categorias cadastradas |
| Preço da oferta | Valor e base: unidade, kg, litro ou pacote |
| Período | Período efetivo do item, herdado da campanha por padrão |
| Estado | Rascunho, pendente, pronto, agendado, vigente, pausado ou encerrado |
| Canais | Site / Story e situação separada de cada envio |
| Ações | Editar, revisar foto, destacar, mover, pausar ou remover da campanha |

Busca por código de barras exato tem prioridade; busca textual serve para descoberta, nunca para associação automática. Zero resultados: “Produto não encontrado” com ação para cadastrar. Mais de um resultado exato: conflito de identificação, revisão obrigatória, não escolher o primeiro.

Filtros úteis: categoria, foto pendente, sem preço, sem código, período, publicação e conflito. Exibir contagem de resultados e ação “Limpar filtros”. Ordenação por nome, prioridade, preço ou término. Persistir seleção por ID, nunca pela posição da linha. Seleção em várias páginas precisa informar seu alcance; por padrão selecionar apenas resultados visíveis, com ação explícita para todos os filtrados.

Edição em lote: período, categoria, inclusão/remoção, canais e pausa; preços diferentes exigem revisão por item. Não aprovar fotos em lote sem conferir a correspondência de cada uma. Arrastar para ordenar é opcional: disponibilizar também “Mover para cima/baixo” para teclado.

## 3. Cadastro de produto

Campos: ID interno imutável, código interno legível, código de barras original, tipo de identificador, nome, marca, variante/sabor, conteúdo, unidade comercial, categoria, descrição e imagem principal aprovada. Guardar origem da imagem, autorização de uso informada, revisão e histórico de aprovação.

Código de barras é **identificação**, não prova de autenticidade, nem garantia de que uma imagem encontrada na internet é correta. Guardar como texto para preservar zeros. Para GTIN, validar comprimento e dígito verificador; manter valor original e uma representação canônica para comparação quando aplicável. Não converter todo identificador interno em GTIN. Não inventar código para preencher o campo.

Produtos sem GTIN, como alguns itens vendidos a peso, usam código interno/PLU explicitamente tipado e motivo “sem GTIN”. Códigos de balança com preço/peso embutido precisam de regra própria validada com a loja; não comparar o código inteiro como se fosse identificador estável. Pacote, caixa, sabor e gramatura diferentes podem ser produtos distintos. Dois códigos só viram aliases após confirmação de equivalência pelo operador.

O código aparece no painel e no detalhe do produto no site, com copiar e busca por código. No card público compacto, priorizar foto, descrição, preço e unidade; o código fica acessível em “Detalhes”. Não gerar barras gráficas nas artes de Instagram por padrão: o objetivo aqui é identificação do cadastro, não criar etiquetas de checkout.

## 4. Item em promoção

Um item da campanha referencia o produto e guarda preço promocional em centavos, unidade/base de venda, condições, intervalo, ordem e destaque. Preço anterior só aparece se houver valor e origem confirmados; não inventar porcentagens de desconto ou contadores de urgência.

Dados permanentes e dados promocionais são separados. Atualizar a descrição ou foto no catálogo cria uma nova revisão; não muda silenciosamente uma campanha já publicada. O operador vê quais campanhas usam a revisão anterior e escolhe revisar/republicar.

O intervalo efetivo do item é a interseção de seu intervalo com o da campanha. Interface: início e fim inclusivos em dias quando o operador escolher datas; traduzir o final do último dia para o começo do dia seguinte, exclusivo, em America/Sao_Paulo. Mostrar o fuso, incluindo agendamentos de Instagram. Não depender do fuso do computador.

## 5. Fluxo de uma campanha

1. **Aparência:** escolher pacote visual por miniatura, nome e período. Decoração Discreta/Marcante; para conscientização, padrão discreto. Prévia em tempo real e opções avançadas recolhidas.
2. **Produtos:** buscar/ler códigos, selecionar, revisar fotos e preencher preços. Um destaque editorial opcional no notebook, sem alterar identificação ou ordem lógica no celular.
3. **Revisão:** resumo dos itens, condições, datas, tema, formatos e destinos. Mostrar pendências junto ao item responsável.
4. **Publicação:** ação explícita de publicar/agendar. Salvar rascunho não publica. No social, selecionar contas e formato por conta, seguindo o plano de múltiplas contas de 10/10/2026.

Modelo de estados do item: rascunho → pendente de revisão → pronto → agendado/vigente → encerrado; pausa/retirada possível durante a vigência. Elegibilidade depende de aprovação da foto, identidade resolvida, descrição, preço, unidade, período e categoria válidos. Um item incompleto não é publicado; demais itens podem prosseguir somente após exclusão explícita e revisão do resumo final.

## 6. Concorrência e conflitos

Ao salvar, comparar a revisão que o editor abriu com a atual. Se outro operador alterou: “Esta oferta foi alterada. Compare as versões antes de salvar.” Não sobrescrever silenciosamente. Uma alteração de preço ou foto invalida a revisão final das artes afetadas.

Se duas campanhas da mesma loja/canal tiverem o mesmo produto/variante em períodos sobrepostos, apresentar ambas e exigir resolução antes da publicação (encerrar, ajustar datas ou retirar um item). Não decidir pelo último registro recebido. Não fundir por nome parecido.

Retirar um produto da campanha não apaga o catálogo nem o histórico. Exclusão permanente não faz parte do fluxo usual. Se um item já foi postado no Instagram, alterar o site não corrige o post existente; registrar a divergência e a ação editorial necessária. Fila futura deve revalidar preço, período, aprovação e revisão antes do envio.

## 7. Visão conceitual dos registros

Produto → revisões do produto → imagens/revisões aprovadas.

Campanha → versão publicada → itens com snapshot de produto, preço e imagem.

Versão publicada + versão do tema + formato → derivada social aprovada → conta de destino + tarefa → confirmação externa.

IDs estáveis comandam as relações. Código de barras é índice de busca e conciliação, não chave de card, ordem de array ou nome de arquivo. Fotos e derivados têm caminho imutável por revisão/hash. Este desenho é conceitual: não cria tabelas ou migrações.

