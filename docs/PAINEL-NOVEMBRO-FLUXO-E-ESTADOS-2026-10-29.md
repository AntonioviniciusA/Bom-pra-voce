# Painel de ofertas: fluxo e estados das campanhas

> **Revisão de escopo em 29/10/2026:** prevalece a [reformulação completa do painel](ESCOPO-PAINEL-CAMPANHAS-2026-10-29.md). O painel será exclusivo da nova vitrine, com calendário, temas prontos, catálogo e cadastro durante inclusão. A validade editável do produto é o vencimento da embalagem/lote. Uma campanha ativa por vez é decisão confirmada. As seis imagens abaixo são referências parciais; calendário e criação/edição de campanha precisam de imagens próprias antes de implementar.

Data: 29/10/2026. Entrega de planejamento para aprovação. Não implementa mudanças no aplicativo, não recupera cadastros e não publica ofertas.

## Decisões do usuário

- Salvamento automático durante o uso, sem cliques repetidos. Ao fechar o aplicativo ou sair da edição com alterações não salvas, confirmar com o usuário: **Salvar e sair**, **Sair sem salvar** ou **Continuar editando**. Se tudo estiver salvo, sair sem confirmação desnecessária.

- Fotos dos produtos: usar **Supabase Storage**, conforme escolha explícita do usuário. Não exigir inclusão de fotos novas nos arquivos do site nem uma nova publicação do frontend a cada cadastro.

- Uma campanha temática por vez no site.
- Produtos e campanhas não podem depender de um segundo botão geral para persistir.
- Salvar o cadastro do produto deve gravá-lo de verdade. Demais alterações terão salvamento automático com confirmação ou falha visível.
- Campanhas mantêm seus produtos separados; reaproveitamento manual não altera a campanha original.
- Primeiro apresentar fluxo e uma imagem por página; implementar somente após aprovação.
- Novembro é a prioridade. A aparência de cada tema fica pronta no site; o painel cuida de campanhas e dados comerciais.

## Por que os dados podem ter desaparecido

Evidência no código atual: `ProductCampaigns.jsx`, funções `storeProduct` e `prepareNovember`, alteram somente o estado React. A persistência ocorre em `save`, pelo botão separado “Salvar rascunhos locais”, ou antes da publicação. Portanto, clicar apenas em “Guardar no rascunho” no cadastro não garante persistência após sair da tela. O usuário informou que clicou no cadastro do produto.

`services/productDrafts.js` guarda catálogo e campanhas juntos no IndexedDB `bpv-product-offers-local-v1`, store `workspace`, chave `data`. A ausência dessa chave resulta em catálogo e campanhas vazios. Isso não distingue primeiro uso de outro perfil/origem. Rascunhos não são sincronizados entre computadores. Abrir navegador, aplicativo instalado ou execução pelo projeto pode acessar armazenamentos diferentes; essa hipótese ainda precisa ser verificada no ambiente em que o usuário cadastrou os dados.

Conclusão: há uma falha de experiência e um caminho comprovado para perder alterações ainda em memória. A causa específica e a possibilidade de recuperar o cadastro não foram confirmadas. Não limpar armazenamento, reinstalar ou criar rascunhos sobre o perfil original antes de inspecioná-lo e preservá-lo. Recuperação é uma etapa futura, separada da aprovação visual.

## Fluxo proposto

### Fotos dos produtos — armazenamento escolhido

Supabase Storage será o destino das fotos dos produtos. O cadastro permanente mantém a referência da foto; campanhas reutilizam a mesma imagem, sem duplicar o arquivo por campanha. As artes dos temas continuam nos arquivos do site.

Direção de implementação: otimizar as fotos em WebP, preparar tamanhos adequados, reutilizar arquivos idênticos e configurar cache. A cópia local pode agilizar o painel, mas não deve ser a única cópia permanente. Exibir separadamente gravação local, envio da foto e confirmação remota; falha de envio conserva o preenchimento e permite nova tentativa, sem anunciar sucesso remoto. Alterações de foto usam nova versão, preservando as imagens referenciadas por publicações anteriores. Não apagar arquivos ainda usados por campanhas.

