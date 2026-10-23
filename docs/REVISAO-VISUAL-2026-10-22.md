# Revisão visual — 22/10/2026

## Alterações solicitadas

- Substituídas as cinco artes rejeitadas por composições fotográficas ilustrativas próximas, com produtos preenchendo o quadro, sem pedestal e sem margens brancas. Arquivos WebP 720 × 720 em `bom-pra-voce-novo/src/images/Setores/ilustracoes/`. Gerados individualmente com image_gen integrado; prompts em `revisao-visual-2026-10-22/prompts-imagens.json`.
- Controles do carrossel com ícones Pause/Play, nomes acessíveis preservados, indicadores visuais menores dentro de áreas de toque de 44 px e estado ativo alongado.
- Aviso de cookies fixo junto à borda inferior, com resumo, detalhes expansíveis e escolhas equivalentes. O mapa continua bloqueado antes da permissão. Escolha/revogação permanece disponível no rodapé. Ao escolher, a página não salta para o rodapé.
- Razão social e CNPJ em faixa institucional própria no final do rodapé, com rótulos separados e adaptação para telas estreitas.
- Banner e descrição da padaria usam: “Padaria em reforma para trazer a melhor qualidade para sua mesa.”
- Finalidade de recrutamento esclarecida para vagas abertas e banco de currículos para futuras oportunidades, conforme confirmação do responsável. A rotina real de eliminação, a hipótese legal e os demais pontos operacionais continuam pendentes; esta confirmação não comprova conformidade integral.

## Referências

- BBC Children in Need, escolhas e preferências de cookies: https://www.bbcchildreninneed.co.uk/legal/cookies/cookie-control-centre/
- ANPD, recomendações de rejeição acessível e gestão de cookies: https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-emite-recomendacoes-para-adequacao-da-pratica-de-coleta-de-cookies-do-portal-gov.br

Aplicado o padrão de escolha clara e acesso posterior às preferências; não foram copiadas categorias de rastreamento que o site não utiliza.

As mudanças são locais, sem commit, push ou publicação. O aviso de candidatura mantém a versão de trabalho 2026-10-21, ainda não publicada nesta tarefa; ao publicar, é necessário alinhar a versão configurada no backend.

## Validação

- 18 testes direcionados passaram em quatro suítes: App, cartões, banner e preferências de privacidade.
- ESLint passou nos cinco arquivos de lógica alterados.
- Compilação final concluída com quatro páginas institucionais estáticas. Permanece o aviso de base Browserslist antiga.
- Conferência visual em desktop e painel de cookies em viewport de 390 × 844. Capturas aceitas na pasta desta revisão: `01-setores-cookies-desktop.png`, `02-setores-desktop.png`, `03-controles-padaria.png`, `04-rodape-desktop.png`, `05-cookies-mobile.png`.
- Verificados rejeição, fechamento e reabertura das preferências; após recarregar, a rejeição permaneceu. O controle de pausa mudou para retomar e o terceiro slide permaneceu selecionado. Não houve envio de candidatura real.
- Corrigidos conflitos de CSS identificados na captura: fundo do botão do indicador ativo e contraste do copyright na faixa institucional.
- As cinco imagens WebP totalizam aproximadamente 828 KiB; são mais detalhadas do que as primeiras artes e permanecem carregadas sob demanda.
- O serviço externo de ofertas não pôde ser consultado nesta sessão (falha DNS); o estado de indisponibilidade permanece visível. Isso não comprova disponibilidade das ofertas em produção.
