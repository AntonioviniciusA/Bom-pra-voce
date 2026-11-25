import {useEffect,useRef} from 'react';
import {Share2} from 'lucide-react';
import {createProductStory} from './story';
import ShareDownloadMenu from './ShareDownloadMenu';
import {siteUrl} from '../../Data/seo';
export default function StoryButton({campaign,item,preview}){
  const artwork=useRef(null);
  useEffect(()=>{artwork.current=null;},[campaign,item,preview]);
  function getArtwork(){
    if(!artwork.current)artwork.current=createProductStory(campaign,item).catch(error=>{artwork.current=null;throw error});
    return artwork.current;
  }
  const link = new URL('/',siteUrl);
  link.searchParams.set('campanha',campaign.id);
  link.searchParams.set('produto',item.product.id);
  return <ShareDownloadMenu campaign={campaign} items={campaign.items || [item]} item={item} getArtwork={getArtwork}
    shareUrl={link.href}
    triggerClassName="product-offer__share" triggerLabel={`Compartilhar ${item.product.name}`} disabled={preview}
    triggerContent={<><Share2 size={18} aria-hidden="true"/><span>Compartilhar</span></>}/>;
}
