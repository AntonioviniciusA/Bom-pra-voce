# Plano de publicação — Segunda da Limpeza

**Campanha:** Segunda da Limpeza

**Vigência pretendida:** segunda-feira, **12/10/2026**, durante o horário de funcionamento da loja.

**Canal:** site da loja.

**Status:** planejamento e conferência; não aprovado para publicação.

> A data foi validada no calendário: 12 de outubro de 2026 cai em uma segunda-feira.

## Regra de nomenclatura para evitar confusão entre campanhas

Usar a data no padrão ISO (`AAAA-MM-DD`) no nome de **todo** arquivo e versão gerados para a campanha. Para este caso, a referência obrigatória é `2026-10-12`.

Exemplos aprovados:

- `panfleto-segunda-da-limpeza-2026-10-12-opcao-a.png`
- `panfleto-segunda-da-limpeza-2026-10-12-opcao-b.png`
- `panfleto-segunda-da-limpeza-2026-10-12-final-a4-vertical.png`
- `PLANO-PANFLETO-SEGUNDA-DA-LIMPEZA-2026-10-12.md`

Não usar somente “segunda”, “outubro” ou “12-10” no nome: essas formas ficam ambíguas em novas gerações, campanhas recorrentes ou organização por ano.

## Objetivo e regra de ouro

Publicar uma oferta identificável, verificável e honrada exatamente como apresentada. Pelo Código de Defesa do Consumidor (CDC), uma publicidade suficientemente precisa vincula o fornecedor; a oferta deve trazer informações corretas, claras, precisas e ostensivas. Não usar preço, foto, marca, volume ou condição diferente do que a loja poderá cumprir.

## Conteúdo aprovado para conferência de preço

| Produto a anunciar | Marca/descrição | Unidade anunciada | Preço à vista |
|---|---|---:|---:|
| Escova multiuso Premium | Asa Brasil | un. | R$ 4,99 |
| Escova sanitária com base | Asa do Brasil | un. | R$ 14,99 |
| Sabão querosene | Azulim / Azul-Marinho, **confirmar marca** | 1 L | R$ 15,99 |
| Difusor | Tropical Aromas | 250 mL | R$ 13,99 |
| Pá de lixo com cabo pequeno | Rodovax | un. | R$ 7,99 |
| Vassoura de pelo | Esfrelux | un. | R$ 18,99 |
| Multiuso | Azulim / Azul-Marinho, **confirmar marca** | 500 mL | R$ 2,99 |
| Papel higiênico folha dupla | Floral | 12 rolos de 20 m, **confirmar embalagem** | R$ 8,99 |
| Amaciante | Downy | 750 mL | R$ 15,99 |
| Lava-roupas | Apyce | 800 mL | R$ 5,99 |
| Limpador perfumado | Casaflor | 1 L | R$ 5,99 |

Todos os valores precisam ser exibidos como preço total à vista, em reais, com a mesma proeminência visual. Se houver parcelamento, frete, retirada, clube/CPF, limite por cliente ou outra condição, ela precisa aparecer junto do preço e antes de o consumidor decidir comprar.

## Estrutura recomendada do panfleto no site

```html
<section aria-labelledby="titulo-segunda-limpeza">
  <img src="[URL_DA_LOGO_OFICIAL]" alt="[NOME_DA_LOJA]" />
  <p>OFERTAS VÁLIDAS SOMENTE EM 12/10/2026, SEGUNDA-FEIRA.</p>
  <h1 id="titulo-segunda-limpeza">Segunda da Limpeza</h1>
  <!-- grade: foto conferida, nome completo, marca, quantidade e preço de cada item -->
  <p>Preços à vista. Ofertas válidas enquanto durarem os estoques da quantidade informada abaixo.</p>
  <p>[RAZÃO SOCIAL] · CNPJ [CNPJ] · [ENDEREÇO FÍSICO COMPLETO] · [CANAL DE ATENDIMENTO]</p>
</section>
```

### Logo e identificação da loja

- Inserir somente a **logo oficial em arquivo controlado pelo site**. O caminho não foi localizado nesta etapa; não publicar com um arquivo temporário ou copiado das fotos de referência.
- O rodapé do site/página da oferta deve disponibilizar, de forma fácil de localizar: nome empresarial, CNPJ, endereço físico e canal de atendimento. Esses dados ainda precisam ser fornecidos ou confirmados pelo responsável.
- Não inventar slogan, razão social, CNPJ, endereço, WhatsApp, regras de retirada, entrega ou política de troca.

## Condições que precisam ser decididas antes de publicar

| Tema | Decisão necessária | Motivo |
|---|---|---|
| Estoque | Informar a quantidade disponível de cada SKU ou retirar a alegação “enquanto durarem os estoques” e garantir disponibilidade para a campanha. | A oferta precisa ser precisa e cumprível. |
| Abrangência | Loja física, retirada e/ou entrega; indicar bairros/CEP e custo/prazo quando houver entrega. | Evita que o site prometa uma modalidade inexistente. |
| Limite | Definir limite por CPF/cliente, se existir. | Não pode ser inserido depois nem escondido em letras pequenas. |
| Forma de pagamento | Confirmar que todos os preços são à vista e dizer quais meios são aceitos. | Parcelamento ou condição vinculada precisa ser informada. |
| Horário | Informar horário da loja no dia 12/10/2026. | A data coincide com feriado nacional de Nossa Senhora Aparecida; a abertura e a operação devem ser confirmadas. |
| Compra online | Confirmar se haverá carrinho/pagamento no site ou apenas divulgação. | Venda à distância exige informações e atendimento próprios; o texto e fluxo mudam. |

## Conferência das fotos — uso exclusivamente interno

