import {optimizeProductImage} from './productImages';
import {logPanelError} from './diagnostics';
import {productCatalogRequest} from './adminApi';
const DB='bpv-product-offers-local-v1';
function open(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>req.result.createObjectStore('workspace');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(new Error('Não foi possível abrir os rascunhos locais.'));});}
export const emptyWorkspace=()=>({revision:0,catalog:[],campaigns:[]});
async function localWorkspace(){const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction('workspace','readonly');const req=tx.objectStore('workspace').get('data');req.onsuccess=()=>resolve(req.result||emptyWorkspace());req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close();});}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function mergeProductChanges(base,local,remote){
 const merged={...remote},conflicts=[];
 for(const key of new Set([...Object.keys(base||{}),...Object.keys(local||{}),...Object.keys(remote||{})])){
  if(['remoteRevision','revision'].includes(key))continue;
  const localChanged=!same(local?.[key],base?.[key]);
  const remoteChanged=!same(remote?.[key],base?.[key]);
  if(localChanged&&remoteChanged&&!same(local?.[key],remote?.[key]))conflicts.push(key);
  else if(localChanged)merged[key]=local[key];
 }
 return {...merged,revision:local.revision,remoteRevision:remote.remoteRevision,conflicts};
}
async function saveRemoteProduct(product,base){
 const action=base&&product.remoteRevision?'product_patch':'product_save';
 try{return await productCatalogRequest(action,product,product.remoteRevision||0,undefined,base)}catch(error){
  if(error?.status!==409)throw error;
  const current=(await productCatalogRequest('product_list')).find(item=>item.id===product.id);
  if(!current)throw error;
  const reconciled=mergeProductChanges(base||product,product,current);
  if(reconciled.conflicts.length){const conflict=new Error('Este produto também foi alterado em outro computador. Reabra o produto para comparar antes de salvar.');conflict.code='PRODUCT_MERGE_CONFLICT';conflict.fields=reconciled.conflicts;throw conflict;}
  const {conflicts,...retry}=reconciled;
  return productCatalogRequest('product_patch',retry,current.remoteRevision||0,undefined,current);
 }
}
export async function loadWorkspace(){
 const local=await localWorkspace();
 try {
  const remote=await productCatalogRequest('product_list');
  const pending=local.catalog.filter(p=>(p.remoteRevision||0)<(p.revision||0));
  const synchronized=[];
  for(const product of pending){
   const saved=await productCatalogRequest('product_save',product,product.remoteRevision||0);
   synchronized.push({...product,...saved,revision:product.revision});
  }
  const catalog=[...remote.filter(p=>!synchronized.some(localProduct=>localProduct.id===p.id)),...synchronized];
  return {...local,catalog};
 } catch(error) {
  logPanelError('product-catalog-load',error);
  return local;
 }
}
export async function saveWorkspace(data){
 const base=await localWorkspace();
 const catalog=[];
 for(const product of data.catalog){
  if((product.remoteRevision||0)<(product.revision||0)){
   const saved=await saveRemoteProduct(product,base.catalog.find(item=>item.id===product.id));
   Object.assign(product,saved,{revision:product.revision});
   catalog.push(product);
  }else catalog.push(product);
 }
 const synchronized={...data,catalog};
 const db=await open();
 return new Promise((resolve,reject)=>{const tx=db.transaction('workspace','readwrite'),store=tx.objectStore('workspace');const req=store.get('data');let next,error;req.onsuccess=()=>{if((req.result?.revision||0)!==data.revision){error=new Error('Este rascunho foi alterado em outra janela. Recarregue antes de salvar.');tx.abort();return;}next={...synchronized,revision:data.revision+1};store.put(next,'data');};tx.oncomplete=()=>{db.close();resolve(next);};tx.onabort=tx.onerror=()=>{db.close();reject(error||new Error('Não foi possível salvar. Verifique o espaço disponível.'));};});
}
export async function readProductImage(file){
 try {
  const images=await optimizeProductImage(file);
  return {...images,imageRevision:crypto.randomUUID(),imageApproved:false,imageAuthorized:false,imageSource:''};
 } catch(error) {logPanelError('product-image-read',error);throw error;}
}
