# Imagens correspondentes, proporções e aprovação

Estado: especificação de planejamento, não processamento implementado.

Atualização em 25/10/2026: [decorações separadas dos 21 temas](assets-v1/README.md) preparadas como materiais de projeto. Isso não implementa o processamento de fotos do catálogo, nem aprova imagens de produtos ou gera ofertas comerciais.

## Problema a resolver

O panfleto atual mistura fotos, textos e preços em um único arquivo. Isso impede garantir associação individual, busca por código, correção localizada e exportação consistente. Estudos gerados também podem mostrar embalagem genérica, peso errado ou alimento preparado diferente do vendido. Nenhuma dessas imagens pode virar foto aprovada de catálogo por mera semelhança.

Exemplos a impedir: frango cru ilustrado por frango assado; pacote 500 g com foto 1 kg; sabor diferente; embalagem antiga sem revisão; foto do produto B reaproveitada no card A durante uma troca de categoria. Aprovar direção de layout não aprova fotos de produtos.

## Recepção e revisão

1. Encontrar/cadastrar produto por código, verificar nome, marca, variante e conteúdo.
2. Anexar foto do item correspondente, com origem e permissão de uso informada. Fontes: fotografia própria, material autorizado do fornecedor/fabricante ou outra fonte conferida. Importação ou pesquisa podem sugerir candidatos, nunca aprovar automaticamente.
3. Ler dimensões, formato, tamanho, orientação e capacidade real de decodificação. Corrigir orientação de visualização antes de calcular a proporção.
4. Mostrar original, enquadramento proposto e prévias. Preservar embalagem completa; usar encaixe com respiro. Não esticar, recortar texto de embalagem ou preencher partes do produto por IA.
5. Operador confere identidade, legibilidade, corte, fundo e fonte. Aprova ou rejeita com motivo.
6. Registrar produto/revisão, hash da foto, dimensões, enquadramento, aprovador e instante. Troca da foto cria nova revisão pendente. Nunca reaproveitar aprovação vinculada a outro arquivo.

Estados separados: **pendente / aprovada / rejeitada / substituída** (editorial) e **processando / pronta / falhou** (técnico). “Imagem aprovada” não significa “oferta vigente”.

## Proporções e perfis recomendados

As medidas abaixo são decisões de projeto. Não são uma afirmação de todos os limites aceitos hoje pela API da Meta.

| Uso | Alvo de planejamento | Regra |
|---|---|---|
| Foto de produto, tela normalizada | 1:1; mestre recomendado 1600×1600 | Produto inteiro por encaixe; fonte retangular pode ser aceita após enquadramento aprovado |
| Derivadas para site | 320, 480, 640, 960 px de largura, conforme slot/DPR | Preservar proporção e identidade; não baixar todos os tamanhos |
| Prévia notebook | 1366×768; conferir também 1280×720 | É viewport responsivo, não proporção obrigatória da foto nem altura fixa da página |
| Prévia celular | 390×844; conferir também 360×800 e 430×932 | Duas colunas quando legíveis; uma coluna em largura/texto ampliado insuficiente |
| Story | 9:16; 1080×1920 | JPG final; preferir 1–2 itens por tela para legibilidade |

Fonte de produto pode ser PNG/JPEG/WebP compatível com o decodificador. Publicação social usa derivada no formato verificado para o canal. Exportar sem transparência sobre fundo definido quando necessário. Conteúdo largo/alto não deve ser deformado para atingir a proporção.

Story: reservar inicialmente 250 px acima/abaixo e 60 px laterais para informações essenciais, como margem editorial conservadora. São valores de projeto a validar na prévia real dos clientes Instagram; não são garantia universal contra sobreposição/corte. Feed foi retirado do escopo pelo usuário.

## Validador no painel

Mostrar ao lado do upload: **Recebida: 1200×800 (3:2). Recomendada para a foto: 1:1, 1600×1600.** Não obrigar o operador a calcular a proporção.

| Nível | Exemplo | Ação |
|---|---|---|
| Informação | “Imagem pronta para revisão.” | Conferir associação e aprovar |
| Aviso | “A imagem é 3:2. O espaço recomendado é 1:1.” | Ajustar enquadramento com margens ou substituir; nunca cortar automaticamente |
| Aviso | “A resolução pode perder nitidez no Story.” | Mostrar zoom no tamanho de saída; substituir ou remover esse destino |
| Bloqueio | Arquivo não decodifica, formato não suportado, identidade divergente, sem aprovação ou corte do produto | Corrigir antes de publicar |
| Bloqueio por formato | A arte final não atende ao perfil de saída escolhido | Recompor/exportar no perfil correto |

Regra proposta para aviso de proporção de fonte: desvio relativo superior a 2% do alvo. Isso é tolerância editorial, não limite de plataforma. A derivada final deve ter dimensões exatas do perfil. Mesmo dentro de 2%, sempre mostrar a prévia; proporção correta não assegura qualidade ou correspondência.

Regra de resolução: comparar pixels úteis da imagem com o slot de saída. Não assumir qualidade só pelo tamanho do arquivo. Fonte retangular pode ser perfeitamente aceitável com margens. Não bloquear a foto apenas por ser retangular; bloquear derivações sem enquadramento/resolução adequados conforme revisão. Para produtos em destaque, exigir amostra nítida no maior slot utilizado.

Textos sugeridos: “Produto diferente do cadastro”, “Gramatura não corresponde”, “Imagem cortada”, “Baixa resolução”, “Origem não confirmada”. Mensagem junto à foto, com ação de resolver; não apenas notificação que desaparece.

## Materiais reutilizáveis por tema

- Um pacote de decoração sem preço, descrição ou foto de produto embutidos.
- Variação de borda para notebook e versão reduzida para celular.
- Composição Story 9:16 com áreas reservadas para conteúdo.
- Miniatura de seleção no painel, prévias de intensidade Discreta/Marcante e paleta com contraste validado.
- Logo original compartilhado, componentes de texto/preço compartilhados, fotos aprovadas compartilhadas.

As pranchas desta entrega representam essas aplicações. Fundos transparentes separados, máscaras finais e arquivos publicáveis por produto são **produção futura**, após validar as imagens reais e a implementação do renderizador. Não recortar uma prancha para fingir que ela é uma exportação final. Não usar a imagem da página inteira como interface.

## Otimização prevista

Guardar original privado e derivados imutáveis. Gerar só tamanhos necessários e reutilizá-los por hash/revisão. Site: formatos modernos compatíveis, carregamento tardio abaixo da dobra e dimensões reservadas; não atrasar a imagem principal visível. Decoração leve e separada das fotos; carregar só o pacote ativo. Story são gerados da versão aprovada, não na navegação de cada cliente.

Metas iniciais, a medir e ajustar sem estragar embalagem/preço: miniatura até 40 KB; card até 120 KB; destaque até 220 KB; decoração celular até 120 KB; decoração notebook até 200 KB. São orçamentos de projeto, não resultados obtidos. Não reduzir legibilidade para cumprir um número arbitrário.

Original, derivada técnica, prancha conceitual e arte social aprovada têm tipos e pastas distintos. Não permitir que a aplicação escolha uma imagem conceitual como foto de produto ou como arquivo de envio por engano.

