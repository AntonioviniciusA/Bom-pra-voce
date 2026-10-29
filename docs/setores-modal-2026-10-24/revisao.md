# Modal dos setores — revisão de 2026-10-24

final result: passed

## Escopo e referência

Layout da imagem aprovada aplicado ao modal compartilhado dos cinco setores. Navegação circular entre setores sem fechar o diálogo, transição com perspectiva de 480 ms nos dois sentidos, gesto horizontal e atalho Alt + setas. Setas sem Alt e controles sobre a imagem continuam navegando pelas fotos.

- Fonte visual: C:/Users/anton/.codex/generated_images/01a16bd3-7ecc-7503-91df-de211a87bb7e/exec-46975df9-bcf2-4eb0-bf51-b480273d8510.png (1536 × 1024).
- Implementação: http://127.0.0.1:3000/#setores.
- Captura desktop: bom-pra-voce-novo/src/images/library/docs/setores-modal-2026-10-24/desktop.jpg. Viewport CSS 1536 × 1024; captura 1536 × 938, com os 86 pixels inferiores do fundo fora da captura do navegador. O modal e seus controles estão inteiros. Comparação das regiões comuns sem reescalonamento, densidade efetiva 1:1.
- Capturas móveis: bom-pra-voce-novo/src/images/library/docs/setores-modal-2026-10-24/mobile.jpg (390 × 844, Laticínios e Frios) e mobile-320.jpg (320 × 568, Congelados); mesmos tamanhos CSS, densidade 1:1.
- Referência e captura desktop final apresentadas juntas na mesma entrada de comparação. Os textos e controles estavam legíveis; não foi necessário recorte adicional.

## Comparação e correções

1. Primeira comparação: [P2] título, miniaturas e destaques pequenos em desktops altos, reduzindo a hierarquia da referência.
2. Correção: regra para telas a partir de 1100 × 850, com título até 72 px, destaques de 76 px e miniaturas de 160 × 108.
3. Nova captura comparada à referência: hierarquia corrigida; nenhum achado P0/P1/P2 remanescente dentro do escopo.

Superfícies verificadas:
- Tipografia: SiteInter existente, título roxo em peso 800, quebra natural de nomes longos e escala menor em telas compactas. Diferenças de fonte exata da imagem gerada são aceitas para manter a identidade do site.
- Espaçamento: duas colunas no desktop, uma no celular; cabeçalho e navegação persistentes, apenas o conteúdo rola. Sem overflow horizontal nas larguras de 390 e 320 px.
- Cores: branco, roxo, amarelo e creme da referência; foco visível e seleção das miniaturas destacada.
- Imagens: fotos existentes preservadas, sem distorção. Faixas laterais intencionais preservam o enquadramento completo, em vez de recriar ou cortar a foto para imitar a proporção gerada.
- Conteúdo: descrições, categorias e situação da Padaria preservadas. O texto da arte não substitui informações institucionais atuais. Contagem de setores acrescentada ao rodapé.

## Validação

- Navegador integrado: ciclo completo Padaria → Bebidas e Adega → Hortifrúti → Laticínios e Frios → Congelados; retorno ao setor anterior; troca de fotos e reinício da galeria na primeira foto após trocar o setor.
- Console do navegador: nenhuma entrada de erro capturada na verificação final.
- Testes: 10 suítes e 47 testes passaram, com configuração da API externa vazia apenas no processo de teste. A execução anterior com a configuração externa teve 46 aprovados e uma falha em App.test.js na consulta de ofertas (preflight 403/espera), alheia ao modal.
- Testes do modal cobrem foco, Escape, ciclo completo, galeria, movimentos horizontais/verticais, movimento reduzido, cliques rápidos e fechamento durante animação.
- Compilação final de produção e geração das quatro páginas estáticas concluídas. Avisos existentes de Browserslist desatualizado e depreciação fs.F_OK.
- Gestos foram verificados por eventos de teste; não houve validação em aparelho físico.

## Limites e entrega

Sem publicação, commit ou push. Alterações paralelas em src/index.css e o arquivo de campanha preexistente foram preservados. A revisão de outros componentes não faz parte deste trabalho. Sem pendências de correção visual identificadas para o modal.
