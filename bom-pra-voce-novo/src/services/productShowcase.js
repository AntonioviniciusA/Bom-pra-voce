import {callPublicFunction, publicMediaUrl, PublicApiError} from './publicApi';
export async function getProductShowcase(signal) {
  const data=await callPublicFunction('product-showcase',{signal});
  const serverTime=Date.parse(data?.server_time);
  if(!Number.isFinite(serverTime)||typeof data.version!=='string'||!Array.isArray(data.campaigns))throw new PublicApiError('INVALID_RESPONSE','Não foi possível conferir as ofertas.');
  const campaigns=data.campaigns.map(c=>{
    const starts=Date.parse(c.starts_at),ends=Date.parse(c.ends_at);
    if(!c.id||!c.title||!Number.isFinite(starts)||!Number.isFinite(ends)||ends<=starts||!Array.isArray(c.items)||!c.items.length||c.items.some(i=>!i.product?.name||!publicMediaUrl(i.product.image)||(i.product.imageSmall&&!publicMediaUrl(i.product.imageSmall))||!Number.isSafeInteger(i.priceCents)||i.priceCents<=0))throw new PublicApiError('INVALID_RESPONSE','Não foi possível conferir os produtos.');
    return {...c,starts,ends};
  });
  return {campaigns:campaigns.filter(c=>c.starts<=serverTime&&c.ends>serverTime),serverTime,version:data.version,nextChangeAt:data.next_change_at?Date.parse(data.next_change_at):null};
}
