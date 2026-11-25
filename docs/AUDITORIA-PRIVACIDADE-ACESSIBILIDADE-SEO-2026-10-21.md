# Auditoria do site Bom Pra Você — 21/10/2026

Escopo: `bom-pra-voce-novo`, rotas públicas e inspeção do contrato local de candidaturas. Alterações locais, sem publicação, envio de currículos ou modificação do banco de produção. A tentativa de leitura do domínio pela ferramenta de pesquisa não teve sucesso; a avaliação funcional foi feita no build local. Não é certificação de conformidade jurídica ou WCAG.

## Dados confirmados pelo responsável nesta conversa

- Domínio: https://www.bompravocesupermercado.com.br/.
- QS 118, conjunto 6, lote 2, Samambaia Sul, Brasília–DF.
- Segunda a sábado 08h–21h; domingo 08h–20h. Feriados continuam sujeitos a consulta.
- Contato geral: roseanyleite75@gmail.com, atendido pela gerente local.
- Currículos e solicitações de exclusão: antoniovinicius_@outlook.com.
- Razão social, CNPJ e CEP foram preservados da configuração existente; não houve consulta cadastral externa nesta auditoria.

## Privacidade e termos

| Achado | Correção / estado |
|---|---|
| Google Maps incorporado automaticamente | Bloqueado até permissão específica. Rejeitar e permitir têm a mesma apresentação. Endereço e link externo continuam disponíveis. |
| Não havia gestão de preferências | Escolha versionada por navegador, validade de 180 dias, falha de armazenamento tratada e reabertura no rodapé. Revogar desmonta o iframe. Cookies já definidos pelo Google precisam ser removidos no navegador. |
| Texto “ao enviar, você concorda” | Substituído por informação de finalidade e acesso ao aviso. Não se inventou consentimento genérico ou base legal. |
| Aviso muito resumido | Incluídos dados solicitados, campos opcionais, fornecedores técnicos, armazenamento local, serviços externos, direitos e canais. |
| Campos e instruções desnecessariamente amplos | Endereço apresentado como cidade/bairro; orientação para não enviar CPF/RG/dados sensíveis. Removida promessa de arrastar arquivo que não possuía implementação. |
| Ausência de termos | Criada rota `/termos`, com identidade da loja, uso informativo, ofertas, candidaturas, links externos e contato; sem exclusão de direitos do consumidor. |
| Prazo de seis meses | O banco local calcula `delete_after`; a busca nas funções locais não encontrou executor de `retention_delete`. Isso não comprova nem exclui a existência de rotina externa. A operação continua pendente de comprovação. |

Inventário identificado no código:

- `bpv-privacy-v1`: armazenamento local da escolha de mapa, booleano, versão e data; 180 dias.
- `bpv:public-promotions:v1`: cache local de panfletos públicos; versão e vigência consultadas no servidor antes de usar; sem dados de candidaturas. Não tem prazo fixo de remoção no disco, podendo permanecer até atualização/limpeza do navegador.
- Google Maps: externo e opcional; bloqueado inicialmente.
- Cloudflare Turnstile: proteção antispam do formulário habilitado; não foi classificado como publicidade. Inventário de cookies do ambiente publicado e configuração de pre-clearance precisam de verificação real.
- Supabase: consulta de ofertas e processamento de candidaturas; sessão de envio mantida em memória, sem persistir currículo no armazenamento local do navegador.
- Não foram encontradas integrações explícitas de analytics/publicidade no frontend auditado. Isso não comprova ausência de injeções/configurações na hospedagem.

### Pendências jurídicas e operacionais

1. Definir e documentar a hipótese legal por finalidade: seleção para uma vaga, banco de talentos futuro, segurança e eventual conservação excepcional. Consentimento não é automaticamente a base adequada para tudo. Não há comprovação desse inventário no código.
2. Validar necessidade de nascimento e demais campos opcionais, incluindo tratamento de candidatos menores. O site não deve solicitar informações sensíveis desnecessárias no PDF.
3. Demonstrar a exclusão efetiva após seis meses: registros, objetos privados, exportações, cópias baixadas e regras de backup. Definir responsável, periodicidade, exceções e evidência de execução.
4. Formalizar acesso do RH, atendimento aos titulares, segurança, resposta a incidentes, fornecedores, regiões de processamento e mecanismos aplicáveis a transferências internacionais.
5. Revisar os novos textos com o responsável pelo tratamento antes da publicação. A flag preexistente `privacy.approved` não comprova aprovação jurídica dos acréscimos desta auditoria.
6. Na publicação coordenada, configurar `PRIVACY_NOTICE_VERSION=2026-10-21` no serviço de candidaturas. O frontend agora envia essa versão; sem alinhamento, o backend rejeita o envio com `PRIVACY_NOTICE_CHANGED`. Nenhum segredo remoto foi alterado aqui.

## Acessibilidade

Objetivo de referência: WCAG 2.2 AA. A base já possuía idioma pt-BR, link para pular conteúdo, rótulos e vários textos alternativos.

Correções implementadas:

- Pausa permanente do carrossel, além da pausa por foco e respeito a movimento reduzido.
- Área dos seletores ampliada para ao menos 24 × 24 CSS px.
- Superfícies sólidas para contraste previsível do cabeçalho e legendas; foco visível, placeholder legível e modo de cores forçadas.
- Lista de setores preserva itens sem substituir o papel de `li` por botão. Galeria isola o conteúdo de fundo com `inert`, contém Tab/Shift+Tab, fecha com Escape e devolve foco.
- Seletores de panfletos deixam de fingir abas sem painéis: são botões de seleção com `aria-pressed`.
- Upload com indicação visível de foco; erro de telefone associado; destino da verificação de segurança acessível pelo resumo de erros; indicação de novas abas.
- Imagens informativas têm `alt`; imagens decorativas/repetidas mantêm `alt=""` intencionalmente.

