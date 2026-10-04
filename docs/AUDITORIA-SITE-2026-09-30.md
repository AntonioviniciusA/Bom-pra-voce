# Auditoria do site Bom Pra Você — 30/09/2026

## Objetivo e autorização

Landing page informativa de supermercado físico: ajudar a consultar promoções, tirar dúvidas e planejar uma visita. O usuário confirmou que o site ainda não foi publicado e que a versão a avaliar está neste repositório. Também pediu destaque para os meios de pagamento aceitos.

**Autorizado:** analisar, testar localmente e documentar. **Não autorizado:** alterar a implementação, redesenhar, publicar ou ativar serviços. As recomendações abaixo são propostas, não mudanças aprovadas.

Base: commit `03eb07f`. Código em `bom-pra-voce-novo/`. Inspeção inicial do Git sem alterações rastreadas. Não foi consultado um site de produção.

**Complemento visual:** [percurso com oito capturas e resultados](EVIDENCIAS-AUDITORIA-2026-09-30.md). Site executado localmente com compilação de desenvolvimento bem-sucedida. Não houve alteração de código para executar a inspeção.

## Parecer

Atualização de 01/10/2026: [implementação local do site público, situação A01–A19 e evidências](IMPLEMENTACAO-SITE-PUBLICO-2026-10-01.md). Os achados abaixo preservam o diagnóstico original; não representam o estado do código após as correções.

**Plano de correção:** [implementação do frontend, fases e critérios de aceite](PLANO-FRONTEND-CORRECOES-AUDITORIA-2026-10-01.md). O planejamento não encerra os achados; a correção depende de implementação autorizada e validação.

A estrutura já contempla ofertas, setores, apresentação da loja e FAQ, mas ainda contém comportamentos de demonstração e lacunas nos dados essenciais. A prioridade recomendada é tornar confiável a jornada **consultar oferta → esclarecer dúvida → confirmar pagamento/horário → chegar à loja**.

O FAQ já explica que a compra é presencial e informa ausência de entregas e reservas. Essas informações são coerentes com a finalidade pedida, mas precisam ser confirmadas pelo responsável da loja. Não há justificativa, neste escopo, para adicionar carrinho, checkout ou cadastro obrigatório.

## Evidências e achados por prioridade

As referências abaixo são relativas a `bom-pra-voce-novo/`. “Confirmado no código” não equivale a comportamento validado no navegador ou informação comercial confirmada.

### P1 — resolver antes da primeira publicação

