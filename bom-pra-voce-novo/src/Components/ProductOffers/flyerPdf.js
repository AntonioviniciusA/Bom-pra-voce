import logoUrl from '../../images/Logo.png';
import blackFridayBackgroundUrl from '../../images/offer-themes/black-friday/explosao-neon-roxa-dourada.png';
import blackFridayTagUrl from '../../images/offer-themes/black-friday/black-friday-etiqueta-desconto-3d.png';
import blackFridayMegaphoneUrl from '../../images/offer-themes/black-friday/black-friday-megafone-3d.png';
import priceBrushUrl from '../../images/offer-themes/compartilhados/preco-pincel-v2.png';
import regularFontUrl from '../../fonts/BarlowCondensed-Bold.ttf';
import heavyFontUrl from '../../fonts/BarlowCondensed-Black.ttf';
import italicFontUrl from '../../fonts/BarlowCondensed-ExtraBoldItalic.ttf';

const PAGE_WIDTH = 1240;
const PAGE_HEIGHT = 1754;
const PRODUCTS_PER_PAGE = 9;
const FONT_FAMILY = 'Flyer Condensed';

function encodeText(value) {
  const bytes = [];
  for (const character of value) {
    const code = character.codePointAt(0);
    if (code < 0x80) bytes.push(code);
    else if (code < 0x800) bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    else if (code < 0x10000) bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    else bytes.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 0x3f), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
  }
  return new Uint8Array(bytes);
}

function safeFilePart(value) {
  return String(value || 'ofertas').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '').toLocaleLowerCase('pt-BR') || 'ofertas';
}

function date(value) { return value?.split('-').reverse().join('/'); }

function formatPeriod(start, end) {
  return start && end ? `Válido de ${date(start)} a ${date(end)}` : 'Consulte a validade das ofertas';
}

function formatPrice(item) {
  return Number.isSafeInteger(item.priceCents) && item.priceCents > 0
    ? (item.priceCents / 100).toLocaleString('pt-BR', {style:'currency', currency:'BRL'}) : 'Preço a definir';
}

function wrapLines(ctx, value, maxWidth, maxLines = Infinity) {
  const words = String(value || '').trim().split(/\s+/).filter(Boolean);
  const lines = [];
  for (const word of words) {
    const current = lines[lines.length - 1] || '';
    const candidate = current ? `${current} ${word}` : word;
    if (current && ctx.measureText(candidate).width > maxWidth) lines.push(word);
    else if (lines.length) lines[lines.length - 1] = candidate;
    else lines.push(candidate);
  }
  if (lines.length > maxLines) {
    lines.length = maxLines;
    while (lines[maxLines - 1] && ctx.measureText(`${lines[maxLines - 1]}…`).width > maxWidth) {
      lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S+$/, '');
    }
    lines[maxLines - 1] = `${lines[maxLines - 1]}…`;
  }
  return lines;
}

function drawFittedLines(ctx, value, x, y, maxWidth, maxLines, options = {}) {
  const {startSize = 34, minSize = 22, weight = 700, lineHeight = 1.02, color = '#fff', align = 'left'} = options;
  let lines = [], size = startSize;
  for (; size >= minSize; size -= 2) {
    ctx.font = `${weight} ${size}px "${FONT_FAMILY}", Arial, sans-serif`;
    lines = wrapLines(ctx, value, maxWidth, maxLines + 1);
    if (lines.length <= maxLines && lines.every(line => ctx.measureText(line).width <= maxWidth)) break;
  }
  if (lines.length > maxLines) lines = wrapLines(ctx, value, maxWidth, maxLines);
  ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'top';
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * size * lineHeight));
  return {size, lines, height: lines.length * size * lineHeight};
}

