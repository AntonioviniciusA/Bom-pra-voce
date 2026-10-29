import {isProductImageUrl} from './productImages.ts';
import { HttpError } from './http.ts';

const categories = ['hortifruti','acougue','mercearia','bebidas','limpeza','higiene','padaria','frios','utilidades'];
const themes = ['padrao','verao','volta-a-rotina','carnaval','volta-as-aulas','consumidor','pascoa','maes','festa-junina','namorados','ferias','inverno','pais','primavera','setembro-amarelo','criancas','outubro-rosa','black-friday','natal','ano-novo','aniversario-loja'];
function fail(message: string): never { throw new HttpError(422,'INVALID_CAMPAIGN',message); }
function string(value: unknown, max: number, required = true): string {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) fail('Revise os textos da campanha e dos produtos.');
  return value.trim();
}
function date(value: unknown): string {
  const text = string(value,10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || !Number.isFinite(Date.parse(text)) || new Date(text).toISOString().slice(0,10) !== text) fail('PerÃ­odo invÃ¡lido.');
  return text;
}
export function gtin(value: string): boolean {
  if (!/^(\d{8}|\d{12}|\d{13}|\d{14})$/.test(value)) return false;
  const digits = [...value].map(Number), check = digits.pop();
  return (10 - digits.reverse().reduce((s,n,i)=>s+n*(i%2 ? 1 : 3),0)%10)%10 === check;
}
// Only this allowlisted snapshot reaches the database/public response.
export function validateProductCampaign(input: any, baseUrl = '') {
  if (!input || !Array.isArray(input.items) || !input.items.length || input.items.length > 100) fail('Inclua entre 1 e 100 produtos.');
  const startDate = date(input.startDate), endDate = date(input.endDate);
  if (endDate < startDate) fail('O fim deve ser igual ou posterior ao inÃ­cio.');
  const starts_at = `${startDate}T00:00:00-03:00`;
  const ends_at = new Date(Date.parse(`${endDate}T00:00:00-03:00`)+86400000).toISOString();
  if (Date.parse(ends_at) <= Date.now()) fail('A campanha jÃ¡ terminou.');
  if (!themes.includes(input.theme_key)) fail('Tema invÃ¡lido.');
  const ids = new Set(), codes = new Set(), barcodes = new Set();
  const items = input.items.map((item: any) => {
    const p = item?.product;
    if (!p || !Number.isSafeInteger(item.priceCents) || item.priceCents <= 0 || item.priceCents > 99999999 || !['un','kg','L','pacote'].includes(item.unit)) fail('Confira produto, preÃ§o e unidade.');
    const id = string(item.id,80), productId = string(p.id,80), code = string(p.code,60);
    const fragrances = Array.isArray(p.fragrances) ? p.fragrances : [{name:p.variant ?? '',barcode:p.barcode ?? ''}];
    if(!fragrances.length||fragrances.length>8) fail('Informe entre 1 e 8 fragrâncias por produto.');
    const checkedFragrances=fragrances.map((f:any)=>({name:string(f?.name ?? '',120,Array.isArray(p.fragrances)),barcode:string(f?.barcode ?? '',14,p.identifierType==='gtin')}));
    const barcode=checkedFragrances[0].barcode;
    if (ids.has(productId) || codes.has(code)) fail('HÃ¡ produtos ou cÃ³digos duplicados.');
    ids.add(productId); codes.add(code);
    if (!['gtin','plu'].includes(p.identifierType) || (p.identifierType === 'gtin' && checkedFragrances.some(f=>!gtin(f.barcode)))) fail('Confira a identificaÃ§Ã£o do produto.');
    for(const f of checkedFragrances){if(f.barcode){const normalized=f.barcode.padStart(14,'0');if(barcodes.has(normalized))fail('Há códigos de barras repetidos.');barcodes.add(normalized);}}
    const noGtinReason = string(p.noGtinReason ?? '',200,p.identifierType === 'plu');
    if (!categories.includes(p.category) || p.imageApproved !== true || p.imageAuthorized !== true || !Number.isSafeInteger(p.revision) || p.revision < 1) fail('Revise e aprove a imagem e a categoria do produto.');
    const imageSource = string(p.imageSource,500);
    const image = string(p.image,2800000);
    if (!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+=*$/.test(image) && !isProductImageUrl(image,baseUrl)) fail('Anexe uma foto JPG, PNG ou WebP para publicar.');
    const imageSmall = p.imageSmall ? string(p.imageSmall,2048) : '';
    if(imageSmall && !isProductImageUrl(imageSmall,baseUrl)) fail('Miniatura inválida.');
    const expiresOn=item.expiresOn ? date(item.expiresOn) : '';
    if(expiresOn&&expiresOn<endDate)fail('O lote vence antes do fim da campanha.');
    return {id,priceCents:item.priceCents,unit:item.unit,expiresOn,conditions:string(item.conditions ?? '',500,false),product:{id:productId,revision:p.revision,name:string(p.name,120),code,barcode,fragrances:checkedFragrances,identifierType:p.identifierType,noGtinReason,brand:string(p.brand ?? '',120,false),variant:string(p.variant ?? '',120,false),content:string(p.content ?? '',120,false),category:p.category,image,...(imageSmall?{imageSmall}:{}),imageRevision:string(p.imageRevision,80),imageSource,imageApproved:true,imageAuthorized:true}};
  });
  return {title:string(input.title,120),theme_key:input.theme_key,startDate,endDate,starts_at,ends_at,conditions:string(input.conditions,500),items};
}
