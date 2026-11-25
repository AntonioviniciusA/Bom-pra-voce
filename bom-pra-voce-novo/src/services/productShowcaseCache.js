const CACHE_KEY='bpv-public-product-showcase-v1';
const MAX_CACHE_AGE_MS=24*60*60*1000;
export const PRODUCT_SHOWCASE_FRESHNESS_MS=45*60*1000;

function validUntil(payload){
  return Math.min(payload.nextChangeAt??Infinity,...payload.campaigns.map(campaign=>campaign.ends));
}

export function writeProductShowcaseCache(payload,clientNow=Date.now()){
  try{
    const until=validUntil(payload);
    if(!Number.isFinite(payload.serverTime)||!Number.isFinite(until)||until<=payload.serverTime)return;
    localStorage.setItem(CACHE_KEY,JSON.stringify({savedAt:clientNow,payload}));
  }catch{}
}

export function readProductShowcaseCache(clientNow=Date.now()){
  try{
    const stored=JSON.parse(localStorage.getItem(CACHE_KEY));
    if(!stored||!Number.isFinite(stored.savedAt)||clientNow<stored.savedAt||clientNow-stored.savedAt>MAX_CACHE_AGE_MS||!Number.isFinite(stored.payload?.serverTime)||!Array.isArray(stored.payload?.campaigns))return null;
    const serverTime=stored.payload.serverTime+(clientNow-stored.savedAt);
    if(serverTime>=validUntil(stored.payload)){localStorage.removeItem(CACHE_KEY);return null;}
    const campaigns=stored.payload.campaigns.filter(campaign=>Number.isFinite(campaign.ends)&&campaign.ends>serverTime);
    const cacheExpiresAt=clientNow+(validUntil(stored.payload)-serverTime);
    return {...stored.payload,serverTime,campaigns,cacheExpiresAt,revalidateAt:Math.min(stored.savedAt+PRODUCT_SHOWCASE_FRESHNESS_MS,cacheExpiresAt),fromCache:true};
  }catch{return null;}
}

export function clearProductShowcaseCache(){
  try{localStorage.removeItem(CACHE_KEY);}catch{}
}
