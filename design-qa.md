> Atualização de evidências em 28/10/2026: prints de Black Friday substituídos foram removidos. Links de imagem agora apontam ao estado atual; o relato datado abaixo é histórico. As pranchas de referência permanecem preservadas.

# Revisão da seção Sobre — 2026-10-23

final result: passed

Escopo: adaptação da seção Sobre à imagem enviada, com alinhamento e leitura responsiva. Não é uma reprodução pixel a pixel de toda a página. Cabeçalho e demais seções existentes foram preservados.

## Evidências

- Referência: codex-clipboard-d6922314-440a-41bc-9e81-bfb34f63112f.png, 1672 × 941.
- Desktop: bom-pra-voce-novo/src/images/library/docs/sobre-layout-2026-10-23/desktop.png; viewport solicitado de 1672 × 941. Referência e captura abertas juntas para comparação. A captura inclui o cabeçalho sticky existente e o início da seção seguinte.
- Celular: bom-pra-voce-novo/src/images/library/docs/sobre-layout-2026-10-23/mobile.png; viewport de 390 × 844.
- Imagem original existente reutilizada; corte com object-fit sem distorção. Fundo liso preservado, sem os ornamentos amarelos da referência.

## Revisão visual

- Tipografia: título destacado e com quebra natural; parágrafos alinhados à esquerda, 17 px e entrelinha de 25,5 px no celular. Sem justificação.
- Espaçamento: título, textos e ações compartilham a mesma margem; duas colunas equilibradas no desktop e uma coluna abaixo de 1000 px.
- Cores: fundo creme, título azul escuro, textos cinza e ação primária amarela.
- Imagem: proporção próxima à referência, cantos arredondados e selo de qualidade legível.
- Conteúdo: parágrafos preservados; ação secundária leva às ofertas; imagem descrita como ilustração no texto alternativo.
- Não foram encontrados problemas P0/P1/P2 na seção adaptada. Diferenças assumidas: tipografia do projeto, imagem existente, cabeçalho existente e ausência dos ornamentos de fundo.

## Validação

- Build de produção: passou.
- App.test.js: 6/6 passaram. A execução registrou uma resposta externa 403 no jsdom, sem falha dos testes.
- Navegador: ambos os CTAs clicados, destinos #setores e #promocoes confirmados.
- Celular: largura do documento 375 px para viewport de 390 px (barra vertical incluída), sem transbordamento horizontal; textos e botões inspecionados visualmente.
- Console do navegador: nenhum erro capturado.
- Sem publicação. Alterações locais paralelas preservadas.

Base de leitura: https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation . Esta revisão não declara conformidade integral com WCAG AAA.

## Auditoria adicional no Google Chrome — 2026-10-23

- Escopo inicial: About.jsx, About.css e evidências desta seção. O usuário posteriormente ampliou o escopo para todas as alterações do site; a auditoria complementar está em docs/AUDITORIA-COMMITS-SITE-2026-10-23.md.
- Revisão de código: CSS limitado a #sobre, destinos #setores/#promocoes existentes, sem nova dependência, chamada de rede ou tratamento de dados pessoais.
- Suíte completa executada: 10 conjuntos e 44 testes passaram. Avisos existentes: requisição externa 403 em App.test.js e future flags do React Router nos testes de preferências. Não são evidência de funcionamento de serviços externos.
- Compilação de produção aprovada anteriormente nesta mesma sessão, sem alterações posteriores no comportamento do componente.
- Chrome real, 320 × 900: sem transbordamento horizontal; títulos/parágrafos alinhados na coordenada x=20, botões acomodam texto em mais de uma linha. Evidência: bom-pra-voce-novo/src/images/library/docs/sobre-layout-2026-10-23/chrome-320.png.
- Chrome real, 1440 × 900: imagem carregada, sem transbordamento horizontal, parágrafos de 23,76 px com entrelinha de 35,64 px. Evidência: bom-pra-voce-novo/src/images/library/docs/sobre-layout-2026-10-23/chrome-1440.png.
- Teclado: Tab entre CTAs com contorno sólido de 3 px; Enter na ação de ofertas navega para #promocoes. Destino #setores também conferido no Chrome nesta conversa.
- Nenhum erro capturado no console do Chrome. Nenhum achado bloqueante na seção Sobre.
- Limites: não é auditoria integral de segurança, jurídica ou de acessibilidade do site; não houve publicação nem envio ao remoto.

