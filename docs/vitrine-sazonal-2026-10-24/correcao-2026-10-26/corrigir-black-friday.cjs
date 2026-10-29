const fs=require('fs');
const sharp=require('C:/Users/anton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const base='bom-pra-voce-novo/src/Components/ProductOffers/';
let jsx=fs.readFileSync(base+'ProductOffers.jsx','utf8').replace('ChevronRight,Megaphone','ChevronRight,Megaphone,ShoppingCart').replace("import blackFridayCart from '../../images/offer-themes/black-friday/black-friday-carrinho-3d.webp';\n",'').replace('black-friday-brilhos-3d.webp','black-friday-raios-finos.webp').replace('<img className="black-friday-cart" src={blackFridayCart} width="80" height="80" alt="" draggable="false"/>','<ShoppingCart className="black-friday-cart" strokeWidth={2} aria-hidden="true"/>');
fs.writeFileSync(base+'ProductOffers.jsx',jsx);
let css=fs.readFileSync(base+'SeasonalFrames.css','utf8').split('/* Three-dimensional title ornaments, shared by the site and panel preview. */')[0];
css+=`
/* Black Friday: reference board 18. Shared site/panel composition. */
.product-offers[data-theme="black-friday"] .product-offers__heading{grid-template-columns:36% minmax(0,1fr);gap:28px;padding:20px 26px;min-height:194px}
.product-offers[data-theme="black-friday"] .product-offers__logo{max-width:none;width:100%;height:auto}
.product-offers[data-theme="black-friday"] .product-offers__headline{position:relative;isolation:isolate;padding:0 58px 0 24px;min-width:0}
.product-offers[data-theme="black-friday"] .product-offers__headline h2{position:relative;font-size:clamp(44px,5.5vw,80px);line-height:.9;letter-spacing:-.035em;margin:0 0 10px;transform:rotate(-3deg);text-shadow:1px 2px #33006b;animation:none}
.product-offers[data-theme="black-friday"] .season-title-lead{font-size:.55em;line-height:1.05;letter-spacing:-.02em}
.product-offers[data-theme="black-friday"] .product-offers__headline h2 em{display:inline-block;text-shadow:1px 1px #d5a600,2px 3px #4800a8}
.product-offers[data-theme="black-friday"] .product-offers__headline p{font-size:clamp(20px,2.1vw,30px);margin:0;padding:7px 24px;max-width:66%;text-align:center;white-space:nowrap}
.product-offers[data-theme="black-friday"] .product-offers__search{position:absolute;right:26px;bottom:17px;width:24%;margin:0;min-height:44px}
.black-friday-ornaments{position:absolute;inset:0;pointer-events:none;user-select:none}
.black-friday-cart{position:absolute;right:0;top:20px;width:58px;height:58px;color:#fff000;filter:drop-shadow(1px 2px 0 #6900c0);animation:bf-cart-float 6s ease-in-out infinite}
.black-friday-sparks{position:absolute;left:-20px;top:23px;width:42px;height:75px;object-fit:contain;animation:bf-sparks-float 7s ease-in-out infinite}
@keyframes bf-cart-float{0%,100%{transform:translateY(0) rotate(12deg)}50%{transform:translateY(-3px) rotate(14deg)}}
@keyframes bf-sparks-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
.product-offers[data-theme="black-friday"] .product-offers__categories{background:#290062}
.product-offers[data-theme="black-friday"] .product-offers__footer{min-height:140px}
@media(min-width:701px) and (max-width:1000px){
.product-offers[data-theme="black-friday"] .product-offers__heading{grid-template-columns:34% minmax(0,1fr);gap:18px;padding:18px;min-height:176px}
.product-offers[data-theme="black-friday"] .product-offers__headline{padding:0 40px 0 14px}
.product-offers[data-theme="black-friday"] .product-offers__headline h2{font-size:clamp(40px,5.7vw,57px)}
.product-offers[data-theme="black-friday"] .product-offers__headline p{font-size:20px;padding:6px 15px}
.product-offers[data-theme="black-friday"] .product-offers__search{width:24%;right:18px;bottom:14px;min-height:38px;padding:7px 10px}
.black-friday-cart{width:40px;height:40px;top:12px}.black-friday-sparks{width:26px;height:50px;left:-14px;top:18px}
}
@media(max-width:700px){
.product-offers[data-theme="black-friday"] .product-offers__heading{display:flex;gap:6px;min-height:0;padding:10px 12px 12px}
.product-offers[data-theme="black-friday"] .product-offers__logo{width:242px;max-width:74%;height:auto}
.product-offers[data-theme="black-friday"] .product-offers__headline{width:100%;max-width:390px;padding:0 33px;text-align:left}
.product-offers[data-theme="black-friday"] .product-offers__headline h2{font-size:clamp(39px,13vw,56px);margin:0 0 5px}
.product-offers[data-theme="black-friday"] .product-offers__headline p{font-size:22px;max-width:none;width:max-content;margin:0 auto;padding:5px 18px}
.product-offers[data-theme="black-friday"] .product-offers__search{position:relative;right:auto;bottom:auto;width:100%;margin:4px 0 0;min-height:36px}
.black-friday-cart{width:35px;height:35px;right:0;top:22px}.black-friday-sparks{left:0;top:22px;width:25px;height:46px}
.product-offers[data-theme="black-friday"] .product-offers__footer{min-height:80px}
}
@media(prefers-reduced-motion:reduce){.black-friday-cart,.black-friday-sparks{animation:none}}
`;
fs.writeFileSync(base+'SeasonalFrames.css',css);
sharp('C:/Users/anton/.codex/generated_images/01a17331-076c-7640-a538-453ecea92efe/exec-bbdf6430-bb35-4af5-8395-416d7f2dd7de.png').trim().resize({height:240}).webp({quality:92,alphaQuality:100}).toFile('bom-pra-voce-novo/src/images/offer-themes/black-friday/black-friday-raios-finos.webp');