A escolha do armazenamento está aprovada. A implementação do layout e do fluxo continua aguardando aprovação; esta atualização é somente documental.

Campanhas → abrir Esquenta ou Semana → produtos da campanha → adicionar do catálogo ou cadastrar produto → conferir campanha e prévia → confirmar publicação → acompanhar estado no site.

O catálogo também pode ser aberto diretamente em Produtos. Ao iniciar um cadastro a partir da campanha, preservar a campanha de origem e oferecer inclusão nela após a gravação real do produto. Incluir um produto exige preço e unidade específicos daquela campanha.

| Página | Objetivo e ação principal | Saída |
|---|---|---|
| Campanhas | Ver Esquenta e Semana, datas, estado local e estado no site separadamente. Abrir campanha. | Produtos da campanha. |
| Produtos da campanha | Ver somente itens da campanha escolhida; ajustar preço, unidade, ordem e condições. Adicionar produtos. | Catálogo para seleção ou conferência. |
| Catálogo de produtos | Buscar por nome, código ou GTIN; ver os cadastros preservados independentemente da campanha. Cadastrar produto. | Cadastro ou retorno com seleção à campanha de origem. |
| Cadastro de produto | Identidade, variantes/códigos, foto, origem e aprovação. Salvar produto. | Só confirmar sucesso após a gravação; voltar ao contexto de origem. |
| Conferência e publicação | Conferir pendências e prévia do site em computador/celular. Publicar após confirmação. | Estado confirmado no site, agendamento ou erro claro. |

As imagens são estudos dessas páginas, com exemplos identificados como ilustrativos. A versão mobile terá página própria por imagem, nunca colagem de dispositivos. Preservar autenticação e segurança; panfletos antigos, Currículos e Instagram/Publicações serão retirados do painel na futura implementação, conforme o novo escopo. Esta etapa não remove funções do aplicativo.

## Imagens para aprovação

Uma página por arquivo, geradas pela ferramenta integrada de imagens. São estudos visuais, não capturas do aplicativo implementado.

1. [Campanhas](painel-novembro-2026-10-29/01-campanhas.png).
2. [Produtos da campanha](painel-novembro-2026-10-29/02-produtos-da-campanha.png).
3. [Catálogo](painel-novembro-2026-10-29/03-catalogo.png).
4. [Cadastro](painel-novembro-2026-10-29/04-cadastro.png).
5. [Conferência e publicação](painel-novembro-2026-10-29/05-conferencia-publicacao.png).
6. [Produtos da campanha no celular](painel-novembro-2026-10-29/06-produtos-da-campanha-mobile.png).

Limites encontrados na inspeção: a imagem de cadastro escreveu “máximo de 5 MB”; o fluxo atual aceita seleção até 10 MB e otimiza o envio até 2 MB. Manter o contrato real, sem adotar esse texto gerado. Asteriscos e rótulos opcionais da imagem não substituem as validações de identidade, variantes e foto do código. Os exemplos de produtos e preços variam entre imagens; a implementação deverá mostrar os mesmos itens e preços na edição e na prévia. A prévia pública desenhada é ilustrativa; reutilizar o componente real do site, com marca e recursos originais. A imagem mobile demonstra a organização estreita, não comprova responsividade de software. O agendamento ilustrado significa publicação confirmada com início de validade futuro.

### Direção usada na geração

Prompt comum: interface administrativa Bom pra Você em português, data de referência 29/10/2026, fundo claro, roxo e pequenos acentos amarelos, tipografia legível, espaços generosos, navegação Campanhas/Produtos, sem editor de aparência, uma página por imagem e exemplos explicitamente ilustrativos. Referência anexada: captura local antiga do painel na primeira geração; estudo de Campanhas nas demais para continuidade visual.

Variações por arquivo: campanhas de novembro em duas linhas; itens da campanha com preços/unidades e salvamento automático; catálogo independente com busca/seleção; cadastro com identidade/foto e salvamento único; conferência com prévia/checklist e publicação explícita; itens mobile empilhados sem tabela horizontal. Dimensões solicitadas: 1440 × 1024 nos estudos desktop, 390 × 844 no mobile; as saídas são imagens conceituais em resolução própria da ferramenta.

## Regras de persistência