# Vitrine sazonal — correção de 27/10/2026

final result: blocked

Escopo desta avaliação: fidelidade do planejamento completo de 21 temas. Não substitui a revisão da seção Sobre acima.

Outubro Rosa e Crianças receberam correções de estrutura, tipografia, categorias, preço e rodapé. Evidências combinadas, com referência e captura na mesma imagem: bom-pra-voce-novo/src/images/library/docs/vitrine-sazonal-2026-10-24/correcao-2026-10-26/comparacao-outubro.png, comparacao-mobile.png, comparacao-criancas.png e comparacao-criancas-mobile.png. A tabela do painel está em painel-outubro.png. Capturas em conteúdo fixo de 1280 e 390 px.

P2 ainda aberto no escopo completo: os outros 19 temas têm recursos iniciais, mas não passaram por correção e comparação individual com suas pranchas. Não declarar o conjunto visualmente aprovado. Não há bloqueio técnico que exija autorização adicional.

Limites intencionais: fotos de produtos fora do escopo autorizado; logotipo original mantido; preços apenas na demonstração isolada, retirados da prancha; datas como dados editáveis; arte decorativa reconstruída, sem promessa de identidade pixel a pixel. Publicação e Stories permanecem pendentes no planejamento.

Verificações: painel 21 testes em 7 arquivos passaram; teste focado da vitrine passou; build do painel passou com aviso de pacote maior que 500 kB. Busca DEMO-2 no navegador retornou somente Feijão carioca. Não houve publicação remota.

Relatório detalhado: docs/vitrine-sazonal-2026-10-24/correcao-2026-10-26/REVISAO.md. A composição anterior foi explicitamente marcada como rejeitada/superada.

# Novembro — integração de 27/10/2026

final result: blocked

Página real /ofertas/novembro e atalho Preparar novembro no painel implementados. Testes: painel 22/22; site focado 2/2. Arte Black Friday otimizada para WebP (60.652 bytes). A página real usa estado de preparação sem ofertas fictícias.

Pendente: conferência visual da integração final, pois o navegador integrado não iniciou mesmo após reinicialização. As imagens black-friday-desktop/mobile são capturas anteriores da demonstração e não comprovam a nova página. Relatório: docs/vitrine-sazonal-2026-10-24/NOVEMBRO-IMPLEMENTACAO-2026-10-27.md. Nenhuma publicação realizada.

# Black Friday 3D — 27/10/2026

final result: blocked

Carrinho e brilhos 3D transparentes gerados a partir da prancha 18, inspecionados e integrados ao título de Black Friday no componente compartilhado pelo site e painel. Movimento em transform com amplitude de 1,5 a 5 px, ciclos suaves de 5,8 a 7 segundos; movimento reduzido desativa as animações. Ornamentos decorativos sem interação ou foco.

Pendente: inspeção da composição final animada no navegador, que continua falhando na inicialização. Não há captura nova dessa integração. Detalhes e arquivos em docs/vitrine-sazonal-2026-10-24/BLACK-FRIDAY-3D-2026-10-27.md.

## 2026-10-27 — Correção do cabeçalho Black Friday

Escopo: corrigir título, carrinho e efeitos rejeitados, preservando o cadastro e o estado vazio da rota pública. Fonte: bom-pra-voce-novo/src/images/offer-themes/black-friday/referencias/18-black-friday.png.

