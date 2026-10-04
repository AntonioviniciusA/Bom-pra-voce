# Implementação do site público — 01/10/2026

Escopo autorizado: correções do site público conforme [plano consolidado](PLANO-CONSOLIDADO-SITE-SUPABASE-PAINEL-LOCAL.md). Código alterado localmente, sem publicação, commit ou implantação de backend. Painel local não implementado nesta etapa.

## Resultado

Revisão posterior: [retorno ao visual original solicitado em 02/10](REVISAO-VISUAL-2026-10-02.md). As capturas, peso do build e descrição de cartões textuais abaixo registram a versão de 01/10; foram substituídos visualmente pela revisão, preservando os fluxos funcionais.

- Layout responsivo com identidade amarela, abertura estática em HTML, menu móvel, foco de navegação, âncoras e cabeçalho sticky.
- Seções de ofertas, localização/horários, pagamentos, setores, apresentação, FAQ e chamada de currículo. Dados institucionais centralizados em `src/Data/storeConfig.js`.
- Sem inscrição por e-mail, tour inoperante, redes fictícias, benefícios/vagas de demonstração ou alegação de 20 anos. Galerias com placeholders substituídas por cartões textuais; fotos existentes preservadas no repositório, fora do carregamento público até revisão.
- Panfletos consultados por serviço público com validação de resposta e origem, vigência pelo horário do servidor, descarte de respostas antigas e revalidação após foco/expiração. Sem PDF de teste como fallback.
- PDF/imagem abre em nova aba, com tipo/tamanho/condições; eliminado o canvas concorrente. Removidos `react-pdf-js`, sua dependência PDF transitiva e o worker público obsoleto. Não foi executada uma modernização geral de dependências.
- Rotas `/`, `/trabalhe-conosco`, `/privacidade` e página de não encontrado. Nenhuma rota administrativa ou consulta pública de currículo/protocolo.
- Formulário implementado com nome, e-mail, área opcional e PDF de até 5.000.000 bytes. Validação local orienta; não substitui validação e inspeção no servidor.
- Sessão em memória com identidade de envio, repetição do mesmo payload, bloqueio de duplo envio, campos preservados e sucesso somente com resposta de finalização válida. Erro incerto mantém os dados bloqueados para evitar reutilizar identidade com outro payload; sessão expirada/conflito exige orientação, sem novo envio automático.
- Comprovante usa resposta confirmada, data do servidor e protocolo. A ação abre a impressão do navegador, que pode salvar em PDF; não existe download direto de PDF independente do navegador. Falha de impressão não reenvia currículo.

## Limite real da entrega

Consulta remota somente leitura confirmou **Bom pra voce**, ref `jcyffbjsvwkmzgvilxha`, região `sa-east-1`, status `ACTIVE_HEALTHY`. Listagem do schema `public`: nenhuma tabela. Listagem de Edge Functions: nenhuma função. Não foram inspecionados todos os schemas, buckets ou Auth; não afirmar inventário completo nem banco integralmente vazio.

Por isso, não foi configurado endpoint ativo no frontend. Ofertas apresentam indisponibilidade, sem substituir falha por “nenhuma vigente”. O recebimento permanece desabilitado: exige configuração pública válida, habilitação explícita e aviso de privacidade preenchido/aprovado. Testes de contrato com respostas simuladas não comprovam persistência, RLS ou recebimento real.

Foi solicitada confirmação de endereço, horários, contato e pagamentos. Sem resposta nesta etapa, esses dados não foram apresentados como confirmados: a página informa atualização/indisponibilidade. Setores textuais aproveitam nomes já existentes; validar composição com a loja antes de publicar. Não publicar o site como concluído enquanto conteúdo essencial e backend estiverem pendentes.

## Situação dos achados

