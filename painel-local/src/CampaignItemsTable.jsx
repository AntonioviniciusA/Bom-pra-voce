import {useState} from 'react';
import {Search,LayoutGrid,Image,AlertCircle,CheckCircle2,ArrowUp,ArrowDown,Trash2,Plus} from 'lucide-react';
import {productIssues} from '../../bom-pra-voce-novo/src/Components/ProductOffers/model';
import {productBarcodes,productDescription,productFragrances} from '../../bom-pra-voce-novo/src/Components/ProductOffers/productIdentity';

const day=value=>value?.split('-').reverse().join('/')||'A definir';
export default function CampaignItemsTable({campaign,catalog,onChange,onAdd,onEdit,onMove}){
 const [query,setQuery]=useState(''),[filter,setFilter]=useState('all'),[selected,setSelected]=useState([]);
 const rows=campaign.items.map((item,index)=>({...item,index,product:catalog.find(p=>p.id===item.productId)}));
 const matches=(r,type)=>type==='all'||(type==='photo'?!r.product?.imageApproved:type==='price'?!r.priceCents:!!r.priceCents&&r.product&&productIssues(r.product).length===0);
 const q=query.trim().toLocaleLowerCase('pt-BR');
 const visible=rows.filter(r=>matches(r,filter)&&[r.product?.name,r.product?.code,r.product?.brand,...productFragrances(r.product||{}).flatMap(f=>[f.name,f.barcode])].some(v=>v?.toLocaleLowerCase('pt-BR').includes(q)));
 const update=(id,patch)=>onChange({items:campaign.items.map(i=>i.id===id?{...i,...patch}:i)});
 return <div className="campaign-table-area">
  <div className="campaign-table-search"><label><Search/><span className="sr-only">Buscar nos produtos da campanha</span><input placeholder="Buscar por nome, marca, fragrância ou código" value={query} onChange={e=>setQuery(e.target.value)}/></label><button className="admin-primary" onClick={onAdd}><Plus size={20}/> Adicionar produtos</button></div>
  <div className="campaign-table-filters">{[['all','Todos',LayoutGrid],['photo','Foto pendente',Image],['price','Sem preço',AlertCircle],['ready','Prontos',CheckCircle2]].map(([key,label,Icon])=><button key={key} type="button" aria-pressed={filter===key} onClick={()=>setFilter(key)}><Icon size={18}/>{label}<span>{rows.filter(r=>matches(r,key)).length}</span></button>)}</div>
  <div className="campaign-table-scroll"><table><thead><tr><th><input type="checkbox" aria-label="Selecionar produtos visíveis" checked={visible.length>0&&visible.every(r=>selected.includes(r.id))} onChange={e=>setSelected(e.target.checked?[...new Set([...selected,...visible.map(r=>r.id)])]:selected.filter(id=>!visible.some(r=>r.id===id)))}/></th><th>Produto e fragrâncias</th><th>Código interno / GTINs</th><th>Preço</th><th>Validade da campanha e do lote</th><th>Status da foto</th><th>Ações</th></tr></thead><tbody>{visible.map(r=><tr key={r.id}>
   <td><input type="checkbox" aria-label={`Selecionar ${r.product?.name}`} checked={selected.includes(r.id)} onChange={e=>setSelected(e.target.checked?[...selected,r.id]:selected.filter(id=>id!==r.id))}/></td>
   <td><div className="campaign-product-cell">{r.product?.image?<img src={r.product.image} alt=""/>:<span className="campaign-no-photo">Sem foto</span>}<div><strong>{r.product?productDescription(r.product):'Produto indisponível'}</strong></div></div></td>
   <td>{r.product?.code}<small>{productBarcodes(r.product||{}).length?'GTINs: '+productBarcodes(r.product).join(' / '):'GTIN não informado'}</small></td>
   <td><input aria-label={`Preço de ${r.product?.name}`} type="number" min="0.01" step="0.01" placeholder="Não informado" value={r.priceCents?r.priceCents/100:''} onChange={e=>update(r.id,{priceCents:Math.round(Number(e.target.value)*100)})}/><select aria-label={`Unidade de ${r.product?.name}`} value={r.unit} onChange={e=>update(r.id,{unit:e.target.value})}>{['un','kg','L','pacote'].map(u=><option key={u}>{u}</option>)}</select></td>
   <td>Campanha: {day(campaign.startDate)} a {day(campaign.endDate)}<label className="campaign-expiry-field">Vencimento do lote<input aria-label={`Vencimento do lote de ${r.product?.name}`} type="date" value={r.expiresOn||''} min={campaign.endDate||undefined} onChange={e=>update(r.id,{expiresOn:e.target.value})}/></label></td>
   <td><span className={`campaign-photo-status ${r.product?.imageApproved?'approved':''}`}>{r.product?.imageApproved?'Aprovada':'Revisar imagem'}</span><small>{r.product?.imageApproved?'Conferida para este cadastro':'A foto precisa de revisão.'}</small></td>
   <td><button className="admin-quiet" onClick={()=>r.product&&onEdit(r.product)}>Editar produto</button><div className="campaign-row-actions"><button aria-label={`Subir ${r.product?.name}`} disabled={!r.index} onClick={()=>onMove(r.index,-1)}><ArrowUp size={16}/></button><button aria-label={`Descer ${r.product?.name}`} disabled={r.index===rows.length-1} onClick={()=>onMove(r.index,1)}><ArrowDown size={16}/></button><button aria-label={`Remover ${r.product?.name}`} onClick={()=>onChange({items:campaign.items.filter(i=>i.id!==r.id)})}><Trash2 size={16}/></button></div></td>
  </tr>)}</tbody></table></div>
  {!visible.length&&<p className="admin-empty">Nenhum produto neste filtro.</p>}
  <div className="campaign-table-bottom"><span>{selected.filter(id=>campaign.items.some(i=>i.id===id)).length} selecionados</span><p>Confira a identidade, os preços, as datas e as fotos antes da publicação.</p></div>
 </div>;
}