- Removidos os dois ornamentos de aparência plástica. Carrinho agora usa o ícone ShoppingCart da biblioteca instalada, junto ao texto; raios finos foram gerados com fundo transparente e otimizados em WebP.
- Cabeçalho reorganizado em logo + título, com busca abaixo à direita; título ampliado e inclinado, profundidade curta. Movimento de 2–3 px apenas nos ornamentos; respeita prefers-reduced-motion.
- Verificação real no Chrome: rota /ofertas/novembro; prévia local do painel em /seasonal-visual.html?theme=black-friday&panel, alternância Notebook/Celular. O painel foi verificado com dados demonstrativos, sem salvar ou publicar campanhas.
- Evidências: bom-pra-voce-novo/src/images/offer-themes/black-friday/evidencias/atual/semana-desktop.png, novembro-mobile.jpg, painel-novembro-desktop.jpg, painel-novembro-mobile.jpg e comparacao-cabecalho.png (referência acima, implementação abaixo).
- Comparação: o título recuperou destaque, carrinho acompanha as letras e raios não invadem a marca. Busca e ornamentos não se sobrepõem nas capturas revisadas. Mantida a marca original do site, cujo desenho e proporção interna diferem da marca ilustrada na prancha. Fundo e tipografia são aproximações, não reprodução pixel a pixel.
- Limite: comparação integral da vitrine continua pendente das fotos aprovadas. Rota pública continua com ofertas em preparação e sem datas confirmadas; não foram publicados preços ilustrativos.
- Testes focados: 2/2 passaram. Build do painel passou. Servidor React compilou sem erros.

Resultado do escopo de correção dos ornamentos/cabeçalho: verificado no Chrome.
Resultado da fidelidade integral à prancha: ainda parcial (marca, fundo e conteúdo diferem).
final result: blocked
Bloqueio para aprovação integral: estados e conteúdo da prancha e da rota pública não são equivalentes; não declarar reprodução integral aprovada.


# Black Friday — revisão atual de 28/10/2026

final result: passed

Escopo: vitrine web e painel de preparação de novembro, com fotos ainda a cadastrar pelo operador. Não declara aprovação visual dos outros temas, da composição do Story ou de publicação comercial.

Fonte visual: bom-pra-voce-novo/src/images/offer-themes/black-friday/referencias/18-black-friday.png (1774 × 887, prancha composta com notebook, celular e Story). Capturas: offer-themes/black-friday/evidencias/atual/semana-desktop.png (1366 × 1000), semana-mobile.png (390 × 1100), esquenta-desktop.png, esquenta-mobile.png, painel-desktop.png e painel-mobile.png, todas sob bom-pra-voce-novo/src/images/. Viewports CSS 1366 × 1000 e 390 × 1100, imagens em 1 pixel por CSS pixel. A prancha contém miniaturas, não é uma captura em escala 1:1; comparação por regiões e proporções. Referência completa e ambas as capturas foram abertas juntas na mesma avaliação.

Estado: demonstração local, quatro itens ilustrativos sem foto aprovada; produtos reais não foram criados. A diferença de fotos é intencional. Datas e títulos seguem a decisão atual do usuário, não os exemplos da prancha.

## Achado, correção e nova comparação

P2 corrigido: o seletor base exigia id promocoes, mas campanhas usam IDs individuais. Isso removia variáveis de cor e herança de fonte, escurecendo preços e alterando os botões. Seletor corrigido para a classe product-offers e identidade Black Friday explicitada. Novas capturas mostram preço roxo/amarelo e controles com a fonte condensada. Prints intermediários foram sobrescritos, conforme a política solicitada.