| ID | Estado nesta entrega | Evidência / pendência |
|---|---|---|
| A01 | Sucesso falso removido; integração pendente | Formulário/recibo testados com contratos; envio real bloqueado até backend e privacidade |
| A02 | Seção implementada; conteúdo pendente | Menu, rodapé e FAQ apontam a pagamentos; aguarda modalidades confirmadas |
| A03 | Frontend implementado; campanhas reais pendentes | Sem arquivo de teste; parsing, expiração e erro cobertos por testes |
| A04 | Seção implementada; conteúdo pendente | Endereço/horários/rota configuráveis, sem valores não confirmados |
| A05 | Corrigido localmente | Menu móvel, Escape e foco testados; inspeção em 390 px |
| A06 | Links fictícios removidos | Âncoras corretas; contatos reais aguardam confirmação |
| A07 | Corrigido por retirada do convite | Tour fora da página pública; arquivos antigos preservados |
| A08 | Corrigido por retirada | Sem captura de e-mail/assinatura simulada |
| A09 | Corrigido por simplificação | Cartões textuais, sem galerias falsas; fotos reais pendentes de revisão |
| A10 | Corrigido localmente | FAQ acessível pelo menu, resposta de pagamentos usa a configuração comum |
| A11 | Corrigido no escopo local | pt-BR, título/descrição/Open Graph, favicon da marca e manifesto; domínio/canonical e compartilhamento remoto pendentes |
| A12 | Corrigido por abertura estática | Texto responsivo, sem carrossel automático, suporte a redução de movimento |
| A13 | Diálogos problemáticos removidos | Panfleto em nova aba; cartões sem clique enganoso; foco e links semânticos |
| A14 | Combinações principais corrigidas | Contraste calculado abaixo; não equivale a certificação de acessibilidade |
| A15 | Alegações fictícias retiradas | Sem vagas/benefícios/tempo de atividade inventados; confirmação institucional pendente |
| A16 | Carregamento reduzido | Apenas logo entre mídias do build; PDFs sob ação; formulário/privacidade em chunks separados |
| A17 | Corrigido | 23 testes em 6 suítes substituem teste padrão |
| A18 | Corrigido por substituição | Nenhum renderizador canvas/dependência react-pdf-js no fluxo; campanha real ainda depende de backend |
| A19 | Corrigido localmente | Cabeçalho no fluxo sticky, compensação de âncora; título de pagamentos abaixo do cabeçalho no teste móvel |

## Validação executada

- `npm test -- --watchAll=false --runInBand`: **23 testes, 6 suítes, todos passaram**. Inclui montagem das rotas reais, indisponibilidade, validação, erro de API, timeout, URL de mídia, expiração, resposta atrasada, repetição, sessão expirada e impressão sem reenvio.
- `CI=true npm run build`: passou. JS principal **72,35 kB gzip**, CSS **5,87 kB gzip**, chunk de currículo **3,83 kB gzip** e privacidade **538 B gzip**. Não são medições de Core Web Vitals nem promessa de desempenho em rede real.
- Build verificado no navegador por servidor local `127.0.0.1:4173`: home, FAQ, candidatura, privacidade e refresh direto da rota de candidatura.
- Desenvolvimento verificado em 360, 390, 768, 1024 e 1440 px: sem overflow horizontal, um H1 na home. Inspeção visual desktop e 390 px; menu móvel e foco após navegação. Emulação, não aparelho físico.
- Console capturado sem warnings/errors na navegação inspecionada. Build avisa que `caniuse-lite` está antigo e Node informa API depreciada na ferramenta legada; compilação bem-sucedida. Atualização geral do CRA não feita.
- `git diff --check`: sem erros. Verificação não inclui auditoria de segurança integral.
- Contrastes calculados por luminância sRGB: texto `#22251d` sobre amarelo `#facc15` **10,15:1**; branco sobre `#22251d` **15,55:1**; secundário `#54594d` sobre `#faf9f4` **6,84:1**; foco `#245caa` sobre branco **6,59:1**; erro `#a21d1d` sobre branco **7,69:1**.
- Não executados: leitura por tecnologia assistiva real, zoom de 200%, teste físico móvel, Lighthouse, integração remota, submissão de currículo real e publicação Cloudflare. Esses limites ficam explícitos.

Evidências: [desktop de produção](evidencias-implementacao-2026-10-01/04-producao-desktop.png), [celular](evidencias-implementacao-2026-10-01/02-mobile.png), [currículo bloqueado](evidencias-implementacao-2026-10-01/03-curriculos-bloqueados.png), [FAQ](evidencias-implementacao-2026-10-01/05-faq-producao.png), [larguras verificadas](evidencias-implementacao-2026-10-01/responsividade.json) e [console](evidencias-implementacao-2026-10-01/console.json).

