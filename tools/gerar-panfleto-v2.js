const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

sharp.cache(false);
sharp.concurrency(1);

const ROOT = path.resolve(__dirname, '..');
const BASE = path.join(ROOT, 'entregas', 'panfleto-final-de-semana-2026-10-05');
const OUT = path.join(BASE, 'versao-2-com-produtos');
const BG = path.join(BASE, 'fundos-v2');
const LOGO = path.join(ROOT, 'bom-pra-voce-novo', 'src', 'images', 'Logo.png');
const W = 2480, H = 3508;

const pages = [
  {
    key: 'mercearia', title: 'MERCEARIA & BEBIDAS', layout: 'grid2x4',
    items: [
      ['Macarrão parafuso ou espaguete','500g','2,99'], ['Ovos Josidith','30 un.','12,99'],
      ['Kapo','200ml','1,99'], ['Coca-Cola','2L','8,99'],
      ['Del Valle Frut','1,5L','4,99'], ['Maionese Hellmann’s','500g','9,99'],
      ['Molho tradicional Quero','249g','1,69'], ['Batata palha Praticamente Leve','75g','3,49'],
    ]
  },
  {
    key: 'acougue', title: 'AÇOUGUE, FRIOS & CONGELADOS', layout: 'grid2x5',
    items: [
      ['Linguiça suína Seara','kg','15,99'], ['Hambúrguer Chuletão','56g','0,99'],
      ['Pé de galinha','kg','7,99'], ['Costela ponta de agulha','kg','17,99'],
      ['Carne suína','kg','9,99'], ['Fígado bovino','kg','15,99'],
      ['Pão de alho Mezzani','310g','8,99'], ['Mortadela defumada Aurora','189g','4,99'],
      ['Mortadela defumada Seara','180g','4,99'], ['Iogurte Nestlé','bandeja','5,99'],
    ]
  },
  {
    key: 'limpeza', title: 'LIMPEZA, HIGIENE & BELEZA', layout: 'grid3x3',
    items: [
      ['Amaciante Downy refil','750ml','15,99'], ['Sabão em barra Minuano','800g','10,99'], ['Lava-roupas líquido Ápice','800g','5,99'],
      ['Sabonete Cliss','85g','0,99'], ['Sabonete líquido Nathy','500ml','14,99'], ['Creme dental Sorriso','70g','3,99'],
      ['Shampoo Bio Extratus','250ml','45,99'], ['Restaurador Bio Extratus','250g','45,99'], ['Body Splash Sabonete Line','200ml','34,99'],
    ]
  },
  {
    key: 'utilidades', title: 'UTILIDADES & BEBÊ', layout: 'grid2x2',
    items: [
      ['Caneca Chopp Caveira','370ml','14,99'], ['Fralda Juninho Panda','M, G e XXG','10,99'],
      ['Prato Nadir Pétala fundo','23,5cm','5,99'], ['Pote com tampa de bambu','1,2L','25,99'],
    ]
  },
];

function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));}

function defs(){return `<defs><style>text{font-family:Arial,sans-serif}.b{font-weight:700}.x{font-weight:900}</style><filter id="s"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".38"/></filter></defs>`;}

function header(title, page){
  const logo = fs.readFileSync(LOGO).toString('base64');
  return `<g filter="url(#s)"><rect x="44" y="34" width="620" height="165" rx="24" fill="#ffe100" stroke="#171717" stroke-width="8"/><image href="data:image/png;base64,${logo}" x="70" y="55" width="568" height="122" preserveAspectRatio="xMidYMid meet"/></g>
  <g filter="url(#s)"><path d="M720 38H2390Q2440 38 2440 88V193H720Z" fill="#171717"/><text x="780" y="105" font-size="40" fill="#fff" class="b">PROMOÇÃO DE FINAL DE SEMANA</text><text x="780" y="168" font-size="53" fill="#ffe100" class="x">${esc(title)}</text><text x="2350" y="172" text-anchor="end" font-size="27" fill="#fff">${page}/4</text></g>`;
}

