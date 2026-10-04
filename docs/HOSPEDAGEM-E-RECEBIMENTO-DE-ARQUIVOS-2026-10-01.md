> Decisão consolidada em 01/10/2026: adotar site público + Supabase + aplicativo somente no computador do usuário. Veja o [plano vigente](PLANO-CONSOLIDADO-SITE-SUPABASE-PAINEL-LOCAL.md). Comparações de CMS, formulário gerenciado e painel web abaixo são histórico de avaliação, não escopo de implementação. Preços permanecem referências a conferir na contratação.

# Hospedagem, promoções e currículos — 01/10/2026

Status: pesquisa e proposta; nenhuma implementação, contratação ou publicação autorizada. Complementa a [auditoria](AUDITORIA-SITE-2026-09-30.md).

Detalhamento posterior: [plano de implementação Supabase — dados, currículos e funções](PLANO-SUPABASE-DADOS-CURRICULOS-FUNCOES-2026-10-01.md). Projeto indicado pelo usuário: “bom pra voce”; inventário remoto ainda pendente.

## Escopo confirmado pelo usuário nesta conversa

- Alterar os arquivos dos panfletos de promoção de forma simples.
- Mostrar instruções de formato e tamanho do panfleto para quem faz a atualização.
- Receber currículo e emitir comprovante com identificador (“matrícula”, nas palavras do usuário).
- Não oferecer consulta pública posterior no site.

**Recomendação ajustada:** Cloudflare Pages + Supabase, painel mínimo autenticado para panfletos e função gerenciada para receber/finalizar candidaturas. Não é necessário CMS editorial completo, sistema de recrutamento ou área do candidato. As alternativas abaixo ficam registradas para comparação, mas o comprovante confiável com número único favorece esse caminho.

### Painel mínimo de panfletos

Uma tela com cartões de campanhas e ações “Adicionar panfleto”, “Substituir” e “Retirar”. Campos mínimos: título, arquivo, início e fim da validade. Mostrar prévia, instruções ao lado do upload e resultado da publicação. Manter a versão atual até a nova terminar de subir e ser validada; usar arquivo com identificador novo para evitar cache antigo e sobrescrita. Registrar quem alterou e quando, com opção de reversão.

Proposta de padrões, a aprovar — são escolhas do projeto, não exigências da hospedagem:

| Uso | Orientação para o responsável |
|---|---|
| Panfleto em imagem | JPG, PNG ou WebP; preferencialmente vertical em 1080 × 1350 px. Para preços pequenos ou muitas ofertas, dividir em páginas/cards; aumentar resolução sozinho não resolve legibilidade no celular |
| Panfleto A4 já usado na impressão | Aceitar PDF A4 vertical (210 × 297 mm), preservando proporção, sem exigir conversão para 1080 × 1350 |
| Miniatura do PDF | JPG/WebP vertical, gerada do documento ou enviada separadamente; conferir se representa o panfleto certo |
| Peso para publicação | Meta de até 1 MB por imagem e até 5 MB por PDF; limite inicial proposto de 10 MB por arquivo, com validação no serviço e mensagem clara. Oferecer instrução para reduzir o arquivo quando exceder |
| Apresentação | Mostrar panfleto inteiro com opção de ampliar/baixar, sem cortar produtos, preços ou condições. Não reutilizar o recorte do banner horizontal para o panfleto |

O atual PDF de teste de 10.416.349 bytes equivale a cerca de 10,42 MB decimais; ultrapassaria um limite de 10.000.000 bytes. Na implementação, padronizar a unidade e o valor exibido, sem misturar MB e MiB. Limites de tamanho não substituem verificação de conteúdo e legibilidade.

### Comprovante de currículo sem consulta pública

Recomenda-se o nome **protocolo de recebimento**. “Matrícula” pode sugerir vínculo de emprego. Se o usuário preferir manter a palavra, explicar no próprio comprovante que identifica apenas a candidatura.