Limites que impedem declarar acessibilidade completa:

- Panfletos publicados como imagem/PDF precisam de equivalente textual completo: produto, marca, quantidade/unidade, preço, validade e condições. Título/resumo existentes não garantem essa equivalência. Não foram inventados preços nem transcritos produtos sem fonte validada.
- PDFs externos precisam de estrutura acessível, ordem de leitura e texto selecionável. O frontend não corrige retroativamente PDFs.
- Validar manualmente com NVDA/VoiceOver, zoom 200%/400%, preferência de movimento reduzido, alto contraste, formulário habilitado, erros, recibo e Turnstile real. Teste automatizado não substitui essas verificações.
- Verificar estados reais de campanhas e temas personalizados. A auditoria de navegador usa ofertas indisponíveis e não envia dados ao backend.

## Busca local, Google e IA

- Metadados por rota, canonical no domínio confirmado e `noindex` no estado de rota desconhecida do cliente.
- `GroceryStore` em JSON-LD com identidade, endereço, horários, imagem e link do mapa, sem avaliações, coordenadas, telefone ou preços inventados.
- Build gera HTML institucional para início, candidaturas, privacidade e termos. Conteúdo principal é legível sem executar JavaScript; ofertas e habilitação do formulário continuam consultadas ao vivo.
- Sitemap com as quatro rotas; `robots.txt` permite rastreamento e informa o sitemap. Robots não protege dados privados.
- Mesmos dados essenciais para pessoas e robôs. Não foram criadas páginas artificiais por bairro, avaliações falsas ou promessas de primeiro lugar.

Pendências externas: confirmar acesso/validação do Perfil da Empresa no Google; categoria principal, endereço, marcador, contatos, horários especiais e fotos atuais; conferir consistência entre perfil e site; validar sitemap e URLs no Search Console e JSON-LD no Rich Results Test. Publicar e inspecionar cada URL diretamente, inclusive sem JavaScript, e conferir que a hospedagem serve os HTMLs específicos sem reescrever tudo para a página inicial. Rota inexistente deve retornar HTTP 404 na hospedagem: `noindex` no cliente não substitui esse status.

O Google informa que não exige arquivo especial ou marcação exclusiva para seus recursos de IA. Conteúdo textual acessível, rastreável e coerente com os dados estruturados é o caminho recomendado. Não foi incluído `llms.txt` como suposta garantia de indexação. Busca local depende também de relevância, distância e proeminência; código não garante classificação.

## Fontes oficiais consultadas

- LGPD, especialmente arts. 6, 7, 9, 18 e 46: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- ANPD, Guia de Cookies: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Contraste mínimo: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
- Teclado: https://www.w3.org/WAI/WCAG22/Techniques/general/G202
- Google, negócios locais: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google, recursos de IA: https://developers.google.com/search/docs/appearance/ai-features
- Google, classificação local: https://support.google.com/business/answer/7091
- Cloudflare, pre-clearance e cookies: https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/pre-clearance/

## Verificação

Resultados do navegador e capturas: `docs/validacao-acessibilidade-2026-10-21/`. O script `scripts/accessibility-audit.cjs` testa as quatro rotas em 1440, 390 e 320 px, WCAG automatizada, ausência de chamada ao mapa sem permissão, teclado na galeria e HTML sem JavaScript. Requer Playwright e Edge; `axe-core` está disponível nas dependências existentes.

O build inicial com mapas de código e plugin de lint ficou sem concluir e foi interrompido. A compilação de verificação usa `GENERATE_SOURCEMAP=false` e `DISABLE_ESLINT_PLUGIN=true`, com ESLint executado separadamente. Há aviso de base Browserslist desatualizada; atualização de dependências não fez parte desta correção.

Os testes iniciais esbarraram no cache temporário restrito do Windows; foram repetidos com cache no projeto. Não confundir falha do ambiente com resultado funcional. Não houve deploy, push ou commit nesta tarefa. Alterações preexistentes em banner, teste do banner, CSS global e imagem não foram descartadas.

### Resultado final da validação local

- 43 testes aprovados em 10 suítes, incluindo rejeição/permissão/revogação do mapa, armazenamento inválido/expirado, pausa persistente, contrato de candidaturas e canonical em rota com barra final.
- Build otimizado e geração das quatro páginas estáticas concluídos com sucesso. ESLint executado separadamente sobre os componentes alterados.
- Edge headless com axe-core: 12 combinações (4 rotas × 3 larguras), zero violações automáticas e zero transbordamentos horizontais nos estados testados.
- Teclado: abrir galeria com Enter, manter foco com Shift+Tab, fechar com Escape e restaurar foco; menu móvel com Enter/Escape. Permitir e revogar mapa também verificados no navegador; requisições externas interceptadas, sem compartilhar dados com Google durante o teste.
- Leitura sem JavaScript: quatro rotas com um título principal e canonical correto. Não é teste de indexação real do Google.
- O axe marcou o contraste de `mark` como verificação manual. Cores computadas: texto rgb(33,16,68), fundo rgb(255,220,61); relação calculada WCAG de **12,73:1**. Capturas do início móvel e destaques foram inspecionadas. Isso não equivale a auditoria manual completa de todas as imagens/estados.
- Os testes de rotas registraram falhas de DNS ao consultar ofertas externas, mas passaram nos estados de indisponibilidade previstos. Não foi validada operação de ofertas/candidaturas em produção.
