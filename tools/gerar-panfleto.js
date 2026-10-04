const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PDFDocument } = require('pdf-lib');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'entregas', 'panfleto-final-de-semana-2026-10-05');
const LOGO = path.join(ROOT, 'bom-pra-voce-novo', 'src', 'images', 'Logo.png');
sharp.cache(false);
sharp.concurrency(1);

const W = 2480;
const H = 3508;

const pages = [
  {
    kicker: 'MERCEARIA & BEBIDAS',
    title: 'Fim de semana com preço bom',
    accent: '#ef2b2d',
    items: [
      ['Macarrão parafuso ou espaguete', '500g', '2,99'],
      ['Ovos Josidith', 'bandeja com 30 un.', '12,99'],
      ['Kapo', '200ml', '1,99'],
      ['Coca-Cola', '2L', '8,99'],
      ['Del Valle Frut', '1,5L', '4,99'],
      ['Maionese Hellmann’s', '500g', '9,99'],
      ['Molho tradicional Quero', '249g', '1,69'],
      ['Batata palha Praticamente Leve', '75g', '3,49'],
    ],
  },
  {
    kicker: 'AÇOUGUE, FRIOS & CONGELADOS',
    title: 'Sabores para reunir a família',
    accent: '#bb1534',
    items: [
      ['Linguiça suína Seara', 'kg', '15,99'],
      ['Hambúrguer Chuletão', '56g', '0,99'],
      ['Pé de galinha', 'kg', '7,99'],
      ['Costela ponta de agulha', 'kg', '17,99'],
      ['Carne suína', 'kg', '9,99'],
      ['Fígado bovino', 'kg', '15,99'],
      ['Pão de alho Mezzani', '310g', '8,99'],
      ['Mortadela defumada Aurora', '189g', '4,99'],
      ['Mortadela defumada Seara', '180g', '4,99'],
      ['Iogurte Nestlé', 'bandeja', '5,99'],
    ],
  },
  {
    kicker: 'LIMPEZA, HIGIENE & BELEZA',
    title: 'Casa cuidada, você também',
    accent: '#11796f',
    items: [
      ['Amaciante Downy refil', '750ml', '15,99'],
      ['Sabão em barra Minuano', '800g', '10,99'],
      ['Lava-roupas líquido Ápice', '800g', '5,99'],
      ['Sabonete Cliss', '85g', '0,99'],
      ['Sabonete líquido Nathy', '500ml', '14,99'],
      ['Creme dental Sorriso Tripla Limpeza Completa', '70g', '3,99'],
      ['Shampoo Bio Extratus', '250ml', '45,99'],
      ['Restaurador Bio Extratus', '250g', '45,99'],
      ['Body Splash Sabonete Line', '200ml', '34,99'],
    ],
  },
  {
    kicker: 'UTILIDADES & BEBÊ',
    title: 'Achadinhos para levar hoje',
    accent: '#1163a6',
    items: [
      ['Caneca Chopp Caveira', '370ml', '14,99'],
      ['Fralda descartável Juninho Panda', 'M, G e XXG', '10,99'],
      ['Prato Nadir Pétala fundo', '23,5cm', '5,99'],
      ['Pote com tampa de bambu', '1,2L', '25,99'],
      ['Oferta de final de semana', 'aproveite até 05/10', ''],
      ['Atendimento', 'seg. a sáb.: 08h–21h', ''],
      ['Domingos', '08h–20h', ''],
      ['Feriados', 'consulte a loja antes de sair', ''],
    ],
  },
];

