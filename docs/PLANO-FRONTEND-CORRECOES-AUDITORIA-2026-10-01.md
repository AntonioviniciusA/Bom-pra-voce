# Plano de implementação do frontend — correções da auditoria

Data: 01/10/2026. Estado: **proposta documentada, sem implementação autorizada**.

Complementa a [auditoria A01–A19](AUDITORIA-SITE-2026-09-30.md), as [evidências visuais](EVIDENCIAS-AUDITORIA-2026-09-30.md) e o [plano Supabase](PLANO-SUPABASE-DADOS-CURRICULOS-FUNCOES-2026-10-01.md). As mudanças abaixo são futuras; este plano não declara achados resolvidos.

## 1. Objetivo e limites

Execução posterior autorizada: [relatório do site público implementado](IMPLEMENTACAO-SITE-PUBLICO-2026-10-01.md). Consultar essa matriz para o estado atual dos achados; este documento preserva o planejamento.

Arquitetura adotada: [site público + Supabase + painel local](PLANO-CONSOLIDADO-SITE-SUPABASE-PAINEL-LOCAL.md). Administração exclusivamente no aplicativo instalado no computador do usuário; este plano detalha o site e identifica as entregas transferidas ao aplicativo.

Entregar uma landing page informativa para supermercado físico, útil no celular: consultar panfletos vigentes, localizar a loja, conferir horário e pagamentos, tirar dúvidas e enviar currículo com comprovante. Entregar, em projeto separado, painel local para panfletos e acesso restrito do RH.

Preservar a identidade e os recursos aproveitáveis; corrigir apresentação e comportamento sem reconstrução arbitrária do site. Manter React e a estrutura atual nesta etapa. Migração de framework/bundler só se houver impedimento comprovado ou decisão separada, não como condição automática para corrigir a auditoria.

Não incluir carrinho, checkout, entrega, conta de candidato, consulta pública de protocolo, newsletter, tour interativo ou avaliação automática de currículos. Retirada do tour e da inscrição sem funcionamento é a proposta para o MVP; sua execução acompanha a aprovação do plano. O recebimento real de currículos permanece no escopo, conforme pedido posterior do usuário.

## 2. Estado local confirmado

- `src/index.js` monta `AppRoutes` com StrictMode; `src/App.js`, que contém Outlet, não é a árvore efetivamente montada.
- `src/Routes.jsx` só tem `/`; `src/pages/Home.jsx` monta tour e recrutamento antes do FAQ e deixa pagamentos comentados.
- `TabloideView.jsx` utiliza `react-pdf-js` e foi associado ao erro de canvas observado na auditoria. A causa exata ainda exige reprodução/investigação; não remover StrictMode para esconder o problema.
- Menu atual some abaixo do breakpoint `md`; não possui alternativa móvel.

O plano usa a inspeção local e a auditoria anterior. Não houve nova execução visual nem testes de implementação nesta etapa. A disponibilidade atual do projeto remoto Supabase não foi reavaliada: isso pertence ao inventário do plano de backend.

## 3. Ordem proposta das informações

1. Cabeçalho com marca e navegação: Ofertas, Como chegar, Pagamentos e Dúvidas; links secundários para setores/sobre e currículo.
2. Abertura com nome, indicação de loja física, bairro/cidade confirmados, horário resumido, “Ver ofertas” e “Como chegar”.
3. Panfletos publicados e vigentes com título, validade e condições.
4. Localização e horários completos, com ação para abrir rota e contato confirmado.
5. Formas de pagamento aceitas na loja, por categoria e com texto legível.
6. Setores/fotos reais e apresentação breve da loja.
7. Perguntas frequentes.
8. Chamada discreta para “Envie seu currículo”, rodapé com contatos e privacidade.

Proposta: formulário de currículo em `/trabalhe-conosco`, acessível a partir da home e diretamente. Assim não é necessário carregar formulário/anexos no primeiro acesso à landing page. A confirmação fica na própria sessão dessa página, sem URL de consulta ou protocolo na barra de endereço.

## 4. Rastreabilidade de todos os achados

Todos os caminhos nesta tabela são relativos a `bom-pra-voce-novo/`.

