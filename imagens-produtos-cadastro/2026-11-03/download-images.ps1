$ErrorActionPreference = 'Stop'

$products = @(
  @{ File = '01_7896102503661_molho-tomate-quero-tradicional-240g.png'; Url = 'https://images.tcdn.com.br/img/img_prod/1299377/molho_de_tomate_quero_240g_varejo_1_unidade_1_20250729091808_4d636b765d51.png' },
  @{ File = '02_7891089440558_azeitona-la-violetera-sem-caroco-80g.jpg'; Url = 'https://gruposoares.vtexassets.com/arquivos/ids/167803/Azeitona-La-Violetera-Sem-Caroco-Doy-Pack-80g.jpg?v=637905060385870000' },
  @{ File = '03_7891089440534_azeitona-la-violetera-fatiada-80g.jpg'; Url = 'https://comper.vteximg.com.br/arquivos/ids/175596-1000-1000/7891089440534.jpg?v=637292019278330000' },
  @{ File = '04_7891089100575_azeitona-la-violetera-com-caroco-100g.jpg'; Url = 'https://bretas.vtexassets.com/arquivos/ids/214283/658d93ede7e21bc2244d520b.jpg?v=638393740677230000' },
  @{ File = '05_7896058257663_biscoito-triunfo-tortini-morango-90g.jpg'; Url = 'https://www.arenaatacado.com.br/on/demandware.static/-/Sites-storefront-catalog-sv/default/dw116bde62/Produtos/734861-7896058257663-biscoito%20triunfo%20tortini%20morango%2090g-triunfo-1.jpg' },
  @{ File = '06_7896058257670_biscoito-triunfo-tortini-trufa-90g.png'; Url = 'https://www.jauserve.com.br/dw/image/v2/BFJL_PRD/on/demandware.static/-/Sites-jauserve-master/default/dwfb61a7d8/7896058257670.png?sw=1800' },
  @{ File = '07_7891152800272_torrada-fortaleza-tradicional-142g.jpg'; Url = 'https://bompreco.vtexassets.com/arquivos/ids/163489/TorradaTradicionalFortalezaPacote142g.jpg?v=637496216422400000' },
  @{ File = '08_7894900701517_coca-cola-sem-acucar-2l.png'; Url = 'https://www.sondadelivery.com.br/img.aspx/sku/868957/530/7894900701517_0.png' },
  @{ File = '09_7894900027013_coca-cola-original-2l.jpg'; Url = 'https://www.cashladona.es/funciones?action=getimage&dealers_id=1&rowid=2351&size=big&type=products' },
  @{ File = '10_7896072911022_celebrate-maca-660ml.jpg'; Url = 'https://www.arenaatacado.com.br/on/demandware.static/-/Sites-storefront-catalog-sv/default/dw213096a8/Produtos/761079-7896072911022-sidra%20cereser%20celebrate%20660ml-cereser-1.jpg' },
  @{ File = '11_7896100501829_suco-uva-integral-alianca-1-5l.png'; Url = 'https://hortifrutibr.vtexassets.com/arquivos/ids/170204/Suco-de-Uva-Integral-Alianca-15L.png?v=639057468121370000' },
  @{ File = '12_7896855901417_vinho-pergola-tinto-suave-1l.jpg'; Url = 'https://gbarbosa.vtexassets.com/arquivos/ids/209164/6552649f8d0743e14888e342.jpg?v=638354953318700000' },
  @{ File = '13_7896002360234_pullman-bisnaguito-tradicional-300g.jpg'; Url = 'https://savegnagoio.vtexassets.com/arquivos/ids/419800/BisnaguinhaPullman300g2.jpg?v=638369742387430000' },
  @{ File = '15_7896440504023_casaflor-dreams-1l.jpg'; Url = 'https://a-static.mlcdn.com.br/800x800/limpador-casaflor-limpeza-perfumada-dreams-1l/minimercadodourado/d18f62a0f65711ec96784201ac185078/66df83516778579493b5903803d1ec43.jpg' },
  @{ File = '16_7897534800212_azulim-multiuso-original-500ml.png'; Url = 'https://images.tcdn.com.br/img/img_prod/924825/multiuso_azulim_original_500ml_3379_1_ae7a994f082ad096d95d965520434800.png' },
  @{ File = '17_7897534828568_azulim-multiuso-florata-500ml.png'; Url = 'https://www.shoppingdalimpeza.com/uploads/shoppingdalimpeza/produtos_imagens/10424-11695326750183224247.png' },
  @{ File = '18_7898976656283_apyce-superacao-sabao-liquido-800ml.jpg'; Url = 'https://multpelatacado.agilecdn.com.br/68837.jpg' },
  @{ File = '19_7500435251235_downy-brisa-verao-refil-750ml.jpg'; Url = 'https://destro.fbitsstatic.net/img/p/amaciante-concentrado-downy-brisa-de-verao-refil-750ml-89848/276846.jpg?h=1000&qs=ignore&v=202503041459&w=1000' },
  @{ File = '20_630941057858_sabonete-cliss-lavanda-85g.jpg'; Url = 'https://poupacentro.com.br/cdn/shop/files/e49d821b74d9bd16c139899d1c21e348.jpg?v=1756248494' },
  @{ File = '21_074468153424_sabonete-cliss-floral-85g.jpg'; Url = 'https://apimedias.treew.com/imgproducts/middle/267932.jpg' },
  @{ File = '22_7891155037880_prato-fundo-petala-opaline-23-5cm.jpg'; Url = 'https://paulistaoatacadista.vtexassets.com/arquivos/ids/296170/PratoFundoNadirOpaline235cmPetala.jpg?v=638080520853330000' },
  @{ File = '23_7891155017271_taca-lirio-nadir-365ml.jpg'; Url = 'https://lojasafubra.vtexassets.com/arquivos/ids/234789/Ta-a-para--gua-Nadir-L-rio-365ml--Vidro---7034-0.jpg?v=639058926534030000' },
  @{ File = '24_7891528029498_creme-dental-sorriso-tripla-limpeza-70g.jpg'; Url = 'https://paguemenos.vtexassets.com/arquivos/ids/1157847/7891528029498-Creme_Dental_Sorriso_Tripla_Limpeza_Completa_70g-Oral_Care-Sorriso--1-.jpg?v=639105035727200000' }
)

$headers = @{ 'User-Agent' = 'Mozilla/5.0' }
foreach ($product in $products) {
  $destination = Join-Path $PSScriptRoot $product.File
  if (Test-Path -LiteralPath $destination) {
    Write-Host "Já existe: $($product.File)"
    continue
  }
  try {
    Invoke-WebRequest -Uri $product.Url -OutFile $destination -Headers $headers
    Write-Host "Baixado: $($product.File)"
  } catch {
    Write-Warning "Falhou: $($product.File) — $($_.Exception.Message)"
  }
}