| ID | Achado e evidência | Consequência | Recomendação / critério de aceite |
|---|---|---|---|
| A01 | `src/Components/WorkWithUs/TrabalheConosco.jsx:201`: envio executa apenas `console.log`, alerta de sucesso e troca de tela. | Candidato acredita que a loja recebeu o currículo, sem transmissão implementada nesse fluxo. | Retirar a promessa/formulário da primeira versão ou implementar recebimento real após autorização. Só mostrar sucesso após confirmação de recebimento. |
| A02 | `src/pages/Home.jsx`: `PaymentsMethods` está comentado. `src/Components/Footer/Footer.jsx`: botão de métodos de pagamento sem ação. | O visitante não consegue consultar a lista prometida. | Área visível “Pagamentos aceitos na loja”, com texto e marcas confirmadas; navegação e FAQ apontam para ela. Não tratar imagens existentes como prova de aceitação. |
| A03 | `src/Data/TabloideData.js`: ambos os cartões usam `pdf-test.pdf`, sem campos de início/fim de validade ou condições. | Ofertas diferentes levam ao mesmo material; não existe controle de vigência no cadastro. | Cada campanha deve ter material correto, período explícito, condições e expiração. Validar também as datas eventualmente impressas na arte. |
| A04 | `src/Data/FaqData.js`: endereço e horário só aparecem como respostas; informa segunda a sábado, 8h–21h, sem domingos/feriados. `Home.jsx` não monta uma seção de localização. | Informação essencial fica escondida e incompleta; visitante pode fazer uma viagem perdida. | Mostrar endereço completo e horário em área própria, ação “Como chegar”, exceções e data de revisão. Confirmar os dados reais antes de publicar. |
| A05 | `src/Components/RoutesNavBar/RoutesNavBar.jsx:12`: navegação usa `hidden md:flex`, sem alternativa móvel no componente. | Em telas menores, desaparecem os atalhos para as seções. | Disponibilizar navegação móvel operável por toque e teclado, incluindo ofertas, pagamentos, localização e dúvidas. |
| A06 | `src/Components/Footer/Footer.jsx:57–85`: destinos `#produtos`, `#servicos`, `#contato` não correspondem aos IDs montados. Redes sociais usam `href="#"`. Telefone e e-mail são texto. | Links aparentam funcionar, mas não levam ao conteúdo ou canal esperado. | Corrigir destinos; usar apenas perfis oficiais confirmados e ações de telefone/e-mail/WhatsApp quando esses canais existirem. |
| A07 | `src/Components/TourVirtual/TourVirtual.jsx`: “Iniciar o Tour” sem ação. `src/Routes.jsx` só declara `/`; `src/pages/Maps.jsx` não é montado por essa rota. | A página promete uma experiência que o visitante não consegue iniciar. | Preferir retirar o convite da primeira publicação, mediante aprovação. Tour só deve voltar com imagens reais, navegação funcional e utilidade comprovada. |
| A08 | `src/Components/Footer/Footer.jsx`: campo de e-mail e botão “Inscrever” sem tratamento de envio. Título diz “Entre em contato via E-mail”. | Mistura contato com assinatura de promoções e não executa nenhuma dessas ações. | Escolher a finalidade. Para contato simples, apresentar canal confirmado; para assinatura, definir operação real e informar claramente o uso dos dados. |
| A09 | `src/Components/Cards/Cards.jsx`: todas as galerias começam com Hortifrut; imagens seguintes usam `via.placeholder.com`. | A galeria pode mostrar setor incorreto ou imagens indisponíveis. | Usar fotos verificadas do respectivo setor ou deixar apenas um cartão informativo sem promessa de galeria. |
| A18 | Ao abrir o primeiro tabloide no navegador local, ocorreu `Cannot use the same canvas during multiple render() operations`, com sobreposição de erro. Captura 02. | A consulta à oferta fica interrompida no ambiente de desenvolvimento. | Investigar o ciclo de renderização do visualizador; verificar a correção em desenvolvimento e na compilação de produção. Não presumir que o erro ocorre identicamente em produção. |
| A19 | Capturas 04, 06 e 07 mostram a barra fixa sobre conteúdo; no celular o banner fica parcialmente coberto. | Conteúdo e identificação de seção podem ficar ocultos. | Rever altura, fundo e espaçamento da barra, compensar destinos de navegação e verificar cabeçalhos em diferentes larguras. |

### P2 — conteúdo, acessibilidade e qualidade