As imagens abaixo são referências comparativas enviadas para esta campanha. Elas **não devem ser publicadas diretamente**, pois estão em diretório temporário, não são ativos gerenciados pelo site e não comprovam todos os dados comerciais. Antes da arte final, fotografar ou selecionar a imagem do SKU efetivamente vendido e guardar a aprovação.

| Item relacionado | Caminho da imagem de referência | Resultado da comparação visual | Ação antes da publicação |
|---|---|---|---|
| Limpador perfumado Casaflor 1 L | `C:\\Users\\anton\\AppData\\Local\\Temp\\codex-clipboard-c2587cf7-1782-4470-9822-ae6a800871a6.jpg` | A foto exibe Casaflor 1 L. | Confirmar variante/perfume que estará à venda. |
| Lava-roupas Apyce 800 mL | `C:\\Users\\anton\\AppData\\Local\\Temp\\codex-clipboard-f8c53ce6-f708-4d64-b294-bd9e99674af2.jpg` | A foto exibe refil Apyce 800 mL. | Confirmar que a oferta é do refil, não de frasco. |
| Amaciante Downy 750 mL | `C:\\Users\\anton\\AppData\\Local\\Temp\\codex-clipboard-67fb6f9b-f5dd-4ce2-a94b-2af893f3f6f8.jpg` | A foto exibe refil Downy 750 mL. | Confirmar que a oferta é do refil e a fragrância. |
| Papel higiênico Floral | `C:\\Users\\anton\\AppData\\Local\\Temp\\codex-clipboard-73146835-da47-4bff-86b9-a7599124e760.jpg` | A foto indica 12 rolos, 20 m e folha dupla. | Usar “12 rolos de 20 m” na arte, após conferência do SKU. |
| Multiuso 500 mL | `C:\\Users\\anton\\AppData\\Local\\Temp\\codex-clipboard-f366822c-287f-4300-9b84-4ca995baee11.jpg` | Rótulo visível: Azulim Casa & Cozinha 500 mL. | Corrigir a marca no briefing: “Azulim” não “Azul-Marinho”, se este for o produto. |
| Vassoura Esfrelux de pelo | `C:\\Users\\anton\\AppData\\Local\\Temp\\codex-clipboard-f421f76b-f323-4438-8a0f-4d828d570e74.jpg` | A foto mostra uma vassoura Esfrelux de pelo. | Confirmar modelo/cor, se relevante para não divergir da imagem final. |
| Pá de lixo com cabo pequeno Rodovax | `C:\\Users\\anton\\AppData\\Local\\Temp\\codex-clipboard-1954546d-c61f-4450-bd49-a1360c440a42.jpg` | Rótulo Rodovax visível. | Confirmar que o cabo pequeno acompanha o produto anunciado. |
| Difusor Tropical Aromas | `C:\\Users\\anton\\AppData\\Local\\Temp\\codex-clipboard-59cbc931-9369-4c96-81ef-fcd0859c1a2d.jpg` | Marca visível; volume não legível na foto. | Confirmar no produto que o conteúdo é 250 mL. |
| Sabão querosene 1 L | `C:\\Users\\anton\\AppData\\Local\\Temp\\codex-clipboard-23661bc0-283e-448b-81b8-c1d595323408.jpg` | A imagem recebida exibe Azulim Sabão Querosene 1 L. | Confirmar a marca no briefing antes da arte. |
| Escova sanitária com base | `C:\\Users\\anton\\AppData\\Local\\Temp\\codex-clipboard-96c12d7a-06cd-4e68-8f5b-84a1a05f4d5d.jpg` | Rótulo aparente: “Vassoura Sanitária Base Premium Asa do Brasil”. | Confirmar se o nome comercial correto é vassoura ou escova sanitária. |
| Escova multiuso Premium | `C:\\Users\\anton\\AppData\\Local\\Temp\\codex-clipboard-26b75ced-39a2-4a8b-8261-a291dcfe2778.jpg` | Foto de escova; marca não legível com segurança. | Conferir marca, modelo e unidade no estoque. |

## Checklist de aprovação — responsável comercial

- [ ] SKU, marca, volume/unidade e preço foram confrontados com o produto físico e o sistema de caixa.
- [ ] Há estoque suficiente ou a quantidade disponível foi informada por SKU.
- [ ] A loja estará aberta em 12/10/2026 e o horário foi inserido quando aplicável.
- [ ] O arquivo da logo oficial foi inserido e está legível em celular.
- [ ] Razão social, CNPJ, endereço e atendimento estão visíveis na página/rodapé.
- [ ] As fotos finais correspondem ao SKU anunciado; as referências temporárias não foram publicadas.
- [ ] A vigência “somente em 12/10/2026” está visível sem rolagem excessiva e sem letra ilegível.
- [ ] A página foi revisada em celular, com textos alternativos nas imagens e contraste suficiente.
- [ ] Após a virada do dia, a oferta será removida, arquivada ou marcada como encerrada para evitar venda com preço expirado.

## Base legal consultada

- [Código de Defesa do Consumidor — Lei nº 8.078/1990, arts. 6º, 30, 31, 35 e 36](https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm): informação clara; oferta vincula o fornecedor; apresentação correta de características, quantidade, preço e prazo; identificação da publicidade.
- [Decreto nº 7.962/2013](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm): para comércio eletrônico, exige divulgação ostensiva da identificação do fornecedor, inclusive nome empresarial, CNPJ e endereço físico e eletrônico.
- [Lei nº 10.962/2004](https://www.planalto.gov.br/ccivil_03/leis/l10.962.htm): regras de afixação de preços em produtos e serviços para o consumidor.

> Este documento é um guia operacional de publicidade de consumo, não substitui orientação jurídica individual ou regras estaduais/municipais eventualmente aplicáveis ao estabelecimento.
