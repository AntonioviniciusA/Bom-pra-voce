import logoUrl from '../../images/Logo.png';
import neonBackgroundUrl from '../../images/offer-themes/black-friday/explosao-neon-roxa-dourada.png';
import priceBrushUrl from '../../images/offer-themes/compartilhados/preco-pincel-v2.webp';
import regularFontUrl from '../../fonts/BarlowCondensed-Bold.ttf';
import heavyFontUrl from '../../fonts/BarlowCondensed-Black.ttf';
async function load(url){const response=await fetch(url);if(!response.ok)throw new Error('Foto indisponível.');return createImageBitmap(await response.blob());}
function contain(ctx,image,x,y,w,h){const scale=Math.min(w/image.width,h/image.height);ctx.drawImage(image,x+(w-image.width*scale)/2,y+(h-image.height*scale)/2,image.width*scale,image.height*scale);}
async function loadOfferFonts(){if(typeof FontFace!=='function'||!document.fonts)return;for(const [url,weight] of [[regularFontUrl,'700'],[heavyFontUrl,'900']]){const face=await new FontFace('Offer Condensed',`url(${url})`,{weight}).load();if(![...document.fonts].some(item=>item.family===face.family&&item.weight===face.weight))document.fonts.add(face);}}
function centered(ctx,value,y,size,color='#fff'){ctx.fillStyle=color;ctx.font=`900 ${size}px 'Offer Condensed', Arial, sans-serif`;ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText(value,540,y);ctx.textAlign='left';}
export function text(ctx,value,x,y,width,height,size=48){
  for(;size>=16;size-=2){
    ctx.font=`700 ${size}px Arial`;const lines=[''];
    for(const word of value.split(/\s+/)){
      const last=lines.length-1,candidate=lines[last]?lines[last]+' '+word:word;
      if(ctx.measureText(candidate).width>width&&lines[last])lines.push(word);else lines[last]=candidate;
    }
    if(lines.length*size*1.2>height||lines.some(line=>ctx.measureText(line).width>width))continue;
    ctx.textBaseline='top';for(let i=0;i<lines.length;i++)ctx.fillText(lines[i],x,y+i*size*1.2);return;
  }
  throw new Error('Texto muito longo para a imagem. Revise a descrição e as condições.');
}
export async function createProductStory(campaign,item){
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Este navegador não permite gerar a imagem.');
  const blackFriday=campaign.theme_key==='black-friday';
  await loadOfferFonts();
  const [photo,logo,background,priceBrush]=await Promise.all([load(item.product.image),load(logoUrl),blackFriday?load(neonBackgroundUrl):null,blackFriday?load(priceBrushUrl):null]);
  try{
    if(blackFriday){
      ctx.fillStyle='#160019';ctx.fillRect(0,0,1080,1920);ctx.drawImage(background,0,0,1080,1920);
      ctx.fillStyle='rgba(18,0,25,.28)';ctx.fillRect(0,0,1080,1920);
      ctx.fillStyle='#fff200';ctx.fillRect(250,55,580,132);contain(ctx,logo,275,75,530,92);
      centered(ctx,'SELEÇÃO',220,70);centered(ctx,'BLACK',286,154);centered(ctx,'FRIDAY',430,154,'#fff200');
      centered(ctx,(campaign.title||'OFERTAS').toLocaleUpperCase('pt-BR').replace(/BLACK FRIDAY/g,'').trim()||'OFERTAS',595,46);
      ctx.save();ctx.shadowColor='#000a';ctx.shadowBlur=28;ctx.shadowOffsetY=16;contain(ctx,photo,95,660,890,575);ctx.restore();
      ctx.fillStyle='#fff';text(ctx,item.product.name.toLocaleUpperCase('pt-BR'),110,1245,860,125,48);
      const detail=[item.product.variant,item.product.content].filter(Boolean).join(' · ').toLocaleUpperCase('pt-BR');if(detail)text(ctx,detail,110,1370,860,58,29);
      ctx.drawImage(priceBrush,110,1440,860,225);centered(ctx,'PREÇO',1470,42,'#230064');
      centered(ctx,(item.priceCents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}),1517,100,'#230064');
      centered(ctx,`POR ${item.unit.toLocaleUpperCase('pt-BR')}`,1615,28,'#230064');
      const day=value=>value?.split('-').reverse().join('/');
      centered(ctx,campaign.startDate&&campaign.endDate?`VÁLIDO DE ${day(campaign.startDate)} A ${day(campaign.endDate)}`:'CONSULTE A VALIDADE',1690,28);
      ctx.fillStyle='#e7d9f2';text(ctx,[...new Set([campaign.conditions,item.conditions].filter(Boolean))].join(' ')||'Consulte condições e disponibilidade na loja.',90,1730,900,58,23);
      centered(ctx,'Não guarde o segredo da economia.',1814,27);centered(ctx,'Compartilhe!',1848,42,'#fff200');
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('Não foi possível gerar a imagem.');
      return new File([blob],`oferta-${item.product.code.replace(/[^a-z0-9_-]/gi,'_')}.png`,{type:'image/png'});
    }
    ctx.fillStyle=campaign.theme_key==='black-friday'?'#1d1228':'#502474';ctx.fillRect(0,0,1080,1920);
    ctx.fillStyle='#fff';ctx.fillRect(60,250,960,1420);contain(ctx,logo,320,265,440,100);
    ctx.fillStyle='#502474';text(ctx,campaign.title,100,385,880,100,50);
    contain(ctx,photo,130,500,820,500);
    ctx.fillStyle='#24202b';text(ctx,item.product.name,100,1020,880,140,56);
    text(ctx,[item.product.variant,item.product.content].filter(Boolean).join(' · '),100,1175,880,70,30);
    ctx.fillStyle='#502474';text(ctx,`${(item.priceCents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} / ${item.unit}`,100,1255,880,100,76);
    const day=d=>d.split('-').reverse().join('/');ctx.fillStyle='#24202b';
    text(ctx,`Válido de ${day(campaign.startDate)} a ${day(campaign.endDate)}`,100,1360,880,40,30);
    text(ctx,`Código: ${item.product.code}`,100,1405,880,30,24);
    text(ctx,[...new Set([campaign.conditions,item.conditions].filter(Boolean))].join(' '),100,1440,880,220,26);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
    if(!blob)throw new Error('Não foi possível gerar a imagem.');
    return new File([blob],`oferta-${item.product.code.replace(/[^a-z0-9_-]/gi,'_')}.png`,{type:'image/png'});
  }finally{photo.close();logo.close();background?.close();priceBrush?.close();}
}
export function downloadStory(file){const url=URL.createObjectURL(file),link=document.createElement('a');link.href=url;link.download=file.name;link.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