| ID | Achado e evidência | Recomendação |
|---|---|---|
| A10 | FAQ de pagamentos inclui frase sobre mapa; não possui atalho no menu. | Corrigir resposta e criar acesso direto às dúvidas. Usar a mesma fonte de dados para FAQ e seção de pagamentos. |
| A11 | `public/index.html`: `lang="en"`, título “React App”, descrição padrão. | Português do Brasil, título e descrição específicos da loja, ícone/marca e metadados de compartilhamento. Endereço público e URL canônica só após definição do domínio. |
| A12 | `BannerHome.jsx`: troca automática a cada 7,5s, sem pausa. `BannerData.js`: alternativas “ ” e “aa”; versão móvel vazia e não utilizada. | Mensagem principal em texto legível, imagens adequadas ao celular, alternativas úteis e controle de pausa. Avaliar se um banner estático atende melhor. |
| A13 | Galeria e visualizador PDF não implementam gestão de foco, fechamento por Escape ou semântica completa de diálogo. Cartões de setores são `div` com clique. | Abrir por botão/link semântico, nomear controles, gerir foco e restaurá-lo ao fechar. Validar por teclado e leitor de tela. |
| A14 | Branco sobre amarelo em títulos, rodapé e botões; amarelo sobre branco em outros controles. | Medir contrastes dos estados reais e corrigir os que falharem. Não declarar conformidade WCAG por leitura de classes ou screenshots. |
| A15 | `About.jsx` promete “+20 anos”; vagas e benefícios estão fixos no código; texto de vagas fala em equipe “apaixonada por tecnologia”. | Validar história, fotos, vagas e benefícios com a loja. Revisar “Conheça Nosso Setores”, “Hortifrut”, “entraremos em conto” e rótulos. |
| A16 | PDF local tem 10.416.349 bytes (aprox. 9,93 MiB). Há banners PNG de mais de 2 MB. | Disponibilizar ofertas em conteúdo legível na página e PDF opcional, com tamanho informado. Otimizar arquivos utilizados e medir carregamento em conexão móvel. Tamanho em disco não é medição do tráfego inicial. |
| A17 | `src/App.test.js` é teste padrão “learn react”, mas `index.js` monta `AppRoutes`. | Quando houver implementação autorizada, substituir por verificações da jornada real. O teste padrão não demonstra funcionamento de ofertas, localização ou formulários. |

**Confirmação de A14:** as cores calculadas no navegador para o título do tour são branco `#FFFFFF` sobre amarelo `#FACC15`, com contraste de aproximadamente **1,53:1**. Esse par fica abaixo de 3:1 para texto grande e 4,5:1 para texto comum. [Referência W3C](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum). Medição restrita a esse par, sem certificação do restante do site.

## Estrutura recomendada da landing page

1. **Topo:** marca, identificação de supermercado físico, bairro/cidade confirmados e atalhos “Ver ofertas” e “Como chegar”. Horário resumido facilmente visível. Não inventar indicador “aberto agora” sem regras de feriados.
2. **Ofertas vigentes:** campanha, validade, produtos/condições legíveis e acesso opcional ao tabloide. Estado explícito quando não houver campanha vigente.
3. **Informações para a visita:** localização, horários completos, telefone/canal de dúvidas. Informar estacionamento, acessibilidade física ou ponto de referência apenas quando confirmados.
4. **Pagamentos aceitos:** dinheiro, Pix, débito, crédito e vales conforme confirmação; listar marcas por categoria e regras aplicáveis.
5. **Setores e loja:** resumo breve e fotos reais. O visitante deve entender o que encontra, sem depender de abrir várias galerias.
6. **Perguntas frequentes:** compras presenciais, entrega, reservas, preços/validade, horários, pagamentos e contato. Incluir troca de produtos e encomendas apenas com política confirmada.
7. **Sobre e rodapé:** história verificável, dados da loja, canais oficiais e informações de privacidade compatíveis com as funções existentes. Vagas como link secundário se houver operação real.

O tour e o recrutamento hoje ocupam espaço antes do FAQ. Recomenda-se reduzir sua prioridade para aproximar a página das necessidades de quem vai comprar presencialmente. Essa é uma proposta de organização, não resultado de pesquisa com clientes.

## Meios de pagamento: requisitos de conteúdo

Não reutilizar automaticamente a lista de logotipos de `src/Data/PaymentsData.js`: há nomes genéricos “aaa” e repetição de Mastercard. A disponibilidade do arquivo não confirma contrato/aceitação.

| Informação a confirmar | Como apresentar |
|---|---|
| Dinheiro e Pix | Nome por extenso; indicar que se refere ao pagamento no caixa. |
| Débito e crédito | Separar modalidades e listar bandeiras confirmadas, com nomes acessíveis além dos logotipos. |
| Vale-alimentação e vale-refeição | Separar categorias e verificar cada marca/modalidade; não presumir que ambas sejam aceitas. |
| Parcelamento | Informar somente regras reais: número de parcelas, compra mínima, juros e eventuais restrições. Se não houver, não prometer. |
| Aproximação/carteiras | Anunciar somente após confirmação operacional. |
| Condições de preço | Quando uma oferta depender do meio de pagamento, explicitar no próprio anúncio. |