async function loadImage(url) {
  if (!url || !/^data:|^blob:|^https?:|^\//i.test(url)) return null;
  let objectUrl;
  try {
    const response = await fetch(url, {mode:'cors', credentials:'same-origin'});
    if (!response.ok) return null;
    objectUrl = URL.createObjectURL(await response.blob());
    const image = new Image(); image.decoding = 'async'; image.src = objectUrl; await image.decode();
    image.flyerObjectUrl = objectUrl; objectUrl = undefined; return image;
  } catch { return null; }
  finally { if (objectUrl) URL.revokeObjectURL(objectUrl); }
}

function releaseImage(image) {
  if (image?.flyerObjectUrl) URL.revokeObjectURL(image.flyerObjectUrl);
}

async function loadFlyerFonts() {
  if (typeof FontFace !== 'function' || !document.fonts) return;
  const faces = [
    new FontFace(FONT_FAMILY, `url(${regularFontUrl})`, {weight:'700'}),
    new FontFace(FONT_FAMILY, `url(${heavyFontUrl})`, {weight:'900'}),
    new FontFace(FONT_FAMILY, `url(${italicFontUrl})`, {weight:'800', style:'italic'}),
  ];
  await Promise.all(faces.map(async face => {
    const loaded = await face.load();
    if (![...document.fonts].some(existing => existing.family === loaded.family && existing.weight === loaded.weight)) document.fonts.add(loaded);
  }));
}

function drawContained(ctx, image, x, y, width, height) {
  const sourceWidth = image.naturalWidth || image.width, sourceHeight = image.naturalHeight || image.height;
  const scale = Math.min(width / sourceWidth, height / sourceHeight);
  const renderedWidth = sourceWidth * scale, renderedHeight = sourceHeight * scale;
  ctx.drawImage(image, x + (width - renderedWidth) / 2, y + (height - renderedHeight) / 2, renderedWidth, renderedHeight);
}

function drawCover(ctx, image, x, y, width, height) {
  const sourceWidth = image.naturalWidth || image.width, sourceHeight = image.naturalHeight || image.height;
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const cropWidth = width / scale, cropHeight = height / scale;
  ctx.drawImage(image, (sourceWidth - cropWidth) / 2, (sourceHeight - cropHeight) / 2, cropWidth, cropHeight, x, y, width, height);
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + width - r, y); ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r); ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height); ctx.quadraticCurveTo(x, y + height, x, y + height - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

function drawProduct(ctx, item, image, assets, x, y, width, height, blackFriday) {
  const textX = x + 18, textWidth = width - 36, photoHeight = 150;
  ctx.save(); ctx.shadowColor = 'rgba(44, 24, 61, .12)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 5;
  ctx.fillStyle = '#fff'; roundedRect(ctx, x, y, width, height, 18); ctx.fill(); ctx.restore();
  ctx.strokeStyle = '#d5d1d9'; ctx.lineWidth = 2; roundedRect(ctx, x, y, width, height, 18); ctx.stroke();
  ctx.save();
  if (image) {
    ctx.shadowColor = 'rgba(34, 18, 45, .18)'; ctx.shadowBlur = 15; ctx.shadowOffsetY = 8;
    drawContained(ctx, image, x + 42, y + 10, width - 84, photoHeight);
  } else {
    ctx.fillStyle = '#6c5c76'; ctx.textAlign = 'center'; ctx.font = `700 21px "${FONT_FAMILY}", Arial, sans-serif`; ctx.fillText('Imagem em preparação', x + width / 2, y + 112);
  }
  ctx.restore();
  let textY = y + photoHeight + 20;
  if (item.product.brand) {
    ctx.fillStyle = '#4c1388'; ctx.font = `700 16px "${FONT_FAMILY}", Arial, sans-serif`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(String(item.product.brand).toLocaleUpperCase('pt-BR'), textX, textY); textY += 17;
  }
  const name = drawFittedLines(ctx, String(item.product.name || 'Produto').toLocaleUpperCase('pt-BR'), textX, textY, textWidth, 2, {startSize:25, minSize:19, weight:900, lineHeight:.94, color:'#2f075e'});
  textY += name.height + 4;
  if (item.product.variant) { const lines = drawFittedLines(ctx, `Fragrâncias: ${item.product.variant}`, textX, textY, textWidth, 2, {startSize:16, minSize:13, weight:700, lineHeight:1.02, color:'#35105f'}); textY += lines.height + 2; }
  if (item.product.content) { const lines = drawFittedLines(ctx, `Embalagem: ${item.product.content}`, textX, textY, textWidth, 1, {startSize:16, minSize:13, weight:700, color:'#35105f'}); textY += lines.height + 2; }
  if (item.expiresOn) drawFittedLines(ctx, `Vencimento do lote: ${date(item.expiresOn)}`, textX, textY, textWidth, 1, {startSize:15, minSize:12, weight:700, color:'#35105f'});
  const brushX = x + 14, brushY = y + height - 105, brushWidth = width - 28;
  if (assets.priceBrush) ctx.drawImage(assets.priceBrush, brushX, brushY, brushWidth, 62);
  else { ctx.fillStyle = '#fff200'; roundedRect(ctx, brushX, brushY + 5, brushWidth, 52, 24); ctx.fill(); }
  ctx.fillStyle = '#3b007c'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `900 39px "${FONT_FAMILY}", Arial, sans-serif`; ctx.fillText(`${formatPrice(item)} /${item.unit || 'un'}`, x + width / 2, brushY + 32);
  const bandY = y + height - 44;
  const band = ctx.createLinearGradient(x, bandY, x + width, bandY); band.addColorStop(0, '#4300a4'); band.addColorStop(1, '#7600df');
  ctx.fillStyle = band; roundedRect(ctx, x + 14, bandY, width - 28, 32, 13); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = `900 17px "${FONT_FAMILY}", Arial, sans-serif`; ctx.fillText('OFERTA BOM PRA VOCÊ', x + width / 2, bandY + 16);
}

function drawPageBackground(ctx, assets, blackFriday) {
  ctx.fillStyle = '#f8f7fa'; ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
}

function drawHeader(ctx, campaign, assets, blackFriday) {
  if (assets.background) drawCover(ctx, assets.background, 0, 0, PAGE_WIDTH, 242);
  ctx.fillStyle = 'rgba(20, 0, 31, .28)'; ctx.fillRect(0, 0, PAGE_WIDTH, 242);
  if (assets.logo) drawContained(ctx, assets.logo, 48, 55, 350, 92);
  const phase = String(campaign.title || 'Ofertas').replace(/black friday/ig, '').trim() || 'Seleção';
  ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillStyle = '#fff'; ctx.font = `italic 800 44px "${FONT_FAMILY}", Arial, sans-serif`;
  ctx.fillText(phase, 735, 18);
  ctx.fillStyle = '#fff200'; ctx.font = `italic 900 91px "${FONT_FAMILY}", Arial, sans-serif`; ctx.fillText(blackFriday ? 'Black Friday' : campaign.title, 735, 50);
  ctx.fillStyle = '#6b21df'; roundedRect(ctx, 545, 163, 380, 48, 20); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = `900 27px "${FONT_FAMILY}", Arial, sans-serif`; ctx.fillText(formatPeriod(campaign.startDate, campaign.endDate).replace('Válido de ','De '), 735, 172);
  if (blackFriday && assets.tag) { ctx.save(); ctx.translate(1110, 100); ctx.rotate(.10); ctx.drawImage(assets.tag, -70, -78, 140, 154); ctx.restore(); }
}

function drawFooter(ctx, campaign, assets, pageNumber, pageCount, blackFriday) {
  const footerY = 1600;
  if (assets.background) drawCover(ctx, assets.background, 0, footerY, PAGE_WIDTH, PAGE_HEIGHT - footerY);
  ctx.fillStyle = 'rgba(25, 0, 39, .36)'; ctx.fillRect(0, footerY, PAGE_WIDTH, PAGE_HEIGHT - footerY);
  if (assets.megaphone) drawContained(ctx, assets.megaphone, 38, footerY + 18, 160, 110);
  ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillStyle = '#fff'; ctx.font = `italic 800 29px "${FONT_FAMILY}", Arial, sans-serif`; ctx.fillText('Não guarde o segredo da economia.', 625, footerY + 19);
  ctx.fillStyle = '#fff200'; ctx.font = `italic 900 61px "${FONT_FAMILY}", Arial, sans-serif`; ctx.fillText('Compartilhe!', 625, footerY + 51);
  ctx.textAlign = 'right'; ctx.fillStyle = '#fff200'; ctx.font = `900 25px "${FONT_FAMILY}", Arial, sans-serif`; ctx.fillText(`${pageNumber}/${pageCount}`, PAGE_WIDTH - 40, footerY + 20);
  ctx.fillStyle = '#fff'; ctx.font = `700 17px "${FONT_FAMILY}", Arial, sans-serif`; ctx.fillText(campaign.conditions || 'Enquanto durarem os estoques.', PAGE_WIDTH - 40, footerY + 58);
  ctx.font = `700 15px "${FONT_FAMILY}", Arial, sans-serif`; ctx.fillText(formatPeriod(campaign.startDate, campaign.endDate), PAGE_WIDTH - 40, footerY + 85);
}

async function canvasToRgb(canvas) {
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const rgba = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  const rgb = new Uint8Array(canvas.width * canvas.height * 3);
  for (let source = 0, target = 0; source < rgba.length; source += 4) {
    rgb[target++] = rgba[source]; rgb[target++] = rgba[source + 1]; rgb[target++] = rgba[source + 2];
  }
  // Keep the page image uncompressed. Some PDF readers intermittently render
  // only part of large browser-produced Flate streams, despite valid data.
  return {bytes:rgb, filter:''};
}

function joinBytes(chunks) {
  const length = chunks.reduce((total, chunk) => total + chunk.length, 0), result = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.length; } return result;
}

