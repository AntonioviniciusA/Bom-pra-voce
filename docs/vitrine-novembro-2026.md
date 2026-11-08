# Black Friday — implementação e operação

Atualização: 28/10/2026. Implementação local; sem publicação do frontend ou de ofertas comerciais nesta entrega.

Atualização de 29/10/2026: a página inicial também apresenta a identidade do Esquenta Black Friday de 29/10 a 22/11 quando não houver campanha publicada; de 23 a 29/11 apresenta a Semana Black Friday. Antes de 01/11, a mensagem informa que o Esquenta começará nessa data. A vitrine continua vazia até a publicação de produtos e preços reais. Campanhas publicadas e válidas continuam tendo prioridade sobre essa apresentação de preparação.

## Períodos confirmados

| Campanha | Primeiro dia | Último dia, inclusive |
|---|---|---|
| Esquenta Black Friday | 01/11/2026 | 22/11/2026 |
| Semana Black Friday | 23/11/2026 | 29/11/2026 |

Horário de Brasília. O dia 30 não pertence à Semana Black Friday. São duas campanhas independentes com a mesma decoração `black-friday`. O botão **Preparar novembro** cria apenas os rascunhos ausentes e preserva nomes, produtos e datas já editados. O rascunho antigo `novembro-2026`, se existir, é mantido; não é silenciosamente convertido nem publicado.

O site mostra somente campanhas publicadas e válidas. A página `/ofertas/novembro` aceita campanhas cujo período cruza novembro de 2026. Sem campanha publicada, a mensagem de preparação usa o relógio retornado pelo servidor: Esquenta entre 1 e 22, Semana entre 23 e 29, encerramento a partir de 30. Nenhum preço ilustrativo é enviado ao site real.

## Colocar produtos no painel

1. Na pasta `painel-local`, execute `npm start`. Ele compila e abre o painel.
2. Entre com sua conta e código do autenticador. Em **Ofertas → Vitrine de produtos → Campanhas**, clique em **Preparar novembro**.
3. Escolha a campanha. Vá a **Produtos → Cadastrar produto**. Informe nome, código interno, GTIN ou motivo de PLU, marca, variante, conteúdo e categoria.
4. Escolha a foto correspondente. Informe origem, autorização e confirme a revisão. Confira a imagem inteira na prévia.
5. Clique em **Guardar no rascunho** e **Incluir na campanha**. Na aba Campanhas, preencha preço e unidade; ajuste ordem e condições.
6. Abra **Conferir prévia do site**, alternando Notebook e Celular. Clique em **Salvar rascunhos locais** para persistir neste computador.
7. Repita para a segunda campanha. O mesmo produto pode participar de ambas com preços independentes.
8. Quando os dados reais estiverem conferidos, use **Conferir estado no site** e **Publicar campanha no site**. A publicação exige conta autorizada, AAL2 e ausência de pendências. Publicar uma campanha futura não antecipa sua validade.

As páginas `seasonal-visual.html` são demonstrações: não servem para cadastrar produtos reais, salvar ou publicar. Use o Electron para manter os rascunhos no perfil do aplicativo. Os rascunhos ainda não são sincronizados entre computadores.

## Referência e avaliação

Abra a [comparação visual completa](vitrine-black-friday-comparacao.html) para conferir a prancha e as capturas atuais juntas.

Fonte de direção visual: [prancha completa Black Friday](pranchas-ofertas-sazonais/18-black-friday.png), com notebook, celular e Story. A data ilustrativa da prancha (23–27) foi substituída pelo período confirmado (23–29). Logo original do supermercado preservado.