| ID | Intervenção no frontend | Arquivos/componentes | Aceite |
|---|---|---|---|
| A01 | Substituir alerta fictício por envio confirmado e comprovante | `WorkWithUs/TrabalheConosco.jsx`, `CandidaturaForm.jsx`, novo `ApplicationReceipt` | Erro de backend nunca gera sucesso; repetição recupera o mesmo protocolo |
| A02 | Montar seção de pagamentos e ligar menu/rodapé/FAQ à mesma informação | `Home.jsx`, `PaymentMethods`, `PaymentsData.js`, `Footer` | Seção visível, categorias corretas, sem logos não confirmados ou repetidos |
| A03 | Consumir campanhas do serviço, com validade e estados reais | `TabloideData.js`, `Tabloide.jsx`, novo serviço de promoções | Material corresponde à campanha; sem fallback de teste em produção |
| A04 | Criar seção localização/horários e ações de rota/contato | Novo `StoreVisit`, configuração da loja e FAQ | Endereço, domingos e feriados confirmados e acessíveis sem abrir FAQ |
| A05 | Menu móvel com abertura, fechamento, teclado e nomes acessíveis | `NavBar`, `RoutesNavBar` | Atalhos disponíveis em 360/390 px; foco e Escape corretos |
| A06 | Corrigir âncoras; remover destinos fictícios; ativar canais confirmados | `Footer`, navegação, configuração da loja | Nenhum `href="#"` como destino fictício; todos os links chegam ao conteúdo esperado |
| A07 | Retirar convite de tour da home/menu no MVP, sem apagar trabalho antigo desnecessariamente | `Home.jsx`, navegação, `TourVirtual` | Nenhum botão promete tour inexistente; `Maps.jsx` não é confundido com rota real até a loja |
| A08 | Trocar campo “Inscrever” por contato real | `Footer` | Nenhum formulário de assinatura inoperante; e-mail abre canal identificado, sem simular envio |
| A09 | Corrigir fonte de fotos por setor; sem galeria quando só houver uma imagem | `Cards.jsx`, novo cadastro de setores | Bebidas mostra bebidas; nenhum placeholder remoto; ausência de foto não vira imagem enganosa |
| A10 | Corrigir FAQ e reutilizar configuração de pagamentos/loja | `Faq.jsx`, `FaqData.js` | Resposta pertinente; acesso via menu; dados consistentes entre seções |
| A11 | Português, título, descrição, marca e compartilhamento | `public/index.html`, `manifest.json`, ícones | “React App” e metadados padrão eliminados; domínio real sem valores inventados |
| A12 | Preferir abertura estática com texto HTML; se mantido carrossel, incluir pausa | `BannerHome`, `BannerData`, `BouncingScroll` | Mensagem legível no celular; alternativas corretas; redução de movimento respeitada |
| A13 | Padronizar diálogo acessível e controles semânticos | Novo `AccessibleDialog`, tabloide e eventual galeria | Escape fecha, foco fica no modal e retorna ao acionador; controles têm nome |
| A14 | Corrigir contraste por tokens e verificar estados | `index.css`, componentes e configuração Tailwind quando necessário | Medir texto normal/grande e controles em normal/hover/foco; não confiar só na cor nominal |
| A15 | Revisar textos e dados da loja; remover vagas/benefícios não confirmados | `About`, `Cards`, `WorkWithUs`, arquivos de dados | Sem “+20 anos” ou vaga fictícia apresentados como fato; redação revisada |
| A16 | Otimizar mídias usadas, carregar módulos sob demanda e informar peso do PDF | Banner, setores, tabloide, rotas | Home não baixa todos os PDFs nem módulos administrativos; imagens com dimensões e tamanho adequado |
| A17 | Substituir teste padrão por testes da árvore real e jornadas | `App.test.js`, testes de componentes/serviços e navegador | Exercitar `AppRoutes`, envio, expiração, acessibilidade e falhas reais |
| A18 | Resolver visualizador PDF ou substituí-lo por experiência mais simples | `TabloideView.jsx`, dependência PDF se necessária | Abrir/fechar/trocar documento sem erro em desenvolvimento e produção; fallback claro |
| A19 | Corrigir barra fixa e compensação de âncoras | Cabeçalho, layout, CSS global | Cabeçalho não cobre título, banner, campo focado ou destino de navegação |

## 5. Organização do código

Evitar renomeação ampla de pastas existentes só por estilo. Introduzir módulos necessários, mantendo convenções atuais onde não prejudicarem clareza:

