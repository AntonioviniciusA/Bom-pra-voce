# Revisão visual — menu mobile “Acesso rápido”

Data: 2026-11-14.

- Verdade visual: `C:/Users/anton/AppData/Local/Temp/codex-clipboard-a085d641-42e7-4e89-a082-8f372d99c1fc.png` (942 × 1674 px, proporção aproximada 9:16).
- Implementação: `http://127.0.0.1:3012/`, menu mobile aberto.
- Captura da implementação: observada no Codex In-app Browser; a ferramenta não expôs caminho persistente para a captura.
- Viewports: 320 × 568 e 430 × 764 CSS px, densidade efetiva 1×. A fonte foi normalizada pela largura: 942 px da referência para 320/430 CSS px da implementação.
- Estado: página inicial, menu aberto, fundo bloqueado e botão de fechamento visível.

## Comparação e histórico

1. A primeira implementação foi reprovada pelo usuário por compactar o menu dentro do cabeçalho, reduzir logo, título e cartões e substituir a cesta da referência por um ícone pequeno. Achado P1.
2. O menu aberto passou a ocupar `100dvh`; logo, título, grade 2 × 3, raios, sombras e rodapé foram reescalados a partir da referência. Foi produzido um asset transparente isolado de cesta com produtos, e o selo usa a logomarca vetorial real do projeto.
3. A primeira captura corrigida ainda iniciava os cartões 11–19 px acima da faixa equivalente e deixava a cesta pequena. Achados P2.
4. A escala tipográfica, a separação abaixo do título, a altura dos cartões e a cesta foram ajustadas. Na captura final de 320 × 568, o título começa em y=90; os cartões começam em y=146, 252 e 358, com 136 × 96/97 px; a referência normalizada começa aproximadamente em y=91, 145, 250 e 356.
5. Em 430 × 764, os cartões medem 183 × 129 px, o documento mede 430 px de largura e o cabeçalho 764 px de altura, sem overflow horizontal ou corte.

## Superfícies obrigatórias

- Tipografia: `SiteInter` local em peso 950 aproxima a massa visual da referência; título usa 30,4 px em 320 e os rótulos 17,28 px, com “Trabalhe conosco” em duas linhas.
- Espaçamento e ritmo: painel em tela cheia, margens laterais equivalentes, grade 2 × 3, raios amplos, sombras inferiores e cesta ancorada ao canto inferior direito.
- Cores: amarelo `#FFE500`, cartões creme `#FFF9E9`, preto e sombra marrom-amarela; nenhum vermelho decorativo foi introduzido.
- Imagens: logo vetorial existente preservada; cesta com produtos é um PNG ARGB 1536 × 1024 com transparência real nos quatro cantos, aberto e inspecionado antes da aplicação. Não foi usada a referência como fundo estático.
- Conteúdo: título e seis rótulos coincidem com a referência. Todos permanecem links reais.
- Ícones: Lucide mantém família consistente, espessura preta e escala equivalente; carrinho pálido inferior é decorativo e oculto da árvore acessível.
- Acessibilidade e comportamento: “Abrir menu”/“Fechar menu”, foco visível, Escape, fechamento externo, bloqueio da rolagem de fundo e restauração ao fechar. O link Pagamentos abriu `/formas-de-pagamento` no navegador.

## Evidência final

- Comparação de visão completa: referência e renderização foram abertas na mesma revisão, com estado e proporção equivalentes. Não restam diferenças P0/P1/P2.
- Comparação focada: logo/carrinho, título, três fileiras, ícones, quebras e rodapé foram legíveis nas capturas completas; não foi necessário um recorte adicional.
- Console: uma aba limpa da prévia foi aberta após a recompilação e não registrou erros.
- Testes: 20 suítes e 104 testes aprovados. Permanecem apenas avisos preexistentes de migração futura do React Router.
- Build: compilação de produção concluída e sete páginas institucionais estáticas geradas.
- Follow-up P3: a onda amarela translúcida do rodapé da arte foi omitida; o carrinho pálido e a cesta preservam a hierarquia sem introduzir uma ilustração artificial adicional.

final result: passed

---

# Modal dos setores — revisão de 2026-10-24

final result: passed

---

# Revisão visual — Stories mobile e Guided Tour

Data: 2026-11-14.

