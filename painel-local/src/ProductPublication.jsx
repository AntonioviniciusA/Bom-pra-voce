import {useState} from 'react';
import {productCampaignRequest} from './services/adminApi';
import {campaignPublicationPlan,campaignPreview} from '../../bom-pra-voce-novo/src/Components/ProductOffers/model';
import {panelErrorMessage} from './services/diagnostics';
import {requireSensitiveAction} from './services/sensitiveAction';

export default function ProductPublication({campaign,catalog,beforePublish,disabled=false,showIssues=true}) {
  const [remote,setRemote]=useState(null),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[confirming,setConfirming]=useState(false),[progress,setProgress]=useState(null);
  const plan=campaign?campaignPublicationPlan(campaign,catalog):{blockingIssues:['Selecione uma campanha'],readyItems:[],pendingItems:[]};
  const productName=item=>catalog.find(product=>product.id===item.productId)?.name||'Produto não encontrado';
  const current=remote?.find(c=>c.id===campaign?.id);
  async function refresh(){setBusy(true);try{setRemote(await productCampaignRequest('list'));setMessage('Estado de publicação conferido.');}catch(e){setRemote(null);setMessage(panelErrorMessage('product-publication-list',e));}finally{setBusy(false);}}
  function requestPublish(){if(!plan.blockingIssues.length&&remote!==null)setConfirming(true);}
  async function publish(){
    if(plan.blockingIssues.length||remote===null)return;
    setConfirming(false);
    if(!await requireSensitiveAction('publicar a campanha no site'))return;
    setBusy(true);setMessage('');setProgress({value:0,label:'Iniciando publicação…',status:'running'});
    let progressValue=0;
    try{
      const snapshot=campaignPreview({...campaign,items:plan.readyItems},catalog);
      await new Promise(resolve=>requestAnimationFrame(resolve));
      progressValue=5;setProgress({value:progressValue,label:'Salvando o rascunho local…',status:'running'});
      await beforePublish();
      const result=await productCampaignRequest('publish',snapshot,current?.revision||0,(label,value)=>{setMessage(label);if(Number.isFinite(value)){progressValue=value;setProgress({value,label,status:value===100?'complete':'running'});}},current?.snapshot);
      setRemote(rows=>[...rows.filter(c=>c.id!==result.id),{...result,title:snapshot.title}]);
      setMessage(result.unchanged?'A campanha já está atualizada. Nenhum dado foi reenviado.':'Campanha publicada. A exibição respeita o período informado; alterações posteriores exigem nova publicação.');
      setProgress({value:100,label:result.unchanged?'Comparação concluída: nada para enviar.':'Campanha publicada e confirmada pelo site.',status:'complete'});
    }catch(e){
      const rejected=e.status>=400&&e.status<500&&e.status!==408;
      const uncertain=progressValue>=90&&!rejected;
      setRemote(null);
      setProgress({value:progressValue,label:rejected?'Envio recusado pelo site.':uncertain?'O pedido saiu do painel, mas não foi confirmado.':'O pedido não chegou a ser enviado.',status:'error'});
      setMessage(`${panelErrorMessage('product-publication-publish',e)} ${uncertain?'Confira o estado no site antes de tentar novamente.':'Corrija a mensagem acima e confira o estado no site antes de tentar novamente.'}`);
    }finally{setBusy(false);}
  }
  async function withdraw(row){if(!await requireSensitiveAction('retirar a campanha do site'))return;setBusy(true);try{const result=await productCampaignRequest('withdraw',row,row.revision);setRemote(rows=>rows.map(c=>c.id===row.id?{...c,...result}:c));setMessage('Campanha retirada da vitrine.');}catch(e){setRemote(null);setMessage(panelErrorMessage('product-publication-withdraw',e));}finally{setBusy(false);}}
  return <section className="admin-form" aria-label="Publicação da vitrine"><h3>Publicação no site</h3><p>Serão publicados somente os produtos completos. Os demais continuam no rascunho para você concluir depois.</p>
    <p><strong>{plan.readyItems.length} {plan.readyItems.length===1?'produto pronto':'produtos prontos'}</strong>{plan.pendingItems.length>0&&` · ${plan.pendingItems.length} ${plan.pendingItems.length===1?'produto ficará pendente':'produtos ficarão pendentes'}`}</p>
    <div className="publication-review">
      <section aria-labelledby="ready-products-title"><h4 id="ready-products-title">Serão publicados agora</h4>{plan.readyItems.length?<ul>{plan.readyItems.map(item=><li key={item.id}>{productName(item)}</li>)}</ul>:<p>Nenhum produto pronto.</p>}</section>
      <section aria-labelledby="pending-products-title"><h4 id="pending-products-title">Não serão publicados</h4>{plan.pendingItems.length?<ul>{plan.pendingItems.map(({item,issues})=><li key={item.id}><strong>{productName(item)}</strong><small>{issues.join(' · ')}</small></li>)}</ul>:<p>Nenhuma pendência.</p>}</section>
    </div>
    <div className="admin-actions"><button type="button" disabled={disabled||busy} onClick={refresh}>Conferir estado no site</button><button type="button" className="admin-primary" disabled={disabled||busy||remote===null||plan.blockingIssues.length>0} onClick={requestPublish}>{busy?'Publicando…':current?.state==='published'?'Publicar nova revisão':'Publicar campanha no site'}</button></div>
    {confirming&&<div className="publication-confirmation" role="dialog" aria-modal="true" aria-labelledby="publication-confirmation-title"><h4 id="publication-confirmation-title">Confirmar lançamento no site?</h4><p><strong>{plan.readyItems.length}</strong> {plan.readyItems.length===1?'produto será publicado':'produtos serão publicados'}{plan.pendingItems.length?` e ${plan.pendingItems.length} ficarão pendentes.`:'.'}</p><p>Após confirmar, o site receberá uma nova versão da campanha.</p><div className="admin-actions"><button type="button" className="admin-quiet" onClick={()=>setConfirming(false)}>Cancelar</button><button type="button" className="admin-primary" onClick={publish}>Confirmar lançamento</button></div></div>}
    {progress&&<div className={`publication-progress publication-progress--${progress.status}`}><div className="publication-progress__track" role="progressbar" aria-label="Progresso da publicação" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress.value}><span style={{width:`${progress.value}%`}}/></div><div><span>{progress.label}</span><strong>{progress.value}%</strong></div></div>}
    {showIssues&&plan.blockingIssues.length>0&&<p>{plan.blockingIssues.join(' ')}</p>}
    {message&&<p role="status">{message}</p>}
    {remote?.map(row=><div className="admin-row" key={row.id}><span>{row.title} · {row.state==='published'?'Publicada (sujeita à validade)':'Retirada'} · revisão {row.revision}</span>{row.state==='published'&&<button disabled={disabled||busy} type="button" onClick={()=>withdraw(row)}>Retirar {row.title} do site</button>}</div>)}
  </section>;
}