| Estado atual | Desktop | Celular |
|---|---|---|
| Esquenta | [Captura](../bom-pra-voce-novo/src/images/offer-themes/black-friday/evidencias/atual/esquenta-desktop.png) | [Captura](../bom-pra-voce-novo/src/images/offer-themes/black-friday/evidencias/atual/esquenta-mobile.png) |
| Semana | [Captura](../bom-pra-voce-novo/src/images/offer-themes/black-friday/evidencias/atual/semana-desktop.png) | [Captura](../bom-pra-voce-novo/src/images/offer-themes/black-friday/evidencias/atual/semana-mobile.png) |
| Painel, rascunhos | [Captura](../bom-pra-voce-novo/src/images/offer-themes/black-friday/evidencias/atual/painel-desktop.png) | [Captura](../bom-pra-voce-novo/src/images/offer-themes/black-friday/evidencias/atual/painel-mobile.png) |

Comparação: fundo violeta/preto, título amarelo inclinado, faixas roxas, preços roxos sobre pincelada amarela, quatro cards no desktop e dois no celular. Corrigido o seletor de identidade que só funcionava para `id="promocoes"`: campanhas com IDs individuais agora recebem cores, fontes e variáveis corretamente. Busca por código DEMO-2 retornou somente Feijão carioca. Console da demonstração sem erros capturados.

Diferenças deliberadas: os produtos da prancha são ilustrativos; as capturas usam espaços de foto pendente porque o operador ainda cadastrará as fotos reais. A fonte é a Barlow Condensed instalada, o logo é o original e os ornamentos são os assets preparados, não uma reprodução idêntica de pixels. O botão adicional Preparar Story pertence ao fluxo implementado e aparece desabilitado na demonstração. O gerador existente exporta PNG 1080 × 1920, mas sua composição não foi equiparada à coluna Story da prancha nesta revisão; compartilhamento no Instagram continua dependendo de validação no dispositivo.

## Imagens e política de substituição

Consulte o [índice por tema](vitrine-imagens.md). Decorações, originais e pranchas ficam juntos em `src/images/offer-themes/<tema>/`. Recursos comuns ficam em `compartilhados/`. As referências completas permanecem em `referencias/`; novas capturas substituem as anteriores em `evidencias/atual/`.

Foram removidos 14 prints de Black Friday substituídos. O registro de substituições fica em `tools/retired-showcase-captures.json`. Os documentos antigos permanecem como relatos datados, com aviso quando seus links passaram a apontar ao estado atual. Capturas de outros temas não foram descartadas sem substitutos.

## Verificação e limites

- Site: 60 testes em 15 suítes passaram, incluindo limites dos períodos em Brasília e preservação dos rascunhos.
- Painel: 42 testes em 12 arquivos passaram, incluindo preparação de novembro, edição e publicação simulada.
- Compilações de site e painel passaram. Permanecem avisos anteriores de tamanho do pacote do painel, base de navegadores e APIs antigas do servidor de desenvolvimento.
- Verificação de integridade: 371 imagens previamente movidas preservam os hashes; as 14 removidas estão registradas separadamente.
- Login real com a conta do operador, publicação de produtos aprovados e Stories no Instagram não foram executados. Nenhum instalador foi gerado e não houve push/deploy.

## Diagnóstico do localhost e do login

Node instalado: v24.11.1; npm 11.19.0. Ambos os projetos compilaram e passaram nos testes com essa instalação. Não foi comprovada falha causada pela versão do Node.

Nesta execução, processos iniciados no ambiente restrito apresentaram timeouts de rede e erros EPERM ao renomear arquivos temporários. Os testes passaram fora desse ambiente. A prévia na porta 5176 respondeu HTTP 200 e foi inspecionada visualmente. A porta 3000 posteriormente respondeu HTTP 200, e a página real de novembro abriu com o estado vazio esperado. A tentativa de reiniciar o site encontrou a porta já ocupada; não foi confirmado qual processo passou a atendê-la.

O Supabase está ativo e `/auth/v1/settings` respondeu HTTP 200 com a configuração pública local fora do ambiente restrito. A falha ENOTFOUND observada dentro desse ambiente não prova falha de DNS do Windows. A captura original do erro de login não foi reproduzida com credenciais reais; não declarar o login corrigido apenas com esse teste de conexão.
