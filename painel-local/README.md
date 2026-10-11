# Painel local Bom Pra Você

Aplicativo administrativo separado do site público e executado em Electron.

## Configuração

1. Copie `.env.example` para `.env.local`.
2. Preencha a URL e a chave publicável do projeto Supabase. Não use `service_role`.
3. Execute `npm install`.

## Execução

- Desenvolvimento: `npm run dev`
- Compilar e abrir no Electron: `npm start`
- Apenas compilar a interface: `npm run build`

## Instalador Windows

Com as duas variáveis públicas de `.env.local` configuradas, execute `npm run dist:win`. O comando gera `release/Bom-Pra-Voce-Painel-Setup-<versão>-x64.exe`, um instalador NSIS por usuário, com seleção de pasta e atalhos no menu Iniciar e na área de trabalho. O arquivo não é publicado automaticamente. Execute-o no computador de destino para instalar o painel; ele não precisa de Node.js nem do repositório.

O Vite incorpora a URL do Supabase e a chave **publicável** ao JavaScript gerado. Confira o projeto de destino antes de criar o instalador. O arquivo `.env.local` não entra no pacote; jamais use nele uma chave `service_role` ou outro segredo. Para mudar as variáveis públicas, gere outro instalador. A instalação mantém as sessões no perfil local do aplicativo e não configura atualização automática.

O setup local ainda não tem assinatura digital; o Windows pode exibir um aviso de procedência. Antes de distribuir a terceiros, configure assinatura de código e teste instalação, login/MFA e atualização no computador de destino.

## Correção ortográfica no editor de ofertas

