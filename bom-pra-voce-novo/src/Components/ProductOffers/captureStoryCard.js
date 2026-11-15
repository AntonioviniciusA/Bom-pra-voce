import regularFont from '../../fonts/BarlowCondensed-Bold.ttf';
import heavyFont from '../../fonts/BarlowCondensed-Black.ttf';
import italicFont from '../../fonts/BarlowCondensed-ExtraBoldItalic.ttf';

async function inlineAsset(url) {
  if (url.startsWith('data:')) return url;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Recurso do story indisponível.');
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function captureStoryCard(card, productCode) {
  await document.fonts.ready;
  const {width, height} = card.getBoundingClientRect();
  const clone = card.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

  const originals = [card, ...card.querySelectorAll('*')];
  const copies = [clone, ...clone.querySelectorAll('*')];
  const assets = new Map();

  function asset(url) {
    if (!assets.has(url)) assets.set(url, inlineAsset(url));
    return assets.get(url);
  }

  await Promise.all(originals.map(async (element, index) => {
    const copy = copies[index];
    const computed = getComputedStyle(element);
    copy.style.cssText = '';
    for (const property of computed) {
      if (!property.startsWith('--')) {
        copy.style.setProperty(property, computed.getPropertyValue(property));
      }
    }
    const background = copy.style.backgroundImage;
    for (const [match, url] of background.matchAll(/url\("([^"]+)"\)/g)) {
      copy.style.backgroundImage = copy.style.backgroundImage.replace(match, 'url("' + await asset(url) + '")');
    }
    if (element instanceof HTMLImageElement) {
      copy.src = await asset(element.currentSrc || element.src);
    }
  }));

  Object.assign(clone.style, {width: width + 'px', height: height + 'px', margin: '0'});
  const fonts = await Promise.all([regularFont, heavyFont, italicFont].map(asset));
  const fontCss = fonts.map((url, index) =>
    `@font-face{font-family:Offer Condensed;src:url("${url}");font-weight:${[700, 900, 800][index]};font-style:${index === 2 ? 'italic' : 'normal'}}`
  ).join('');
  const markup = new XMLSerializer().serializeToString(clone);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><style>${fontCss}</style><foreignObject width="100%" height="100%">${markup}</foreignObject></svg>`;
  const image = new Image();
  image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  await image.decode();

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = Math.round(height * canvas.width / width);
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Não foi possível gerar a imagem.');
  const code = String(productCode ?? 'produto').replace(/[^a-z0-9_-]/gi, '_');
  return new File([blob], `oferta-${code}.png`, {type: 'image/png'});
}