- Referências: `image(20261114-061007).png` e `image(10).png` anexadas na conversa “Corrigir descrição e tour”.
- Implementação: `http://localhost:3000/#promocoes`, campanha Esquenta Black Friday.
- Viewports: 320, 360, 375, 390, 414 e 430 × 700 CSS px.
- Estados: Guided Tour aberto; story iniciado; reprodução pausada para a inspeção do texto e do preço.

## Mudanças verificadas

- A área inferior do card agora usa duas colunas estruturais: nome/conteúdo em uma coluna flexível e preço em um bloco independente.
- O nome permite quebra e é limitado a duas linhas; o conteúdo também é limitado, sem invadir o preço.
- O tour apresenta um mapa visual das zonas de voltar, segurar e avançar, três instruções curtas, botão **Começar stories** e ação **Pular tour**.
- O foco inicial vai para **Começar stories** e, ao concluir ou pular, retorna aos controles do story.
- As animações de toque/segurar são feitas em CSS e respeitam `prefers-reduced-motion`; não foram criadas imagens desnecessárias.

## Evidências responsivas

- Nas seis larguras, o Guided Tour ficou integralmente visível, sem rolagem interna, com CTA dentro do viewport e foco inicial correto.
- Nas seis larguras, as caixas do nome e do preço não se cruzaram; copy e rodapé permaneceram dentro do viewport.
- As inspeções pausadas em 320 e 430 px confirmaram logo, campanha, produto, nome, conteúdo, preço e rodapé legíveis.
- Ações de avançar/voltar, pausa, retomada e toque prolongado com `pointerType: touch` estão cobertas pelos testes do componente.

## Validação

- 19 suítes e 100 testes aprovados antes do teste adicional de “Pular tour”.
- A suíte focada de Stories passou novamente com 7 testes, incluindo “Pular tour” e retorno do foco.
- Build de produção concluído com sucesso.
- O build manteve um aviso já existente em `story.js`: importação `blackFridayBackgroundUrl` não utilizada.
- A suíte completa manteve avisos já existentes do React Router e do canvas não implementado pelo JSDOM; nenhum teste falhou.
- `git diff --check` sem erros; somente avisos de conversão LF/CRLF do checkout.

## Limitações

- A revisão validou eventos de ponteiro touch automatizados e o navegador responsivo local; não substitui uma rodada em aparelho físico com diferentes barras do navegador e recortes de tela.
- A campanha avança automaticamente a cada 7 segundos; a inspeção visual do card foi pausada para evitar capturas durante uma transição.
- Após essas validações, uma alteração concorrente adicionou `ShareDownloadMenu`/`flyerPdf` ao mesmo diretório. A repetição final da suíte completa ficou bloqueada por `TextEncoder` ausente no Jest e por um estado intermediário de `ProductOffers.jsx`; esses erros não estavam presentes no build e na suíte completa aprovados acima e não foram alterados por esta revisão para evitar sobrescrever trabalho externo.

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


---

# Histórico de outras revisões (fora do escopo atual)

# Revisão visual — nav branca e contorno da fonte

Data: 2026-10-07.

- Causa: branco com alfa `0.3` deixava 70% do conteúdo escuro atravessar, fazendo a nav parecer preta sobre banners escuros.
- Correção final solicitada: fundo branco com 40% de opacidade (`rgba(255, 255, 255, 0.4)`), mantendo blur e borda amarela.
- Paridade responsiva: o painel interno do menu móvel deixou de adicionar uma segunda camada branca de 94% e agora fica transparente, herdando somente os mesmos 40% do cabeçalho usados no desktop.
- Interação móvel: ao tocar ou clicar fora do cabeçalho, o menu aberto fecha; interações dentro do próprio cabeçalho continuam disponíveis e o fechamento por `Escape` foi preservado.
- Tipografia: removida a borda simulada por quatro sombras; aplicado contorno amarelo único de `0.55px`, com preenchimento preto.
- `src/App.test.js`: teste isolado de fechamento ao clicar fora aprovado; a execução integral ficou bloqueada pela resposta HTTP 403 da consulta externa de ofertas.
- Build de produção compilado com sucesso e `git diff --check` sem erros.
- A captura pós-correção ficou bloqueada porque o navegador integrado não conseguiu iniciar o processo de inspeção nesta execução.

Não há falha funcional conhecida, mas a confirmação visual pós-correção ainda precisa ser feita no navegador.

final result: blocked

---

# Revisão visual — Padaria em breve

Data: 2026-10-06.

