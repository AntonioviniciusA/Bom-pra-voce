> **Atualização de 28/10/2026:** consulte [Black Friday: operação e validação atual](vitrine-novembro-2026.md) e [organização das imagens](vitrine-imagens.md). O registro abaixo descreve a entrega anterior.

Atualização local de 29/10/2026: um cadastro pode reunir até oito fragrâncias/variantes com um GTIN válido e exclusivo para cada uma. O preço do item na campanha vale para todas as fragrâncias reunidas. A tabela mostra marca, nome, fragrâncias, conteúdo e códigos; a vitrine pública separa essas informações em linhas e relaciona cada GTIN à sua fragrância nos detalhes. O vencimento da embalagem/lote é editado em cada item da campanha, separado do período promocional, e, quando informado, deve ser igual ou posterior ao último dia da campanha. A publicação remota e o frontend público ainda precisam receber esta revisão para exibir os novos campos.

# Vitrine e painel local — implementação de 27–28/10/2026

## Fluxo do operador

1. Entre no painel com sua conta e segundo fator. A conta precisa da permissão `promotions.manage`.
2. Em **Ofertas → Vitrine de produtos**, cadastre o produto. Preserve o código como texto, confira GTIN ou justifique PLU, marca, variante e conteúdo.
3. Anexe a foto correspondente, indique origem e autorização e aprove a correspondência. As dimensões recebidas são exibidas; a proporção é preservada.
4. Crie uma campanha, defina período em Brasília, condições, tema, preços e unidades. **Preparar novembro** cria um rascunho editável, sem produtos fictícios.
5. Confira a prévia. **Salvar rascunhos locais** grava no computador e não publica.
6. Use **Conferir estado no site** e **Publicar campanha no site**. As pendências bloqueiam a publicação. Uma nova revisão é necessária para alterar ofertas já publicadas.
7. **Retirar … do site** encerra a exibição. Em caso de resposta perdida, confira o estado antes de repetir: o servidor pode ter concluído a operação.

O site consulta campanhas publicadas dentro da validade. A página inicial usa a nova vitrine; `/ofertas/novembro` filtra campanhas com período que cruza novembro de 2026. Carregamento, falha e ausência de ofertas são estados distintos. Não se exibem produtos das pranchas como dados comerciais.

## Fotos e Stories

Os arquivos-fonte do repositório estão em `bom-pra-voce-novo/src/images/`. Veja o [guia da biblioteca](../bom-pra-voce-novo/src/images/README.md). Foram centralizadas 385 imagens antes espalhadas em documentos, evidências, seeds e ícones; `node tools/verify-images.cjs` confere os hashes originais. Build e execução geram cópias dos ícones públicos para manter os mesmos endereços.

Fotos de produtos são dados operacionais: IndexedDB nos rascunhos e Storage `promotion-public/products/assets/` nas publicações. O envio usa caminhos derivados do conteúdo e mantém imagens imutáveis, com versão menor para telas pequenas. Fotos e textos permanecem associados ao snapshot publicado. Não se apagam arquivos após uma resposta ambígua, pois uma publicação pode já referenciá-los.

Cada card publicado permite preparar um PNG 1080 × 1920, baixar e, em navegadores compatíveis, compartilhar a imagem. O Story utiliza foto inteira, descrição, preço, unidade e validade da publicação. Abrir o seletor de compartilhamento não confirma postagem no Instagram. Este fluxo não agenda nem publica automaticamente no Feed ou Stories.

## Contrato e proteção

- `product-showcase`: GET público e POST administrativo, com verificação de usuário, AAL2 e permissão.
- `bpv.product_campaigns`: snapshot atual, revisão, estado e período.
- `bpv.product_campaign_revisions`: histórico das publicações e retiradas.
- A leitura retorna relógio do servidor, versão e campanhas em uma única consulta. O cliente descarta respostas atrasadas e remove preços na expiração antes de aguardar a rede.
- Escrita serializada por campanha e revisão esperada. Chamadas diretas das funções SQL ficam restritas ao serviço; tabelas privadas têm RLS e nenhum acesso de `anon`/`authenticated`.
- Limites: 100 produtos, fotos preparadas de até 2 MB e campanha legada de até 28 MB por requisição. Validação de campos, códigos, período, aprovação e URLs no servidor.

## Supabase remoto

Projeto confirmado: `jcyffbjsvwkmzgvilxha` (**Bom pra voce**).
Aplicadas as migrações `product_showcase` e `seasonal_promotion_themes`; publicada a Edge Function `product-showcase` (versão 2, incluindo envio otimizado de imagens). GET remoto respondeu HTTP 200 com lista vazia e CORS do domínio do site. Nenhuma oferta comercial foi criada para testar.

As migrações locais de Instagram/antivírus não foram aplicadas por esta entrega. O histórico remoto já apresentava diferenças anteriores; não executar um push geral de migrações sem reconciliar essas diferenças. Os arquivos locais destas duas migrações foram alinhados aos identificadores do histórico remoto: `20261028015232_product_showcase.sql` e `20261028015409_seasonal_promotion_themes.sql`.

Advisors: tabelas privadas sinalizadas como RLS sem política, intencionalmente fechadas aos clientes; proteção contra senhas vazadas já estava desabilitada no projeto. Não se alterou a configuração de autenticação nesta entrega.

## Validação e limites

Testes do banco cobrem permissão, conflito de revisão, retirada, histórico e remoção de campos privados da resposta pública. Testes de frontend cobrem carregamento, falha, expiração e ausência de produtos de demonstração. Site: 53 testes em 14 suítes passaram. Painel: 42 testes em 12 suítes passaram com `--maxWorkers=1`; uma execução concorrente anterior excedeu 5 segundos em um teste de interface, que passou na execução sequencial. Banco: migrações e testes de integridade passaram. As compilações de site e painel passaram; o painel conserva aviso de tamanho de bundle e a base de navegadores informa desatualização. Integridade: 385 hashes preservados, 518 links de imagens da documentação resolvidos e 44 referências estáticas do build verificadas. GET remoto HTTP 200; POST administrativo sem autenticação HTTP 401.

Publicação real com uma conta AAL2 e produtos aprovados, inspeção visual final (o navegador integrado falhou ao reconectar às prévias locais), inspeção em dispositivos reais e compartilhamento no aplicativo Instagram ainda exigem validação operacional. Rascunhos e catálogo permanecem locais, sem sincronização entre computadores. Compilar o painel não gera um instalador nem publica o frontend.

Fontes técnicas consultadas: [RLS e grants](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage](https://supabase.com/docs/guides/storage).