## Como executar e concluir a integração

Na pasta `bom-pra-voce-novo`: `npm start` para desenvolvimento; `npm run build` e `npm run preview` para conferir produção local. A prévia escuta somente loopback, porta 4173, e não é servidor para publicação. No ambiente desta sessão, o wrapper npm falhou anteriormente; execução funcionou usando Node e npm-cli.js instalados em `C:\Program Files\nodejs`.

Preencher `storeConfig.js` com dados confirmados. Copiar `.env.example` para `.env.local` somente com URL e chave publicável; não usar secret/service_role. O frontend usa fetch nativo, sem cliente Auth administrativo. Manter `REACT_APP_APPLICATIONS_ENABLED=false` até implementar e verificar os contratos abaixo, controles de abuso, privacidade e operação. Alterar configuração de ambiente requer reiniciar desenvolvimento ou refazer build. O flag é controle de disponibilidade da interface, não proteção de servidor.

Hospedagem planejada: Cloudflare Pages com build `npm run build`, diretório `build` e raiz do projeto `bom-pra-voce-novo`. `_redirects` inclui fallback de SPA; ainda verificar comportamento na hospedagem real. Não houve deploy.

## Contratos públicos implementados no cliente — pendentes no servidor

### GET public-promotions

Resposta: `{ server_time: ISO8601, campaigns: [...] }`. Cada campanha precisa de `id`, `title`, `summary`, `conditions`, `starts_at`, `ends_at`, `file_url`, `mime_type`, `size_bytes`; `thumbnail_url` opcional. Apenas campanhas publicadas; intervalo início inclusivo/fim exclusivo. Cliente valida horário, datas e URL HTTPS no mesmo projeto, bucket público `promotion-public`, sem query/hash. Não aceita URL de currículo, domínio externo ou javascript. CDN/domínio de mídia distinto exigirá revisão explícita da allowlist. `summary` deve ser incluído no modelo/projeção do backend antes da integração.

### POST application-init

JSON `{ idempotency_key }` e header `Idempotency-Key`, gerado com UUID seguro no navegador. Resposta `{ intent_id, token, server_time, expires_at }`. Mesmo identificador na retentativa precisa recuperar o mesmo intent dentro da janela permitida; não renovar indefinidamente a expiração. Proteger a chave de recuperação como credencial temporária, não registrá-la em logs e limitar abuso. O frontend não persiste chave/token em disco.

### POST application-submit

Multipart: `intent_id`, `name`, `email`, `area`, `file`. Headers `Idempotency-Key` e `X-Application-Token`. Resposta de confirmação: `{ status: "received", intent_id, receipt: { protocol, received_at, candidate_name, file_name } }`. Protocolo no formato `BPV-AAAA-<componente de 22 a 64 caracteres alfanuméricos/hífens>`; servidor garante pelo menos 128 bits aleatórios e unicidade. `file_name` é sanitizado pelo backend; comprovante escapa conteúdo via React.

Somente retornar confirmação após persistência/transação conforme plano Supabase. Mesma identidade/payload retorna recibo existente; payload diferente retorna 409; expirado 410; excesso 429. Respostas pessoais `Cache-Control: no-store`. CORS precisa permitir origem efetiva e headers `apikey`, `Content-Type`, `Idempotency-Key`, `X-Application-Token`; CORS não substitui autenticação nem proteção de abuso. Todos os acessos de frontend usam chave publicável, sem credenciais administrativas.

Rejeições HTTP e respostas malformadas nunca emitem recibo. No cliente atual, erro sem confirmação inequívoca de não recebimento é tratado conservadoramente: manter o mesmo envio, sem liberar alteração dos campos. Refinar erros de validação remota com contrato explícito de rejeição segura durante implementação do backend, antes de habilitar o recebimento público.

Referência técnica consultada: [Supabase — CORS de funções](https://supabase.com/docs/guides/functions/cors). O índice changelog.md não foi lido pelo leitor web (content-type não suportado). Nenhuma versão nova de SDK Supabase foi instalada.