- Implementação: `http://localhost:3001/#setores`, conferida no navegador integrado em viewport móvel.
- O cartão da Padaria recebeu selo amarelo “Em breve” e nome acessível `Padaria — Em breve`.
- O modal repete o estado “Em breve” e explica que o setor está em preparação, sem afirmar disponibilidade atual.
- A estrutura, a navegação entre setores, o fechamento e o enquadramento responsivo da imagem foram preservados.
- `src/App.test.js`: 3 testes aprovados. O `AggregateError` conhecido da consulta externa apareceu no jsdom sem falhar as asserções.
- Build de produção compilado com sucesso e `git diff --check` sem erros.

Não restam achados P0, P1 ou P2 no escopo solicitado.

final result: passed

---

# Revisão visual — modal e data de nascimento no iPhone 13

Data: 2026-10-06.

- Referência: defeitos relatados pelo usuário no modal de setores e no campo nativo de data no iPhone 13.
- Implementação: `http://localhost:3001/#setores` e uma prévia local isolada do formulário em `http://localhost:3002/trabalhe-conosco`.
- Viewports CSS: 390 × 844 e 1366 × 768, densidade 1×.
- Capturas: observadas diretamente no navegador integrado; a ferramenta não expôs caminho local para persistência.

## Comparação e correções

- Modal: a imagem horizontal era forçada para uma caixa alta com `object-fit: cover`, causando corte. A imagem agora preserva proporção 16:9; no celular usa `contain`, mostrando todo o enquadramento.
- Em 390 × 844, a imagem ficou com 346 × 194,6 px e dimensões naturais 680 × 383 px, totalmente visível dentro do modal. O documento não apresentou overflow horizontal.
- Em 1366 × 768, o modal ficou com 1306 × 666,9 px e a imagem com 668,6 × 376,1 px, sem distorção ou overflow.
- Formulário: o campo de data e seu contêiner passaram a aceitar `min-width: 0` e `max-width: 100%`; o controle nativo recebeu aparência e tamanho de fonte estáveis para Safari/iOS.
- Em 390 × 844, o campo e seu contêiner mediram exatamente 305 px. O limite direito ficou em 340 px dentro do cartão, sem deslocamento lateral e com `scrollX = 0`.

## Validação

- Modal aberto, imagem conferida, navegação e fechamento preservados.
- Campo de data focado e inspecionado na posição real do formulário móvel.
- A prévia isolada do formulário usou configuração fictícia apenas para renderização; por isso o Turnstile registrou o aviso esperado `400020`. Nenhum dado foi enviado.
- Testes direcionados: 2 suítes e 4 testes aprovados. O `AggregateError` conhecido da consulta externa apareceu no jsdom sem falhar as asserções.
- Build de produção compilado com sucesso.
- `git diff --check` sem erros de whitespace; apenas avisos de conversão LF/CRLF em arquivos já modificados.

Não restam achados P0, P1 ou P2 no escopo solicitado.

final result: passed

---

# Revisão visual — busca do cabeçalho

Data: 2026-10-03.

## Evidências

- Verdade visual de origem: `C:/Users/anton/AppData/Local/Temp/codex-clipboard-c03eb45f-0324-4fa5-8aa6-4dc1a50b2291.png` (1365 × 728 px). A imagem registra o defeito, não um mockup de destino: busca sem acabamento, cabeçalho expandido e banner deslocado.
- Implementação: `http://localhost:3000/`, conferida no navegador integrado. A captura foi observada diretamente no navegador; a ferramenta não expôs caminho de arquivo local para a imagem.
- Viewports CSS: navegador desktop (aproximadamente 1265 × 712) e 390 × 844 no teste responsivo. Densidade de captura 1×.
- Estados: busca aberta sem texto, busca com `horarios`, fechamento por `Escape`, menu móvel aberto e busca móvel aberta.

## Comparação e iterações

1. Antes: o conteúdo da busca participava do fluxo do cabeçalho, usava controles/lista sem estilos e aumentava a altura da navegação sobre o banner.
2. Correção: a busca passou a ser um painel flutuante ancorado ao botão, com campo composto, atalhos em chips, sombra, borda e dimensões limitadas. O banner permanece na posição original quando a busca abre.
3. Pós-correção desktop: cabeçalho preserva a altura; painel fica alinhado à direita, abaixo do ícone, sem sobrepor o botão de fechar e sem transbordamento horizontal.
4. Pós-correção móvel: menu e painel cabem em 390 px sem rolagem horizontal. A busca continua acessível dentro do menu.