| Área proposta | Responsabilidade |
|---|---|
| `src/Data/storeConfig.js` | Dados confirmados da loja, pagamentos, horários, contatos e redes; fonte única para home/rodapé/FAQ |
| `src/Data/navigation.js` | IDs e links compartilhados entre menu desktop, móvel e rodapé |
| `src/services/promotions.js` | Consulta de campanhas, normalização de resposta e cancelamento |
| `src/services/applications.js` | Inicialização, submissão e repetição segura da própria sessão |
| `painel-local/src/services/admin.js` (projeto separado) | Operações autenticadas de panfletos/RH; nunca incluídas no site |
| Cliente de funções públicas | No site, consumir somente promoções e candidatura; cliente Auth administrativo pertence ao painel local |
| `src/hooks/usePromotions.js` | Estado compartilhado da consulta, hora do servidor e revalidação |
| `src/Components/Common/` | Diálogo, mensagens de erro/estado, campo de formulário, botão de ação |
| `src/Components/StoreVisit/` | Endereço, horários, rota e canais |
| `src/Components/WorkWithUs/ApplicationReceipt.jsx` | Resultado confirmado e impressão; gerador de PDF separado e carregado sob demanda |
| `painel-local/src/pages/` (projeto separado) | Login, panfletos e recebimentos RH no aplicativo instalado |

Não criar uma camada genérica complexa de formulários ou um design system completo. Centralizar apenas regras realmente compartilhadas.

### Rotas

- `/`: landing page.
- `/trabalhe-conosco`: candidatura e confirmação na sessão.
- `/privacidade`: aviso aprovado para a operação real.
- Login/recuperação/MFA pertencem ao aplicativo local; definir retorno de autenticação seguro ao escolher o runtime. Não criar administração no site.
- Rota desconhecida: página clara de não encontrado com retorno à home.

Resolver a duplicidade conceitual de `App.js`/`AppRoutes`: escolher um único ponto de composição e testar exatamente a árvore montada por `index.js`. Configurar fallback de SPA na hospedagem futura e testar refresh/acesso direto a cada rota. Carregar PDF e comprovante sob demanda. Telas administrativas pertencem a outro build, instalado localmente.

## 6. Navegação, layout e acessibilidade

Cabeçalho preferencialmente sticky no fluxo, com fundo de contraste previsível. Se necessário manter fixed, reservar altura real no layout e definir compensação de rolagem compartilhada. Não esconder overflow global para mascarar componentes maiores que a tela.

Usar links para navegação e botões para ações. Incluir “Pular para o conteúdo”, um título principal por página e hierarquia coerente. Menu móvel fecha ao selecionar destino, permite Escape e devolve foco ao botão. Abrir sem impedir a leitura do título principal.

Manter `details/summary` no FAQ, por ser solução já funcional, e revisar leitura/estado no teclado. Não adicionar busca ao FAQ sem volume que justifique.

Diálogos têm título associado, foco inicial apropriado, contenção de foco, fundo indisponível para interação, Escape e restauração de foco. Bloquear rolagem de fundo sem perder a posição. Avaliar `<dialog>` nativo ou biblioteca acessível pequena, com suporte confirmado na implementação.

Contraste-alvo: texto comum ≥4,5:1 e texto grande ≥3:1; controles/foco visíveis e mensurados conforme critérios aplicáveis. A combinação branca/amarela reprovada na auditoria deve ser substituída por texto escuro adequado. Verificar redução de movimento, zoom de 200%, textos longos e alvos de toque confortáveis.

## 7. Ofertas e visualização de arquivos

Uma consulta compartilhada para a listagem; não buscar a mesma campanha separadamente no banner, cartões e modal. Cancelar/respeitar respostas antigas ao sair da tela e evitar que uma resposta atrasada substitua uma versão mais recente. Não usar Realtime nem polling contínuo sem necessidade.

Estados distintos: carregando, campanhas disponíveis, nenhuma vigente e erro de consulta. “Sem ofertas vigentes” exige resposta válida vazia; erro de rede deve explicar indisponibilidade e permitir tentar novamente. Nunca inventar preço ou reutilizar campanha vencida como fallback.

Cada cartão exibe título específico, validade, condições, tipo e tamanho do arquivo, além de ação nomeada como “Ver panfleto Ofertas da semana”. Horário do servidor controla a vigência; revalidar ao recuperar foco e no término da campanha, sem depender só do relógio local.

