import {useState} from 'react';
import {createProductStory,downloadStory} from './story';
export default function StoryButton({campaign,item,preview}){
  const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
  async function share(){
    setBusy(true);setMessage('');
    try{
      const file=await createProductStory(campaign,item);
      if(navigator.share&&navigator.canShare?.({files:[file]}))await navigator.share({files:[file],title:item.product.name});
      else{downloadStory(file);setMessage('Imagem do Story baixada. Abra o Instagram para compartilhar.');}
    }catch(e){if(e.name!=='AbortError')setMessage(e.message||'Não foi possível compartilhar o Story. Confira a conexão e tente novamente.');}
    finally{setBusy(false);}
  }
  return <div className="product-story"><button disabled={preview||busy} onClick={share}>{busy?'Preparando compartilhamento…':'Compartilhar nos Stories'}</button>{message&&<small role="status">{message}</small>}</div>;
}