## Superfícies de fidelidade

- Tipografia: mantém a família e os pesos já usados pelo site; rótulo, campo, atalhos e texto auxiliar têm hierarquia legível.
- Espaçamento e ritmo: painel independente do fluxo do cabeçalho, com 22 px de respiro interno e alvos mínimos de 44 px nos botões.
- Cores e tokens: creme, amarelo, roxo e azul de foco reutilizam a linguagem existente.
- Imagens: logo e banners existentes foram preservados, sem recorte ou substituição.
- Conteúdo: atalhos e ajuda preservados; busca sem acento encontra `Horários e endereço`.

## Validação funcional

- 7 suítes e 25 testes aprovados.
- Build de produção concluído com sucesso.
- Busca aberta/fechada, filtro por `horarios` e fechamento por `Escape` verificados.
- Nenhum erro ou aviso da página no console do navegador.
- `git diff --check` sem erros.

Não há achados P0, P1 ou P2 restantes no escopo da busca do cabeçalho. O menu móvel permanece deliberadamente expansível, conforme a arquitetura atual do site.

final result: passed

---

# Revisão visual — navegação translúcida e tipografia da marca

Data: 2026-10-06.

- Verdade visual de origem: `C:/Users/anton/AppData/Local/Temp/codex-clipboard-b0333796-d3d5-46b6-ba84-f32b20ff0be0.png` (1223 × 297 px, densidade 1×), usada como referência tipográfica da logo.
- Implementação: `http://localhost:3001/`, renderizada no navegador integrado. As capturas desktop e móvel foram observadas diretamente; o navegador não expôs caminho de arquivo local para persistência.
- Viewports CSS: 1366 × 768 e 390 × 844, densidade 1×.
- Estados: cabeçalho rolado no desktop, topo no celular e menu móvel expandido.

## Comparação e iterações

1. A primeira inspeção detectou que uma regra anterior de cabeçalho preto ainda vencia na cascata e deixava a nova letra preta sem contraste.
2. A camada de marca passou a fixar somente o fundo do cabeçalho em branco com 30% de opacidade, preservando borda amarela, desfoque e demais estados existentes.
3. A captura pós-correção confirmou `rgba(255, 255, 255, 0.3)` no topo e no estado rolado, texto preto e contorno amarelo sutil nos links. O item ativo mantém o preenchimento amarelo sem contorno duplicado.
4. No menu móvel aberto, a lista usa branco com 94% de opacidade para manter leitura e contraste, enquanto o invólucro do cabeçalho continua em 30%.

## Superfícies obrigatórias

- Tipografia: a busca pública não forneceu identificação confiável da fonte proprietária da logo. Foi usada a família local `SiteInter` em peso 900, com espaçamento mais fechado e fallback `Arial Black`, aplicada somente aos títulos principais.
- Espaçamento e ritmo: dimensões, posição fixa, raio, logo e alvos de toque da navegação foram preservados.
- Cores: fundo branco a 30%, letras `#111`, borda amarela existente e contorno tipográfico amarelo discreto.
- Imagens: a logo rasterizada original foi preservada, sem reconstrução ou alteração.
- Conteúdo: rótulos, destinos e hierarquia semântica foram mantidos.

## Validação

- Desktop e celular sem transbordamento horizontal.
- Menu móvel abriu e exibiu todos os destinos; cabeçalho superior e estado rolado foram conferidos.
- Console do navegador sem erros ou avisos.
- `src/App.test.js`: 3 testes aprovados. O `AggregateError` conhecido da consulta externa apareceu no jsdom sem falha de asserção.
- Build de produção concluído com sucesso e `git diff --check` sem erros.

Não restam achados P0, P1 ou P2 no escopo solicitado.

final result: passed

---

# Revisão visual — ofertas, modal de setores e candidatura móvel

Data: 2026-10-05.

- Referências: quatro capturas móveis fornecidas pelo usuário, cobrindo a distância da HUD de ofertas, o modal de setores, a chamada Trabalhe conosco e o formulário de candidatura.
- Implementação: `http://localhost:3000/` e `http://localhost:3000/trabalhe-conosco`, renderizadas no navegador integrado.
- Viewport inspecionado no navegador: 1280 × 720 CSS px; regras móveis confrontadas com a referência de aproximadamente 390 CSS px.

## Correções