**Decisão recomendada para o PDF:** miniatura real + “Abrir PDF”/download como caminho robusto; prévia ampliável para imagens. Visualizador embutido só permanece se trouxer ganho e passar testes. O navegador pode não renderizar PDF internamente em todos os dispositivos, por isso abertura/download deve continuar disponível.

Se mantido canvas: investigar montagem/desmontagem, cancelamento de render pendente, mudança de URL/página e compatibilidade da biblioteca com React. Não trocar pacote por palpite ou desligar StrictMode. Verificar documentação e versão suportada antes de escolher substituto. No carregamento, mostrar estado adequado em vez de “Página 1 de 0”. Erro do visualizador não pode derrubar o resto da página.

Não prometer conteúdo acessível só por fornecer PDF ou imagem. Cada campanha terá resumo textual e condições; garantir acessibilidade dos preços exige PDF acessível ou transcrição dos itens, sem presumir OCR correto. Cadastro de catálogo completo fica fora do MVP; registrar esse limite e orientar produção dos panfletos.

## 8. Dados da loja, pagamentos e conteúdo

Configuração estática versionada para informações pouco mutáveis; Supabase fica responsável pelas campanhas e candidaturas. Não criar outro painel para todo texto da loja sem solicitação.

Campos: nome, endereço, rota confirmada, horário por dia e exceções, telefone, WhatsApp se real, e-mail, redes, pagamentos por modalidade e condições. Exibir só dados aprovados. Logos existentes não confirmam bandeira aceita. Pagamentos e FAQ usam o mesmo cadastro; sem repetições ou nomes “aaa”.

Localização deve funcionar como texto e link mesmo sem mapa incorporado. Preferir link para rota no MVP, evitando carregamento desnecessário de mapas. Não usar geolocalização automática. Indicador “aberto agora” só com calendário completo; caso contrário, mostrar tabela de horários.

Recrutamento: candidatura espontânea é suficiente até existir lista real de vagas. Não mostrar benefícios ou oportunidades de demonstração. História, tempo de atividade, fotos e contatos precisam de confirmação antes de publicação.

## 9. Formulário e comprovante de currículo

Campos mínimos: nome, contato necessário, área/vaga opcional e PDF. Revisar com RH quais contatos são indispensáveis; não exigir textos longos de motivação/experiência já contidos no arquivo sem necessidade. Sem documentos de identidade.

Estado explícito: edição → validação local → envio → confirmação de persistência → comprovante; erro recuperável pode ocorrer em cada etapa. Usar progresso percentual somente quando medido; caso contrário, descrever a etapa sem números fictícios.

- Validação local de obrigatoriedade, formato e 5.000.000 bytes para orientar; servidor continua autoridade.
- Erros junto aos campos, resumo de erro com foco e anúncio de estado acessível.
- Aviso de privacidade próximo ao envio; não inventar base legal ou usar checkbox genérico como solução automática.
- Chave de idempotência e token pertencem à sessão do envio. Duplo clique e retentativa mantêm identidade; dados alterados após submissão exigem tratamento de conflito, não reutilização silenciosa.
- Não limpar formulário antes da confirmação. Em resultado de rede incerto, informar que o recebimento ainda não foi confirmado e repetir com a mesma identidade; não instruir novo envio imediato.
- Token, currículo e dados pessoais ficam na memória da sessão; sem localStorage, query string, analytics, logs ou cache de service worker.
- Abortar requisição/fechar página não significa cancelar envio já recebido; explicar saída durante envio sem prometer cancelamento remoto.
- Ao confirmar, exibir protocolo, data do servidor e aviso de que não há consulta no site nem garantia de contratação.
- Baixar PDF e imprimir a partir de resposta confirmada; sem enviar dados a serviço externo de geração. Escapar textos do candidato e testar caracteres/acento/nomes longos.
- Se geração do PDF falhar, manter confirmação e oferecer impressão/nova tentativa; não reenviar currículo para tentar imprimir.
- Sem rota de consulta, QR público ou protocolo tratado como senha. Ao expirar a sessão, não prometer reemissão pública.

Não mostrar “Recebido” apenas porque upload chegou a 100%, validação local passou ou resposta genérica HTTP foi bem-sucedida; validar contrato de finalização e protocolo retornado.

