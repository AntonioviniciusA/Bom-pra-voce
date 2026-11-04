import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import ProductOffers from '../../bom-pra-voce-novo/src/Components/ProductOffers/ProductOffers';
import siteCss from '../../bom-pra-voce-novo/src/index.css?inline';
import css from '../../bom-pra-voce-novo/src/Components/ProductOffers/ProductOffers.css?inline';
import framesCss from '../../bom-pra-voce-novo/src/Components/ProductOffers/SeasonalFrames.css?inline';
import remainingCss from '../../bom-pra-voce-novo/src/Components/ProductOffers/SeasonalRemaining.css?inline';
import themesCss from '../../bom-pra-voce-novo/src/Components/Tabloide/promotionThemes.css?inline';
const html='<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}'+siteCss+themesCss+css+framesCss+remainingCss+'</style></head><body><div id="root"></div></body></html>';
export default function ProductPreview({campaign}){
 const [doc,setDoc]=useState(null),[mobile,setMobile]=useState(false),[width,setWidth]=useState(600),[height,setHeight]=useState(900);const host=useRef(null);const viewport=mobile?390:1280,scale=Math.min(1,width/viewport);
 useEffect(()=>{if(!host.current||typeof ResizeObserver==='undefined')return;const ro=new ResizeObserver(([entry])=>setWidth(entry.contentRect.width));ro.observe(host.current);return()=>ro.disconnect();},[]);
 useEffect(()=>{if(!doc||typeof ResizeObserver==='undefined')return;const ro=new ResizeObserver(()=>setHeight(doc.documentElement.scrollHeight));ro.observe(doc.getElementById('root'));return()=>ro.disconnect();},[doc]);
 return <aside className="product-editor-preview"><div className="admin-actions"><strong>Prévia do site</strong><button type="button" className="admin-quiet" aria-pressed={!mobile} onClick={()=>setMobile(false)}>Notebook</button><button type="button" className="admin-quiet" aria-pressed={mobile} onClick={()=>setMobile(true)}>Celular</button></div><div ref={host} className="product-preview-frame" style={{overflow:'hidden',height:Math.ceil(height*scale)+4}}><iframe title="Vitrine de produtos no site" srcDoc={html} onLoad={e=>setDoc(e.currentTarget.contentDocument)} style={{width:viewport,height,border:0,transform:`scale(${scale})`,transformOrigin:'top left',display:'block'}}/>{doc?.getElementById('root')&&createPortal(<ProductOffers campaign={campaign} preview/>,doc.getElementById('root'))}</div></aside>
}

