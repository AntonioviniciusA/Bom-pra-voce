**Atualização de 26/10/2026:** implementação local autorizada e escopo confirmado como vitrine de produtos individuais. Veja [estado, capturas e limites da primeira implementação](implementacao-2026-10-26/AVALIACAO.md) e a [galeria dos 21 temas no componente](implementacao-2026-10-26/GALERIA.html). As restrições de implementação abaixo são históricas; publicação pública e Stories continuam pendentes.

# Vitrine sazonal — planejamento e estudos visuais

Data: **24/10/2026**. Estado: **planejamento; implementação expressamente não autorizada**.

**Atualização de 25/10/2026:** análise do estado atual em [Fechamento do planejamento](07-fechamento-2026-10-25.md). O usuário autorizou preparar **decorações para todos os 21 temas**, sem fotos de produtos. Materiais separados e guia em [assets-v1](assets-v1/README.md), com [galeria interativa](assets-v1/galeria.html). A autorização é para materiais; a implementação funcional continua pendente. As afirmações abaixo sobre ausência de assets finais descrevem a entrega original de 24/10; o pacote novo entrega elementos transparentes, não Stories comerciais prontos.

## Decisões do usuário

**Última correção de escopo:** sem Feed. Manter notebook, celular e **Stories**, com compartilhamento também pelo cliente. Convite: **“Não guarde o segredo da economia. Compartilhe!”**. O estudo inicial com Feed foi superado e não integra a galeria final.

- Aprovados: direção visual sazonal e conceito de painel local com prévia.
- Manter a identidade e o arquivo original do logo do supermercado.
- A seção entra abaixo dos banners existentes: não criar outro banner de ofertas.
- Nome, período e categorias preestabelecidas alimentam a seção.
- Um cadastro de produtos alimentará site e artes para Instagram.
- Criar estudos para celular, notebook e Story em cada tema.
- Informar proporção recomendada e avisar sobre imagens inadequadas no painel.
- Cada produto deve ter foto correspondente e aprovada, descrição, preço e código de barras para identificação.
- Documentar prevenção de erros durante carregamento e controle dos produtos em promoção.

## Documentos

1. [Painel, catálogo e promoções](01-painel-produtos-promocoes.md)
2. [Imagens, aprovação e formatos](02-imagens-formatos-aprovacao.md)
3. [Carregamento, identidade e consistência](03-carregamento-identidade.md)
4. [Biblioteca de temas e materiais](04-temas-materiais.md)
5. [Validação futura, etapas e fontes](05-validacao-fontes.md)
6. [Galeria dos estudos visuais](GALERIA.md)
7. [Stories da loja e compartilhamento pelo cliente](06-stories-compartilhamento.md)

## Como interpretar o material

As pranchas mostram três aplicações de um mesmo tema: notebook, celular e Story. São estudos de composição, não capturas de um sistema implementado e não são arquivos publicáveis de ofertas reais. Os enquadramentos reduzidos da prancha não equivalem às resoluções finais indicadas na especificação.

Fotos, embalagens, preços e períodos de exemplo são ilustrativos e não estão aprovados para venda. A aprovação da direção visual não aprova automaticamente cada produto, mensagem, imagem gerada ou campanha. Imagens geradas podem aproximar tipografia e logo; na produção futura, usar o logo original e texto renderizado a partir dos dados, sem redesenho por IA.

Os estudos podem conter pequenas diferenças em relação às regras escritas. Em caso de conflito, prevalecem: identidade exata do produto, legibilidade, datas corretas, categorias cadastradas e ausência de banner adicional. A documentação define o comportamento; a imagem define a direção visual.

## Evidência atual e limites

Inspeção local em 24/10/2026:

- `painel-local/src/Offers.jsx`: gerenciamento centrado em campanhas e upload de panfleto; não oferece a lista granular de produtos proposta aqui.
- `painel-local/src/promotionOptions.js`: cinco opções de cor; não são pacotes sazonais completos.
- `bom-pra-voce-novo/src/services/promotions.js`: validação de campanhas, versão, horário do servidor e cache.
- `bom-pra-voce-novo/src/hooks/usePromotions.js`: cancelamento, geração da consulta, atualização periódica e expiração.
- `bom-pra-voce-novo/src/Components/Tabloide/PromotionShowcase.jsx`: seleção de campanha por índice e exibição de arquivo.

Essas evidências não confirmam o estado do ambiente publicado nem explicam, sozinhas, o erro visto na captura. Nenhum serviço externo, conta social ou banco de produção foi alterado neste trabalho. Não foram executados testes do produto, pois não há mudança funcional.

Há alterações de outros trabalhos no checkout em Cards, CSS, design-qa e documentos de setores. Não pertencem a esta entrega. Esta entrega deve permanecer restrita a esta pasta de planejamento.



## Correção após rejeição — 27/10/2026

A implementação genérica foi rejeitada. Consulte [comparações atuais](correcao-2026-10-26/GALERIA.html) e [relatório de correção e pendências](correcao-2026-10-26/REVISAO.md). Outubro Rosa e Crianças foram revistos; os outros 19 temas ainda não têm a mesma validação de fidelidade. O conjunto completo não está aprovado.