## 10. Interface transferida ao painel local

Esta seção especifica telas do projeto separado de painel local, conforme o plano consolidado; não são rotas do site público.

**Panfletos:** tela com campanhas, validade e estado. Adicionar/Substituir abre formulário curto, com formatos e dimensões visíveis antes da seleção: imagens 1080 × 1350 px preferencialmente; PDF A4; meta 1 MB/imagem e 5 MB/PDF; teto 10.000.000 bytes. Arquivo fora da proporção gera orientação, não corte automático de preços.

Prévia usa arquivo selecionado localmente; liberar Object URLs ao substituir/sair. Publicar somente após validação remota. Manter campanha anterior até confirmação da versão nova. Conflito 409 apresenta informação atual e permite revisar, sem sobrescrever trabalho alheio. Retirar campanha exige confirmação contextual identificando qual item será retirado. Separar “salvo como rascunho” de “publicado”.

**RH:** lista paginada mínima com protocolo, nome, área e data. Download apenas mediante autorização e inspeção liberada; mostrar “Em verificação” para quarentena. Não carregar todos os PDFs em previews automáticos. Não oferecer nota, ranking ou recomendação de contratação.

**Sessão interna:** carregando/verificando permissão não pode renderizar conteúdo restrito por um instante. Tratar 401 como sessão inválida e 403 como falta de permissão. Logout limpa consultas e dados pessoais em memória. A proteção das rotas é experiência de navegação; segurança real está nas funções e RLS. Não usar `user_metadata` para decidir autorização. Permissão revogada deve bloquear novas operações mesmo com tela já aberta.

## 11. Contratos com Supabase e configuração

O site consome `public-promotions`, `application-init` e `application-submit`; o painel local consome `promotion-admin` e `rh-applications` com autenticação e autorização. Documentar exemplos de sucesso/erro antes de conectar componentes; validar estrutura, status, campos obrigatórios e URLs permitidas da mídia recebida.

No frontend, apenas URL do projeto e chave publishable quando necessária. Para o bundler atual, nomes propostos `REACT_APP_SUPABASE_URL` e `REACT_APP_SUPABASE_PUBLISHABLE_KEY`; todo valor desse tipo é público no bundle. Nunca usar chave secret/service-role. Fixar versões de novas dependências e atualizar lockfile somente durante implementação autorizada.

Configuração ausente deve produzir indisponibilidade clara e bloquear operações dependentes; não ativar modo fictício em produção. Fixtures só em teste/desenvolvimento explicitamente isolado. Não montar formulário enviável antes de a API real estar habilitada e validada.

Nenhuma mudança de schema, credencial ou função está autorizada por este documento. Requisitos remotos de autenticação, CORS, limites e liberação de anexos seguem o plano Supabase.

## 12. Desempenho, SEO e publicação futura

- Otimizar somente imagens realmente utilizadas; dimensões explícitas, formatos eficientes e carregamento adiado abaixo da dobra. Imagem principal não deve ser atrasada desnecessariamente.
- Download de PDF somente por ação do visitante. Carregar geração de comprovante e eventual visualizador sob demanda; nenhum módulo administrativo no build público.
- Evitar fonte de conteúdo importante exclusivamente em imagens. Usar título/descrição/idioma corretos no HTML inicial, não apenas atualização após JavaScript.
- Configurar Open Graph, favicon e manifesto com marca real. Canonical e URLs de compartilhamento dependem do domínio definido.
- Dados estruturados da loja devem refletir conteúdo confirmado e visível; não inventar avaliações, localização ou horário. Não garantir resultado destacado no Google.
- Não há rotas admin no site. A rota de candidatura não entra em sitemap de conteúdo comercial; noindex quando apropriado não é controle de acesso. Página de privacidade deve continuar acessível.
- Medir build de produção e rede móvel após mudanças; relatório de tamanho do bundle e recursos carregados. Não declarar pontuação Lighthouse sem execução. Se pré-renderização for necessária para conteúdo indexável/compartilhamento, registrar decisão separada e testá-la antes de ampliar a arquitetura.

## 13. Sequência de entrega

