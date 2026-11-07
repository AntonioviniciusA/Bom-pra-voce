import {useEffect,useState} from 'react';
import {Share2} from 'lucide-react';
import {createProductStory,downloadStory} from './story';
export default function StoryButton({campaign,item,preview}){
  const [busy,setBusy]=useState(true),[message,setMessage]=useState(''),[file,setFile]=useState(null);
  useEffect(()=>{
    let active=true;setFile(null);setMessage('');setBusy(!preview);
    if(preview){setBusy(false);return()=>{active=false};}
    createProductStory(campaign,item).then(result=>{if(active)setFile(result)}).catch(error=>{if(active)setMessage(error.message||'Não foi possível preparar a arte. Tente novamente.')}).finally(()=>{if(active)setBusy(false)});
    return()=>{active=false};
  },[campaign,item,preview]);
  async function share(){
    if(!file)return;
    setMessage('');
    if(!navigator.share||!navigator.canShare?.({files:[file]})){
      downloadStory(file);setMessage('PNG baixado. Pronto para enviar ou publicar.');return;
    }
    try{await navigator.share({files:[file],title:item.product.name});}
    catch(e){if(e.name!=='AbortError')setMessage('Não foi possível abrir o compartilhamento. Tente novamente.');}
  }
  return <div className="product-story">
    <button className="product-offer__share" type="button" aria-label={`Compartilhar ${item.product.name}`} disabled={preview||busy||!file} onClick={share}><Share2 size={18}/><span>{busy?'Preparando…':'Compartilhar'}</span></button>
    {message&&<small role="status">{message}</small>}
  </div>;
}