- A HUD de categorias passou de 38 px para 20 px de distância no desktop e de 28 px para 10 px no celular; o preenchimento móvel também foi reduzido para aproximar o controle do cartão sem prejudicar os alvos de toque.
- O modal passou a calcular largura com `border-box`, bloqueando o overflow horizontal observado na primeira captura local.
- Em até 600 px, o modal usa altura dinâmica (`dvh`), respeita áreas seguras, reduz imagem, tipografia, miniaturas e espaços, mantém botões de 44 px e preserva rolagem vertical contida.
- A página de candidatura recebeu limites explícitos de largura nos filhos da grade e no formulário. Campos agora usam `border-box`; no celular, o cartão ocupa 100% da coluna e a página recorta apenas overflow lateral acidental.

## Validação

- Modal aberto e inspecionado: conteúdo completo visível em 1280 × 720, sem a barra horizontal encontrada antes da correção.
- Página Trabalhe conosco inspecionada em 1280 × 720: documento sem overflow horizontal (`scrollWidth` útil igual à largura do conteúdo visível) e cartão dentro da grade.
- Controles do modal preservam rótulos acessíveis; fechamento e navegação anterior/próximo continuam disponíveis.
- Testes direcionados: 2 suítes e 4 testes aprovados (`App.test.js` e `CandidaturaForm.test.jsx`). O `AggregateError` conhecido da consulta externa apareceu no jsdom sem falhar testes.
- Build de produção compilado com sucesso.
- `git diff --check` sem erro de whitespace; permaneceram apenas avisos de conversão LF/CRLF em arquivos já modificados.

final result: passed

---

# Revisão visual — formas de pagamento

Data: 2026-10-05.

- Referência visual: imagem enviada pelo usuário, `1-Imagem-colada-1.jpg` (1280 × 853 px).
- Implementação: `http://localhost:3000/#pagamentos`, conferida no navegador integrado.
- Viewports comparados: 1366 × 768, 1024 × 768 e 390 × 844 CSS px.
- Conteúdo: pagamento presencial; nenhuma integração de checkout foi criada ou anunciada.

## Comparação e adaptação

- A arte original foi preservada como ativo principal, sem redesenhar ou aproximar as marcas.
- A seção recebeu título e descrição compatíveis com a hierarquia visual do site, além de lista textual das quinze formas mostradas na referência.
- No desktop, a arte permanece em destaque dentro de um cartão branco com borda amarela. No celular, reduz sem corte e é complementada por uma grade textual de duas colunas para manter a leitura.
- A FAQ passa a obter a mesma lista da configuração central, evitando divergência de conteúdo.

## Validação

- Seção e imagem possuem nomes acessíveis; a lista expõe as bandeiras em marcação semântica.
- Não houve rolagem horizontal em 390 px nem em 1024 px.
- Console do navegador sem erros ou avisos na página verificada.
- `src/App.test.js`: 3 testes aprovados. O jsdom registrou o erro externo já conhecido ao consultar promoções, sem falha de asserção.
- Build de produção concluído com sucesso.
- `git diff --check` sem erros.

Não restam achados P0, P1 ou P2 no escopo da seção de pagamentos.

final result: passed

---

# Revisão visual — carrossel de panfletos com HUD

Data: 2026-10-04.

- Verdade visual: `C:/Users/anton/AppData/Local/Temp/codex-clipboard-0c7ac7a7-9340-4201-aac1-22d9cd10c7a8.png` (1672 × 941 px).
- Implementação: `http://127.0.0.1:4173/#promocoes`, renderizada no navegador integrado.
- Viewports CSS: 1680 × 941 e 390 × 844, densidade 1×.
- Estado: primeiro panfleto ativo; troca para “Utilidades e bebê” também verificada.

## Comparação e iterações

1. A primeira renderização reproduziu a composição de três colunas, mas o contrato remoto ainda não entregava categoria e a validade exclusiva aparecia como 06/10.
2. Foi adicionada inferência retrocompatível por título e a data final passou a ser exibida como o último dia válido, 05/10.
3. Na nova captura, o HUD mostrou quatro setores nomeados, o segundo setor trocou a imagem e o estado selecionado. O corpo permaneceu sem transbordamento horizontal no desktop e no celular; no celular, o HUD possui rolagem horizontal intencional.

## Superfícies obrigatórias