Usar o título “Formas de pagamento aceitas na loja”. “Pagamento seguro” isoladamente sugere uma transação online que não faz parte deste site. A seção e o FAQ devem ser consistentes e ter responsável pela revisão.

## Promoções: operação recomendada

Cada campanha precisa de título, unidade aplicável, início/fim, material correto, condições, responsável e data da última revisão. Se forem publicados produtos, incluir marca, quantidade/unidade, preço e restrições reais.

Fluxo proposto: preparar → conferir com a loja → aprovar → publicar → encerrar/arquivar. Considerar fuso `America/Sao_Paulo`. A oferta vencida deixa de ser apresentada como vigente; ausência de campanha deve mostrar mensagem clara. “Enquanto durarem os estoques” não deve substituir a definição de período nem servir para resolver divergências de informação.

A escolha de ferramenta depende de quem atualizará. Se a loja precisar de autonomia, avaliar um painel simples com prévia, agendamento e expiração. Se as atualizações forem feitas por desenvolvedor, um cadastro estruturado no projeto pode bastar inicialmente. Não é necessário construir um sistema de comércio eletrônico para publicar tabloides.

## Fontes técnicas consultadas

- [Google Search Central — LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business): usar dados estruturados coerentes com os dados visíveis da loja, após confirmar endereço/horários. Não garante posição ou destaque na busca.
- [W3C WAI — Carousels](https://www.w3.org/WAI/tutorials/carousels/): referência para pausa e operação por teclado.
- [W3C WAI — Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): referência para foco, semântica e fechamento de diálogos.

Consulta em 30/09/2026. Estas fontes orientam recomendações técnicas; não comprovam os dados comerciais da loja. Este documento não é parecer jurídico, certificação de acessibilidade ou auditoria de segurança completa.

## Plano de implementação proposto — depende de autorização

1. **Validar conteúdo:** endereço, localização no mapa, horários, contatos, marcas aceitas, ofertas reais e operação de atualização.
2. **Corrigir confiança e utilidade:** ofertas vigentes, pagamentos, localização/horários, FAQ, navegação móvel e links; retirar ou concluir ações sem funcionamento.
3. **Ajustar apresentação e acessibilidade:** leitura no celular, contraste, foco, rótulos, modais, imagens e banner.
4. **Preparar publicação:** metadados, domínio, dados estruturados, desempenho e testes da jornada completa. Publicar somente com autorização específica.

## Critérios para liberar a primeira versão

- Cliente encontra ofertas, endereço, horário e pagamentos sem abrir tour ou formulário.
- Todas as informações comerciais são aprovadas pela loja e consistentes entre seções.
- Não há promessa de envio, inscrição, tour ou vaga sem operação correspondente.
- Campanha vencida não aparece como atual; PDF corresponde à campanha e abre no celular.
- Navegação funciona em 360, 390, 768, 1024 e 1440 px, sem perda de conteúdo ou rolagem horizontal indevida.
- Menu, FAQ e modais podem ser operados por teclado; foco é visível; contraste é medido; zoom de 200% é revisado.
- Links de localização, contato e redes levam aos destinos oficiais confirmados.
- Qualquer coleta futura de dados tem finalidade, destino, acesso, retenção e tratamento de falhas definidos; não inventar políticas nem contatos.
- Após publicação autorizada: verificar domínio, HTTPS, metadados, navegação e arquivos no endereço público. Validação local não comprova esses itens.

## Decisões pendentes da loja

- Quem atualiza promoções e qual frequência?
- Quais meios, bandeiras e vales são realmente aceitos? Existe parcelamento?
- Endereço, horário de domingos/feriados e contatos do código estão corretos?
- Manter recrutamento na primeira versão? Quem recebe e responde?
- Há fotos reais autorizadas para a página? O tour atende a uma necessidade concreta?

As respostas não bloqueiam esta documentação, mas são necessárias antes de publicar informações como fatos.