function encodeAsciiHex(bytes) {
  const digits = '0123456789ABCDEF', encoded = new Uint8Array(bytes.length * 2 + 1);
  for (let source = 0, target = 0; source < bytes.length; source += 1) {
    encoded[target++] = digits.charCodeAt(bytes[source] >> 4);
    encoded[target++] = digits.charCodeAt(bytes[source] & 15);
  }
  encoded[encoded.length - 1] = 62;
  return encoded;
}

function buildPdfFromImages(images) {
  if (!images.length) throw new Error('O panfleto não possui páginas.');
  const chunks = [], offsets = [0]; let length = 0;
  const push = value => { const bytes = typeof value === 'string' ? encodeText(value) : value; chunks.push(bytes); length += bytes.length; };
  const object = (number, parts) => { offsets[number] = length; push(`${number} 0 obj\n`); parts.forEach(push); push('\nendobj\n'); };
  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'); object(1, ['<< /Type /Catalog /Pages 2 0 R >>']);
  const pageRefs = images.map((_, index) => `${3 + index * 3} 0 R`).join(' '); object(2, [`<< /Type /Pages /Count ${images.length} /Kids [${pageRefs}] >>`]);
  images.forEach(({bytes, filter}, index) => {
    const page = 3 + index * 3, image = page + 1, content = page + 2, imageName = 'FlyerPage';
    object(page, [`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /ProcSet [/PDF /ImageC] /XObject << /${imageName} ${image} 0 R >> >> /Contents ${content} 0 R >>`]);
    object(image, [`<< /Type /XObject /Subtype /Image /Width ${PAGE_WIDTH} /Height ${PAGE_HEIGHT} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Interpolate true ${filter}/Length ${bytes.length} >>\nstream\n`, bytes, '\nendstream']);
    const drawing = `q 595.28 0 0 841.89 0 0 cm /${imageName} Do Q`; object(content, [`<< /Length ${encodeText(drawing).length} >>\nstream\n${drawing}\nendstream`]);
  });
  const xref = length, size = 2 + images.length * 3; push(`xref\n0 ${size + 1}\n0000000000 65535 f \n`);
  for (let index = 1; index <= size; index++) push(`${String(offsets[index]).padStart(10, '0')} 00000 n \n`);
  push(`trailer\n<< /Size ${size + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`); return new Blob([joinBytes(chunks)], {type:'application/pdf'});
}