### Saída e fechamento — comportamento solicitado

- Salvar automaticamente as alterações durante o uso, incluindo o preenchimento incompleto como rascunho recuperável. Não exigir um botão geral adicional depois de cadastrar ou editar.
- Cobrir fechar a janela do aplicativo, sair da edição, trocar de página com edição pendente e encerrar a sessão. No navegador, cobrir também recarregar ou fechar a aba dentro das possibilidades da plataforma.
- Antes de concluir a saída, verificar gravações e envios pendentes. Se os dados já estiverem salvos, não interromper o usuário com confirmação.
- Se houver alterações não salvas, mostrar **“Há alterações que ainda não foram salvas. O que deseja fazer?”**, com **Salvar e sair**, **Sair sem salvar** e **Continuar editando**.
- **Salvar e sair:** aguardar a confirmação real das operações necessárias. Se falhar, manter a edição aberta e informar o erro; não fechar nem apagar o conteúdo automaticamente.
- **Sair sem salvar:** descartar somente alterações ainda não persistidas no contexto abandonado. Explicar que alterações já salvas automaticamente permanecem; essa ação não desfaz gravações anteriores nem exclui produtos ou campanhas.
- **Continuar editando:** cancelar a saída e conservar todo o preenchimento.
- Se a foto ainda não tiver sido enviada ao Storage, informar isso explicitamente. Diferenciar rascunho preservado neste computador de foto confirmada no Supabase; não exibir “Tudo salvo” de forma ambígua. Uma saída offline com pendências remotas deve informar exatamente o que permanece local.
- Salvar ao sair não publica uma campanha. A publicação exige a ação explícita de conferência e confirmação.
- No Electron, usar confirmação própria com essas três ações. Ao fechar/recarregar uma aba no navegador, o aviso nativo pode ter texto e botões definidos pelo navegador; não prometer o mesmo diálogo personalizado nesse evento. Cobrir navegação interna com o diálogo próprio.
- Encerramento forçado do sistema ou queda de energia não garantem execução de diálogo; a preservação automática durante a edição reduz essa janela de perda.

Critérios de aceite adicionais: fechamento com tudo salvo não pergunta; fechamento com gravação pendente ou erro permite as três escolhas; falha em “Salvar e sair” mantém a janela e os dados; saída sem salvar não exclui o último estado persistido; reabrir recupera o último rascunho salvo; sessão encerrada não mantém confirmação enganosa de envio remoto.

- Editar campanha, incluir/remover item e alterar preço: salvamento automático local, com escrita serializada e tratamento de conflito; gravar o último valor antes de navegar.
- Cadastro: um único “Salvar produto” valida e grava. Não exige “Salvar rascunhos locais” depois. Preservar automaticamente o preenchimento incompleto como rascunho de formulário, sem apresentá-lo como produto pronto.
- Mostrar “Salvando…”, “Salvo neste computador” com horário, ou “Não foi possível salvar” com tentativa novamente. Não anunciar sucesso antes da conclusão da transação.
- Em falha, manter o conteúdo digitado e avisar ao sair. Falha de leitura não pode virar lista vazia com aparência de sucesso.
- Catálogo vazio deve informar ausência de cadastros neste perfil. Campanha sem itens deve oferecer adicionar produtos. Filtro sem resultado deve oferecer limpar busca.
- Editar produto já publicado não muda o snapshot no site. Mostrar “Alterações locais ainda não publicadas”.
- Salvar localmente não sincroniza computadores nem publica. Backup/exportação e recuperação precisam ser definidos na implementação; não prometer proteção contra remoção do perfil apenas com salvamento automático.

## Novembro: estado de cada campanha

Os estados operacionais reais do perfil do usuário e do servidor não foram consultados nesta entrega. Datas e estrutura abaixo são fatos do código e da documentação atual; não são confirmação de que existam rascunhos salvos ou campanhas publicadas.

