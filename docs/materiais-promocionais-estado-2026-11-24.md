# Materiais promocionais: estado da implementação

## Fluxos existentes

- `bom-pra-voce-novo/src/Components/ProductOffers`: vitrine, stories, arte individual, PDF A4 e menu de compartilhamento.
- `bom-pra-voce-novo/src/Components/Tabloide/seasonalThemes.js`: catálogo visual dos temas. Os recursos atuais não correspondem ao novo conjunto de nove arquivos por tema.
- `painel-local/src/OfferCampaignPanel.jsx` e `ProductPublication.jsx`: edição, conferência e publicação. A geração atual do PDF ocorre no navegador mediante pedido do visitante, sem versão imutável de materiais.

## Implementado nesta revisão

- Abaixo de 768 px, um produto em destaque na ordem publicada, stories por categoria e acesso aos stories pelo destaque. Sem grade ou paginação mobile.
- De 768 a 1023 px, grade de duas ou três colunas. Grade desktop preservada.
- Removida a instrução de arrastar e seu ícone da vitrine de stories.
- Menu público com PDF para download ou compartilhamento por arquivo quando suportado, e cópia de link. O link individual inclui campanha e produto.
- Tema Natal: moldura original de `imagens-tema-sazional` incorporada à vitrine mobile, aos stories e ao renderizador da arte vertical individual. O texto e as datas da oferta continuam dinâmicos. A peça com datas gravadas de 18 a 24/12/2026 não foi aplicada.
- Calendário do painel: criação de rascunho como oferta normal por padrão; temas do mês aparecem como sugestões explícitas. Escolher Natal não altera outras campanhas nem publica automaticamente.

## Pendências para a especificação completa

1. Produzir e conferir visualmente os nove recursos nomeados por tema nas dimensões fornecidas, especialmente `ofertas-mobile-completo.webp`. A moldura natalina original tem 941 × 1672 px e é aplicada como recurso visual, sem afirmar que substitui o arquivo final exigido de 1080 × 1920 px. Não substituir a arte existente antes da conferência das pranchas, fontes, logo e legibilidade.
2. Estender o manifesto e o renderizador com composição própria para quadrado, páginas PNG/JPEG nas duas resoluções, seleção de páginas e ZIP. O PDF atual usa canvas com fundo específico de Black Friday e não fornece páginas exportáveis.
3. Criar versão imutável da campanha, geração no fluxo de publicação, armazenamento privado temporário, verificação de integridade, ativação atômica e invalidação por versão. Não anunciar os materiais sob URLs públicas antes disso.
4. Integrar prévias e estados dos materiais no painel, com permissões vigentes.
5. Implementar metadados Open Graph específicos por produto no documento servido ao crawler; somente mudar a URL do cliente não gera metadados específicos.
6. Comparar capturas reais em orientações e larguras diferentes; validar campanhas com 0, 1, 2, 10, 20 e 50 produtos e consistência de PDF e imagens.

Não publicar em produção sem autorização.