const checklist = [
  ['Mercearia e bebidas', 'Macarrão parafuso / espaguete 500g', 'R$ 2,99', '11/2026'],
  ['Mercearia e bebidas', 'Ovos Josidith com 30 un.', 'R$ 12,99', '24/10/2026'],
  ['Mercearia e bebidas', 'Kapo 200ml', 'R$ 1,99', '16/04/2027'],
  ['Mercearia e bebidas', 'Coca-Cola 2L', 'R$ 8,99', '26/12/2026'],
  ['Mercearia e bebidas', 'Del Valle Frut 1,5L', 'R$ 4,99', '27/04/2027'],
  ['Mercearia e bebidas', 'Maionese Hellmann’s 500g', 'R$ 9,99', '29/01/2027'],
  ['Mercearia e bebidas', 'Molho tradicional Quero 249g', 'R$ 1,69', '03/2027'],
  ['Mercearia e bebidas', 'Batata palha Praticamente Leve 75g', 'R$ 3,49', '17/12/2027'],
  ['Açougue, frios e congelados', 'Linguiça suína Seara — kg', 'R$ 15,99', '05/11/2026'],
  ['Açougue, frios e congelados', 'Hambúrguer Chuletão 56g', 'R$ 0,99', '07/01/2027'],
  ['Açougue, frios e congelados', 'Pé de galinha — kg', 'R$ 7,99', '12/2026'],
  ['Açougue, frios e congelados', 'Costela ponta de agulha — kg', 'R$ 17,99', '20/10/2026'],
  ['Açougue, frios e congelados', 'Carne suína — kg', 'R$ 9,99', '10/2026'],
  ['Açougue, frios e congelados', 'Fígado bovino — kg', 'R$ 15,99', '10/2026'],
  ['Açougue, frios e congelados', 'Pão de alho Mezzani 310g', 'R$ 8,99', '19/10/2026'],
  ['Açougue, frios e congelados', 'Mortadela defumada Aurora 189g', 'R$ 4,99', '16/10/2026'],
  ['Açougue, frios e congelados', 'Mortadela defumada Seara 180g', 'R$ 4,99', '16/10/2026'],
  ['Açougue, frios e congelados', 'Iogurte Nestlé — bandeja', 'R$ 5,99', '20/10/2026'],
  ['Limpeza, higiene e beleza', 'Amaciante Downy refil 750ml', 'R$ 15,99', 'não informada'],
  ['Limpeza, higiene e beleza', 'Sabão em barra Minuano 800g', 'R$ 10,99', 'não informada'],
  ['Limpeza, higiene e beleza', 'Lava-roupas líquido Ápice 800g', 'R$ 5,99', 'não informada'],
  ['Limpeza, higiene e beleza', 'Sabonete Cliss 85g', 'R$ 0,99', 'não informada'],
  ['Limpeza, higiene e beleza', 'Sabonete líquido Nathy 500ml', 'R$ 14,99', 'não informada'],
  ['Limpeza, higiene e beleza', 'Creme dental Sorriso Tripla Limpeza Completa 70g', 'R$ 3,99', 'não informada'],
  ['Limpeza, higiene e beleza', 'Shampoo Bio Extratus 250ml', 'R$ 45,99', 'não informada'],
  ['Limpeza, higiene e beleza', 'Restaurador Bio Extratus 250g', 'R$ 45,99', 'não informada'],
  ['Limpeza, higiene e beleza', 'Body Splash Sabonete Line 200ml', 'R$ 34,99', 'não informada'],
  ['Utilidades e bebê', 'Caneca Chopp Caveira 370ml', 'R$ 14,99', 'não se aplica'],
  ['Utilidades e bebê', 'Fralda descartável Juninho Panda M, G e XXG', 'R$ 10,99', 'não informada'],
  ['Utilidades e bebê', 'Prato Nadir Pétala fundo 23,5cm', 'R$ 5,99', 'não se aplica'],
  ['Utilidades e bebê', 'Pote com tampa de bambu 1,2L', 'R$ 25,99', 'não se aplica'],
];

function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
}

function wrap(text, max) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) { lines.push(current); current = word; }
    else current = next;
  }
  if (current) lines.push(current);
  return lines;
}

function textLines(lines, x, y, size, lineHeight, attrs='') {
  return `<text x="${x}" y="${y}" font-size="${size}" ${attrs}>${lines.map((l,i)=>`<tspan x="${x}" dy="${i===0?0:lineHeight}">${esc(l)}</tspan>`).join('')}</text>`;
}

function commonDefs() {
  return `<defs><style>
    text{font-family:Arial,sans-serif}.bold{font-weight:700}.xb{font-weight:900}
  </style><filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="16" flood-opacity=".18"/></filter></defs>`;
}

function footer() {
  return `<g transform="translate(0 3130)">
    <rect width="2480" height="378" fill="#171717"/>
    <rect width="2480" height="14" fill="#ef2b2d"/>
    <text x="110" y="82" font-size="34" fill="#fff" class="bold">OFERTAS VÁLIDAS ATÉ 05/10/2026</text>
    <text x="110" y="132" font-size="25" fill="#fff">Produtos sujeitos à disponibilidade de estoque. Preços à vista.</text>
    <text x="110" y="176" font-size="25" fill="#fff">Em caso de divergência de preços, prevalece o menor valor.</text>
    <text x="110" y="230" font-size="26" fill="#ffd900" class="bold">QS 118, conjunto 6, lote 2 — Samambaia Sul, Brasília–DF</text>
    <text x="110" y="276" font-size="25" fill="#fff">(61) 99374-2005  •  Seg. a sáb. 08h–21h  •  Dom. 08h–20h</text>
    <text x="110" y="324" font-size="21" fill="#bbb">Feriados: consulte a loja antes de sair. Consulte características e validade na embalagem.</text>
  </g>`;
}