| Campanha | Identificador do modelo | Tema | Período em Brasília | Estado verificável nesta entrega | Prioridade |
|---|---|---|---|---|---|
| Esquenta Black Friday | `novembro-2026-esquenta` | `black-friday` | 01 a 22/11/2026, inclusive | Modelo local implementado; persistência do rascunho e publicação do usuário desconhecidas. | Primeiro preparar e validar. |
| Semana Black Friday | `novembro-2026-semana` | `black-friday` | 23 a 29/11/2026, inclusive | Modelo local implementado; persistência do rascunho e publicação do usuário desconhecidas. | Preparar separadamente após fluxo do Esquenta. |
| Novembro legado, se existir | `novembro-2026` | Conferir dado preservado | Conferir cadastro original | A preparação atual preserva esse rascunho, sem converter ou publicar. Existência no perfil desconhecida. | Preservar e revisar manualmente. |

O dia 30/11 fica fora dessas campanhas. A preparação visual da página inicial entre 29/10 e 29/11 não comprova campanha publicada, não cria produtos e não autoriza preços fictícios. O guia de 27/10 com período 23–27/11 é histórico; a referência atual usa 23–29/11.

## Estados de qualquer campanha

Separar estado do salvamento local, estado de publicação e resultado da validade. Não reduzir tudo a um único selo “Rascunho” ou “Ativa”.

| Dimensão | Estado exibido | Significado e ação |
|---|---|---|
| Leitura local | Carregando | Não exibir ausência definitiva de dados antes de concluir. |
| Leitura local | Falha ao carregar | Não substituir por workspace vazio; oferecer tentar novamente e preservar o armazenamento. |
| Edição local | Rascunho incompleto | Dados preservados, mas existem pendências comerciais ou de foto. |
| Edição local | Pronta para conferir | Validações locais passaram; ainda exige conferência e publicação explícita. |
| Persistência | Salvando / Salvo / Falha ao salvar | Resultado real da gravação; falha conserva o conteúdo em edição. |
| Consulta remota | Não conferido / Conferindo / Falha na consulta | Não inferir publicação nem ausência apenas pelo calendário. |
| Publicação | Não publicada | Servidor consultado com sucesso e sem publicação correspondente. |
| Publicação | Publicando | Aguardar confirmação; impedir duplo envio. |
| Publicação | Publicada, agendada | Snapshot confirmado, antes do início da validade. |
| Publicação | Publicada, em vigor | Snapshot confirmado, dentro da validade e com oferta válida. |
| Publicação | Publicada, encerrada | Snapshot existe, mas a validade terminou. Dados permanecem consultáveis no painel. |
| Publicação | Retirada | Servidor confirmou retirada; rascunho e catálogo devem ser preservados. |
| Revisão | Alterações não publicadas | Existe publicação anterior e o rascunho local foi modificado. |
| Escrita remota | Resultado incerto | Resposta perdida não significa falha no servidor. Consultar estado antes de repetir. |
| Concorrência | Conflito de revisão | Não sobrescrever outra janela ou operador; reconciliar os dados. |

O banco atual armazena apenas `published` e `withdrawn` como estados remotos. Agendada, em vigor e encerrada são interpretações de período; os demais estados acima são propostas de apresentação e operação. Uma campanha pode estar “Salva neste computador” e “Publicada, agendada” ao mesmo tempo.

## Regra de uma campanha por vez

Decisão aprovada pelo usuário nesta conversa, ainda não implementada. O código atual admite múltiplas campanhas publicadas.

Proposta: permitir preparar e publicar antecipadamente períodos que não se sobrepõem. Impedir duas campanhas em vigor simultaneamente no servidor, inclusive em operações concorrentes. Para substituir uma campanha dentro de um período sobreposto, mostrar qual será substituída e fazer a troca de forma consistente. Nunca retirar a anterior antes de confirmar que a nova versão está pronta. A implementação precisa preservar o histórico e tratar o snapshot completo, incluindo tema e produtos.

Esquenta e Semana não se sobrepõem. Não ativar rascunho apenas porque chegou novembro. A exibição de um snapshot publicado segue sua validade. Em 30/11, encerrar as ofertas sem apagar o cadastro nem estender preços automaticamente.

## Inventário dos demais temas

Todos constam em `seasonalThemes.js`, com recursos de computador, celular e miniatura. Isso confirma registro no catálogo local, não validação visual final, campanha comercial cadastrada ou publicação. Não confundir tema com instância de campanha.

