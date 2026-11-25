# Biblioteca de temas e materiais

Planejamento de 24/10/2026. Perfis finais: **notebook, celular e Story; sem Feed**.

Atualização em 25/10/2026: o usuário confirmou a produção das decorações dos 21 temas. O pacote [assets-v1](assets-v1/README.md) entrega um elemento transparente por tema e suas derivações. As descrições abaixo continuam sendo direção visual; não exigem que cada detalhe da prancha esteja no elemento isolado. Composições completas e renderizador continuam futuros.

## Catálogo de direção visual

Os períodos das pranchas são exemplos de campanhas, não calendário oficial de feriados nem ofertas reais. Datas móveis devem ser configuradas por ano. Meses não obrigam aplicação automática. Todos os temas preservam logo, categorias, identificação, preço e unidade.

| Tema | Direção | Título ilustrativo |
|---|---|---|
| Padrão Bom pra você | Roxo e amarelo, etiquetas de preço em recorte de papel, sem data comemorativa. | Ofertas da semana |
| Verão | Amarelo solar, turquesa como acento, recortes de raios e ondas nas bordas; sem praia gigante. | Verão com economia |
| Volta à rotina | Papel quadriculado discreto, listas e etiquetas amarelas, roxo predominante, ideia de despensa organizada. | Sua rotina rende mais |
| Carnaval | Confetes e serpentinas restritos às margens, roxo amarelo e magenta, ritmo alegre. | Folia de ofertas |
| Volta às aulas | Recortes de caderno e pequenas formas de lápis nas bordas; lancheira saudável como contexto sem alegações médicas. | De volta às aulas |
| Mês do consumidor | Etiquetas de papel e selo de preço em roxo amarelo; nenhuma porcentagem de desconto inventada. | Mês do consumidor |
| Páscoa | Lavanda e amarelo, detalhes pequenos de papel e ovos decorativos nas margens, fotografias isoladas reais conceituais. | Páscoa para compartilhar |
| Dia das Mães | Florais delicados em papel, ameixa e coral com amarelo da marca; sem estereótipos de tarefas domésticas. | Para celebrar com elas |
| Festa junina | Bandeirinhas, tecido xadrez nos extremos, papel kraft claro, roxo amarelo e pequenos toques laranja. | Arraiá de ofertas |
| Dia dos Namorados | Fita de cetim vinho, pequenos corações nos cantos, roxo profundo e amarelo; sugestão de jantar para compartilhar. | Sabores para compartilhar |
| Férias | Recortes de papel divertidos e bilhetes, amarelo e roxo com azul suave; sem pessoas nem mascotes. | Férias com mais sabor |
| Inverno | Textura sutil de papel e tricô nas bordas, ameixa e âmbar, sem neve; produtos de café e despensa. | Sabores de inverno |
| Dia dos Pais | Papel kraft elegante, roxo e dourado, pequenas fitas geométricas; sem álcool, ferramentas ou estereótipos. | Celebre bons momentos |
| Primavera | Folhas e flores de papel pequenas nos cantos, lavanda verde e amarelo, leveza sem encobrir fotos. | Ofertas de primavera |
| Setembro Amarelo | Camada de conscientização discreta: fita amarela em uma nota independente, creme e roxo, sem selo promocional da causa e sem fogos. | Ofertas da semana |
| Dia das Crianças | Formas arredondadas de papel e estrelas nas margens, roxo amarelo e azul; linguagem dirigida aos responsáveis, sem pressão de compra infantil. | Momentos em família |
| Outubro Rosa | Camada de conscientização discreta: fita rosa na nota independente, rosa claro nas bordas, roxo e preços amarelos mantidos; sem causa em selo de desconto. | Ofertas da semana |
| Black Friday | Roxo quase preto, amarelo elétrico e etiquetas limpas; nenhum desconto percentual, preço anterior ou urgência fictícia. | Seleção Black Friday |
| Natal | Pinheiro, fitas vermelhas e pequenos ornamentos dourados nos cantos, ameixa e amarelo, decoração sofisticada sem banner. | Natal à mesa |
| Ano-Novo | Pequenas estrelas douradas, fitas em papel branco e roxo, amarelo festivo; sem álcool ou contador. | Um novo ano de economia |
| Aniversário da loja | Fitas roxas amarelas e pequenos balões nas margens, selo comemorativo sem inventar idade da empresa. | Aniversário Bom pra você |