| Etapa | Trabalho | Dependência | Saída verificável |
|---|---|---|---|
| F0 | Consolidar configuração, rotas e dados confirmados | Conteúdo comercial | Campos pendentes visíveis na documentação; mapa de links único |
| F1 | Cabeçalho/menu/âncoras, hero, localização, pagamentos, FAQ e rodapé | F0 | Jornada informativa útil em desktop/celular, sem botões falsos |
| F2 | Setores/sobre, contraste, diálogos e metadados | F1 e imagens reais | Fotos corretas, leitura/teclado e links revisados |
| F3 | Promoções e substituição/correção do PDF | Contrato `public-promotions` | Carregamento/vazio/erro/validade e abertura estáveis |
| F4 | Candidatura e comprovante | API de recebimento, privacidade e política de arquivo | Persistência confirmada, repetição segura, recibo baixável |
| F5 — projeto separado | Login, panfletos e RH no aplicativo local | Auth/permissões/funções privadas e runtime desktop definido | Upload/publicação e download restrito reais no computador do usuário |
| F6 | Testes integrados, performance e documentação operacional | F1–F5 | Matriz de aceite executada, limites registrados, nenhum sucesso simulado |

F1/F2 podem avançar antes do backend. F3–F5 podem ser desenvolvidas contra contratos em testes, mas só são consideradas concluídas após integração real. Não publicar testes/mocks como sistema funcional. Cada etapa futura terá alterações temáticas revisáveis, sem push/publicação implícitos.

## 14. Verificação e definição de concluído

Testes de comportamento proporcionais ao risco, sem testar apenas detalhes de implementação:

- Navegação desktop/móvel leva ao destino; título/campo não fica encoberto; teclado e foco funcionam.
- Oferta vencida, erro de rede e lista vazia são diferentes; resposta atrasada não restaura campanha antiga.
- Abrir/fechar/trocar PDF repetidamente não gera erro; falha do arquivo preserva a página e oferece alternativa.
- Backend rejeita ou demora: nunca mostrar comprovante falso. Timeout após commit retorna protocolo original na retentativa.
- PDF grande/tipo inválido, arquivo sem seleção, campos vazios e falha de geração do recibo têm recuperação compreensível.
- Editor não vê RH; sessão expirada/revogada não mantém dados restritos na tela; testar também API direta no backend.
- Publicação em conflito ou upload inválido preserva versão anterior; sucesso só após confirmação remota.
- Teste automatizado substitui “learn react” e monta a árvore real; testes integrados com Supabase usam dados fictícios.
- Revisão visual em 360, 390, 768, 1024 e 1440 px; zoom 200%; teclado; contraste medido e amostra com leitor de tela. Emulação não substitui teste físico: registrar separadamente se executado.
- Build de produção, testes relevantes e rede móvel verificados uma vez ao concluir cada mudança significativa; ampliar apenas se surgirem falhas.
- Conferir HTML/metadados, links, refresh de rotas e cache na hospedagem após publicação especificamente autorizada.

Encerramento da implementação exigirá tabela A01–A19 atualizada como resolvido/pendente, com evidência e dependências. Este plano não altera essa classificação: todos os achados permanecem abertos até execução e validação.

## 15. Dependências externas e decisões pendentes

Confirmar endereço/rota, horários inclusive domingos/feriados, contatos, pagamentos e regras, história/fotos, panfletos reais, responsável RH, aviso de privacidade e dados do comprovante. Não bloquear construção de componentes por conteúdo ainda ausente; usar fixtures em testes e impedir publicação de informação inventada.

Propostas de produto a aprovar com a implementação: hero estático, tour fora do MVP, inscrição de e-mail substituída por contato e formulário em rota própria. Recebimento de currículo e painel simples já fazem parte do objetivo pedido; serviço remoto, segurança e publicação ainda precisam ser executados e verificados.

## 16. Referências técnicas

- [Chaves Supabase](https://supabase.com/docs/guides/getting-started/api-keys): chave publishable no navegador; segredos no servidor. Consultado em 01/10/2026.
- [Padrão W3C de diálogo modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): comportamento esperado de foco/teclado. Consultado em 01/10/2026.
- Demais referências de contraste, carrossel e SEO estão na auditoria.

A tentativa de leitura do índice `https://supabase.com/changelog.md` não foi suportada pelo leitor web nesta sessão; documentação específica de chaves foi consultada. Antes de instalar/implementar integração, revisar changelog e compatibilidade das versões efetivamente escolhidas. Não houve atualização de dependências ou alteração remota nesta etapa.

