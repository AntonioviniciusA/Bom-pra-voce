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