function flyerSvg(page, pageNumber) {
  const logo = fs.readFileSync(LOGO).toString('base64');
  const items = page.items;
  const cols = 2;
  const rows = Math.ceil(items.length / cols);
  const gap = 38;
  const cardW = 1085;
  const contentTop = 760;
  const contentBottom = 3050;
  const cardH = Math.floor((contentBottom - contentTop - gap*(rows-1))/rows);
  const cards = items.map((it, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = 115 + col*(cardW+80);
    const y = contentTop + row*(cardH+gap);
    const nameLines = wrap(it[0], cardH < 420 ? 31 : 27).slice(0,2);
    const hasPrice = Boolean(it[2]);
    return `<g transform="translate(${x} ${y})" filter="url(#shadow)">
      <rect width="${cardW}" height="${cardH}" rx="34" fill="#fff" stroke="#e6e0d7" stroke-width="3"/>
      <rect width="22" height="${cardH}" rx="11" fill="${page.accent}"/>
      <circle cx="95" cy="82" r="34" fill="${page.accent}" opacity=".12"/>
      <circle cx="95" cy="82" r="18" fill="${page.accent}"/>
      ${textLines(nameLines,150,76,42,49,'class="bold"')}
      <text x="150" y="${cardH-54}" font-size="31" fill="#575757">${esc(it[1])}</text>
      ${hasPrice ? `<g transform="translate(${cardW-420} ${cardH-177})"><text x="0" y="0" font-size="40" class="bold" fill="#3b3b3b">R$</text><text x="72" y="0" font-size="92" class="xb" fill="${page.accent}">${esc(it[2])}</text></g>` : ''}
    </g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${commonDefs()}<rect width="2480" height="3508" fill="#fff9e8"/>
    <path d="M0 0H2480V610C2050 760 1610 565 1210 665C790 770 390 710 0 585Z" fill="#ffd900"/>
    <image href="data:image/png;base64,${logo}" x="108" y="72" width="900" height="222" preserveAspectRatio="xMidYMid meet"/>
    <rect x="1810" y="75" width="540" height="160" rx="80" fill="#171717"/><text x="2080" y="140" text-anchor="middle" font-size="34" fill="#fff" class="bold">PROMOÇÃO</text><text x="2080" y="196" text-anchor="middle" font-size="38" fill="#ffd900" class="xb">FINAL DE SEMANA</text>
    <text x="120" y="420" font-size="33" fill="${page.accent}" class="xb" letter-spacing="3">${esc(page.kicker)}</text>
    <text x="120" y="555" font-size="78" class="xb">${esc(page.title)}</text>
    <text x="120" y="632" font-size="32" fill="#525252">Preço bom de verdade, pertinho de você.</text>
    <text x="2345" y="680" text-anchor="end" font-size="27" fill="#686868">PÁGINA ${pageNumber}/4</text>
    ${cards}${footer()}
  </svg>`;
}

function checklistSvg(rows, pageNumber, totalPages) {
  const logo = fs.readFileSync(LOGO).toString('base64');
  const startY = 640;
  const rowH = 110;
  let y = startY;
  let body = '';
  let previousSection = '';
  for (const row of rows) {
    if (row[0] !== previousSection) {
      body += `<rect x="90" y="${y}" width="2300" height="58" rx="12" fill="#171717"/><text x="120" y="${y+40}" font-size="27" fill="#ffd900" class="bold">${esc(row[0].toUpperCase())}</text>`;
      y += 74;
      previousSection = row[0];
    }
    const lines = wrap(row[1], 48).slice(0,2);
    body += `<g><rect x="90" y="${y}" width="2300" height="${rowH-10}" rx="14" fill="${(Math.round(y/rowH)%2)?'#fff':'#fffdf5'}" stroke="#ddd"/>
      <rect x="118" y="${y+35}" width="42" height="42" rx="5" fill="#fff" stroke="#333" stroke-width="3"/>
      ${textLines(lines,190,y+43,28,34,'class="bold"')}
      <text x="1490" y="${y+52}" font-size="30" class="bold">${esc(row[2])}</text>
      <text x="1810" y="${y+52}" font-size="27">${esc(row[3])}</text>
      <line x1="2170" y1="${y+68}" x2="2350" y2="${y+68}" stroke="#777" stroke-width="2"/>
    </g>`;
    y += rowH;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${commonDefs()}<rect width="2480" height="3508" fill="#fff9e8"/>
    <rect width="2480" height="470" fill="#ffd900"/><image href="data:image/png;base64,${logo}" x="90" y="55" width="720" height="178" preserveAspectRatio="xMidYMid meet"/>
    <text x="90" y="340" font-size="66" class="xb">CONFERÊNCIA MANUAL</text><text x="90" y="405" font-size="28">Promoção de final de semana • validade da oferta: 05/10/2026</text>
    <text x="90" y="540" font-size="24" class="bold">OK</text><text x="190" y="540" font-size="24" class="bold">PRODUTO / APRESENTAÇÃO</text><text x="1490" y="540" font-size="24" class="bold">PREÇO</text><text x="1810" y="540" font-size="24" class="bold">VALIDADE INFORMADA</text><text x="2170" y="540" font-size="24" class="bold">OBSERVAÇÃO</text>
    ${body}
    <rect x="0" y="3260" width="2480" height="248" fill="#171717"/><text x="90" y="3325" font-size="25" fill="#ffd900" class="bold">CONFERIR ANTES DE PUBLICAR</text><text x="90" y="3372" font-size="22" fill="#fff">Nome/marca • peso/volume • preço • validade física • estoque • código/EAN • ortografia.</text><text x="90" y="3420" font-size="21" fill="#bbb">Validades “não informada” precisam ser verificadas diretamente na embalagem. Página ${pageNumber}/${totalPages}.</text>
  </svg>`;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const pngs = [];
  for (let i=0;i<pages.length;i++) {
    const base = `panfleto-a4-${String(i+1).padStart(2,'0')}`;
    const svgPath = path.join(OUT, `${base}.svg`);
    const pngPath = path.join(OUT, `${base}.png`);
    fs.writeFileSync(svgPath, flyerSvg(pages[i], i+1));
    pngs.push(pngPath);
  }
  const chunks = [checklist.slice(0,16), checklist.slice(16)];
  for (let i=0;i<chunks.length;i++) {
    const base = `conferencia-a4-${String(i+1).padStart(2,'0')}`;
    const svgPath = path.join(OUT, `${base}.svg`);
    const pngPath = path.join(OUT, `${base}.png`);
    fs.writeFileSync(svgPath, checklistSvg(chunks[i], i+1, chunks.length));
    pngs.push(pngPath);
  }
  if (process.env.SVG_ONLY === '1') {
    console.log(OUT);
    return;
  }
  for (const pngPath of pngs) {
    const svgPath = pngPath.replace(/\.png$/i, '.svg');
    await sharp(svgPath).png().toFile(pngPath);
  }
  const pdf = await PDFDocument.create();
  for (const pngPath of pngs) {
    const img = await pdf.embedPng(fs.readFileSync(pngPath));
    const page = pdf.addPage([595.28,841.89]);
    page.drawImage(img,{x:0,y:0,width:595.28,height:841.89});
  }
  fs.writeFileSync(path.join(OUT,'panfleto-e-conferencia-a4.pdf'), await pdf.save());
  const csv = ['Setor;Produto;Preço;Validade informada;Conferido;Observações', ...checklist.map(r=>[...r,'',''].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(';'))].join('\r\n');
  fs.writeFileSync(path.join(OUT,'lista-conferencia.csv'), '\ufeff'+csv, 'utf8');
  fs.writeFileSync(path.join(OUT,'LEIA-ME.txt'), [
    'Panfleto A4 vertical — Promoção de final de semana',
    'Oferta válida até 05/10/2026.',
    '',
    'Arquivos panfleto-a4-01 a 04: artes para divulgação/impressão.',
    'Arquivos conferencia-a4-01 e 02: lista para conferência manual.',
    'PDF: conjunto completo, na mesma ordem.',
    'CSV: lista editável para conferência.',
    '',
    'Pontos que exigem conferência antes da publicação:',
    '- quantidade de unidades da bandeja do Iogurte Nestlé;',
    '- grafia/marca de Cliss, Ápice, Juninho Panda e Sabonete Line;',
    '- confirmação de todas as validades diretamente nas embalagens;',
    '- disponibilidade real dos itens e correspondência exata entre produto e preço.'
  ].join('\r\n'), 'utf8');
  console.log(OUT);
}

main().catch(err=>{console.error(err);process.exit(1)});
