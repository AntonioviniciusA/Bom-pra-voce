export const productCategories = [
 {key:'hortifruti',label:'Hortifruti'}, {key:'acougue',label:'Açougue'}, {key:'mercearia',label:'Mercearia'}, {key:'bebidas',label:'Bebidas'}, {key:'limpeza',label:'Limpeza'}, {key:'higiene',label:'Higiene e beleza'}, {key:'padaria',label:'Padaria'}, {key:'frios',label:'Frios e congelados'}, {key:'utilidades',label:'Utilidades'}
];
import {productBarcodes,productFragrances} from './productIdentity';
export function validGTIN(value) {
 if(!/^(\d{8}|\d{12}|\d{13}|\d{14})$/.test(value)) return false;
 const digits=[...value].map(Number); const check=digits.pop();
 return (10-digits.reverse().reduce((sum,n,i)=>sum+n*(i%2===0?3:1),0)%10)%10===check;
}
export function productDraftIssues(p) {
 const issues=[];
 if(!p.name?.trim()) issues.push('Informe o nome');
 if(!p.code?.trim()) issues.push('Informe o código interno');
 const explicitVariants=Array.isArray(p.fragrances)?p.fragrances:[],barcodes=productBarcodes(p);
 if(explicitVariants.length>8) issues.push('Use até 8 variantes por produto');
 if(p.identifierType==='gtin') {
  if(explicitVariants.length) {
   if(explicitVariants.some(f=>!f.name?.trim()||!validGTIN(f.barcode||''))) issues.push('Informe o nome e o GTIN válido de cada variante');
  } else if(!validGTIN(p.barcode||'')) issues.push('Informe um GTIN válido para o produto');
 }
 if(new Set(barcodes.map(code=>code.padStart(14,'0'))).size!==barcodes.length) issues.push('Cada fragrância precisa de um código de barras diferente');
 if(p.identifierType!=='gtin'&&!p.noGtinReason?.trim()) issues.push('Informe o motivo de não usar GTIN');
 if(!productCategories.some(c=>c.key===p.category)) issues.push('Escolha a categoria');
 if(!p.image) issues.push('Anexe a foto correspondente');
 if(!p.imageSource?.trim()||!p.imageAuthorized) issues.push('Informe a origem e autorização da foto');
 return issues;
}
export function productIssues(p) {
 const issues=productDraftIssues(p);
 if(!p.imageApproved) issues.push('Revise e aprove a foto');
 return issues;
}
export function campaignIssues(c,catalog) {
 const issues=[];
 const campaignBarcodes=new Set();
 const realDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
 if(!realDate(c.startDate)||!realDate(c.endDate)) issues.push('Informe datas existentes no calendário');
 if(realDate(c.endDate)&&Date.parse(`${c.endDate}T00:00:00-03:00`)+86400000<=Date.now()) issues.push('A campanha já terminou');
 if(!c.conditions?.trim()) issues.push('Informe as condições da oferta');
 if(c.items.length>100) issues.push('Use até 100 produtos por campanha');
 if(new Set(c.items.map(i=>i.productId)).size!==c.items.length) issues.push('Remova os produtos repetidos');
 if(!c.title?.trim()) issues.push('Informe o nome da campanha');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(c.startDate)||!/^\d{4}-\d{2}-\d{2}$/.test(c.endDate)||c.startDate>c.endDate) issues.push('Confira o período');
 if(!c.items.length) issues.push('Inclua pelo menos um produto');
 for(const item of c.items){const p=catalog.find(p=>p.id===item.productId);if(!p){issues.push('Produto não encontrado');continue;}
 for(const message of productIssues(p)) issues.push(`${p.name||p.code}: ${message}`);
 for(const barcode of productBarcodes(p)){const normalized=barcode.padStart(14,'0');if(campaignBarcodes.has(normalized))issues.push(`${p.name}: GTIN repetido em outro produto da campanha`);campaignBarcodes.add(normalized);}
 if(!item.noExpiry&&!item.expiresOn) issues.push(`${p.name}: informe o vencimento representativo da embalagem/lote ou marque sem vencimento`);
 else if(!item.noExpiry&&(!realDate(item.expiresOn)||item.expiresOn<c.endDate)) issues.push(`${p.name}: o vencimento do lote deve ser uma data válida igual ou posterior ao fim da campanha`);
 if(!Number.isSafeInteger(item.priceCents)||item.priceCents<=0) issues.push(`${p.name}: informe um preço válido`);
 if(!['un','kg','L','pacote'].includes(item.unit)) issues.push(`${p.name}: confira a unidade`);
 }
 return issues;
}
export function campaignPreview(c,catalog){return {...c,items:c.items.map(item=>({...item,product:catalog.find(p=>p.id===item.productId)})).filter(i=>i.product)};}