Fluxo proposto: candidato informa nome, contato e vaga/área, envia PDF → serviço verifica e grava arquivo privado → finaliza registro com número único gerado no servidor → devolve comprovante para baixar/imprimir na mesma sessão. Recomenda-se PDF para currículo, limite inicial de 5 MB; não coletar documentos de identidade nesta etapa.

O comprovante contém: nome da loja, nome do candidato, vaga/área quando aplicável, protocolo, data/hora em America/Sao_Paulo, identificação do arquivo recebido e aviso “Confirma apenas o recebimento do currículo; não garante contratação. Não há consulta de andamento pelo site. Guarde este comprovante.” Não incluir contatos completos ou informações desnecessárias. Não emitir documento oficial ou prometer assinatura digital certificada.

O código deve ter componente aleatório não previsível e unicidade imposta pelo banco. Não usar CPF, telefone ou contador público. Em retentativa após falha de rede, o mesmo envio deve recuperar o mesmo resultado pela autorização temporária da submissão, sem criar consulta pública por protocolo. Essa recuperação técnica de curta duração não constitui área pública de acompanhamento.

Não criar página “Consultar matrícula”, endpoint anônimo de pesquisa, lista pública, QR code de consulta ou link público para currículo. O identificador sozinho não autoriza acesso a dados. Acesso interno restrito do responsável pelo RH continua necessário, por painel privado mínimo ou operação administrativa definida; funcionários de promoções não recebem acesso a currículos por padrão.

Comprovante pode ser gerado para download a partir da resposta confirmada do serviço; nunca a partir de um sucesso simulado no navegador. Se futuramente for necessária verificação de autenticidade do documento, avaliar assinatura verificável sem consulta pública. Isso não está incluído como requisito atual. Envio por e-mail do comprovante é opcional, depende de serviço/custo e deve ser decidido separadamente.

## Recomendação

Para a landing page atual, usar hospedagem estática e serviços gerenciados. Não há necessidade demonstrada de VPS ou servidor continuamente mantido pela loja. O frontend React pode continuar existindo; o recebimento persistente de arquivos depende de um serviço externo ou de pequenas funções de servidor.

Há dois caminhos principais:

1. **Menor desenvolvimento próprio:** Cloudflare Pages para o site, CMS gerenciado como Sanity para promoções e Tally para candidaturas. Se o próprio desenvolvedor publicar as promoções, dispensar o CMS inicialmente e usar arquivos versionados no projeto. Esta última alternativa reduz assinaturas, mas aumenta dependência operacional do desenvolvedor.
2. **Painel único e regras próprias:** Cloudflare Pages para site/painel e Supabase para autenticação, banco e arquivos; uma função gerenciada recebe/finaliza candidaturas e controla abuso. Recomendado se a equipe precisar gerenciar promoções e currículos dentro de uma interface própria. Exige desenvolvimento e testes de autorização, embora dispense administrar servidor.

O segundo caminho oferece mais controle; o primeiro reduz trabalho de construção. Não declarar que uma ferramenta garante integridade ou conformidade por si só.

## Hospedagens comparadas

### Estimativa mensal de hospedagem e domínio