export function buildPdfFromJpegs(jpegs) {
  return buildPdfFromImages(jpegs.map(bytes => ({bytes, filter:'/Filter /DCTDecode '})));
}

export function buildPdfFromRgbPages(pages) {
  // ASCIIHex is deliberately conservative: it avoids binary stream parsing
  // differences seen in some PDF readers while preserving the page pixels.
  return buildPdfFromImages(pages.map(page => ({bytes:encodeAsciiHex(page.bytes), filter:'/Filter /ASCIIHexDecode '})));
}

export async function createCampaignFlyerPdf(campaign, items = campaign.items || []) {
  if (!items.length) throw new Error('Não há produtos para incluir no panfleto.');
  const blackFriday = campaign.theme_key === 'black-friday'; await loadFlyerFonts();
  const pages = [], pageCount = Math.ceil(items.length / PRODUCTS_PER_PAGE);
  const canvas = document.createElement('canvas'); canvas.width = PAGE_WIDTH; canvas.height = PAGE_HEIGHT;
  const ctx = canvas.getContext('2d', {alpha:false}); if (!ctx) throw new Error('Este navegador não permite gerar o PDF.');
  for (let offset = 0; offset < items.length; offset += PRODUCTS_PER_PAGE) {
    const pageItems = items.slice(offset, offset + PRODUCTS_PER_PAGE);
    const [logo, background, tag, megaphone, priceBrush, ...images] = await Promise.all([
      loadImage(logoUrl), blackFriday ? loadImage(blackFridayBackgroundUrl) : Promise.resolve(null),
      blackFriday ? loadImage(blackFridayTagUrl) : Promise.resolve(null), blackFriday ? loadImage(blackFridayMegaphoneUrl) : Promise.resolve(null),
      loadImage(priceBrushUrl), ...pageItems.map(item => loadImage(item.product.image)),
    ]);
    const assets = {logo, background, tag, megaphone, priceBrush};
    try {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
      drawPageBackground(ctx, assets, blackFriday); drawHeader(ctx, campaign, assets, blackFriday);
      pageItems.forEach((item, index) => {
        const row = Math.floor(index / 3);
        const itemsInRow = Math.min(3, pageItems.length - row * 3);
        const column = index % 3 + (3 - itemsInRow) / 2;
        drawProduct(ctx, item, images[index], assets, 32 + column * 398, 258 + row * 440, 380, 425, blackFriday);
      });
      drawFooter(ctx, campaign, assets, offset / PRODUCTS_PER_PAGE + 1, pageCount, blackFriday);
      pages.push(await canvasToRgb(canvas));
    } finally { [...Object.values(assets), ...images].forEach(releaseImage); }
  }
  return new File([buildPdfFromRgbPages(pages)], `panfleto-${safeFilePart(campaign.title)}.pdf`, {type:'application/pdf'});
}

export function downloadFile(file) {
  const url = URL.createObjectURL(file), link = document.createElement('a'); link.href = url; link.download = file.name; link.rel = 'noopener';
  document.body.appendChild(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 10000);
}
