import { authenticatedUser, projectUrl, rpc } from '../_shared/supabase.ts';
import { cors, failure, HttpError, json, preflight, requireMethod, requireUuid } from '../_shared/http.ts';
import { validateProductCampaign } from '../_shared/productCampaign.ts';
import {imageExists,productImagePath,productImageUrl,storeProductImage,isProductImageUrl} from '../_shared/productImages.ts';

Deno.serve(async req => {
  try {
    cors(req);
    if (req.method === 'OPTIONS') return preflight(req);
    if (req.method === 'GET') return json(req,await rpc('bpv_product_showcase',{}),200,{'Cache-Control':'no-store'});
    requireMethod(req,'POST');
    const user = await authenticatedUser(req);
    if (!await rpc('bpv_has_permission',{p_user_id:user.id,p_permission:'promotions.manage'})) throw new HttpError(403,'FORBIDDEN','Sem permissÃ£o para administrar ofertas.');
    // Bound the stream even when Content-Length is missing.
    const reader = req.body?.getReader();
    if (!reader) throw new HttpError(400,'INVALID_REQUEST','Pedido vazio.');
    const mime=(req.headers.get('content-type')||'').split(';')[0];
    const binary=mime.startsWith('image/');
    const limit=binary?2000000:28000000; // Legacy panels remain compatible during rollout.
    const chunks: Uint8Array[] = []; let length=0;
    while (true) { const {done,value}=await reader.read(); if(done)break; length+=value.length; if(length>limit){await reader.cancel();throw new HttpError(413,'FILE_TOO_LARGE','Publique atÃ© 28 MB por campanha.');} chunks.push(value); }
    const bytes = new Uint8Array(length); let offset=0; for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
    if(binary)return json(req,await storeProductImage(bytes,mime));
    const body=JSON.parse(new TextDecoder().decode(bytes));
    if(body.action==='list')return json(req,await rpc('bpv_list_product_campaigns',{p_actor:user.id}));
    if(body.action==='image-status'){
      const path=productImagePath(body.hash,body.mime);
      return json(req,{exists:await imageExists(path),url:productImageUrl(path)});
    }
    const id=requireUuid(body.campaign_id,'Campanha');
    if(!Number.isSafeInteger(body.expected_revision)||body.expected_revision<0)throw new HttpError(422,'INVALID_REVISION','Recarregue o estado da publicaÃ§Ã£o.');
    if(body.action==='withdraw')return json(req,await rpc('bpv_write_product_campaign',{p_actor:user.id,p_id:id,p_expected_revision:body.expected_revision,p_snapshot:null}));
    if(body.action!=='publish')throw new HttpError(400,'INVALID_ACTION','AÃ§Ã£o invÃ¡lida.');
    const snapshot=validateProductCampaign(body.campaign,projectUrl());
    const checked=new Set<string>();
    for(const item of snapshot.items){
      if(item.product.image.startsWith('data:')){
        const match=/^data:(image\/(?:png|jpeg|webp));base64,(.+)$/.exec(item.product.image)!;
        item.product.image=(await storeProductImage(Uint8Array.from(atob(match[2]),c=>c.charCodeAt(0)),match[1])).url;
      }
      for(const url of [item.product.image,item.product.imageSmall].filter(Boolean) as string[]){
        if(!isProductImageUrl(url,projectUrl()))throw new HttpError(422,'INVALID_IMAGE','Foto inválida.');
        if(checked.has(url))continue;
        const path=url.split('/promotion-public/')[1];
        checked.add(url);
      }
    }
    const urls=[...checked];
    for(let offset=0;offset<urls.length;offset+=6){
      await Promise.all(urls.slice(offset,offset+6).map(async url=>{
        if(!await imageExists(url.split('/promotion-public/')[1]))throw new HttpError(422,'MISSING_IMAGE','Uma foto não foi encontrada. Envie novamente antes de publicar.');
      }));
    }
    // Never remove uploaded assets on an ambiguous network failure: a commit may have succeeded.
    return json(req,await rpc('bpv_write_product_campaign',{p_actor:user.id,p_id:id,p_expected_revision:body.expected_revision,p_snapshot:snapshot}));
  }catch(error){return failure(req,error);}
});
