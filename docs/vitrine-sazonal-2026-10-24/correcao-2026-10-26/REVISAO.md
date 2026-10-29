# Correção da vitrine após rejeição

Revisão concluída em 27/10/2026. A pasta conserva a data de início da correção.

## Referências e resultado

Referências: pranchas 16 (Crianças), 17 (Outubro Rosa) e 22 (lista do painel). A versão genérica de `../implementacao-2026-10-26` foi rejeitada pelo usuário e não é referência aprovada.

A correção recupera a faixa roxa de categorias, quatro produtos no notebook e dois no celular, preço roxo sobre pincelada amarela, detalhes em botão roxo, cabeçalho sazonal e rodapé com convite ao compartilhamento. Outubro Rosa permanece separado dos preços. Crianças passa a usar título em duas linhas, azul/roxo, moldura amarela de papel e rodapé roxo com megafone. O painel usa tabela com produto, código, preço, validade, situação da foto e ações.

## Evidência reproduzível

- `../../../bom-pra-voce-novo/src/images/library/docs/vitrine-sazonal-2026-10-24/correcao-2026-10-26/comparacao-outubro.png`: referência à esquerda, implementação à direita.
- `../../../bom-pra-voce-novo/src/images/library/docs/vitrine-sazonal-2026-10-24/correcao-2026-10-26/comparacao-mobile.png`: Outubro Rosa no celular, mesma ordem.
- `../../../bom-pra-voce-novo/src/images/library/docs/vitrine-sazonal-2026-10-24/correcao-2026-10-26/comparacao-criancas.png` e `../../../bom-pra-voce-novo/src/images/library/docs/vitrine-sazonal-2026-10-24/correcao-2026-10-26/comparacao-criancas-mobile.png`: Crianças, mesma ordem.
- `../../../bom-pra-voce-novo/src/images/library/docs/vitrine-sazonal-2026-10-24/correcao-2026-10-26/painel-outubro.png`: tabela funcional em demonstração isolada.
- `GALERIA.html`: acesso às comparações e à prévia local.

Capturas feitas no navegador integrado. A página de conferência fixa o conteúdo em 1280 px (notebook) ou 390 px (celular), independentemente da largura do painel do navegador. As comparações são montagens de diagnóstico, sem alteração do conteúdo capturado. Os arquivos `*-v1` e `../../../bom-pra-voce-novo/src/images/library/docs/vitrine-sazonal-2026-10-24/correcao-2026-10-26/painel-v2.png` registram etapas intermediárias, não o resultado final.

## Diferenças explícitas

- Fotos reais não fazem parte desta etapa: espaços reservados, sem embalagens inventadas.
- Os quatro valores demonstrativos vêm da prancha. A demonstração não grava no catálogo real e não publica ofertas.
- O logotipo é o arquivo original do projeto; não foi substituído pelo desenho aproximado da prancha gerada.
- Datas são dados da campanha; não estão gravadas nas imagens. A prancha infantil exemplifica 2027; a demonstração local usa outubro de 2026.
- Ornamentos foram reconstruídos como imagens de decoração. Não são cópia pixel a pixel da ilustração; a comparação registra essa diferença.
- O painel preserva a navegação existente e acrescenta controles necessários ao rascunho local. Stories e publicação ainda não têm implementação neste fluxo.

## Validação

- Painel: 7 arquivos e 21 testes passaram, incluindo seleção somente dos itens filtrados, edição em centavos e ordenação/remoção após busca.
- Compilação do painel passou; aviso de pacote JavaScript maior que 500 kB permanece.
- Busca da vitrine por DEMO-2 conferida no navegador: retorna somente Feijão carioca.
- Outubro e Crianças comparados visualmente em notebook/celular. A ausência de fotos impede avaliar o resultado comercial completo.

## O que ainda falta fechar no planejamento completo

Os 21 conjuntos iniciais de decoração continuam em `../assets-v1`. Esta revisão não declara os outros 19 temas visualmente fiéis às respectivas pranchas: precisam da mesma comparação individual antes de serem considerados prontos. Também faltam publicação da nova vitrine, geração de Stories, cadastro/aprovação de produtos reais e otimização das novas imagens PNG para distribuição pública. A Home pública mantém o fluxo anterior; nenhuma publicação ou alteração remota foi feita.

## Origem dos novos recursos

Arquivos locais em `bom-pra-voce-novo/src/images/offer-themes`: `outubro-papel-v2.png`, `criancas-papel-v2.png`, `criancas-rodape-v2.png`, `preco-pincel-v2.png`, `data-pincel-rosa-v2.png`. Gerados pela ferramenta integrada de imagens a partir das pranchas, sem produtos, textos ou preços.

Prompts de produção: moldura rosa de papel com folhagens e centro livre para Outubro Rosa; moldura infantil amarela com ondas azuis/roxas e estrelas; pincelada amarela transparente para preço; pincelada rosa transparente para data. Rodapé infantil: faixa roxa de papel em camadas, estrelas amarelas nas extremidades, megafone amarelo à esquerda, coração branco à direita, centro livre, sem texto/logotipo/produtos.

Fontes locais e licenças: [Barlow Condensed](https://github.com/google/fonts/tree/main/ofl/barlowcondensed) e [Lilita One](https://github.com/google/fonts/tree/main/ofl/lilitaone), repositório oficial Google Fonts. A escolha aproxima a linguagem visual; não identifica uma fonte exata na imagem gerada.
