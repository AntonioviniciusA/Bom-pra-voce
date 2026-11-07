import {useEffect,useState} from 'react';
import {createProductStory,downloadStory} from './story';
export default function StoryButton({campaign,item,preview}){
  const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[file,setFile]=useState(null);
  useEffect(()=>{setFile(null);setMessage('');},[campaign,item]);
  async function prepare(){
    setBusy(true);setMessage('');
    try{setFile(await createProductStory(campaign,item));}
    catch(e){setMessage(e.message||'Não foi possível preparar a arte. Tente novamente.');}
    finally{setBusy(false);}
  }
  async function share(){
    try{await navigator.share({files:[file],title:item.product.name});}
    catch(e){if(e.name!=='AbortError')setMessage('Não foi possível abrir o compartilhamento. Use Baixar PNG.');}
  }
  return <div className="product-story">
    {!file?<button type="button" disabled={preview||busy} onClick={prepare}>{busy?'Preparando arte…':'Preparar arte para compartilhar'}</button>:<>
      {navigator.share&&navigator.canShare?.({files:[file]})&&<button type="button" onClick={share}>Compartilhar arte</button>}
      <button type="button" onClick={()=>{downloadStory(file);setMessage('PNG baixado. Pronto para enviar ou publicar.');}}>Baixar PNG</button>
    </>}
    {message&&<small role="status">{message}</small>}
  </div>;
}
