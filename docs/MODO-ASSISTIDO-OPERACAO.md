# Modo assistido do painel local

Guia operacional permanente para continuar cadastros sem redescobrir o fluxo. Este documento descreve somente a operação local; salvar produto ou campanha não publica no site.

## Localização fixa

- Aplicativo: `painel-local/`
- Controle do modo assistido: `painel-local/electron/assistant.cjs`
- Cliente local: `painel-local/scripts/assistant-client.mjs`
- Formulário e catálogo: `painel-local/src/OfferCampaignPanel.jsx`
- Imagens preparadas: `imagens-produtos-cadastro/2026-11-03/01_CANDIDATAS_CONFERIDAS/`
- Ordem, GTIN e descrição: `imagens-produtos-cadastro/2026-11-03/LISTA-CADASTRO.csv`
- Imagens rejeitadas ou sem correspondência: `imagens-produtos-cadastro/2026-11-03/REVISAR/`
- Registro de defeitos: `docs/BUGS-MODO-ASSISTIDO.md`

## Regras que não devem ser redescobertas

1. A sessão assistida dura uma hora e exige AAL2 recente.
2. A interação manual pausa a automação por alguns segundos; repetir somente depois de `userActive: false`.
3. A autorização do modo assistido não equivale à autorização da imagem. Use `set-image-authorization` somente após confirmação expressa do operador.
4. A origem padronizada das imagens geradas deste lote é `Inteligência artificial`.
5. Anexar imagem deve retornar `processed: true` antes de salvar.
6. Salvar deve retornar `saved: true` e o total do catálogo. Não considerar apenas `ok: true` como prova.
7. `navigate-products` volta ao catálogo e preserva o rascunho.
8. Somente `cancel-product` ou o botão **Cancelar** descarta o rascunho.
9. Produto duplicado deve ser identificado pelo GTIN/código; nunca sobrescrever para contornar a validação.
10. Nenhuma ação do modo assistido publica campanha, altera preço ou confirma foto como revisada.
11. Antes de iniciar um lote, `status` deve retornar `assistantVersion: 3`. Ausência ou versão diferente significa que o painel aberto usa um build antigo: reiniciar antes de operar.
12. `assistantScript` já é um template literal. Não usar crases ou `${...}` dentro do JavaScript incorporado sem escape; preferir concatenação e executar `node --check electron/assistant.cjs` antes de reiniciar o painel.
13. No cadastro automatizado, anexar e processar a imagem antes de preencher `imageSource`. O processamento atualiza o estado do produto e uma origem preenchida cedo demais pode ser substituída pelo estado anterior.
14. `USER_ACTIVE` significa que aquela ação não foi executada. Repetir somente a ação recusada depois de `userActive: false`.
15. Se `saving: true`, não repetir `save-product`, mesmo após o limite de 30 segundos. Consultar `status` até a página voltar para `Produtos`.

## Sequência padronizada de cadastro

Execute a partir da raiz do repositório. O JSON abaixo é um modelo; substitua os valores pelo item da lista.

```powershell
node painel-local/scripts/assistant-client.mjs '{"action":"status"}'
node painel-local/scripts/assistant-client.mjs '{"action":"open-new-product"}'
node painel-local/scripts/assistant-client.mjs '{"action":"fill-product","product":{"name":"NOME","code":"GTIN","brand":"MARCA","content":"CONTEUDO","category":"CATEGORIA","barcode":"GTIN"}}'
node painel-local/scripts/assistant-client.mjs '{"action":"attach-image","path":"CAMINHO_ABSOLUTO_DA_IMAGEM"}'
node painel-local/scripts/assistant-client.mjs '{"action":"set-image-authorization","authorized":true}'
node painel-local/scripts/assistant-client.mjs '{"action":"fill-product","product":{"imageSource":"Inteligência artificial"}}'
node painel-local/scripts/assistant-client.mjs '{"action":"status"}'
node painel-local/scripts/assistant-client.mjs '{"action":"save-product"}'
node painel-local/scripts/assistant-client.mjs '{"action":"status"}'
```

Categorias aceitas: `hortifruti`, `acougue`, `mercearia`, `bebidas`, `limpeza`, `higiene`, `padaria`, `frios` e `utilidades`.

## Critérios de confirmação

Antes de preencher:

- `assistantVersion` deve ser `3`;
- `page` deve ser `Produtos`;
- `form` deve ser `null`;
- registrar o `catalogCount` inicial.

Antes de salvar:

- nome, código e GTIN devem corresponder ao mesmo item;
- `hasImage` deve ser verdadeiro;
- `imageAuthorized` deve refletir a decisão expressa do operador;
- `imageProcessing` deve ser falso.
- `saving` deve ser falso antes de iniciar outra ação; se verdadeiro, apenas aguardar.
- `validationMessage` deve estar vazio; se houver conteúdo, corrigir a causa antes de repetir o salvamento.
- `invalidFields` deve estar vazio. A validação nativa do navegador ocorre antes do React e pode bloquear o envio mesmo sem `validationMessage`.

Depois de salvar:

- o comando deve retornar `saved: true`;
- a página deve voltar para `Produtos`;
- em cadastro novo, `catalogCount` deve aumentar em um;
- em duplicidade, interromper o item e conferir o catálogo; não preencher o próximo produto sobre o formulário atual.

## Recuperação segura

- Sessão expirada: o operador reativa o modo assistido; não automatizar o código autenticador.
- `USER_ACTIVE`: aguardar e repetir somente a ação que não foi executada.
- Rascunho correto ainda aberto: usar `navigate-products` para preservar.
- Rascunho comprovadamente duplicado ou incorreto: usar `cancel-product` somente com essa intenção explícita.
- Imagem não processada em 30 segundos: manter o rascunho, registrar em `docs/BUGS-MODO-ASSISTIDO.md` e não salvar.
- Estado visível diferente do retornado pelo cliente: parar, reiniciar o painel e autorizar nova sessão; não continuar por suposição.

## Inclusão de lista na campanha

Na campanha, abra o catálogo e expanda **Incluir produtos por lista**. Cole um nome exato, código interno ou GTIN por linha. O painel separa:

- pronto para incluir;
- não encontrado;
- ambíguo;
- já presente na campanha;
- cadastro que ainda precisa de revisão.

Somente itens marcados como prontos entram na campanha. Preço, unidade e vencimento continuam pendentes para conferência do operador.

## Validação após mudanças

```powershell
cd painel-local
node --test electron/assistant.test.cjs
npm test
npm run build
```

Reinicie o aplicativo após alterar `electron/assistant.cjs` ou gerar um novo build. Uma janela já aberta não recebe automaticamente o novo processo principal.

## Estado confirmado em 04/11/2026

- Catálogo local confirmado com 28 produtos.
- Lote `imagens-produtos-cadastro/2026-11-03/LISTA-CADASTRO.csv` concluído para todos os itens com foto disponível.
- O GTIN `7898575692958` continua sem cadastro de imagem porque a foto correta do Casaflor Mistérios do Oriente não foi encontrada.
- Os produtos deste lote permanecem com revisão visual pendente; cadastro local não equivale a publicação.
