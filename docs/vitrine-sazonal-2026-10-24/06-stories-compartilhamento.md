# Stories da loja e compartilhamento pelo cliente

Decisão de 24/10/2026: **sem Feed**. Os perfis são site no notebook, site no celular e Story. Esta preferência substitui a confirmação anterior.

## Experiência pública

Convite: **“Não guarde o segredo da economia. Compartilhe!”**

Cada produto tem “Compartilhar oferta”; a lista tem “Compartilhar ofertas”. Uma folha de opções oferece prévia, **Compartilhar link**, **Compartilhar imagem para Story**, **Baixar imagem** e **Copiar link**, conforme suporte do aparelho. Botões têm nome acessível e área de toque confortável. Nada é enviado automaticamente.

O link identifica campanha/item estáveis. Oferta encerrada apresenta esse estado, sem substituir silenciosamente por outro produto. O compartilhamento da campanha abre sua lista, identificando período e situação. Código de barras é consultável nos detalhes, sem poluir a arte social.

Imagem para Story usa snapshot público aprovado: logo original, foto exata, descrição, unidade, preço, período e condições. Padrão: um produto por imagem. Vários itens geram sequência numerada com prévia; não amontoar tudo numa tela. Compartilhar a campanha pode oferecer link ou seleção de itens, evitando download enorme inesperado.

O cliente não edita preço/descrição da arte oficial, não acessa rascunhos, não aprova imagens e não publica na conta da loja. O destino é escolhido por ele; não ler agenda ou contatos.

## Compatibilidade e fallback

Web Share depende de navegador, HTTPS, gesto do usuário e aplicativos disponíveis. Verificar suporte para arquivos. Não garantir que o Instagram ou Stories apareça, nem que a imagem abra diretamente no editor. A resposta da API não comprova postagem: pode representar apenas abertura/entrega ao mecanismo do sistema.

Se a preparação assíncrona perder o gesto autorizado, mostrar “Imagem pronta” e novo botão de compartilhar. Cancelar o seletor é comportamento normal, sem alerta de falha nem reenvio. Em aparelhos sem suporte, oferecer baixar imagem e copiar link com orientação curta para abrir o Instagram.

Texto desenhado numa imagem não é link clicável. Não gerar um sticker falso. Inserção manual de sticker pode ser orientada; não é promessa da publicação automática. Compartilhamento para WhatsApp/familiares usa o seletor ou link, sem integração com contatos.

## Loja no painel

Selecionar produtos → prévia 9:16 → revisar → baixar sequência ou escolher conta conectada e solicitar/agendar Story. Mostrar quantidade, validade, conta e estado de cada tarefa. Preservar arquitetura planejada de múltiplas contas de 10/10/2026, restringindo o novo fluxo a Stories. Não apagar/migrar tarefas legadas de Feed neste planejamento.

Distinguir “arte pronta”, “envio solicitado”, “publicado confirmado”, “falhou”, “cancelado” e “expirado”. Retentativas devem reconciliar status antes de duplicar. Capacidade/permissões da conta e publicação real continuam dependências externas não verificadas aqui.

## Integridade e validade

Derivada pública por item/versão + foto aprovada + tema/versão + perfil. Reutilizar arquivo aprovado em vez de capturar a tela ou renderizar para cada visitante. Preço/foto arbitrários enviados pelo navegador não podem alterar a arte oficial. Limitar geração e mostrar progresso quando houver sequência.

Antes de preparar/compartilhar, verificar vigência/revisão. Mudança exige nova prévia. Oferta expirada bloqueia nova geração promocional; pode compartilhar link com o estado encerrado. Imagem já baixada pode continuar circulando: incluir datas e não prometer revogação remota.

Métricas futuras distinguem diálogo aberto, arquivo preparado e link copiado. Não registrar destinatários nem chamar essas ações de publicação confirmada.

## Fontes e limite de pesquisa

[MDN — share](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) e [canShare](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare), consultadas em 24/10/2026, fundamentam suporte condicionado, gesto e verificação de arquivos. As páginas oficiais da Meta consultadas retornaram HTTP 429. Os formatos desta proposta são decisões de design; limites e permissões devem ser confirmados antes de implementação/publicação. Não foi tentada publicação real.