- Tipografia: família local do site preservada; títulos, texto auxiliar e rótulos mantêm a hierarquia da referência.
- Espaçamento e ritmo: três colunas no desktop, empilhamento no celular, cartão lateral, imagem central e HUD inferior mantêm as proporções e o fluxo principal.
- Cores: amarelo, creme, roxo e branco da referência foram aproximados com os tokens já usados pelo site.
- Imagens: os quatro panfletos reais fornecidos pelo usuário são exibidos diretamente; não há placeholder ou reconstrução do material promocional.
- Conteúdo: validade, título, resumo, condições e CTA vêm do Supabase; o download em PDF da referência foi omitido porque os materiais atuais são PNG.

## Validação funcional

- Quatro abas de setor com `role=tab`, estado selecionado e navegação por teclado.
- Troca de “Açougue e congelados” para “Utilidades e bebê” confirmou alteração do panfleto e do texto.
- CTA abre a imagem completa em nova aba.
- 8 suítes e 27 testes aprovados.
- Build de produção concluído com sucesso.

Não restam achados P0, P1 ou P2 no escopo visual. A ausência dos elementos decorativos laterais e do QR Code é intencional: não havia ativo equivalente nem URL pública final aprovada, e esses elementos não devem ser simulados.

final result: passed

---

# Revisão visual — responsividade do cabeçalho e seção de vagas

Data: 2026-10-04.

Referência do defeito: `C:/Users/anton/AppData/Local/Temp/codex-clipboard-336692e9-8113-4016-b85a-08284fba0ad7.png` (1366 × 768 px).

## Correções e comparação

- Em 1366 px, logo, links e busca agora permanecem em uma linha, sem rótulos comprimidos ou controle cortado na borda.
- A seção de vagas recebeu grade intermediária, título reduzido proporcionalmente e benefícios com ícones, espaçamento e texto legíveis.
- Abaixo de 1180 px, a navegação passa para o menu expansível em vez de tentar comprimir o layout desktop.
- Em 1024 × 768, o cabeçalho exibe logo e botão de menu sem sobreposição.
- Em 390 × 844, o menu abre em uma coluna, todos os destinos ficam acessíveis e não existe rolagem horizontal.
- No topo, o cabeçalho sólido continua no fluxo da página; após a rolagem, mantém a apresentação flutuante.

## Evidências

- Comparação visual realizada no navegador integrado em 1366 × 768, 1024 × 768 e 390 × 844.
- Menu mobile aberto e fechado durante a verificação.
- Imagens, textos e identidade existentes foram preservados.

Não restam achados P0, P1 ou P2 no escopo responsivo observado na referência.

final result: passed

---

# Revisão visual — FAQ e rodapé

Referência visual: `C:/Users/anton/AppData/Local/Temp/codex-clipboard-bbaf1500-b201-43b2-b6a5-1125cd1e9756.png` (1672 × 973 px).

Implementação: `http://192.168.0.7:4174/#duvidas`, conferida no navegador em desktop e em 390 × 844 CSS px, densidade 1×. As capturas foram observadas diretamente no navegador; a ferramenta não expôs caminho local para elas.

Estado comparado: segunda pergunta aberta. A primeira pergunta também foi aberta durante o teste de interação para confirmar o fechamento automático da anterior.

## Comparação visual

A implementação preserva a composição principal da referência: título central, grade de duas colunas, cartões brancos com contorno amarelo, ícones circulares, controle de expansão, chamada amarela e rodapé amarelo dividido em grupos. A adaptação intencional substitui WhatsApp e redes sociais sem confirmação por endereço e horários reais da loja.

## Superfícies obrigatórias

- Tipografia: Inter local preservada; pesos, escala, entrelinha e quebras mantêm a hierarquia da referência.
- Espaçamento e ritmo: duas colunas no desktop, uma no celular; cartões, chamada e separadores mantêm ritmo uniforme.
- Cores e tokens: amarelo, creme e roxo existentes no produto foram reutilizados.
- Imagens e ativos: logo oficial existente reutilizada; ícones são da biblioteca instalada, sem desenhos improvisados.
- Conteúdo: as sete perguntas existentes foram preservadas; contato não confirmado não foi publicado.

## Validação funcional

- A abertura de uma pergunta fecha a anterior.
- Estados `aria-expanded` e painéis associados foram confirmados.
- Navegação para localização e links do rodapé permanecem disponíveis.
- Rodapé empilhado e FAQ em uma coluna conferidos em 390 × 844, sem transbordamento horizontal.
- Console do navegador sem erros.
- 7 suítes e 25 testes aprovados.
- Build de produção concluído com sucesso.

## Achados finais

