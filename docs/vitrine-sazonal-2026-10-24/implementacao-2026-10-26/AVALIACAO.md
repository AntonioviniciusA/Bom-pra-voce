> **VERSÃO REJEITADA / SUPERADA.** O usuário rejeitou esta composição por divergir das pranchas. As afirmações visuais abaixo são registro histórico, não aprovação atual. Consulte [a correção e suas limitações](../correcao-2026-10-26/REVISAO.md).

# Vitrine de produtos — implementação local e avaliação

Data: 26/10/2026. Escopo confirmado pelo usuário: nova vitrine de produtos individuais, começando por outubro; decoração dos 21 temas, sem fotos de produtos nesta etapa.

## O que funciona localmente

- Componente real de cards individuais no código do site, com categorias, busca por descrição/código, detalhes, unidade e preço em centavos.
- Composição de teste dentro da Home, abaixo dos banners existentes. A Home pública padrão ainda usa os panfletos até existir publicação da nova vitrine.
- Outubro Rosa discreto, em nota separada dos cards. Fonte institucional: [INCA — Outubro Rosa 2026](https://www.gov.br/inca/pt-br/assuntos/eventos/outubro-rosa-2026).
- Biblioteca de 21 decorações compartilhada pelo site e painel. Arquivos transparentes e formatos em `../assets-v1`.
- Dentro de Ofertas, nova área Vitrine de produtos, com Campanhas, Produtos e Imagens para revisão. Panfletos existentes continuam acessíveis.
- Catálogo separado de participação em campanha, IDs estáveis, preços em centavos, unidade, ordenação por botões e remoção sem apagar o catálogo.
- Cadastro de GTIN ou código interno/PLU; validação do dígito do GTIN e bloqueio de código duplicado. Foto requer origem, autorização e conferência individual; trocar foto ou identidade invalida a aprovação.
- Arquivos JPG/PNG/WebP até 2 MB, dimensões entre 400 e 6000 pixels. Recomendação quadrada de 1200 × 1200, com contenção sem recorte.
- Salvamento em IndexedDB deste computador/origem. Revisão transacional impede sobrescrever outra janela. Erro ao salvar não fecha nem limpa o rascunho.
- Prévia em iframe nos tamanhos de notebook/celular usando o componente e estilos do site.

## Capturas e avaliação

[Galeria dos 21 temas](GALERIA.html). Capturas `vitrine-*-1440.png`, `vitrine-*-390.png`, `vitrine-*-320.png`. [Painel](../../../bom-pra-voce-novo/src/images/library/docs/vitrine-sazonal-2026-10-24/implementacao-2026-10-26/painel-produtos-outubro.png). [Home com outubro](../../../bom-pra-voce-novo/src/images/library/docs/vitrine-sazonal-2026-10-24/implementacao-2026-10-26/site-outubro-contexto.png).

Ordem: outubro capturado, avaliado e corrigido; depois Black Friday, Natal, Ano-Novo e os demais temas. Revisão visual direta de outubro (notebook e celular), painel, Black Friday, Natal e inserção na Home. Os demais passaram pela captura e verificação estrutural automática, não por aprovação editorial individual do usuário.

Correção encontrada na captura: o seletor antigo `#promocoes` substituía o fundo sazonal por amarelo. O componente agora vence essa regra com um seletor próprio, preservando os outros estilos do site. O painel ganhou lista rolável para evitar uma página longa quando há muitos itens.

Resultado estrutural: 21 temas × 3 larguras = 63 combinações sem rolagem horizontal da página e sem erros de JavaScript. Categorias no celular têm rolagem própria. Evidências: `validacao-outubro-rosa.json` e `validacao-black-friday.json`.

A avaliação confirma estrutura e decoração, não a apresentação final de embalagens reais ou legibilidade de preços longos. Os cards mostram “Foto em preparação” e “Preço a definir”, sem simular ofertas comerciais. Não há ofertas reais cadastradas por este trabalho.

As capturas antigas `outubro-rosa-*.png` e `../../../bom-pra-voce-novo/src/images/library/docs/vitrine-sazonal-2026-10-24/implementacao-2026-10-26/painel-outubro.png` são do primeiro experimento com panfletos, anterior à confirmação de escopo. Estão superadas pelas capturas com prefixo `vitrine-` e por `../../../bom-pra-voce-novo/src/images/library/docs/vitrine-sazonal-2026-10-24/implementacao-2026-10-26/painel-produtos-outubro.png`.

## O que falta para operação pública

1. Persistência compartilhada e API de catálogo, revisões de imagens, campanhas e versões publicadas. O armazenamento local atual é um rascunho, não o banco de produção.
2. Upload privado, revisão e promoção de imagens para caminhos imutáveis; aprovação de identidade e das fotos reais.
3. Publicação atômica dos itens, conflitos entre campanhas, pausa/retirada, autorização, trilha de auditoria e validação no servidor.
4. Leitura pública versionada, horário do servidor, retirada imediata ao vencer, revalidação e tratamento de falhas. O componente visual não substitui esse contrato.
5. Cadastro dos produtos, preços e condições reais. Confirmar as nove categorias propostas com a operação da loja.
6. Geração e revisão de Stories a partir de uma versão publicada. Decorações de Story estão preparadas, mas não são artes comerciais exportadas nem envios confirmados.
7. Validar a seleção manual de temas e o visual final com fotos reais. Não foi implementada ativação automática por calendário.

A migração `20261028015409_seasonal_promotion_themes.sql` (renomeada para corresponder ao histórico remoto em 28/10) somente permite as novas chaves no contrato antigo de panfletos. Não cria o backend da vitrine individual e não foi aplicada ao serviço remoto.

## Como conferir

No painel local habitual: Ofertas → Vitrine de produtos → Nova campanha. Outubro Rosa é o tema inicial desta entrega. Cadastre produtos e salve os rascunhos; eles não aparecem no site público.

A entrada `painel-local/seasonal-visual.html` é um ambiente de avaliação no servidor de desenvolvimento, não integra o pacote de produção. Usa os componentes reais com dados de demonstração isolados. `capturar-produtos.cjs` cria seu próprio navegador e testa salvamento local, sem acessar uma sessão real ou modificar o Supabase.

Nenhum deploy, publicação de campanha, envio social, commit ou push foi realizado.

## Verificações executadas

- Painel: 18 testes passaram (inclui campanha local, erro de salvamento, identificação, revisão de foto e compatibilidade com o editor existente).
- Site: 4 testes direcionados passaram (busca/filtro da vitrine e comportamento dos panfletos existentes).
- Compilação do painel passou; aviso de tamanho de pacote acima de 500 kB permanece para otimização posterior.
- Compilação do site passou; base Browserslist antiga foi informada. O aviso de ARIA na decoração foi corrigido retirando o atributo incompatível de `picture`; as imagens decorativas mantêm texto alternativo vazio.
- Migrações existentes, permissões e transações verificadas no banco de teste local. Isso não valida o backend de produtos individuais, que ainda não foi construído.
- Verificação adicional em navegador isolado: rascunho persistiu após nova leitura, revisão avançou e gravação com revisão antiga foi recusada (`validacao-persistencia.json`).
- Verificação direcionada de acessibilidade e código dos componentes novos passou após corrigir o atributo de `picture` e a referência explícita a `window.location`.