| Tema | Chave | Estado documentável agora |
|---|---|---|
| Padrão Bom pra você | `padrao` | Cadastrado no catálogo; operação do usuário não verificada. |
| Verão | `verao` | Cadastrado; fora da prioridade de novembro. |
| Volta à rotina | `volta-a-rotina` | Cadastrado; fora da prioridade de novembro. |
| Carnaval | `carnaval` | Cadastrado; fora da prioridade de novembro. |
| Volta às aulas | `volta-as-aulas` | Cadastrado; fora da prioridade de novembro. |
| Mês do consumidor | `consumidor` | Cadastrado; fora da prioridade de novembro. |
| Páscoa | `pascoa` | Cadastrado; fora da prioridade de novembro. |
| Dia das Mães | `maes` | Cadastrado; fora da prioridade de novembro. |
| Festa junina | `festa-junina` | Cadastrado; fora da prioridade de novembro. |
| Dia dos Namorados | `namorados` | Cadastrado; fora da prioridade de novembro. |
| Férias | `ferias` | Cadastrado; fora da prioridade de novembro. |
| Inverno | `inverno` | Cadastrado; fora da prioridade de novembro. |
| Dia dos Pais | `pais` | Cadastrado; fora da prioridade de novembro. |
| Primavera | `primavera` | Cadastrado; fora da prioridade de novembro. |
| Setembro Amarelo | `setembro-amarelo` | Tema institucional cadastrado; não vincular a causa a desconto. |
| Dia das Crianças | `criancas` | Cadastrado; fora da prioridade de novembro. |
| Outubro Rosa | `outubro-rosa` | Tema institucional cadastrado; campanha operacional não verificada. |
| Black Friday | `black-friday` | Tema de novembro; dois modelos de campanha confirmados no código. |
| Natal | `natal` | Cadastrado; fora da prioridade de novembro. |
| Ano-Novo | `ano-novo` | Cadastrado; fora da prioridade de novembro. |
| Aniversário da loja | `aniversario-loja` | Cadastrado; período depende da loja, sem inventar aniversário. |

## Responsividade e critérios para implementação futura

- Desktop: navegação lateral estreita, conteúdo com largura confortável e uma tarefa principal por página.
- Celular: navegação recolhida, itens da campanha em lista vertical, formulários em uma coluna, botões acessíveis e sem rolagem horizontal da página.
- Conferência: alternar prévia computador/celular em área própria; não misturar formulário completo, galeria de temas, catálogo e publicação na mesma tela.
- Verificar 360, 390, 768, 1024 e 1440 px, zoom, teclado, foco, contraste, textos longos e erros reais.
- Cadastrar produto, fechar e reabrir: produto permanece sem segundo salvamento.
- Preparar novembro, fechar e reabrir: as duas campanhas permanecem sem recriar ou duplicar.
- Falha de disco ou de rede não exibe sucesso fictício. Uma campanha vazia, vencida ou com foto/preço pendente não deve ser publicada como pronta.
- Trocar campanha preserva os demais produtos e respeita uma campanha em vigor por vez.
- Nenhuma alteração no aplicativo antes da aprovação desta proposta.

## Fontes locais lidas

- [Escopo atual do painel](ESCOPO-PAINEL-CAMPANHAS-2026-10-29.md).
- [Guia atual de novembro](vitrine-novembro-2026.md).
- [Vitrine e painel](vitrine-painel.md) e [README do painel](../painel-local/README.md).
- [Direção dos temas](vitrine-sazonal-2026-10-24/04-temas-materiais.md) e relato histórico [27/10](vitrine-sazonal-2026-10-24/NOVEMBRO-IMPLEMENTACAO-2026-10-27.md).
- `painel-local/src/ProductCampaigns.jsx`, `services/productDrafts.js`, `ProductPublication.jsx`.
- `bom-pra-voce-novo/src/Components/ProductOffers/novemberCampaign.js` e `Tabloide/seasonalThemes.js`.
- `supabase/migrations/20261028015232_product_showcase.sql`, apenas leitura do contrato local.

Não houve consulta ao banco remoto, ao perfil original do aplicativo ou a credenciais. Os exemplos visuais não representam os dados desaparecidos.
