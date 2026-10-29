import {useCallback,useEffect,useRef,useState} from 'react';
import {getProductShowcase} from '../../services/productShowcase';
import ProductOffers from './ProductOffers';
import {homeNovemberPreparationAt,novemberPreparationAt} from './novemberCampaign';

export default function LiveProductOffers({november=false}) {
  const [state,setState]=useState({status:'loading',campaigns:[]});
  const generation=useRef(0),controller=useRef(null),expiry=useRef(null);
  const invalidate=useCallback(()=>{generation.current++;},[]);
  const reload=useCallback(async()=>{
    const current=++generation.current; controller.current?.abort();clearTimeout(expiry.current);
    controller.current=new AbortController();
    // Remove the old snapshot before any request, including at the expiry boundary.
    setState({status:'loading',campaigns:[]});const started=performance.now();
    try{
      const result=await getProductShowcase(controller.current.signal);
      if(current!==generation.current)return;
      const now=result.serverTime+performance.now()-started;
      const campaigns=result.campaigns.filter(c=>c.ends>now);
      setState({status:'ready',campaigns,serverTime:now});
      const next=Math.min(result.nextChangeAt??Infinity,...campaigns.map(c=>c.ends));
      if(Number.isFinite(next))expiry.current=setTimeout(reload,Math.min(2147483647,Math.max(1,next-now)));
    }catch{if(current===generation.current)setState({status:'error',campaigns:[]});}
  },[]);
  useEffect(()=>{
    reload();const poll=setInterval(()=>{if(!document.hidden)reload()},60000);
    const visible=()=>{if(!document.hidden)reload();else{generation.current++;controller.current?.abort();clearTimeout(expiry.current);setState({status:'loading',campaigns:[]});}};
    document.addEventListener('visibilitychange',visible);window.addEventListener('focus',visible);
    return()=>{invalidate();controller.current?.abort();clearTimeout(expiry.current);clearInterval(poll);document.removeEventListener('visibilitychange',visible);window.removeEventListener('focus',visible);};
  },[reload,invalidate]);
  if(state.status==='loading')return <section id="promocoes" aria-busy="true"><p role="status">Conferindo ofertas e validade…</p></section>;
  if(state.status==='error')return <section id="promocoes"><p role="alert">Não foi possível consultar as ofertas agora.</p><button onClick={reload}>Tentar novamente</button></section>;
  const campaigns=november?state.campaigns.filter(c=>c.startDate<='2026-11-30'&&c.endDate>='2026-11-01'):state.campaigns;
  if(!campaigns.length)return <ProductOffers campaign={november?novemberPreparationAt(state.serverTime):homeNovemberPreparationAt(state.serverTime)||{title:'Ofertas da semana',theme_key:'padrao',items:[],conditions:'Aguarde as próximas ofertas.',emptyMessage:'As próximas ofertas estão sendo preparadas. Volte em breve.'}}/>;
  return <div id="promocoes">{campaigns.map(c=><ProductOffers key={`${c.id}:${c.revision}`} campaign={c}/>)}</div>;
}
