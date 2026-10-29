import {useState} from 'react';
import {productCampaignRequest} from './services/adminApi';
import {campaignIssues,campaignPreview} from '../../bom-pra-voce-novo/src/Components/ProductOffers/model';
import {panelErrorMessage} from './services/diagnostics';

export default function ProductPublication({campaign,catalog,beforePublish,disabled=false}) {
  const [remote,setRemote]=useState(null),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
  const issues=campaign?campaignIssues(campaign,catalog):['Selecione uma campanha'];
  const current=remote?.find(c=>c.id===campaign?.id);
  async function refresh(){setBusy(true);try{setRemote(await productCampaignRequest('list'));setMessage('Estado de publicação conferido.');}catch(e){setRemote(null);setMessage(panelErrorMessage('product-publication-list',e));}finally{setBusy(false);}}
  async function publish(){
    if(issues.length||remote===null)return;
    setBusy(true);setMessage('');
    try{
      const snapshot=campaignPreview(campaign,catalog);
      await beforePublish();
      const result=await productCampaignRequest('publish',snapshot,current?.revision||0,setMessage);
      setRemote(rows=>[...rows.filter(c=>c.id!==result.id),{...result,title:snapshot.title}]);
      setMessage('Campanha publicada. A exibição respeita o período informado; alterações posteriores exigem nova publicação.');
    }catch(e){setRemote(null);setMessage(`${panelErrorMessage('product-publication-publish',e)} Confira o estado no site antes de tentar novamente.`);}finally{setBusy(false);}
  }
  async function withdraw(row){setBusy(true);try{const result=await productCampaignRequest('withdraw',row,row.revision);setRemote(rows=>rows.map(c=>c.id===row.id?{...c,...result}:c));setMessage('Campanha retirada da vitrine.');}catch(e){setRemote(null);setMessage(panelErrorMessage('product-publication-withdraw',e));}finally{setBusy(false);}}
  return <section className="admin-form" aria-label="Publicação da vitrine"><h3>Publicação no site</h3><p>Confira a prévia, fotos, preços e validade. Salvar rascunhos não publica ofertas.</p>
    <div className="admin-actions"><button type="button" disabled={disabled||busy} onClick={refresh}>Conferir estado no site</button><button type="button" className="admin-primary" disabled={disabled||busy||remote===null||issues.length>0} onClick={publish}>{busy?'Aguarde…':current?.state==='published'?'Publicar nova revisão':'Publicar campanha no site'}</button></div>
    {issues.length>0&&<p>{issues.length} pendências impedem a publicação. Confira a lista de revisão.</p>}
    {message&&<p role="status">{message}</p>}
    {remote?.map(row=><div className="admin-row" key={row.id}><span>{row.title} · {row.state==='published'?'Publicada (sujeita à validade)':'Retirada'} · revisão {row.revision}</span>{row.state==='published'&&<button disabled={disabled||busy} type="button" onClick={()=>withdraw(row)}>Retirar {row.title} do site</button>}</div>)}
  </section>;
}
