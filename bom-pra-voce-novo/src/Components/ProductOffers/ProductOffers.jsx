import StoryButton from './StoryButton';
import {siteUrl} from '../../Data/seo';
import {useEffect,useMemo,useState} from 'react';
import {Search,Share2,LayoutGrid,Beef,Milk,SprayCan,House,ChevronRight,Megaphone,ShoppingCart} from 'lucide-react';
import {seasonalTheme} from '../Tabloide/seasonalThemes';
import Logo from '../../images/Logo.png';
import blackFridaySparks from '../../images/offer-themes/black-friday/black-friday-raios-finos.webp';
import {productBarcodes,productFragrances} from './productIdentity';
import './ProductOffers.css';
import './SeasonalFrames.css';
import './SeasonalRemaining.css';
import './OfferControls.css';
const groups=[{key:'all',label:'Todas',Icon:LayoutGrid},{key:'meat',label:'Açougue e congelados',Icon:Beef,categories:['acougue','frios']},{key:'grocery',label:'Mercearia e bebidas',Icon:Milk,categories:['mercearia','bebidas','hortifruti','padaria']},{key:'cleaning',label:'Limpeza e beleza',Icon:SprayCan,categories:['limpeza','higiene']},{key:'home',label:'Casa e bebê',Icon:House,categories:['utilidades']}];
const MOBILE_QUERY='(max-width: 700px)';
function useProductsPerPage(){
 const [mobile,setMobile]=useState(()=>typeof window!=='undefined'&&!!window.matchMedia?.(MOBILE_QUERY).matches);
 useEffect(()=>{
  const media=window.matchMedia?.(MOBILE_QUERY);
  if(!media)return;
  const update=()=>setMobile(media.matches);
  update();media.addEventListener('change',update);
  return()=>media.removeEventListener('change',update);
 },[]);
 return mobile?4:8;
}
const day=value=>value?.split('-').reverse().join('/');
const period=(start,end)=>start&&end?'De '+(start.slice(0,7)===end.slice(0,7)?start.slice(8):day(start))+' a '+day(end):'Período a definir';
function CampaignTitle({theme,title}){
 if(theme==='criancas'&&title==='Momentos em família')return <>Momentos<br/><em>em família</em></>;
 if(theme==='black-friday'&&['Seleção Black Friday','Esquenta Black Friday','Semana Black Friday'].includes(title))return <><span className="season-title-lead">{title.replace(' Black Friday','')}</span><em>Black Friday<ShoppingCart className="black-friday-cart" strokeWidth={2} aria-hidden="true"/></em></>;
 if(theme==='natal'&&title==='Natal à mesa')return <>Natal <em>à mesa</em></>;
 if(theme==='ano-novo'&&title==='Um novo ano de economia')return <><span className="season-title-ribbon">Um novo ano</span><em>de economia</em></>;
 const words=(title||'Ofertas da semana').split(' '),last=words.pop();return <>{words.join(' ')} <em>{last}</em></>;
}
function Photo({product}){const[failed,setFailed]=useState(false);return <div className="product-offer__photo">{product.image&&!failed?<img src={product.imageSmall||product.image} srcSet={product.imageSmall?`${product.imageSmall} 480w, ${product.image} 1200w`:undefined} sizes="(max-width: 600px) 45vw, 240px" alt={product.name} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>:<span>Foto do produto<br/><small>Aguardando cadastro e revisão</small></span>}</div>}
function Price({cents,unit}){if(!Number.isSafeInteger(cents)||cents<=0)return <div className="product-offer__price product-offer__price--pending"><span>Preço a definir</span></div>;const [whole,fraction]=(cents/100).toFixed(2).split('.');return <div className="product-offer__price" aria-label={`${whole} reais e ${fraction} centavos por ${unit}`}><span>R$</span><strong>{whole}<sup>,{fraction}</sup></strong><small>/{unit}</small></div>}
export default function ProductOffers({campaign,preview=false}){
 const[category,setCategory]=useState('all'),[query,setQuery]=useState(''),[message,setMessage]=useState(''),[page,setPage]=useState(1);const theme=seasonalTheme(campaign.theme_key);
 const [sharedProduct,setSharedProduct]=useState(()=>{const params=new URLSearchParams(window.location.search);return params.get('campanha')===campaign.id?params.get('produto'):null;});
 const filtered=useMemo(()=>{const q=query.trim().toLocaleLowerCase('pt-BR'),group=groups.find(c=>c.key===category);const exact=campaign.items.filter(i=>i.product.code?.toLocaleLowerCase('pt-BR')===q||productBarcodes(i.product).includes(q));return (q&&exact.length?exact:campaign.items).filter(({product:p})=>(!sharedProduct||p.id===sharedProduct)&&(category==='all'||group?.categories.includes(p.category))&&(!q||exact.length||[p.name,p.brand,p.code,p.content,...productFragrances(p).flatMap(f=>[f.name,f.barcode])].some(v=>v?.toLocaleLowerCase('pt-BR').includes(q))));},[campaign,category,query,sharedProduct]);
 useEffect(()=>{
  if(preview||new URLSearchParams(window.location.search).get('campanha')!==campaign.id)return;
  const frame=requestAnimationFrame(()=>document.getElementById(`promocoes-${campaign.id}`)?.scrollIntoView?.({block:'start'}));
  return()=>cancelAnimationFrame(frame);
 },[campaign.id,preview]);
 const pageSize=useProductsPerPage();
 const pageCount=Math.max(1,Math.ceil(filtered.length/pageSize)),paged=filtered.slice((page-1)*pageSize,page*pageSize);
 useEffect(()=>setPage(1),[category,query,campaign.id,campaign.revision,pageSize]);
 useEffect(()=>{if(page>pageCount)setPage(current=>Math.min(current,pageCount));},[page,pageCount]);
 async function share(item){
  if(preview){setMessage('Esta é uma prévia. Compartilhamento disponível após a publicação da campanha.');return;}
  const link=new URL('/',siteUrl);link.searchParams.set('campanha',campaign.id);if(item)link.searchParams.set('produto',item.product.id);link.hash=`promocoes-${campaign.id}`;
  const url=link.href,text=item?`${item.product.name} — ${(item.priceCents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}/${item.unit}. ${period(campaign.startDate,campaign.endDate)}.`:campaign.title;
  try{if(navigator.share)await navigator.share({title:item?.product.name||campaign.title,text,url});else{await navigator.clipboard.writeText(url);setMessage('Link copiado.');}}
  catch(e){if(e.name!=='AbortError')setMessage(`Copie este link para compartilhar: ${url}`);}
 }

 return <section className={`product-offers${preview?'':' product-offers--public'}`} id={campaign.id ? `promocoes-${campaign.id}` : "promocoes"} data-theme={theme?.key||'padrao'} aria-labelledby={`product-offers-title-${campaign.id||"empty"}`}><div className="product-offers__inner">
 <header className="product-offers__heading">{theme&&!theme.institutional&&<img className="product-offers__theme-art" src={theme.desktop} alt=""/>}<img className="product-offers__logo" src={Logo} alt="Bom pra você Supermercado"/><div className="product-offers__headline">{theme?.key==="black-friday"&&<div className="black-friday-ornaments" aria-hidden="true"><img className="black-friday-sparks" src={blackFridaySparks} width="64" height="64" alt="" draggable="false"/></div>}<h2 id={`product-offers-title-${campaign.id||"empty"}`}><CampaignTitle theme={theme?.key} title={campaign.title}/></h2><p>{period(campaign.startDate,campaign.endDate)}</p></div><label className="product-offers__search"><Search size={23} aria-hidden="true"/><span className="sr-only">Buscar produto ou código</span><input value={query} onChange={e=>{setSharedProduct(null);setQuery(e.target.value)}} placeholder="Buscar produtos…"/></label></header>
 <div className="product-offers__categories" role="group" aria-label="Categorias">{groups.map(({key,label,Icon})=><button key={key} type="button" aria-pressed={category===key} onClick={()=>{setSharedProduct(null);setCategory(key)}}><Icon aria-hidden="true"/><span>{label}</span></button>)}</div>
 {(query||category!=='all'||sharedProduct)&&<p className="product-offers__count" role="status">{filtered.length} produtos <button onClick={()=>{setQuery('');setCategory('all');setSharedProduct(null)}}>Limpar filtros</button></p>}
 {pageCount>1&&<nav className="product-offers__pagination" aria-label="Paginação dos produtos"><button type="button" disabled={page===1} onClick={()=>setPage(value=>value-1)}>Anterior</button><span aria-live="polite">Página {page} de {pageCount}</span><button type="button" disabled={page===pageCount} onClick={()=>setPage(value=>value+1)}>Próxima</button></nav>}
 <div className="product-offers__grid">{paged.map(item=><article className="product-offer" key={item.id}><button className="product-offer__share" type="button" aria-label={`Compartilhar ${item.product.name}`} onClick={()=>share(item)}><Share2 size={18}/><span>Compartilhar</span></button><Photo key={`${item.product.id}:${item.product.imageRevision}`} product={item.product}/><div className="product-offer__body">{item.product.brand&&<span className="product-offer__brand">{item.product.brand}</span>}<h3>{item.product.name}</h3>{productFragrances(item.product).some(f=>f.name)&&<p className="product-offer__variants">Fragrâncias: {productFragrances(item.product).map(f=>f.name).filter(Boolean).join(' / ')}</p>}{item.product.content&&<p className="product-offer__content">Embalagem: {item.product.content}</p>}{item.expiresOn&&<p className="product-offer__expiry">Vencimento do lote: {day(item.expiresOn)}</p>}<Price cents={item.priceCents} unit={item.unit}/><details><summary>Detalhes <ChevronRight size={16}/></summary><div><p>Código interno: {item.product.code||'A definir'}</p>{productFragrances(item.product).filter(f=>f.barcode).map((f,index)=><p key={`${f.barcode}-${index}`}>GTIN{f.name?` ${f.name}`:''}: {f.barcode}</p>)}<p>Oferta: {period(campaign.startDate,campaign.endDate)}</p><p>{item.conditions||campaign.conditions||'Condições a definir'}</p></div></details><StoryButton campaign={campaign} item={item} preview={preview}/></div></article>)}</div>

 {!filtered.length&&<div className="product-offers__empty"><p>{campaign.items.length?(sharedProduct?'Este produto não está mais disponível nesta campanha. Limpe os filtros para ver as ofertas atuais.':'Nenhum produto corresponde aos filtros.'):(campaign.emptyMessage||'Inclua os produtos da campanha para conferir a composição.')}</p></div>}
 <footer className="product-offers__footer">{!theme?.institutional&&theme?.key!=="criancas"&&<Megaphone className="product-offers__megaphone" aria-hidden="true"/>}{theme?.institutional&&<aside className="product-offers__awareness" aria-label={`Comunicação institucional: ${theme.label}`}><img src={theme.mobile} width="62" height="80" alt=""/><div><strong>{theme.label}</strong><p>Informação e cuidado.</p>{theme.key==='outubro-rosa'&&<a href="https://www.gov.br/inca/pt-br/assuntos/eventos/outubro-rosa-2026" target="_blank" rel="noopener noreferrer">Materiais do INCA <span className="sr-only">(nova aba)</span></a>}</div></aside>}<div className="product-offers__invitation"><p>Não guarde o segredo da economia.</p><strong>Compartilhe!</strong></div><button className="product-offers__share-all" disabled={!campaign.items.length} type="button" onClick={()=>share()}><Share2 size={24}/><span>Compartilhar ofertas</span></button><small className="product-offers__disclaimer">{preview?'Prévia local · produtos e preços ainda não publicados.':campaign.conditions}</small></footer>{message&&<p className="product-offers__message" role="status">{message}</p>}</div></section>
}