- Tipografia: Barlow Condensed existente, título inclinado com fase em linha própria; sem corte do título em 390 px. Fonte e logo originais substituem as aproximações presentes na prancha.
- Layout: quatro colunas no desktop, duas no celular, categorias em rolagem horizontal, busca e compartilhamento acessíveis. Documento com largura igual ao viewport no teste de 390 px. Escala de 80% preexistente preservada.
- Cores: roxo, amarelo, preto/violeta e fundo creme; restauração das variáveis resolveu a divergência encontrada.
- Imagens: moldura e raios existentes preservados; logo original intacto. Fotos comerciais aguardam cadastro, não foram extraídas da prancha nem inventadas.
- Conteúdo: Esquenta 01–22 e Semana 23–29/11/2026; unidade de preço explícita; períodos antigos não foram reaproveitados como regra.
- Interações: busca DEMO-2 isolou Feijão carioca, limpeza de filtros restaurou os quatro itens; Preparar novembro criou as duas fases; prévia e campos de datas conferidos no painel. Console da demonstração sem erros capturados.

Comparação focal: título/data, categorias e preço foram inspecionados nas capturas de desktop e celular em resolução original; a prancha e as capturas foram apresentadas no mesmo conjunto de comparação. Nenhum P0/P1/P2 remanescente no escopo da composição web com fotos pendentes. P3: ornamentos não são cópia pixel a pixel; acrescentar fotografias reais permitirá avaliar a composição comercial completa.

Testes: site 60/60; painel 42/42; builds aprovados. Login real, publicação com AAL2 e compartilhamento no Instagram não foram exercitados. Guia: docs/vitrine-novembro-2026.md.

# Painel local de campanhas e produtos — 29/10/2026

final result: passed

Fonte visual: `docs/painel-novembro-2026-10-29/01-campanhas.png` a `06-produtos-da-campanha-mobile.png`. As cinco referências desktop medem 1487 × 1058 px; a referência mobile mede 853 × 1844 px. Estado pretendido: campanhas de novembro, catálogo, cadastro, edição mobile e conferência/publicação.

Implementação: `painel-local/src/OfferCampaignPanel.jsx` e `OfferCampaignPanel.css`; rota isolada de avaliação `painel-local/panel-visual.html`. A implementação usa os temas, a prévia, as validações, a persistência IndexedDB, a preparação de novembro e a publicação versionada reais do projeto.

Evidência disponível: todas as seis referências foram abertas em resolução original e inspecionadas. A implementação foi renderizada no navegador integrado em `http://127.0.0.1:5175/panel-visual.html`, primeiro em desktop e depois com viewport explícito de 390 × 844 px. A largura mobile foi medida no documento: `innerWidth=390` e `scrollWidth=390`, sem estouro horizontal. A aba 3 foi mantida aberta como prévia local para conferência.

Verificação funcional: o percurso Campanhas → Calendário → Produtos → Cadastrar produto → Campanha → Conferência foi exercitado no navegador. Foram confirmados os dois rascunhos de novembro, catálogo vazio, formulário com identidade/GTIN, seletor de temas reais, salvamento local, prévia, checklist e controles de publicação. A suíte completa aprovou 59 testes em 15 arquivos; o build Vite foi aprovado. O limite de teste foi ampliado para dez segundos porque um teste antigo de controles excedia cinco segundos apenas na execução paralela completa e continuava passando isoladamente.

Superfícies verificadas no navegador:

- Tipografia: Inter e hierarquia roxa do painel, preservando fontes próprias apenas dentro da prévia real do site.
- Espaçamento: cartões de campanha, tabela/catálogo, formulário em duas colunas, conferência com painel lateral e reorganização abaixo de 1000/700 px.
- Cores: roxo, amarelo de aviso, verde de sucesso, vermelho de erro e fundo branco conforme as referências.
- Imagens: recursos reais dos temas e fotos cadastradas; nenhuma imagem fictícia das pranchas foi incorporada ao produto.
- Conteúdo: textos operacionais reais, limite correto de 10 MB com otimização até 2 MB e separação explícita entre salvar localmente e publicar.

Correções após a comparação: o recurso largo do tema foi removido do cabeçalho operacional e o cartão passou a usar a miniatura própria; no mobile, a navegação virou uma grade de três colunas e o contêiner passou a impedir estouro lateral. Nenhum P0/P1/P2 permaneceu no escopo local. P3: a miniatura Black Friday é propositalmente decorativa e não reproduz o banner completo da referência.

