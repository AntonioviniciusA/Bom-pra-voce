# Revisão: artes nas capas e fotos nas galerias

Este registro substitui a decisão anterior de usar fotos como capas. Conforme correção do usuário, as capas voltam às artes ilustradas. Bebidas e Adega reúne as duas artes existentes; Laticínios e Frios recebeu arte própria. Padaria mantém arte de pães e selo Em breve; a foto da reforma aparece apenas na galeria.

## Galerias

Correção final solicitada pelo usuário: Bebidas e Adega tem **três fotos** — refrigerantes, cervejas e adega de madeira com vinhos, espumantes e destilados. A terceira deriva da foto existente `unnamed.webp`, retocada para retirar etiquetas de preço e salva como `adega-vinhos-galeria.jpg`. Navegação anterior/próxima e teclado usam a quantidade real de fotos. Os outros setores mantêm duas opções conforme abaixo.

Cada setor possui duas opções navegáveis por miniatura, setas e teclado. Bebidas usa foto dos refrigerantes e foto das geladeiras de cervejas; Hortifrúti usa vista das frutas e dos legumes; Laticínios usa dois trechos do balcão; Congelados usa vista elevada e longitudinal. Padaria é exceção documental: somente uma foto foi recebida, apresentada inteira e em recorte, identificado no contador. Não são dois registros distintos.

Novos arquivos em src/images/Setores: bebidas-galeria-2.jpg, hortifruti-galeria-2.jpg, laticinios-galeria-2.jpg, congelados-galeria-2.jpg e laticinios-arte.jpg. Fotos retocadas por IA para retirar preços; detalhes pequenos podem diferir dos originais. Nenhum original foi sobrescrito.

## Avaliação do fluxo

1. **Escolher setor:** capas ilustradas coerentes com a referência fornecida, título sobre fundo escuro e arte específica de laticínios. Evidência: [desktop](validacao/setores-1440.png) e [celular](validacao/setores-390.png).
2. **Abrir e trocar foto:** setas agora percorrem fotos do mesmo setor, miniatura selecionada recebe borda, contador indica posição. Evidência: [galeria de bebidas](validacao/modal-1440-0.png) e [balcão no celular](validacao/modal-390-2.png).
3. **Fotos verticais:** preservado enquadramento inteiro, com espaço neutro lateral em vez de cortar produtos. Evidência: [hortifrúti](validacao/modal-390-1.png). Imagens verticais ficam menores; nova foto horizontal seria uma melhoria futura, sem bloquear uso das atuais.
4. **Padaria:** faixa legível, fundo suavizado, aviso de reforma e indicação de que a segunda opção é um recorte. Evidência: [padaria](validacao/modal-390-4.png).
5. **Fechar e navegar por teclado:** Escape fecha; foco retorna ao card; Tab fica dentro do modal. Controles possuem nomes acessíveis. Não foi feita auditoria completa com leitor de tela.

Achado corrigido durante a revisão: ícones eram escolhidos pela posição da categoria e mostravam símbolos sem relação com seu conteúdo. Passaram a representar o setor. A grade não apresentou overflow horizontal em 320, 390, 768 ou 1440 px. No celular, cinco cards deixam um item na última linha; mantida largura consistente em vez de ampliar artificialmente a padaria.

## Validação

Build de produção; três testes React para capa versus foto, troca e reinício da galeria, fechamento e foco. Edge/Playwright autorizado pelo usuário após duas falhas do navegador integrado. Galerias verificadas nas quatro larguras, incluindo seleção da segunda foto e fechamento por Escape. Capturas atuais em validacao/.

Alterações locais, sem deploy, push ou commit. Os demais lotes não publicados continuam disponíveis para futuras seleções.