function footer(){return `<g><rect x="0" y="3292" width="2480" height="216" fill="#171717"/><rect x="0" y="3292" width="2480" height="12" fill="#ef2029"/>
  <text x="55" y="3350" font-size="30" fill="#ffe100" class="x">OFERTAS VÁLIDAS ATÉ 05/10/2026</text>
  <text x="55" y="3392" font-size="21" fill="#fff">Produtos sujeitos à disponibilidade de estoque. Preços à vista. Em caso de divergência, prevalece o menor preço.</text>
  <text x="55" y="3430" font-size="23" fill="#ffe100" class="b">QS 118, conjunto 6, lote 2 — Samambaia Sul, Brasília–DF</text>
  <text x="55" y="3467" font-size="21" fill="#fff">(61) 99374-2005 • Seg. a sáb. 08h–21h • Dom. 08h–20h • Feriados: consulte a loja.</text></g>`;}

function label2(item, x, y, width=1040, height=118){
  return `<g filter="url(#s)"><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="28" fill="#171717" fill-opacity=".94" stroke="#ffe100" stroke-width="5"/>
  <text x="${x+30}" y="${y+43}" font-size="28" fill="#fff" class="b">${esc(item[0])}</text><text x="${x+30}" y="${y+88}" font-size="23" fill="#ffe100">${esc(item[1])}</text>
  <text x="${x+width-30}" y="${y+82}" text-anchor="end" font-size="64" fill="#ffe100" class="x"><tspan font-size="27">R$ </tspan>${esc(item[2])}</text></g>`;
}

function overlays(page){
  if(page.layout==='grid2x4'){
    const ys=[620,1365,2110,2855]; let s='';
    page.items.forEach((it,i)=>{const x=i%2?1260:80; s+=label2(it,x,ys[Math.floor(i/2)],1140,124);}); return s;
  }
  if(page.layout==='grid2x5'){
    const ys=[490,1040,1590,2140,2690]; let s='';
    page.items.forEach((it,i)=>{const x=i%2?1250:50; s+=label2(it,x,ys[Math.floor(i/2)],1180,112);}); return s;
  }
  if(page.layout==='grid3x3'){
    const xs=[25,835,1645], ys=[760,1795,2830]; let s='';
    page.items.forEach((it,i)=>{const x=xs[i%3], y=ys[Math.floor(i/3)]; s+=`<g filter="url(#s)"><rect x="${x}" y="${y}" width="785" height="150" rx="25" fill="#171717" fill-opacity=".94" stroke="#ffe100" stroke-width="5"/><text x="${x+24}" y="${y+42}" font-size="25" fill="#fff" class="b">${esc(it[0])}</text><text x="${x+24}" y="${y+84}" font-size="22" fill="#ffe100">${esc(it[1])}</text><text x="${x+755}" y="${y+128}" text-anchor="end" font-size="58" fill="#ffe100" class="x"><tspan font-size="25">R$ </tspan>${esc(it[2])}</text></g>`;}); return s;
  }
  const xs=[55,1265], ys=[1175,2720]; let s='';
  page.items.forEach((it,i)=>{s+=label2(it,xs[i%2],ys[Math.floor(i/2)],1160,150);}); return s;
}

function svg(page,index){
  const bg=fs.readFileSync(path.join(BG,`${page.key}.png`)).toString('base64');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs()}<image href="data:image/png;base64,${bg}" x="0" y="0" width="2480" height="3508" preserveAspectRatio="xMidYMid slice"/>${header(page.title,index)}${overlays(page)}${footer()}</svg>`;
}

async function main(){
  fs.mkdirSync(OUT,{recursive:true});
  const only=process.argv[2];
  const selected=only?pages.filter(p=>p.key===only):pages;
  for(const page of selected){
    const index=pages.indexOf(page)+1;
    const base=`panfleto-v2-${String(index).padStart(2,'0')}-${page.key}`;
    const sp=path.join(OUT,base+'.svg'), pp=path.join(OUT,base+'.png');
    fs.writeFileSync(sp,svg(page,index));
    await sharp(sp).png().toFile(pp);
    console.log(pp);
  }
}
main().catch(e=>{console.error(e);process.exit(1)});