Não restam achados P0, P1 ou P2 no escopo. A troca de “Fale conosco” por “Visite a loja” é deliberada: `phone`, `email` e `whatsappUrl` continuam vazios na configuração e não devem ser inventados. Não houve achado que exigisse uma segunda iteração visual.

final result: passed

---

# Revisão visual — Sobre, setores e candidatura

Referências visuais: `C:/Users/anton/AppData/Local/Temp/codex-clipboard-5015adc7-485b-4b55-b3db-71166afbde9e.png` (1680 × 941 px) e `C:/Users/anton/AppData/Local/Temp/codex-clipboard-6ae415f2-8e5b-4958-8222-a94d5a74ea4c.png` (1536 × 1024 px).

Implementações verificadas: `http://localhost:4173/#sobre` e `http://localhost:4173/trabalhe-conosco`.

Capturas da implementação: renderizadas no Codex In-app Browser durante esta revisão; o navegador não expôs caminho de arquivo para as capturas.

## Comparação e resultado

- A seção Sobre passou a usar composição em duas colunas, título em duas linhas, dois CTAs e uma imagem horizontal de hortifrúti produzida para esta interface.
- Os cinco setores aparecem imediatamente abaixo, com imagem, tratamento escuro para legibilidade, título e traço amarelo, seguindo a ordem e proporção da referência.
- A página Trabalhe conosco passou a ter apresentação independente, com marca, texto, benefícios, recorte da equipe e cartão de candidatura.
- O fundo do cabeçalho existente foi mantido; sua estrutura e superfície não foram substituídas pelo novo layout.
- Em 390 × 844 px, texto, botões, benefícios, fotografia, cartão e setores empilham sem rolagem horizontal nem sobreposição.
- A versão desktop foi comparada nos viewports das referências: 1680 × 941 e 1536 × 1024.

## Superfícies obrigatórias

- Tipografia: hierarquia, pesos, quebras e entrelinhas aproximados das referências com a família local do projeto.
- Espaçamento: largura máxima, colunas, alinhamentos, raios e intervalos revisados em desktop e celular.
- Cores: amarelo da marca, roxo escuro, creme e branco mantidos de forma consistente.
- Imagens: recorte da equipe fornecido pelo usuário; fotografia do supermercado gerada sem texto, marca ou pessoas; ativos reais dos setores reaproveitados.
- Interações: links de setores, localização, privacidade e navegação permanecem funcionais e com foco visível.

## Validação funcional

- O estado ativo do serviço de candidaturas continua protegido por configuração. No ambiente de prévia sem backend habilitado, foi validado o cartão de indisponibilidade, sem oferecer um envio falso.
- O layout completo do formulário foi compilado e coberto pelos testes do componente. A conferência visual ao vivo do estado habilitado depende da configuração real do serviço.
- 7 suítes e 25 testes aprovados.
- Build de produção concluído com sucesso.
- `git diff --check` sem erros.

Não restam achados P0, P1 ou P2 no escopo visual e responsivo solicitado. A disponibilidade real do envio de currículos permanece uma dependência externa, preservada deliberadamente.

final result: passed

---

# Revisão visual — seção Trabalhe conosco

Referência visual: `C:/Users/anton/AppData/Local/Temp/codex-clipboard-504bda27-b778-4ab6-be12-be15268a1968.png` (1680 × 941 px), apoiada pelo recorte transparente `codex-clipboard-2d1fbc03-79c9-43b3-a53d-04b3cae9508c.png` (1448 × 1086 px).

Implementação: `http://localhost:4173/#trabalhe-conosco`.

Captura de implementação: captura renderizada no Codex In-app Browser durante esta revisão (o navegador não expôs caminho de arquivo para a captura). Região comparada: 1665 × 720 CSS px dentro de um viewport 1680 × 941, device scale 1. A diferença de 15 px corresponde à barra de rolagem do navegador.

Estado: página inicial, seção Trabalhe conosco focada, navegação fechada e botão em repouso.

## Comparação visual

A referência e a renderização foram abertas e comparadas no mesmo contexto e viewport. A composição final preserva a divisão imagem/texto, a hierarquia em roxo, o destaque amarelo, o botão em pílula, os três benefícios e a escala dominante da fotografia. O cabeçalho do site permanece acima da seção por ser parte real da página, enquanto a referência fornecida mostra apenas o bloco isolado.

