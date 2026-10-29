# Carrinho e adornos 3D — Black Friday

Referência: `../../bom-pra-voce-novo/src/images/offer-themes/black-friday/referencias/18-black-friday.png`. Aplicação: título do tema `black-friday`, compartilhado pelo site e pela prévia do painel local.

## Recursos

Em `bom-pra-voce-novo/src/images/offer-themes/`:

- `black-friday-carrinho-3d.png`: original transparente.
- `black-friday-carrinho-3d.webp`: versão de 400 px para entrega, 32.270 bytes.
- `black-friday-brilhos-3d.png`: original transparente.
- `black-friday-brilhos-3d.webp`: versão de 400 px para entrega, 20.774 bytes.

Gerados com a ferramenta integrada de imagens. Prompt do carrinho: ícone isolado inspirado no carrinho amarelo ao lado do título da prancha; estrutura tubular espessa, esmalte amarelo, faces laterais violetas, reflexos brilhantes, perspectiva e inclinação discreta, duas rodas, fundo transparente, sem produtos, texto ou logotipo. Prompt dos efeitos: três raios amarelos em forma de gota, dois confetes violetas e uma estrela de quatro pontas, com volume, bordas arredondadas e reflexos, fundo transparente e sem texto.

## Movimento e integração

- Carrinho flutua 5 px em ciclo suave de 5,8 segundos, com rotação de -2 a 2 graus.
- Efeitos se deslocam 2 px em ciclo de 6,4 segundos.
- Título continua sendo texto HTML: sombra em camadas cria profundidade, com oscilação de 1,5 px em 7 segundos.
- Elementos decorativos não recebem foco nem interceptam cliques. Tamanhos adaptados para notebook, tablet e celular.
- `prefers-reduced-motion: reduce` desativa todas essas animações.
- A prévia do painel importa o mesmo componente e a mesma folha de estilos, incluindo as animações.

O navegador integrado continuou indisponível nesta etapa. A geração dos recursos foi inspecionada diretamente, mas a captura da composição animada final e a avaliação visual em execução permanecem pendentes.
