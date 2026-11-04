export function dataImageBlob(value) {
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+=*)$/.exec(value);
  if (!match) throw new Error('Foto inválida. Anexe novamente a imagem do produto.');
  return new Blob([Uint8Array.from(atob(match[2]), c => c.charCodeAt(0))], {type: match[1]});
}

export async function optimizeProductImage(file) {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type) || !file.size || file.size > 10000000)
    throw new Error('Escolha JPG, PNG ou WebP de até 10 MB.');
  const bitmap = await createImageBitmap(file);
  try {
    const {width,height} = bitmap;
    if (width < 400 || height < 400 || width > 6000 || height > 6000)
      throw new Error('Use uma imagem entre 400 e 6000 pixels em cada lado.');
    const render = async limit => {
      const scale = Math.min(1, limit / Math.max(width,height));
      const canvas = document.createElement('canvas');
      canvas.width = limit; canvas.height = limit;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Não foi possível preparar a foto.');
      const w = Math.round(width * scale), h = Math.round(height * scale);
      context.drawImage(bitmap,(limit-w)/2,(limit-h)/2,w,h);
      const blob = await new Promise(resolve => canvas.toBlob(resolve,'image/webp',0.82));
      if (!blob || blob.type !== 'image/webp' || blob.size > 2000000)
        throw new Error('Não foi possível otimizar a foto. Escolha uma imagem menor.');
      return new Promise((resolve,reject) => {
        const reader = new FileReader(); reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Não foi possível ler a foto.')); reader.readAsDataURL(blob);
      });
    };
    return {image:await render(1200),imageSmall:await render(480),imageWidth:width,imageHeight:height,imageOptimizationVersion:1};
  } finally { bitmap.close(); }
}

export async function prepareCampaignImages(campaign, request, onProgress = () => {}) {
  const prepared = {...campaign,items:[]};
  const sent = new Map();
  async function send(value) {
    const blob = dataImageBlob(value);
    const hash = btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer()))))
      .replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
    if (sent.has(hash)) return sent.get(hash);
    const status = await request({action:'image-status',hash,mime:blob.type});
    const result = status.exists ? status : await request(blob);
    if (typeof result.url !== 'string') throw new Error('O servidor não confirmou o envio da foto.');
    sent.set(hash,result.url); return result.url;
  }
  for (const [index,item] of campaign.items.entries()) {
    onProgress(`Preparando foto ${index+1} de ${campaign.items.length}: ${item.product.name}`);
    const p = item.product;
    // Produtos já sincronizados guardam URLs públicas validadas pelo servidor.
    // Uma edição textual não deve tentar decodificar essas URLs como base64.
    if (typeof p.image === 'string' && !p.image.startsWith('data:')) {
      prepared.items.push({...item,product:{...p}});
      onProgress(`Foto já armazenada: ${index+1} de ${campaign.items.length}.`);
      continue;
    }
    const images = p.imageOptimizationVersion === 1 && p.imageSmall
      ? p : await optimizeProductImage(dataImageBlob(p.image));
    const image = await send(images.image), imageSmall = await send(images.imageSmall);
    prepared.items.push({...item,product:{...p,image,imageSmall}});
    onProgress(`Fotos confirmadas: ${index+1} de ${campaign.items.length}.`);
  }
  return prepared;
}
