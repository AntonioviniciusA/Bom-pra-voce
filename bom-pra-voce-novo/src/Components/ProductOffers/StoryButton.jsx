import {useState} from 'react';
import {createProductStory,downloadStory} from './story';
export default function StoryButton({campaign,item,preview}){
  const [file,setFile]=useState(null),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
  async function prepare(){setBusy(true);try{setFile(await createProductStory(campaign,item));setMessage('Imagem pronta para baixar ou compartilhar.');}catch(e){setMessage(e.message||'Não foi possível gerar o Story. Confira a conexão e tente novamente.');}finally{setBusy(false);}}
  async function share(){try{await navigator.share({files:[file],title:item.product.name});}catch(e){if(e.name!=='AbortError')setMessage('Use Baixar Story para salvar a imagem.');}}
  return <div className="product-story">{!file?<button disabled={preview||busy} onClick={prepare}>{busy?'Preparando…':'Preparar Story'}</button>:<><button onClick={()=>downloadStory(file)}>Baixar Story</button>{navigator.canShare?.({files:[file]})&&<button onClick={share}>Compartilhar imagem</button>}</>}{message&&<small role="status">{message}</small>}</div>;
}