Console: não surgiram novos erros durante o percurso local. O histórico da aba continha quatro registros `session-required` anteriores, provenientes de tentativas de consultar o estado protegido do servidor sem sessão. O painel não faz essa consulta ao abrir a revisão; ela só ocorre por ação explícita em “Conferir estado no site”. Publicação remota, retirada da vitrine, login AAL2 e validação comercial com produtos reais não foram executados e permanecem fora desta aprovação local.

## Correção de produto sem variantes e revisão Black Friday — 30/10/2026

final result: passed

Fonte visual: `bom-pra-voce-novo/src/images/offer-themes/black-friday/referencias/18-black-friday.png`, 1774 × 887 px. Implementação comparada: `bom-pra-voce-novo/src/images/offer-themes/black-friday/evidencias/atual/semana-desktop.png`, 1366 × 1000 px, e `semana-mobile.png`, 390 × 1100 px. A prancha é uma composição reduzida de notebook, celular e Story; as capturas foram avaliadas em suas larguras CSS documentadas e não redimensionadas como se fossem um recorte 1:1 da prancha.

Evidência combinada: `painel-local/black-friday-qa.html`, aberta em `http://127.0.0.1:5175/black-friday-qa.html`, apresentou a fonte e as duas capturas atuais na mesma vista. Estado: Semana Black Friday, quatro produtos demonstrativos, fotos ainda não aprovadas e valores explicitamente marcados como não publicados. A rota isolada `seasonal-visual.html?theme=black-friday&phase=semana&device=desktop` foi renderizada novamente; navegação e console foram verificados, sem erros ou avisos.

Correção funcional: produtos sem variantes agora exibem `GTIN do produto`; a seção de variantes começa vazia e marcada como opcional. Só passa a exigir nome e GTIN por variante depois de `Adicionar variante`. Rascunhos antigos contendo uma única variante completamente vazia são normalizados. A validação de dígito verificador e duplicidade de GTIN permanece ativa. Evidência no navegador: formulário novo mostrou o campo `GTIN do produto` e nenhuma `Variante 1` obrigatória.

Fidelidade visual:

- Tipografia: Barlow Condensed mantém a hierarquia branca/amarela do título e os preços roxos sobre pincelada amarela. `Semana` e o período atual são dados da campanha, não texto fixo do tema.
- Espaçamento: quatro cards no notebook e duas colunas no celular; busca, filtros horizontais e rodapé compacto preservam a estrutura da prancha. Nenhum estouro próprio do componente foi observado na captura normalizada; a barra vista na página de avaliação vem do iframe fixo de 1280 px dentro de uma aba menor.
- Cores: roxo quase preto, violeta, amarelo elétrico, branco e creme coincidem com a direção definida.
- Imagens: logo e decoração reais estão presentes. A ausência de fotografias nos cards é um estado intencional de segurança (`Aguardando cadastro e revisão`), não uma divergência a preencher com imagens fictícias.
- Conteúdo: títulos e datas refletem a campanha configurada. Preços da demonstração continuam identificados como ilustrativos e não publicados.

Comparação histórica: a falha P1 do formulário era a criação automática de `Variante 1`, que tornava impossível concluir um produto único. Ela foi removida, o caso sem variantes recebeu campo próprio e a nova evidência no navegador confirmou o estado corrigido. Nenhum P0/P1/P2 visual permanece. P3: com fotos reais aprovadas, repetir a comparação comercial para avaliar recorte, escala e equilíbrio dos cards; o Story continua dependente de uma foto aprovada.

Verificação: 61 testes em 15 arquivos aprovados e build Vite aprovado. O GTIN `7896422000109` visível no anexo não passa no cálculo de dígito verificador atual; a correção não transforma esse código em GTIN válido. Se ele for apenas código interno, deve permanecer no campo correspondente e o GTIN real deve ser informado separadamente.