Estimativa em 01/10/2026 para um site, um projeto Supabase e domínio .com.br comum disponível. Domínio: referência de R$40/ano (equivalente a R$3,33/mês, pago anualmente), conforme [NIC.br](https://www.nic.br/noticia/na-midia/quanto-custa-fazer-um-site-saiba-como-economizar/); a publicação oficial é antiga e o valor deve ser confirmado no pedido atual do Registro.br, cuja página de pagamento exigiu JavaScript nesta consulta. Disponibilidade do nome não verificada.

| Cenário | Hospedagem estática | Supabase | Domínio rateado | Total-base |
|---|---|---|---|---|
| Econômico, dentro das cotas gratuitas | R$0 | US$0 | R$3,33 | R$3,33/mês equivalente; desembolso anual de R$40 pelo domínio |
| Pago, com Supabase Pro | R$0 | A partir de US$25/mês | R$3,33 | US$25/mês + R$40/ano |

Para ilustrar, usando câmbio **hipotético** de R$5,50 por dólar, o cenário Pro custa R$140,83/mês equivalente (R$137,50 + R$3,33), antes de tributos, spread e extras. Não é cotação de hoje nem preço fechado. Reservar aproximadamente R$150–170/mês é margem de planejamento sob essa hipótese, não garantia de fatura máxima.

Essa conta não inclui desenvolvimento/manutenção, e-mail profissional, envio de comprovante por e-mail, backup externo dos arquivos, inspeção antimalware ou excedentes. A função de recebimento seria hospedada no Supabase, dentro da cota aplicável; não é necessário pagar um servidor separado só para ela. O comprovante baixado na tela não exige assinatura de serviço de e-mail.

O plano gratuito permite iniciar, mas pode pausar por inatividade e exige respeitar cotas/rotina de backup. Pro não é requisito técnico absoluto para receber currículos; é recomendação de orçamento para operação contínua. Fontes reconsultadas: [Supabase](https://supabase.com/pricing), [Cloudflare Pages](https://developers.cloudflare.com/pages/functions/pricing/).

Preços públicos consultados em 01/10/2026, em dólares, sem câmbio, impostos, domínio, e-mail, desenvolvimento ou excedentes. Planos podem mudar.

| Opção | Adequação ao projeto | Custo/restrições verificadas | Avaliação |
|---|---|---|---|
| Cloudflare Pages | Entrega do site React compilado; integrações externas para conteúdo e formulários | Requisições de arquivos estáticos gratuitas e ilimitadas; Functions têm cotas/cobrança próprias. Arquivo individual do site limitado a 25 MiB | Primeira escolha para hospedar esta landing page. Não inclui sozinho painel editorial ou caixa de currículos |
| Netlify | Hospedagem estática e Forms gerenciado | Free com 300 créditos/mês; planos atuais usam créditos. Forms gratuitos e ilimitados nos planos por créditos, mas isso não elimina limites de outros recursos | Alternativa se priorizar formulários integrados; validar privacidade de anexos, exportação, exclusão e comportamento ao esgotar créditos antes de escolher |
| Vercel Pro | Boa opção quando houver necessidade real de sua plataforma de aplicações | Pro anunciado a US$20/mês mais consumo aplicável. Hobby restrito a uso pessoal não comercial | Tecnicamente viável, mas maior custo-base para a necessidade atual. Não usar Hobby para o supermercado |
| Hospedagem tradicional/VPS | Possível com servidor e/ou CMS instalado | Não foi cotado fornecedor específico | Não priorizada: atualizações, backups e manutenção de servidor/plugins ampliam responsabilidade sem benefício necessário neste escopo |

Fontes: [Cloudflare preços](https://developers.cloudflare.com/pages/functions/pricing/), [Cloudflare limites](https://developers.cloudflare.com/pages/platform/limits/), [Netlify preços](https://www.netlify.com/pricing/), [Netlify Forms](https://docs.netlify.com/manage/forms/usage-and-billing/), [Vercel preços](https://vercel.com/pricing), [restrição comercial Vercel](https://vercel.com/docs/limits/fair-use-guidelines).

## Caminho A — sem backend desenvolvido para o site

### Promoções

Um CMS é um painel pronto para gerenciar conteúdo. Configurar campos: título, imagem/PDF, início, fim, condições e situação. Equipe entra com conta individual, cadastra a campanha, confere a prévia e publica. A configuração do CMS e a conexão com o site ainda precisam ser desenvolvidas.

Sanity possui plano Free, mas com datasets públicos e apenas papéis Administrator e Viewer. O Growth é anunciado a US$15 por usuário/mês e acrescenta, entre outros recursos, papel Editor e agendamento. Não entregar privilégios amplos só para evitar assinatura. Não armazenar currículos no dataset público. [Planos Sanity](https://www.sanity.io/pricing).

No modelo estático, publicar conteúdo exige atualizar o site por build/webhook ou consultá-lo pela API. O encerramento da oferta também precisa de mecanismo: agendamento de reconstrução, consulta de conteúdo vigente ou função gerenciada. Esconder no navegador com base no relógio do visitante é insuficiente como único controle. Definir fuso, cache e tratamento de falha. Um arquivo que já foi divulgado publicamente pode continuar em cópias/cache mesmo após a campanha sair de destaque.

Se você mesmo publicar: manter materiais públicos no projeto e cadastro estruturado, revisar alteração, gerar prévia e publicar a versão aprovada. Guardar histórico para reversão. PDFs grandes e acúmulo de campanhas podem justificar armazenamento de arquivos separado. Isso é publicação manual, não um painel autônomo para funcionários.

### Currículos

Usar formulário gerenciado, por exemplo Tally, por link ou incorporado à página. Candidato informa dados mínimos e anexa currículo; a equipe consulta as submissões no serviço. O serviço faz o papel do backend.

Tally oferece uploads gratuitos de até 10 MB por arquivo, sem exigir conta do respondente, sujeitos a uso justo. Arquivos no painel exigem autenticação; ao exportar para integrações, URLs podem conter tokens que permitem acesso sem login. Portanto, planilhas/exportações devem permanecer restritas. [Uploads e acesso](https://tally.so/help/file-uploads).

A exclusão automática por prazo é recurso Business; se usar plano sem esse recurso, criar rotina manual e responsável definido. Verificar também cópias exportadas. [Retenção Tally](https://tally.so/help/submissions-data-retention).

Vantagens: pouca implementação de recebimento e painel pronto. Limitações: serviços separados, regras e disponibilidade do fornecedor, tarefas manuais de retenção/exportação e recursos pagos de colaboração. Testar envio completo e recuperação de anexos antes de ativar no site.

## Caminho B — backend gerenciado e painel próprio

Componentes propostos:

- Cloudflare Pages: páginas públicas e interface administrativa.
- Supabase Auth: contas dos funcionários; acesso concedido, sem tornar qualquer conta registrada administradora.
- Banco: campanhas, candidaturas, estado de processamento e registro de alterações.
- Storage separado: promoções publicadas e currículos privados; rascunhos confidenciais não entram no espaço público.
- Função gerenciada: autorização de uploads públicos, limites, proteção contra abuso e confirmação da candidatura. Pode ser Supabase Edge Function ou Cloudflare Worker; não há necessidade de usar os dois.

O Supabase Free oferece 1 GB de arquivos e pode pausar projetos após uma semana de inatividade. O Pro parte de US$25/mês, com primeiro projeto incluído; consumo, projetos adicionais e serviços complementares podem aumentar a conta. Para operação comercial contínua, orçar Pro e backup de arquivos. [Planos](https://supabase.com/pricing).

Arquivos privados podem ser acessados com sessão autorizada ou link temporário. Políticas RLS precisam permitir apenas o acesso necessário. A chave administrativa `service_role` não pode entrar no código do navegador, pois ignora essas políticas. [Buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals), [controle de acesso](https://supabase.com/docs/guides/storage/security/access-control).

### Integridade do recebimento

Proposta de fluxo para implementação futura:

1. Serviço cria identificador único de candidatura e autorização de upload limitada a um arquivo/caminho.
2. Arquivo é enviado para área privada, com nome gerado pelo sistema e restrições de tipo/tamanho.
3. Serviço confirma existência e tamanho, verifica conteúdo/tipo e executa a política de segurança do arquivo; extensão ou `accept` do HTML não bastam. Inspeção antimalware precisa de mecanismo escolhido, não presumir que o provedor a fornece.
4. Finalização associa registro e arquivo e muda o estado para recebido. Em caso de análise pendente, comunicar isso separadamente, sem prometer que o RH já leu.
5. Só então mostrar confirmação e protocolo ao candidato. Retentativas com o mesmo identificador não criam duplicatas.
6. Notificação por e-mail ocorre depois e pode ser reenviada; falha de e-mail não deve apagar candidatura recebida. Não anexar currículos a notificações gerais: direcionar o responsável ao painel.
7. Remover uploads abandonados e registrar falhas sem expor dados pessoais em logs.

Banco e armazenamento não formam uma única transação automática. O estado pendente/finalizado, a limpeza de órfãos e a prevenção de duplicatas resolvem essa diferença. Um hash calculado em ambiente confiável ajuda a detectar alteração do arquivo, mas não substitui permissão de acesso, verificação de conteúdo ou backup.

### Backup e recuperação

Backup do banco Supabase não inclui os arquivos armazenados pelo Storage; contém seus metadados. Planejar cópia dos objetos e dos registros, criptografia/acesso, retenção e teste de restauração. Não prometer “backup completo” apenas por contratar Pro. [Documentação de backups](https://supabase.com/docs/guides/platform/backups).

## Controles indispensáveis, independentemente do fornecedor

| Necessidade | Proposta |
|---|---|
| Integridade | Identificador único, associação correta registro/arquivo, confirmação após persistência, prevenção de sobrescrita e histórico de alterações |
| Confidencialidade | Currículos privados, contas individuais, acesso apenas de RH/responsáveis e links temporários quando aplicável |
| Disponibilidade | Exportação/backup recuperável, monitoramento de cotas, rotina de tratamento de falhas e responsável operacional |
| Promoções corretas | Revisão antes de publicar, período explícito, horário confiável, expiração e controle de cache |
| Segurança de upload | Restrições verificadas no serviço, proteção contra abuso, conteúdo não executável e processo para arquivos suspeitos |
| Minimização | Pedir apenas dados necessários à candidatura; evitar CPF/RG e informações sensíveis sem necessidade definida |
| Retenção | Prazo e finalidade definidos pela loja; excluir também exportações e prever expiração de backups de forma consistente |

A ANPD orienta medidas técnicas e administrativas também para agentes de pequeno porte. Usar serviço gerenciado não elimina as decisões da loja sobre finalidade, acesso e retenção. Definir aviso de privacidade, base legal adequada, fornecedor e eventual transferência internacional antes de coletar; não presumir que alegação de GDPR equivale a conformidade automática com a LGPD. [Guia ANPD](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/anonimizado___guia_orientat-_seg_da_inf_p_atpp.pdf), [Resolução nº 2](https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-2-de-27-de-janeiro-de-2022).

## Ideias que reduzem custo, com limites claros

- **E-mail exclusivo para RH:** simples, porém exige organização, retenção, proteção da conta e acompanhamento de spam. Um link `mailto:` abre o programa do candidato; não comprova envio ou recebimento. Não mostrar sucesso apenas por abrir esse link.
- **Formulário externo gerenciado:** melhor alternativa inicial ao formulário atual que simula envio; mantém recebimento fora do código da landing page.
- **Promoções publicadas por você:** dispensa painel próprio, desde que a loja aceite depender de sua disponibilidade para publicar/retirar materiais.
- **Painel pronto para promoções + formulário externo para RH:** dá autonomia com menos desenvolvimento, ao custo de operar dois serviços.
- **Evitar:** currículo em pasta pública, repositório Git, armazenamento local do navegador, planilha publicada ou token administrativo exposto no frontend. Um endereço difícil de adivinhar não é controle de acesso.

## Decisão sugerida e perguntas pendentes

Escolher **Cloudflare Pages + formulário gerenciado** se a prioridade for começar com baixo custo e pouca manutenção. Adicionar CMS quando a equipe precisar editar promoções. Escolher **Cloudflare Pages + Supabase e painel próprio** se gestão unificada e regras específicas forem requisitos desde a primeira versão.

Faltam confirmar: quem publica as promoções, número de usuários internos, frequência, volume/tamanho de currículos, orçamento mensal, responsável por RH e prazo de guarda. Não há base para estimar custo total ou fixar prazo de retenção sem essas respostas.

Antes de contratar: validar plano efetivo, cotas, tratamento de anexos privados, exportação, exclusão, contas/permissões e restauração. A comparação usa documentação oficial; nenhum dos fluxos foi provisionado ou testado em um serviço externo nesta pesquisa.