Foi feita também uma verificação em 390 × 844 CSS px. O conteúdo empilha sem rolagem horizontal: texto e benefícios aparecem antes da fotografia, mantendo a chamada para ação visível e legível.

## Superfícies obrigatórias

- Tipografia: Inter local em pesos 400, 700 e 800; título com peso, entrelinha, quebra e destaque equivalentes à referência.
- Espaçamento e ritmo: grade desktop, largura máxima, alinhamento, separadores, círculos dos ícones e botão conferidos; empilhamento móvel sem overflow horizontal.
- Cores e tokens: fundo creme quase branco, roxo escuro e amarelos do destaque, botão e ícones correspondem à paleta da referência.
- Imagem e ativos: fotografia transparente fornecida pelo usuário usada diretamente, sem placeholder ou reconstrução; corte, escala e alinhamento inferior conferidos em desktop e celular.
- Conteúdo: título, parágrafo, CTA e os três benefícios reproduzem o texto da referência.

## Iterações

- Substituída a foto antiga do supermercado pelo recorte transparente fornecido.
- Ajustadas escala e posição da fotografia para aproximar cabeça, fundo amarelo e linha de base da referência.
- Reposicionado o bloco de texto e refinadas quebras, peso, entrelinha e destaque amarelo.
- Criado comportamento responsivo com CTA em largura total, benefícios empilhados e imagem preservada no celular.
- O CTA foi acionado e abriu `/trabalhe-conosco`; o título da página de destino ficou visível.
- Console verificado sem erros.

## Achados finais

Não restam achados P0, P1 ou P2. Como diferença contextual aceitável, a página real mantém o cabeçalho do site acima do bloco, ausente na arte isolada.

## Checklist de implementação

- [x] Imagem final aplicada.
- [x] CTA funcional e com foco visível.
- [x] Ícones de biblioteca, com rótulos acessíveis no grupo.
- [x] Desktop comparado no viewport da referência.
- [x] Responsividade validada em 390 × 844.
- [x] Sem erros de console.
- [x] 7 suítes e 25 testes aprovados.
- [x] Build de produção concluído.

final result: passed

---

# Revisão visual — identidade, cabeçalho e indicadores

Data: 2026-10-04.

- Referências: `codex-clipboard-3027c26e-0a89-4ffa-b65c-251a85a7992f.jpg`, `codex-clipboard-d84785bb-b56f-4995-98d1-ef073e7eb896.jpg` e `codex-clipboard-769d6733-c862-469b-822d-0d716a0750a7.png`.
- Implementação: `http://127.0.0.1:4173/`, renderizada no navegador integrado.
- Viewports: 1365 × 768 e 390 × 844 CSS px, densidade 1×.
- Estados: topo com Início ativo; rolagem sobre Ofertas; menu móvel fechado.

## Comparação e iterações

1. O primeiro build preservou uma regra antiga de cabeçalho claro com especificidade maior.
2. A camada final recebeu seletor específico para os estados inicial e rolado. A captura revisada confirmou fundo `#11110f`, borda amarela, texto branco com contorno discreto e destaque ativo amarelo.
3. Ao rolar 780 px, o destaque mudou de Início para Ofertas; a transformação calculada foi `translateY(-8px) scale(.985)` e o fundo passou para preto com 91% de opacidade.
4. Os três números do carrossel foram substituídos por pontos de 12 px; o ativo cresce para 36 px. Os rótulos acessíveis permanecem disponíveis apenas para leitores de tela.

## Superfícies obrigatórias

- Tipografia: Inter ExtraBold local aproxima o peso da marca em títulos e navegação; o arquivo rasterizado da logo foi preservado.
- Espaçamento e ritmo: cabeçalho, superfícies e raios foram normalizados; não houve transbordamento em 1365 px ou 390 px.
- Cores: preto, branco, amarelo, creme e roxo foram consolidados em tokens de marca.
- Imagens: logo e banners originais preservados sem reconstrução.
- Conteúdo: rótulos e destinos de navegação preservados; apenas a apresentação dos indicadores mudou.

## Validação

- Scrollspy confirmado em Início e Ofertas.
- Estado transformado do cabeçalho confirmado após rolagem.
- Pontos do carrossel sem números visuais, com rótulos acessíveis.
- 8 suítes e 27 testes aprovados.
- Build de produção concluído com sucesso.
- Supabase remoto atualizado e resposta pública validada com quatro categorias ordenadas.

Não restam achados P0, P1 ou P2 no escopo verificado.

final result: passed
