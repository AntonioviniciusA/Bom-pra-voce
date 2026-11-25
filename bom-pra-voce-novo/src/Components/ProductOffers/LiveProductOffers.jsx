import {useCallback,useEffect,useRef,useState} from 'react';
import {getProductShowcase} from '../../services/productShowcase';
import {PRODUCT_SHOWCASE_FRESHNESS_MS,readProductShowcaseCache,writeProductShowcaseCache} from '../../services/productShowcaseCache';
import ProductOffers from './ProductOffers';
import {RefreshCw} from 'lucide-react';
import {homeNovemberPreparationAt,novemberPreparationAt} from './novemberCampaign';

const MINIMUM_LOADING_MS=1400;

function OffersLoading({overlay=false}){
  return <section id={overlay?undefined:'promocoes'} className={'offers-loading'+(overlay?' offers-loading--overlay':'')} aria-busy="true" aria-labelledby="offers-loading-title">
    <div className="offers-loading__inner">
      <header className="offers-loading__heading"><div className="offers-loading__brand" aria-hidden="true"/><div><h2 id="offers-loading-title">Preparando as melhores ofertas</h2><p role="status">Conferindo produtos, preços e validade…</p></div></header>
      <div className="offers-loading__categories" aria-hidden="true">{Array.from({length:5},(_,index)=><span key={index}/>)}</div>
      <div className="offers-loading__grid" aria-hidden="true">{Array.from({length:8},(_,index)=><article key={index}><div className="offers-loading__photo"/><div className="offers-loading__line offers-loading__line--short"/><div className="offers-loading__line"/><div className="offers-loading__price"/></article>)}</div>
    </div>
  </section>;
}

export default function LiveProductOffers({november=false}) {
  const initial=useRef();
  if(initial.current===undefined)initial.current=readProductShowcaseCache()||false;
  const [state,setState]=useState(()=>initial.current?{status:'ready',...initial.current}:{status:'loading',campaigns:[]});
  const [visualReady,setVisualReady]=useState(false);
  const generation=useRef(0),controller=useRef(null),expiry=useRef(null);
  const loadingStartedAt=useRef(performance.now()),visualTimer=useRef(null);
  const revalidateAt=useRef(initial.current?.revalidateAt||0),cacheExpiresAt=useRef(initial.current?.cacheExpiresAt||0);
  const invalidate=useCallback(()=>{generation.current++;},[]);
  const reload=useCallback(async(expired=false)=>{
    const current=++generation.current; controller.current?.abort();clearTimeout(expiry.current);
    controller.current=new AbortController();
    if(expired){loadingStartedAt.current=performance.now();setVisualReady(false);setState({status:'loading',campaigns:[]});}
    else setState(previous=>previous.status==='ready'?previous:{status:'loading',campaigns:[]});
    const started=performance.now();
    try{
      const result=await getProductShowcase(controller.current.signal);
      if(current!==generation.current)return;
      const now=result.serverTime+performance.now()-started;
      const campaigns=result.campaigns.filter(c=>c.ends>now);
      const next=Math.min(result.nextChangeAt??Infinity,...campaigns.map(c=>c.ends));
      const savedAt=Date.now();
      const fresh={campaigns,serverTime:now,version:result.version,nextChangeAt:result.nextChangeAt,cacheExpiresAt:Number.isFinite(next)?savedAt+Math.max(1,next-now):null};
      fresh.revalidateAt=Math.min(savedAt+PRODUCT_SHOWCASE_FRESHNESS_MS,fresh.cacheExpiresAt??Infinity);
      revalidateAt.current=fresh.revalidateAt;cacheExpiresAt.current=fresh.cacheExpiresAt||0;
      writeProductShowcaseCache(fresh);
      setState({status:'ready',...fresh,fromCache:false});
      const delay=Math.min(fresh.revalidateAt,fresh.cacheExpiresAt??Infinity)-Date.now();
      if(Number.isFinite(delay))expiry.current=setTimeout(()=>{if(!document.hidden)reload(Date.now()>=cacheExpiresAt.current)},Math.min(2147483647,Math.max(1,delay)));
    }catch{if(current===generation.current)setState(previous=>{if(previous.status==='ready'){const delay=previous.cacheExpiresAt-Date.now();if(delay>0)expiry.current=setTimeout(()=>reload(true),Math.min(2147483647,delay));else return {status:'error',campaigns:[]};return previous;}return {status:'error',campaigns:[]};});}
  },[]);
  const handleVisualReady=useCallback(()=>{
    clearTimeout(visualTimer.current);
    const remaining=Math.max(0,MINIMUM_LOADING_MS-(performance.now()-loadingStartedAt.current));
    visualTimer.current=setTimeout(()=>setVisualReady(true),remaining);
  },[]);
  useEffect(()=>{
    const scheduleOrReload=()=>{
      const now=Date.now();
      if(!initial.current||now>=revalidateAt.current)return reload(now>=cacheExpiresAt.current&&cacheExpiresAt.current>0);
      const due=Math.min(revalidateAt.current,cacheExpiresAt.current||Infinity);
      expiry.current=setTimeout(()=>{if(!document.hidden)reload(Date.now()>=cacheExpiresAt.current)},Math.min(2147483647,Math.max(1,due-now)));
    };
    scheduleOrReload();
    const visible=()=>{if(!document.hidden&&Date.now()>=revalidateAt.current)scheduleOrReload();else if(document.hidden){generation.current++;controller.current?.abort();}};
    document.addEventListener('visibilitychange',visible);window.addEventListener('focus',visible);
    return()=>{invalidate();controller.current?.abort();clearTimeout(expiry.current);clearTimeout(visualTimer.current);document.removeEventListener('visibilitychange',visible);window.removeEventListener('focus',visible);};
  },[reload,invalidate]);
  if(state.status==='loading')return <OffersLoading/>;
  if(state.status==='error')return <section id="promocoes" className="offers-error" aria-labelledby="offers-error-title">
    <div className="offers-error__card">
      <span className="offers-error__eyebrow">Ofertas</span>
      <h2 id="offers-error-title">Ops! As ofertas não carregaram.</h2>
      <p role="alert">Não foi possível consultar as ofertas agora. Confira sua conexão e tente novamente.</p>
      <button type="button" className="offers-error__retry" onClick={()=>reload()}>
        <span className="offers-error__retry-icon" aria-hidden="true"><RefreshCw size={20} strokeWidth={2.5}/></span>
        <span>Tentar novamente</span>
      </button>
    </div>
  </section>;
  const campaigns=november?state.campaigns.filter(c=>c.startDate<='2026-11-30'&&c.endDate>='2026-11-01'):state.campaigns;
  if(!campaigns.length)return <div className="offers-ready-shell"><ProductOffers onVisualReady={handleVisualReady} campaign={november?novemberPreparationAt(state.serverTime):homeNovemberPreparationAt(state.serverTime)||{title:'Ofertas da semana',theme_key:'padrao',items:[],conditions:'Aguarde as próximas ofertas.',emptyMessage:'As próximas ofertas estão sendo preparadas. Volte em breve.'}}/>{!visualReady&&<OffersLoading overlay/>}</div>;
  return <div id="promocoes" className="offers-ready-shell">{campaigns.map(c=><ProductOffers key={`${c.id}:${c.revision}`} campaign={c} onVisualReady={handleVisualReady}/>) }{!visualReady&&<OffersLoading overlay/>}</div>;
}
