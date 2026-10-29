import {optimizeProductImage} from './productImages';
import {logPanelError} from './diagnostics';
const DB='bpv-product-offers-local-v1';
function open(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>req.result.createObjectStore('workspace');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(new Error('Não foi possível abrir os rascunhos locais.'));});}
export const emptyWorkspace=()=>({revision:0,catalog:[],campaigns:[]});
export async function loadWorkspace(){const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction('workspace','readonly');const req=tx.objectStore('workspace').get('data');req.onsuccess=()=>resolve(req.result||emptyWorkspace());req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close();});}
export async function saveWorkspace(data){const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction('workspace','readwrite'),store=tx.objectStore('workspace');const req=store.get('data');let next,error;req.onsuccess=()=>{if((req.result?.revision||0)!==data.revision){error=new Error('Este rascunho foi alterado em outra janela. Recarregue antes de salvar.');tx.abort();return;}next={...data,revision:data.revision+1};store.put(next,'data');};tx.oncomplete=()=>{db.close();resolve(next);};tx.onabort=tx.onerror=()=>{db.close();reject(error||new Error('Não foi possível salvar. Verifique o espaço disponível.'));};});}
export async function readProductImage(file){
 try {
  const images=await optimizeProductImage(file);
  return {...images,imageRevision:crypto.randomUUID(),imageApproved:false,imageAuthorized:false,imageSource:''};
 } catch(error) {logPanelError('product-image-read',error);throw error;}
}
