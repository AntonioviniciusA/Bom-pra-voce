# Revisão da seção Sobre — 2026-10-23

final result: passed

Escopo: adaptação da seção Sobre à imagem enviada, com alinhamento e leitura responsiva. Não é uma reprodução pixel a pixel de toda a página. Cabeçalho e demais seções existentes foram preservados.

## Evidências

- Referência: codex-clipboard-d6922314-440a-41bc-9e81-bfb34f63112f.png, 1672 × 941.
- Desktop: docs/sobre-layout-2026-10-23/desktop.png; viewport solicitado de 1672 × 941. Referência e captura abertas juntas para comparação. A captura inclui o cabeçalho sticky existente e o início da seção seguinte.
- Celular: docs/sobre-layout-2026-10-23/mobile.png; viewport de 390 × 844.
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
- Chrome real, 320 × 900: sem transbordamento horizontal; títulos/parágrafos alinhados na coordenada x=20, botões acomodam texto em mais de uma linha. Evidência: docs/sobre-layout-2026-10-23/chrome-320.png.
- Chrome real, 1440 × 900: imagem carregada, sem transbordamento horizontal, parágrafos de 23,76 px com entrelinha de 35,64 px. Evidência: docs/sobre-layout-2026-10-23/chrome-1440.png.
- Teclado: Tab entre CTAs com contorno sólido de 3 px; Enter na ação de ofertas navega para #promocoes. Destino #setores também conferido no Chrome nesta conversa.
- Nenhum erro capturado no console do Chrome. Nenhum achado bloqueante na seção Sobre.
- Limites: não é auditoria integral de segurança, jurídica ou de acessibilidade do site; não houve publicação nem envio ao remoto.
