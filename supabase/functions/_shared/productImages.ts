import {HttpError} from './http.ts';
import {projectUrl,serviceKey,upload,download} from './supabase.ts';
import {sha256} from './crypto.ts';
import {validatePromotion} from './validation.ts';

const extensions: Record<string,string> = {'image/webp':'webp','image/png':'png','image/jpeg':'jpg'};
export function productImagePath(hash: string,mime: string) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(hash) || !extensions[mime])
    throw new HttpError(422,'INVALID_IMAGE','Identificação de foto inválida.');
  return `products/assets/${hash}.${extensions[mime]}`;
}
export function productImageUrl(path: string) {
  return `${projectUrl()}/storage/v1/object/public/promotion-public/${path}`;
}
export function isProductImageUrl(value: string, base: string) {
  const prefix = `${base.replace(/\/$/,'')}/storage/v1/object/public/promotion-public/`;
  return value.startsWith(prefix) && /^products\/assets\/[A-Za-z0-9_-]{43}\.(webp|png|jpg)$/.test(value.slice(prefix.length));
}
export async function imageExists(path: string) {
  const key=serviceKey();
  const response=await fetch(`${projectUrl()}/storage/v1/object/authenticated/promotion-public/${path}`,{
    method:'HEAD',headers:{apikey:key,Authorization:`Bearer ${key}`},redirect:'error'
  });
  if(response.ok) return true;
  if(response.status===404) return false;
  // Storage can return 400 for a missing object; do not mistake auth/server failures for absence.
  if(response.status===400) {
    const info=await fetch(`${projectUrl()}/storage/v1/object/info/promotion-public/${path}`,{
      headers:{apikey:key,Authorization:`Bearer ${key}`},redirect:'error'
    });
    if(info.ok) return true;
    const body=await info.json().catch(()=>({}));
    if(body.code==='NoSuchKey'||body.error==='not_found'||String(body.statusCode)==='404')return false;
  }
  throw new HttpError(503,'STORAGE_UNAVAILABLE','Não foi possível conferir a foto no armazenamento. Tente novamente.');
}
export async function storeProductImage(photo: Uint8Array,mime: string) {
  if(!photo.length||photo.length>2000000)throw new HttpError(413,'FILE_TOO_LARGE','Cada foto preparada deve ter até 2 MB.');
  validatePromotion(photo,mime);
  const hash=await sha256(photo),path=productImagePath(hash,mime);
  if(!await imageExists(path)) {
    try {await upload('promotion-public',path,photo,mime);}
    catch(error) {
      // A concurrent upload or lost response may already have persisted exactly these bytes.
      const existing=new Uint8Array(await download('promotion-public',path));
      if(await sha256(existing)!==hash)throw error;
    }
  }
  return {url:productImageUrl(path)};
}
