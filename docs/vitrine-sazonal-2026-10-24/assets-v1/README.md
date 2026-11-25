# Decorações dos 21 temas — versão 1

Produzidas em 25/10/2026 por solicitação do usuário: **todos os 21 temas, apenas decoração**. Não há fotos de produto, preços, validade, logo redesenhado ou publicação. As imagens foram geradas com a ferramenta integrada `image_gen`; os prompts e a origem estão em [fontes.json](fontes.json). Para os três primeiros temas, esse arquivo registra um resumo do prompt; a redação integral está no histórico da conversa.

Abra [a galeria interativa](galeria.html) para comparar os temas, alternar notebook/celular/Story e conferir intensidade. Funciona como arquivo local, sem servidor e sem dependências externas. É uma demonstração de encaixe, não a interface final do site.

## Entrega por tema

| Arquivo | Uso | Dimensão |
|---|---|---|
| `original.png` | Fonte preservada, com transparência | Dimensão real no manifesto |
| `miniatura.webp` | Seletor no painel | 160×160 |
| `celular.webp` | Elemento discreto em margem reservada | 256×256 |
| `notebook.webp` | Elemento de canto fora da grade | 512×512 |
| `story.webp` | Elemento para composição futura de Story | 640×640 |
| `manifesto.json` | Identificação, tamanhos, hashes, paleta e regras | Um por tema |

Total: **21 PNGs originais + 84 WebPs = 105 arquivos de imagem**. Cada tema tem um elemento decorativo composto; suas partes internas não são camadas editáveis. Os quatro WebPs são derivados do mesmo original, sem mudanças de desenho ou de cor. Intensidade é aplicada por escala/quantidade de instâncias, não por troca de ilustração.

**`story.webp` não é um Story 1080×1920 pronto para publicar.** É a decoração transparente que entra nessa tela. A composição completa dependerá de logo original, textos, fotos aprovadas e renderizador. Não se entrega aqui uma moldura fixa da página inteira, porque a grade do site tem altura variável.

## Contrato para integração

- Manifesto central: [manifesto.json](manifesto.json). Referências são relativas a esta pasta. Chaves dos temas são estáveis; versão 1.
- Copiar o pacote necessário para a área de assets do aplicativo quando a implementação for autorizada. Não importar `docs` inteiro nem carregar todos os originais na página pública.
- Site: `object-fit: contain`, dimensões reservadas, `pointer-events: none`, `alt=""` quando puramente decorativo. Não usar filtro de cor, deformação ou recorte que apague o elemento.
- Notebook: elemento de 144 CSS px por padrão; até duas instâncias na intensidade Marcante. Se não houver margem, reduzir/ocultar a decoração, nunca sobrepor produtos ou expandir cabeçalho só para acomodá-la.
- Celular: uma instância de 64 CSS px em margem reservada; a galeria mostra 73,6 px em Marcante. O conteúdo sempre tem prioridade. Não repetir atrás dos cards.
- Story comercial: tela futura 1080×1920. Elemento dentro de caixa x=820, y=0, 240×240; conteúdo essencial entre x=60..1020 e y=250..1670. Essas margens são regra editorial conservadora, não garantia da interface do Instagram.
- Conscientização: Setembro Amarelo e Outubro Rosa são camadas institucionais, com uma fita de 32/40 CSS px no site em bloco independente; Story institucional separado, sem preço. Reservar sua caixa antes de posicionar texto. Não misturar fitas com etiquetas comerciais.
- Os pares de texto/fundo do manifesto têm contraste calculado. Isso não certifica contraste sobre a ilustração, acessibilidade da interface ou adequação de toda composição; não colocar texto diretamente sobre os elementos.
- O logo original continua em `bom-pra-voce-novo/src/images/Logo.png`. Não há cópia alterada no pacote.
- Sem ativação automática por mês: seleção e campanha precisam de revisão. Datas, condições e produtos nunca vêm do tema.

## Qualidade e aprovação

Preparação técnica: decodificação, dimensões, conteúdo e transparência real conferidos no processamento; metadados e hashes registrados. Orçamentos verificados: miniatura até 40.000 bytes, celular até 120.000, notebook/Story até 200.000 cada. A aparência foi revista nos resultados gerados e deve ser aprovada pelo usuário no contexto final.

As sombras e texturas são parte da imagem; algumas silhuetas se aproximam das bordas do original. Usar encaixe integral e margem no layout. Não prometer reconstrução de partes fora do arquivo. Os elementos seguem a direção das pranchas, mas são novas ilustrações, não recortes idênticos.

Estado: **materiais preparados para integração; aprovação visual do usuário pendente; aplicativo não alterado**. Falta validar a composição final em telas/aparelhos reais e com o catálogo, quando existir. As 23 pranchas antigas continuam conceituais.

## Reproduzir os derivados

`preparar.cjs` usa Node e Sharp. Informe o caminho do módulo em `BPV_SHARP_PATH` ou disponibilize `sharp` normalmente. Os originais já estão no pacote; após a primeira cópia, o processamento usa esses arquivos locais. Reexecutar recria somente derivados, manifestos e galeria dentro desta pasta. Não faz chamadas de geração, rede, upload ou alteração no aplicativo.
