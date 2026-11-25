> Atualização de evidências em 28/10/2026: prints de Black Friday substituídos foram removidos. Links de imagem agora apontam ao estado atual; o relato datado abaixo é histórico. As pranchas de referência permanecem preservadas.

# Novembro — site e painel local

## Implementado

- Página real do site em `/ofertas/novembro`, com navegação e rodapé do site, metadados próprios e conteúdo estático correspondente para leitores sem JavaScript.
- Identidade Black Friday: fundo escuro, detalhes luminosos roxos/amarelos, título em duas linhas, faixa de data, categorias e linguagem dos cards documentados.
- Modelo compartilhado entre site e painel: “Seleção Black Friday”, tema `black-friday`, período sugerido de 23 a 27/11/2026, conforme a prancha. O período é editável e não ativa a campanha automaticamente.
- No painel, botão **Preparar novembro** em **Ofertas → Vitrine de produtos → Campanhas**. Cria um rascunho vazio ou seleciona o rascunho de novembro existente, preservando seus ajustes. Use **Salvar rascunhos locais** para persistir.
- A prévia do painel usa o componente e os mesmos estilos/imagens do site, nos modos notebook e celular.

## Imagens preparadas

Em `bom-pra-voce-novo/src/images/offer-themes/`:

- `black-friday-papel-v2.png`: original gerado a partir da referência `../pranchas-ofertas-sazonais/18-black-friday.png`.
- `black-friday-papel-v2.webp`: versão usada no site, 60.652 bytes, mantendo o original disponível.
- `preco-pincel-v2.webp` e `data-pincel-rosa-v2.webp`: recursos compartilhados para preço e data. A faixa de data de novembro recebe o tratamento roxo nos estilos.

Geração pela ferramenta integrada de imagens, sem fotos de produtos. Prompt: fundo quase preto/violeta, raios diagonais roxos e pequenos detalhes amarelos nas extremidades, etiqueta de percentual à direita, centro livre para texto; sem logotipo, preços, produtos ou botões. A arte é uma reconstrução da decoração, não uma cópia exata de cada pixel da prancha.

## Estado dos dados

A página real apresenta **“As ofertas de novembro estão sendo preparadas. Volte em breve.”** enquanto não existe uma campanha publicada. Não contém os quatro produtos nem os preços ilustrativos da prancha. Compartilhar ofertas fica desabilitado sem itens.

O painel mantém rascunhos no computador. A publicação desses rascunhos no site e a geração de Stories ainda não estão implementadas. Não houve publicação, alteração de banco remoto ou geração de instalador.

## Evidências e limites

- Testes do painel: 22 passaram, incluindo criação idempotente de novembro e preservação do nome editado.
- Testes focados do site: 2 passaram, incluindo ausência de produtos demonstrativos na página real.
- Capturas anteriores do tema estão em `../../bom-pra-voce-novo/src/images/offer-themes/black-friday/evidencias/atual/semana-desktop.png` e `black-friday-mobile.png`. São demonstrações de composição, não capturas da nova página vazia.
- A conferência visual da integração final está pendente: o navegador integrado falhou ao iniciar, inclusive após reinicialização. Não usar as capturas anteriores como prova dessa última integração.

URLs locais: site `http://127.0.0.1:3000/ofertas/novembro`; painel `http://127.0.0.1:5175/`; demonstração de composição `http://127.0.0.1:5175/seasonal-visual.html?theme=black-friday`.

Compilações finais: site e painel passaram. A página estática build/ofertas/novembro/index.html foi gerada com a mensagem correta de preparação. A validação visual no navegador continua pendente; compilação e testes não substituem essa inspeção.
