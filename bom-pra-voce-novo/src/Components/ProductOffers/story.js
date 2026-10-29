import logoUrl from '../../images/Logo.png';
async function load(url){const response=await fetch(url);if(!response.ok)throw new Error('Foto indisponível.');return createImageBitmap(await response.blob());}
function contain(ctx,image,x,y,w,h){const scale=Math.min(w/image.width,h/image.height);ctx.drawImage(image,x+(w-image.width*scale)/2,y+(h-image.height*scale)/2,image.width*scale,image.height*scale);}
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
  const [photo,logo]=await Promise.all([load(item.product.image),load(logoUrl)]);
  try{
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
  }finally{photo.close();logo.close();}
}
export function downloadStory(file){const url=URL.createObjectURL(file),link=document.createElement('a');link.href=url;link.download=file.name;link.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
