import {afterEach,expect,test,vi} from 'vitest';
vi.mock('@supabase/supabase-js',()=>({createClient:()=>({auth:{getSession:async()=>({data:{session:{access_token:'test'}}})}})}));
vi.mock('./config',()=>({apiConfig:()=>({ready:true,url:'https://test.supabase.co',key:'public'}),AdminApiError:class extends Error{constructor(code,message,status=0){super(message);this.code=code;this.status=status;}}}));
import {productCampaignRequest} from './adminApi';
const image=`https://test.supabase.co/storage/v1/object/public/promotion-public/products/assets/${'a'.repeat(43)}.webp`;
const campaign=()=>({id:'c',title:'Semana',theme_key:'padrao',startDate:'2090-01-01',endDate:'2090-01-02',conditions:'Enquanto durarem os estoques',items:[{id:'i',priceCents:599,unit:'un',noExpiry:true,product:{id:'p',revision:1,name:'Produto',code:'001',identifierType:'plu',noGtinReason:'Interno',category:'utilidades',image,imageSmall:image,imageRevision:'r1',imageSource:'Própria',imageApproved:true,imageAuthorized:true}}]});
afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals();});
test.each([0,4])('publishes creation or revision %s with stored images and no expiry',async revision=>{
 const source=campaign(),before=structuredClone(source),progress=vi.fn();
 vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,status:200,json:async()=>({id:'c',revision:revision+1,state:'published'})})));
 await expect(productCampaignRequest('publish',source,revision,progress)).resolves.toMatchObject({revision:revision+1});
 expect(fetch).toHaveBeenCalledTimes(1);
 const body=JSON.parse(fetch.mock.calls[0][1].body);
 expect(body.expected_revision).toBe(revision);expect(body.campaign.items[0]).toMatchObject({id:'i',priceCents:599,noExpiry:true,product:{id:'p',image,imageSmall:image}});
 expect(source).toEqual(before);expect(progress).toHaveBeenLastCalledWith(expect.any(String),100);
});
test('retains the actual rejection code returned by the Edge Function',async()=>{
 vi.stubGlobal('fetch',vi.fn(async()=>({ok:false,status:422,json:async()=>({error:'INVALID_CAMPAIGN',message:'Revise os textos.'})})));
 await expect(productCampaignRequest('publish',campaign(),4)).rejects.toMatchObject({status:422,remoteCode:'INVALID_CAMPAIGN'});
});
test.each([null,{id:'other',revision:5,state:'published'},{id:'c',revision:4,state:'published'}])('does not confirm an invalid HTTP 200 receipt %j',async receipt=>{
 const progress=vi.fn();vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,status:200,json:async()=>receipt})));
 await expect(productCampaignRequest('publish',campaign(),4,progress)).rejects.toMatchObject({code:'INVALID_PUBLICATION_RESPONSE'});
 expect(progress.mock.calls.some(([,value])=>value===100)).toBe(false);
});
test.each(['headers','body'])('stops waiting when the response %s never finishes',async stage=>{
 vi.useFakeTimers();const progress=vi.fn();
 vi.stubGlobal('fetch',vi.fn(()=>stage==='headers'?new Promise(()=>{}):Promise.resolve({ok:true,status:200,json:()=>new Promise(()=>{})})));
 const pending=expect(productCampaignRequest('publish',campaign(),4,progress)).rejects.toMatchObject({code:'TIMEOUT'});
 await vi.advanceTimersByTimeAsync(60001);await pending;
 expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
 expect(progress.mock.calls.some(([,value])=>value===100)).toBe(false);
});
