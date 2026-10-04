# Ajustes após comentários visuais — 03/10/2026

Implementação autorizada pelos quatro comentários do usuário no navegador.

## Decisões e resultado

- Panfletos concentrados exclusivamente em `#promocoes`, imediatamente abaixo do carrossel. Removidos os atalhos duplicados sob o banner. Links do menu continuam levando à mesma seção. O carrossel apresenta a loja e seus setores, sem uma segunda listagem de panfletos.
- Três imagens no carrossel: arte original de preço baixo, nova ilustração de compras e arte existente da padaria. Navegação manual por anterior, próxima e seleção direta; estado anunciado e controles acessíveis. Sem troca automática que interrompa a leitura. A arte Quarta Verde continua fora por conter informações comerciais não confirmadas.
- Pagamentos incorporado como faixa compacta em localização/horários; removida a seção independente e o item dedicado do menu. Mantida a resposta nas dúvidas frequentes.
- Fonte local Trebuchet MS, com alternativas de sistema; títulos mais expressivos e pesados, sem depender de requisição de fontes externas. Renderização pode variar conforme fontes instaladas.
- Amarelo nas ofertas e rodapé, roxo nos destaques e botões, creme como fundo e lilás suave na apresentação. Reduzidos espaçamentos verticais e tamanho da área de recrutamento.
- Substituída a imagem corporativa da apresentação por uma ilustração de compras. Não representa fotografia da loja real.

## Imagem gerada

Ferramenta integrada image_gen, sem CLI. Arquivo usado pelo projeto: `bom-pra-voce-novo/src/images/compras-ilustracao.png` (1536 × 1024). Original anterior preservado. O PNG ainda poderá ser otimizado para distribuição; esta revisão não afirma otimização completa de imagens.

Prompt utilizado:

> Create a polished editorial illustration for the About section of a Brazilian neighborhood supermarket website Bom Pra Você. Landscape 3:2 composition, warm welcoming grocery shopping scene: a kraft shopping bag overflowing with fresh lettuce, tomatoes, bananas, oranges and a baguette on a mustard yellow counter, subtle grocery aisle shapes in soft focus behind. Rich sunny yellow, deep aubergine purple accents, natural leafy green. Tactile high quality 3D illustration, appetizing realistic produce, friendly local supermarket mood, not corporate office. No people, no logos, no text, no price tags, no watermark. Full bleed scene, balanced central composition, not a mockup.

## Validação

- 23 testes existentes aprovados; teste adicional do carrossel aprovado (24 no total). Cobre seleção, avanço, retorno e fechamento do ciclo de três slides.
- Build de produção concluído. Avisos existentes das ferramentas sobre Browserslist e fs.F_OK permanecem.
- Conferência no navegador desktop e celular: controles trocam imagens, seção de panfletos única, leitura móvel e ausência de transbordamento horizontal em 390 pixels. Console observado sem erros/avisos da página.
- [Captura desktop](evidencias-ajustes-2026-10-03/desktop.png) e [captura móvel](evidencias-ajustes-2026-10-03/mobile.png).

Integração com Supabase, recebimento efetivo de currículos e confirmação dos dados comerciais continuam pendentes. Nenhuma publicação realizada nesta revisão.

## Atualização: banners, vidro e dados da loja

Esta atualização substitui as decisões anteriores de carrossel manual e apresentação em duas colunas.

- Sobre: ilustração existente como fundo, com texto sobre painel translúcido, desfoque de fundo e contraste escuro. Fundo opaco parcial mantém a leitura mesmo sem suporte a backdrop-filter.
- Carrossel: três artes completas, sem títulos ou botões HTML sobre as imagens. Somente seletores numerados; troca a cada 5 segundos. Pausa ao passar o mouse ou focar os controles, não avança em aba oculta e respeita a preferência de movimento reduzido.
- Logo oficial enviada pelo usuário copiada para src/images/Logo.png e public/brand.png. Novas artes corrigidas usando a logo como referência, removendo a assinatura manuscrita inventada. A reprodução dentro das artes é gerada; o cabeçalho e rodapé usam o arquivo fornecido.
- Endereço: QS 118, conjunto 6, lote 2, Samambaia Sul, Brasília–DF, conforme captura enviada pelo usuário e endereço encontrado na pesquisa.
- Horários informados diretamente pelo usuário: segunda a sábado 08:00–21:00; domingo 08:00–20:00. Feriados continuam sujeitos a consulta.
- Botão Abrir no Google Maps abre uma busca pelo nome e endereço completo em nova aba. Não depende do link curto que falhou na consulta. O destino é uma busca por endereço, não um place_id verificado.

### Artes e ferramenta

Geradas e corrigidas com image_gen integrado, salvas em bom-pra-voce-novo/src/images/banner-compras.png e banner-padaria.png. A imagem de apresentação continua em compras-ilustracao.png. Originais da geração permanecem preservados na pasta da ferramenta.

Prompts de criação: banner horizontal 2,5:1, amarelo e roxo, produtos à direita e título integrado à esquerda; para compras, texto “TUDO PARA O SEU DIA A DIA”; para padaria, “SUA PRÓXIMA PARADA: A PADARIA”. Sem preços, endereço ou ofertas inventadas. A primeira geração trouxe uma assinatura manuscrita, substituída após orientação do usuário.

Prompt de correção: substituir a assinatura manuscrita pela logo retangular oficial fornecida como segunda referência, preservando fundo amarelo, borda preta, letras brancas sobre preto e subtítulo Supermercado; preservar o restante da composição. No banner de compras, remover também o símbolo de carrinho inventado da sacola.

### Validação desta atualização

25 testes aprovados em 7 suítes, incluindo intervalo de 5 segundos, seleção numérica, retorno ao primeiro banner e pausa na interação. Build de produção concluído com sucesso. Verificação de whitespace do Git sem erros.

A conferência visual final desta atualização está pendente: a revisão automática do acesso ao navegador falhou por limite de uso e a ação não foi executada. As capturas da seção anterior documentam a versão anterior, não esta atualização. Nenhuma publicação realizada. Supabase e recebimento efetivo de currículos permanecem pendentes.
