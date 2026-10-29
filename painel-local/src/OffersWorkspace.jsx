import {useState} from 'react';
import Offers from './Offers';
import ProductCampaigns from './ProductCampaigns';
export default function OffersWorkspace(props){const [legacy,setLegacy]=useState(false);return <div style={{minWidth:0}}><div className="admin-actions" style={{padding:'16px 24px'}}><button className="admin-quiet" aria-pressed={!legacy} onClick={()=>setLegacy(false)}>Vitrine de produtos</button><button className="admin-quiet" aria-pressed={legacy} onClick={()=>setLegacy(true)}>Panfletos existentes</button></div>{legacy?<Offers {...props}/>:<ProductCampaigns/>}</div>}
