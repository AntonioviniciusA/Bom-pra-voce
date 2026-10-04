# Plano de uniformização visual — 04/10/2026

## Objetivo

Unificar a página inicial do Bom Pra Você em torno da identidade amarela, preta, branca e roxa da marca, reduzindo a sensação de blocos desconectados. O cabeçalho deve reagir à rolagem, indicar a seção atualmente visível e o carrossel inicial deve usar indicadores gráficos sem números.

## Referências recebidas

- Logo amarela com lettering branco, pesado, inclinado e contorno preto.
- Cabeçalho atual branco no topo e translúcido após rolagem.
- Carrossel inicial com indicadores numerados.

## Decisões

1. **Tipografia da marca:** a imagem da logo é rasterizada e não contém uma fonte extraível. A interface continuará usando a família local Inter para textos longos. Títulos, botões principais e navegação receberão peso extra forte, leve inclinação e sombra/contorno discreto para aproximar o ritmo visual do lettering sem falsificar ou redesenhar a marca.
2. **Cabeçalho:** fundo preto, textos e ícones brancos, contorno preto sutil no lettering e borda amarela. Ao rolar, o cabeçalho reduz levemente a altura e sobe alguns pixels com uma transformação animada.
3. **Navegação ativa:** usar observação das seções visíveis para atualizar `aria-current` e o destaque amarelo conforme a rolagem. Cliques e mudanças de rota continuam funcionando.
4. **Carrossel inicial:** substituir números por três pontos gráficos acessíveis. O ponto ativo cresce horizontalmente, sem depender apenas de cor, e o banner avança automaticamente a cada 3 segundos.
5. **Uniformidade:** consolidar superfícies em creme claro e amarelo suave, repetir raios, bordas, sombras, largura de conteúdo e ritmo vertical. As seções continuam distintas semanticamente, mas deixam de parecer páginas diferentes.
6. **Acessibilidade:** respeitar `prefers-reduced-motion`, manter foco visível, rótulos dos controles e alvos mínimos de toque.
7. **Supabase:** aplicar a migração já preparada com `category_key` e `display_order` para que o HUD de panfletos seja administrável e ordenado pelo backend.

## Critérios de aceite

- Cabeçalho preto e legível em desktop e celular.
- Item ativo acompanha `home`, `promocoes`, `setores`, `sobre`, `localizacao`, `duvidas` e `trabalhe-conosco` durante a rolagem.
- Transformação do cabeçalho ocorre apenas quando há rolagem e é desativada com movimento reduzido.
- Carrossel inicial não exibe números.
- Ordem do site e da navegação: Início, Ofertas, Sobre, Setores, Trabalhe conosco, Como chegar e Dúvidas.
- O acompanhamento permanece correto depois de Setores, incluindo Trabalhe conosco, Como chegar e Dúvidas.
- Nenhuma rolagem horizontal em 390 px.
- Panfletos continuam trocando pelo HUD.
- Testes automatizados, build, verificação visual e contrato remoto do Supabase aprovados.

## Limites

- O arquivo original da logo não será alterado.
- Não será declarada uma fonte proprietária inexistente nem extraída uma fonte de uma imagem.
- O envio de currículos continuará desativado até existirem chaves reais do Turnstile e dados jurídicos aprovados para o aviso de privacidade.
