# Operação — publicação automática no Instagram

O painel já cria tarefas de Feed e Story quando uma oferta é publicada. A entrega à Meta é feita pela Edge Function `instagram-publisher`; ela não usa credenciais no navegador nem no banco.

## Pré-requisitos externos

1. Uma conta **Instagram Comercial** (necessária para Stories) autorizada para publicação na Meta.
2. Um aplicativo Meta com as permissões aprovadas `instagram_business_basic` e `instagram_business_content_publish`.
3. Configurar os segredos da função — nunca em arquivo versionado:

```text
INSTAGRAM_GRAPH_API_VERSION=<versao Graph API ativa no app Meta>
INSTAGRAM_BUSINESS_ACCOUNT_ID=<id profissional do Instagram>
INSTAGRAM_ACCESS_TOKEN=<token da conta, com permissao de publicar>
INSTAGRAM_PUBLISHER_SECRET=<segredo aleatorio longo para o agendador>
```

4. Publicar a migração `20261009110000_instagram_publications.sql`, `promotion-admin` e `instagram-publisher`.
5. Criar um agendamento externo confiável para chamar `POST /functions/v1/instagram-publisher` a cada minuto, com o cabeçalho `x-instagram-worker-secret` igual a `INSTAGRAM_PUBLISHER_SECRET`.

O agendador não deve enviar a credencial da Meta; apenas o segredo exclusivo do worker. Se usar um serviço de agendamento, guarde esse segredo no cofre de variáveis da plataforma.

## Fluxo operacional

1. No painel, publicar a oferta com arquivo **JPG** e marcar Feed e/ou Story.
2. O banco cria uma tarefa por destino, ligada de forma única à versão do panfleto.
3. No horário de início da oferta, o worker busca a imagem pública HTTPS, cria o contêiner na Meta, espera o processamento e publica.
4. A aba **Instagram** mostra fila, falhas, publicação e expiração do Story. Uma falha pode ser reenviada pelo painel.

## Limitações intencionais

- PDF, PNG e WebP continuam aceitos no site, mas a automação do Instagram exige JPG nesta versão.
- A função não suporta música, enquetes, GIFs, link sticker ou demais recursos interativos de Story.
- Stories expiram depois de 24 horas; o registro interno permanece para auditoria.
- A cota e a aprovação da Meta são pré-requisitos externos. Falhas de token, conta e permissões aparecem como falha na fila.

## Validação de produção

Antes de habilitar para campanhas reais, use uma conta Comercial de teste e confirme: publicação no Feed, publicação no Story, reprocessamento de contêiner, erro de token, reenvio manual e que a URL pública da imagem abre fora de uma sessão autenticada.