Para usar o Grammarly neste aplicativo Electron, instale o [Grammarly para Windows](https://www.grammarly.com/desktop/windows) e entre na sua conta. A extensão instalada no Chrome não é carregada pelo painel local. Os campos de texto da oferta usam `textarea` e idioma `pt-BR`, conforme as orientações de compatibilidade do Grammarly; campos de senha e dados dos candidatos não foram adaptados. Após instalar, reinicie o painel e digite uma frase no título da oferta para conferir se o indicador do Grammarly aparece. A disponibilidade das sugestões em português depende da conta e das opções de idioma do Grammarly.

O aplicativo usa estados internos `#ofertas` e `#curriculos`; nenhuma rota administrativa é adicionada ao site público.

## Controle de ofertas e currículos

- Ofertas: edição do título, resumo, condições, validade, categoria, ordem, nome do cartão (HUD), oito ícones e cinco temas com seleção visual e prévia. Envio de imagem/PDF de até 10 MB para substituir o panfleto.
- A publicação grava os dados e a nova versão do panfleto na mesma transação. Conflitos de revisão não sobrescrevem alterações de outro operador.
- Currículos: consulta dos dados enviados, busca nos registros carregados, paginação e download individual. Arquivos em inspeção, rejeitados ou expirados não são liberados.
- 2FA: cadastro por QR Code ou chave manual, confirmação de seis dígitos, retomada de cadastro abandonado e exigência de AAL2 antes de abrir a gestão. Não remove autenticadores já verificados.

## Atualização do backend

A migração `supabase/migrations/20261006234947_admin_campaign_customization.sql` foi aplicada ao projeto `jcyffbjsvwkmzgvilxha`. As funções `promotion-admin` e `rh-applications` foram publicadas na versão 6 em 07/10/2026. O site com nomes, ícones e temas dos cartões foi publicado e promovido na Vercel. Veja o [registro de publicação e pendências](../docs/PUBLICACAO-PAINEL-2026-10-07.md).

Conservar as permissões `promotions.manage` e `applications.read`, TOTP habilitado e as origens autorizadas do painel nas Edge Functions. Os endpoints administrativos aceitam explicitamente `null` (Electron), `http://127.0.0.1:5174` e `http://localhost:5174`. A permissão de RH foi concedida à conta administrativa existente e auditada. Não ampliar essa lista com curingas.

O painel não transforma PDFs pendentes em seguros. A consulta remota confirmou um autenticador TOTP verificado, acesso de RH concedido e nenhuma candidatura disponível. Upload/publicação e download completos com uma sessão do operador ainda precisam de validação. A ativação de candidaturas deve seguir o estado real registrado no documento de publicação; os arquivos locais de ambiente e a configuração hospedada não são equivalentes.

## Validação local

- `npm test`: testes de MFA, contratos da API, publicação com metadados, download e telas.
- `npm run test:database`: aplica todas as migrações em PostgreSQL em memória (PGlite) e verifica permissões, rollback, revisão, cache, paginação por data/ID e bloqueios de download por quarentena/expiração.
- `npm run build`: compilação Vite.
- `node scripts/check-remote.mjs`: verifica CORS, bloqueio sem autenticação, ofertas públicas e rejeição de candidatura sem Turnstile no Supabase real, usando somente URL/chave pública de `.env.local`.
- `scripts/visual-check.cjs`: revisão automatizada em navegador com API simulada; requer Playwright disponível em `PLAYWRIGHT_MODULE`, Edge e servidor Vite em `127.0.0.1:5175` com variáveis públicas de teste. Capturas em `artifacts/` usam somente dados fictícios.

Em 06/10/2026: sete testes do painel passaram, as verificações SQL passaram e as telas foram conferidas a 1440 e 390 pixels. O site compilou; sua suíte existente (29 testes) e o teste adicional de personalização passaram. As duas Edge Functions passaram em `deno check`. Esses resultados não substituem a validação de Auth, Storage, CORS e inspeção no Supabase hospedado.
## Prévia durante a edição

O painel importa o mesmo componente `PromotionShowcase` do site e seu CSS completo, fontes e temas. Um iframe isola esses estilos e aplica as media queries em 1440 px (computador) ou 390 px (celular). A escala indicada reduz somente a visualização para caber no editor. “Ampliar prévia” oferece uma área maior.

Textos, tema, ícone, validade e arquivo selecionado atualizam sem salvar. Outras campanhas publicadas e vigentes aparecem na navegação, ordenadas como no site. A oferta em edição aparece mesmo vencida/agendada, com aviso. Links externos ficam inativos; navegação por setores e teclado funciona. PDFs usam o mesmo cartão de abertura do site.

A migração `20261008142200_admin_preview_assets`, aplicada em 08/10/2026, acrescenta caminho público e tipo do arquivo ativo à RPC administrativa. Mantém promotions.manage e execução apenas pelo service_role. Consulta remota confirmou quatro campanhas com arquivo. Não altera validade, estado ou arquivos.

A prévia cobre a seção Ofertas, sem cabeçalho/rodapé. A ferramenta de navegador falhou ao inicializar o ambiente: comparação visual pixel a pixel ainda não realizada. O compartilhamento elimina a implementação visual duplicada.

Compiladores alinhados ao site: Tailwind 3.4.17 e Autoprefixer 10.4.21. Audit apontou sete avisos transitivos de desenvolvimento (cinco altos, dois moderados); a correção sugerida exige Tailwind 4, fora desta alteração. Não houve atualização major automática.

A miniatura ajusta a escala pela largura e pela altura total da seção: no editor, ocupa no máximo 420 px de altura e fica centralizada. O iframe mantém 1440/390 px internos; fontes, quebras de linha e proporções não mudam. Na prévia ampliada, o limite acompanha a altura da janela.

## Barra lateral
O botão Abrir/Fechar menu recolhe a navegação e libera espaço para o editor. Após 10 segundos com o mouse fora da barra, ela fecha automaticamente. Voltar com o mouse reinicia a contagem; foco de teclado dentro da navegação pausa o fechamento. Escape fecha e devolve o foco ao botão de abertura. O formulário em edição permanece montado.