## Aplicação dos temas

O tema é uma camada de apresentação versionada, não uma fonte de produtos. Configuração conceitual: chave/versão, nome, paleta, miniatura, materiais decorativos, posições seguras, intensidade, variantes por viewport, template de Story e regras de texto. Não embutir preço, validade ou foto de produto em fundos.

A identidade base fica protegida: arquivo original do logo, legibilidade, estrutura de card, busca, categorias, unidades e comportamento. Tema pode mudar moldura, detalhes de textura, etiqueta decorativa e acentos; não pode recolorir embalagens, reescrever preços, mudar código ou ocultar condições.

No site, o cabeçalho da seção recebe apenas nome, período e navegação. Limitar a altura editorial: alvo inicial 96–120 CSS px no notebook e 88–112 no celular, além da linha de filtros. Se o título for longo, permitir quebra controlada/redução até limite legível, sem criar banner. As pranchas são aproximações: versões com cabeçalho maior precisam ser ajustadas na futura produção.

O logo já existente no cabeçalho do site permanece. A repetição dentro da seção, presente em estudos para reconhecer a marca isoladamente, não é obrigatória na página final. Nas artes de Story, o logo é obrigatório. O convite de compartilhamento é uma faixa compacta, não um segundo banner; em telas pequenas pode ser uma linha e botão.

## Calendário e conflitos

Mostrar sugestões pelo período escolhido. Aplicar somente após seleção; ativação automática só para campanha já revisada e agendada. Ao término, voltar ao padrão sem afetar outras campanhas válidas. Uma campanha tem um tema comercial principal e, opcionalmente, uma camada institucional de conscientização. Se forem incompatíveis visualmente, oferecer prévia e priorização explícita, sem empilhar decorações.

Setembro Amarelo e Outubro Rosa usam comunicação institucional separada. Não vincular desconto à causa, não prometer doação/apoio financeiro inexistente, não gerar orientação médica. Mensagens precisam de origem e revisão própria; manter cards comerciais com leitura habitual. Na publicação social, padrão recomendado: peça de conscientização independente e peça de oferta independente, sem fita sobre o preço.

## Materiais por perfil — contrato de produção futura

| Perfil | Material compartilhado | Adaptação própria |
|---|---|---|
| Notebook | Logo, dados e fotos aprovados, tokens, símbolos do tema | Bordas laterais, título horizontal, grade 4 colunas/destaque opcional |
| Celular | Mesmo snapshot e identidade | Decoração reduzida, título compacto, 2 colunas ou 1 para acessibilidade, filtros horizontais |
| Story | Mesmas fotos/textos/preços/validade e tema | Tela 9:16 com margens seguras e 1 item por padrão; sem controles do site |
| Painel | Catálogo, temas e miniaturas | Prévia, estados de aprovação, dimensões, avisos e revisão antes de envio |

Pacote reutilizável previsto: miniatura de tema, decoração notebook, decoração celular, composição Story, tokens e manifesto de regras. Não duplicar fotos para cada tema. Não carregar 21 temas na página pública: apenas o ativo. A galeria contém estudos visuais compostos; não contém ainda fundos transparentes finais, componentes de software ou exports publicáveis.

## Limites dos estudos gerados

Pranchas não são medição pixel a pixel dos viewports escritos nas legendas. Dimensões corretas e zonas seguras devem ser impostas pelo futuro renderizador e conferidas na saída, não inferidas de uma imagem gerada. Categorias eventualmente abreviadas/ilegíveis em miniaturas devem conservar seus nomes reais na UI. Conferir marca/embalagem e substituir todas as fotos de exemplo por aprovadas.

## Inventário

A [galeria](GALERIA.md) lista as 21 pranchas com notebook, celular e Story. Estudos complementares do painel documentam lista de produtos e revisão de imagens. O arquivo `inventario.json` registra os arquivos entregues; ele é inventário documental, não configuração usada pelo aplicativo.

