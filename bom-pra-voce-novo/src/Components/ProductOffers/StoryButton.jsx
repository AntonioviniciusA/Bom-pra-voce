import {useEffect,useRef} from 'react';
import {Share2} from 'lucide-react';
import {createProductStory} from './story';
import ShareDownloadMenu from './ShareDownloadMenu';
export default function StoryButton({campaign,item,preview}){
  const artwork=useRef(null);
  useEffect(()=>{artwork.current=null;},[campaign,item,preview]);
  function getArtwork(){
    if(!artwork.current)artwork.current=createProductStory(campaign,item).catch(error=>{artwork.current=null;throw error});
    return artwork.current;
  }
  return <ShareDownloadMenu campaign={campaign} items={campaign.items || [item]} item={item} getArtwork={getArtwork}
    triggerClassName="product-offer__share" triggerLabel={`Compartilhar ${item.product.name}`} disabled={preview}
    triggerContent={<><Share2 size={18} aria-hidden="true"/><span>Compartilhar</span></>}/>;
}
