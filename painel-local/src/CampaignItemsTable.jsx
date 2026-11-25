import {useEffect,useState} from 'react';
import {Search,LayoutGrid,Image,AlertCircle,CheckCircle2,ArrowUp,ArrowDown,Trash2,Plus,PackageOpen} from 'lucide-react';
import {productIssues} from '../../bom-pra-voce-novo/src/Components/ProductOffers/model';
import {productBarcodes,productDescription,productFragrances} from '../../bom-pra-voce-novo/src/Components/ProductOffers/productIdentity';

const day=value=>value?.split('-').reverse().join('/')||'A definir';
const money=value=>value?new Intl.NumberFormat('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(value/100):'';
const PAGE_SIZE=8;
export default function CampaignItemsTable({campaign,catalog,onChange,onAdd,onEdit,onMove,onReviewPhoto,focusTarget,onFocusHandled}){
 const [query,setQuery]=useState(''),[filter,setFilter]=useState('all'),[selected,setSelected]=useState([]),[page,setPage]=useState(1);
 const rows=campaign.items.map((item,index)=>({...item,index,product:catalog.find(p=>p.id===item.productId)}));
 const matches=(r,type)=>type==='all'||(type==='photo'?!r.product?.imageApproved:type==='price'?!r.priceCents:!!r.priceCents&&r.product&&productIssues(r.product).length===0);
 const q=query.trim().toLocaleLowerCase('pt-BR');
 const visible=rows.filter(r=>matches(r,filter)&&[r.product?.name,r.product?.code,r.product?.brand,...productFragrances(r.product||{}).flatMap(f=>[f.name,f.barcode])].some(v=>v?.toLocaleLowerCase('pt-BR').includes(q)));
 const pageCount=Math.max(1,Math.ceil(visible.length/PAGE_SIZE)),paged=visible.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
 const update=(id,patch)=>onChange({items:campaign.items.map(i=>i.id===id?{...i,...patch}:i)});
 useEffect(()=>{if(page>pageCount)setPage(pageCount);},[page,pageCount]);
 useEffect(()=>{
  if(!focusTarget)return;
  setFilter('all');setQuery('');setPage(Math.floor(Math.max(0,rows.findIndex(row=>row.id===focusTarget.itemId))/PAGE_SIZE)+1);
  requestAnimationFrame(()=>{const node=document.querySelector(`[data-item-id="${focusTarget.itemId}"][data-field="${focusTarget.field}"]`);node?.scrollIntoView?.({block:'center'});node?.focus();onFocusHandled?.();});
 },[focusTarget,onFocusHandled]);
 const moveField=(event)=>{if(event.key!=='Enter')return;const fields=[...event.currentTarget.closest('table').querySelectorAll('[data-campaign-field]:not(:disabled)')];const index=fields.indexOf(event.currentTarget),next=fields[index+(event.shiftKey?-1:1)];event.preventDefault();(next||event.currentTarget).focus();};
 return <div className="campaign-table-area">
  <div className="campaign-table-search"><label><Search/><span className="sr-only">Buscar nos produtos da campanha</span><input placeholder="Buscar dentro dos produtos adicionados" value={query} onChange={e=>{setQuery(e.target.value);setPage(1)}}/></label></div>
  <div className="campaign-table-filters">{[['all','Todos',LayoutGrid],['photo','Foto pendente',Image],['price','Sem preço',AlertCircle],['ready','Prontos',CheckCircle2]].map(([key,label,Icon])=><button key={key} type="button" aria-pressed={filter===key} onClick={()=>{setFilter(key);setPage(1)}}><Icon size={18}/>{label}<span>{rows.filter(r=>matches(r,key)).length}</span></button>)}</div>
  <div className="campaign-table-scroll"><table><thead><tr><th><input type="checkbox" aria-label="Selecionar produtos visíveis" checked={paged.length>0&&paged.every(r=>selected.includes(r.id))} onChange={e=>setSelected(e.target.checked?[...new Set([...selected,...paged.map(r=>r.id)])]:selected.filter(id=>!paged.some(r=>r.id===id)))}/></th><th>Produto e fragrâncias</th><th>Código interno / GTINs</th><th>Preço</th><th>Validade da campanha e do lote</th><th>Status da foto</th><th>Ações</th></tr></thead><tbody>{paged.map(r=><tr key={r.id}>
   <td><input type="checkbox" aria-label={`Selecionar ${r.product?.name}`} checked={selected.includes(r.id)} onChange={e=>setSelected(e.target.checked?[...selected,r.id]:selected.filter(id=>id!==r.id))}/></td>
   <td><div className="campaign-product-cell">{r.product?.image?<img src={r.product.image} alt=""/>:<span className="campaign-no-photo">Sem foto</span>}<div><strong>{r.product?productDescription(r.product):'Produto indisponível'}</strong></div></div></td>
   <td>{r.product?.code}<small>{productBarcodes(r.product||{}).length?'GTINs: '+productBarcodes(r.product).join(' / '):'GTIN não informado'}</small></td>
   <td><label className="campaign-price-field"><span>R$</span><input aria-label={`Preço de ${r.product?.name}`} type="text" inputMode="numeric" placeholder="0,00" value={money(r.priceCents)} data-campaign-field data-item-id={r.id} data-field="price" onKeyDown={moveField} onChange={e=>update(r.id,{priceCents:Number(e.target.value.replace(/\D/g,''))||0})}/></label><select aria-label={`Unidade de ${r.product?.name}`} value={r.unit} data-campaign-field data-item-id={r.id} data-field="unit" onKeyDown={moveField} onChange={e=>update(r.id,{unit:e.target.value})}>{['un','kg','L','pacote'].map(u=><option key={u}>{u}</option>)}</select></td>
   <td>Campanha: {day(campaign.startDate)} a {day(campaign.endDate)}<label className="campaign-no-expiry"><input type="checkbox" checked={r.noExpiry===true} onChange={e=>update(r.id,{noExpiry:e.target.checked,expiresOn:e.target.checked?'':r.expiresOn||''})}/> Produto sem vencimento</label><label className="campaign-expiry-field">Vencimento do lote<input aria-label={`Vencimento do lote de ${r.product?.name}`} type="date" value={r.expiresOn||''} min={campaign.endDate||undefined} disabled={r.noExpiry===true} data-campaign-field data-item-id={r.id} data-field="expiry" onKeyDown={moveField} onChange={e=>update(r.id,{expiresOn:e.target.value,noExpiry:false})}/></label></td>
   <td><span className={`campaign-photo-status ${r.product?.imageApproved?'approved':''}`}>{r.product?.imageApproved?'Aprovada':'Revisar imagem'}</span><small>{r.product?.imageApproved?'Conferida para este cadastro':'A foto precisa de revisão.'}</small>{!r.product?.imageApproved&&r.product?.image&&<button type="button" className="admin-quiet" onClick={()=>onReviewPhoto?.(r.product)}>Conferir imagem</button>}</td>
   <td><button className="admin-quiet" onClick={()=>r.product&&onEdit(r.product)}>Editar produto</button><div className="campaign-row-actions"><button aria-label={`Subir ${r.product?.name}`} disabled={!r.index} onClick={()=>onMove(r.index,-1)}><ArrowUp size={16}/></button><button aria-label={`Descer ${r.product?.name}`} disabled={r.index===rows.length-1} onClick={()=>onMove(r.index,1)}><ArrowDown size={16}/></button><button aria-label={`Remover ${r.product?.name}`} onClick={()=>onChange({items:campaign.items.filter(i=>i.id!==r.id)})}><Trash2 size={16}/></button></div></td>
  </tr>)}</tbody></table></div>
  {pageCount>1&&<nav className="offer-pagination" aria-label="Paginação dos produtos da campanha"><button type="button" className="offer-secondary" disabled={page===1} onClick={()=>setPage(value=>value-1)}>Anterior</button><span aria-live="polite">Página {page} de {pageCount}</span><button type="button" className="offer-secondary" disabled={page===pageCount} onClick={()=>setPage(value=>value+1)}>Próxima</button></nav>}
  {!visible.length&&<div className="campaign-products-empty"><PackageOpen/><h3>{rows.length?'Nenhum produto corresponde a este filtro':'A campanha ainda não tem produtos'}</h3><p>{rows.length?'Limpe a busca ou escolha outro filtro.':'Escolha produtos do catálogo permanente. Você só precisará informar preço, unidade e vencimento.'}</p>{!rows.length&&<button className="offer-primary" onClick={onAdd}><Plus size={20}/> Escolher produtos do catálogo</button>}</div>}
  <div className="campaign-table-bottom"><span>{selected.filter(id=>campaign.items.some(i=>i.id===id)).length} selecionados</span><p>Confira a identidade, os preços, as datas e as fotos antes da publicação.</p></div>
 </div>;
}
