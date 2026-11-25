// @vitest-environment node
import {beforeAll,beforeEach,afterAll,expect,test,vi} from 'vitest';
const base='https://test.supabase.co';
const url=`${base}/storage/v1/object/public/promotion-public/products/assets/${'A'.repeat(43)}.webp`;
let handler;
const env={SUPABASE_URL:base,SUPABASE_SERVICE_ROLE_KEY:'test-key'};
beforeAll(async()=>{
  vi.stubGlobal('Deno',{env:{get:key=>env[key]},serve:fn=>{handler=fn;}});
  await import('../../supabase/functions/product-showcase/index.ts');
});
afterAll(()=>vi.unstubAllGlobals());
beforeEach(()=>{
  vi.stubGlobal('fetch',vi.fn(async(path,options)=>{
    if(path.endsWith('/auth/v1/user'))return Response.json({id:'actor'});
    if(path.endsWith('/bpv_has_permission'))return Response.json(true);
    if(path.endsWith('/bpv_list_products'))return Response.json([{id:'40000000-0000-4000-8000-000000000002',revision:2,remoteRevision:4,name:'Produto',code:'001',identifierType:'plu',noGtinReason:'Sem GTIN',barcode:'',fragrances:[{name:'Padrão',barcode:''}],brand:'',variant:'Padrão',content:'150 ml',category:'mercearia',image:url,imageSmall:url,imageSource:'Foto própria',imageRevision:'r1',imageApproved:true,imageAuthorized:true}]);
    if(path.endsWith('/bpv_write_product'))return Response.json({id:'40000000-0000-4000-8000-000000000002',remoteRevision:5});
    if(path.endsWith('/bpv_write_product_campaign'))return Response.json({id:'saved',revision:1});
    if(options.method==='HEAD')return new Response(null,{status:200});
    throw new Error('Unexpected request: '+path);
  }));
});
function request(body,origin='null'){
  return new Request(`${base}/functions/v1/product-showcase`,{method:'POST',headers:{origin,'content-type':'application/json',authorization:`Bearer a.${btoa(JSON.stringify({aal:'aal2'}))}.c`},body:JSON.stringify(body)});
}
function campaign(){return {action:'publish',campaign_id:'40000000-0000-4000-8000-000000000001',expected_revision:0,campaign:{title:'Semana',theme_key:'padrao',startDate:'2090-01-01',endDate:'2090-01-02',conditions:'Enquanto durarem os estoques',items:[{id:'i',priceCents:500,unit:'un',expiresOn:'2090-02-01',conditions:'',product:{id:'p',revision:1,code:'001',name:'Produto',identifierType:'plu',noGtinReason:'Sem GTIN',barcode:'',category:'mercearia',image:url,imageSmall:url,imageSource:'Foto própria',imageRevision:'r1',imageApproved:true,imageAuthorized:true}}]}};}
test('publishes references only after confirming storage, deduplicating checks',async()=>{
  const response=await handler(request(campaign()));
  expect(response.status,await response.clone().text()).toBe(200);
  expect(fetch.mock.calls.filter(([,o])=>o.method==='HEAD')).toHaveLength(1);
  const write=fetch.mock.calls.find(([p])=>p.endsWith('/bpv_write_product_campaign'));
  expect(JSON.parse(write[1].body).p_snapshot.items[0].product.imageSmall).toBe(url);
});
test('missing image blocks publication without mutating the campaign',async()=>{
  const original=fetch.getMockImplementation();fetch.mockImplementation((p,o)=>o.method==='HEAD'?Promise.resolve(new Response(null,{status:404})):original(p,o));
  expect((await handler(request(campaign()))).status).toBe(422);
  expect(fetch.mock.calls.some(([p])=>p.endsWith('/bpv_write_product_campaign'))).toBe(false);
});
test('untrusted origin is rejected before authentication or storage',async()=>{
  expect((await handler(request(campaign(),'https://evil.example'))).status).toBe(403);
  expect(fetch).not.toHaveBeenCalled();
});
test('anonymous upload is rejected before reading or storing the photo',async()=>{
  const response=await handler(new Request(`${base}/functions/v1/product-showcase`,{method:'POST',headers:{origin:'null','content-type':'image/webp'},body:'RIFF1234WEBP'}));
  expect(response.status).toBe(401);expect(fetch).not.toHaveBeenCalled();
});
test('merges and validates only the changed product fields',async()=>{
  const response=await handler(request({action:'product_patch',campaign_id:'40000000-0000-4000-8000-000000000002',expected_revision:4,patch:{revision:3,category:'higiene'}}));
  expect(response.status,await response.clone().text()).toBe(200);
  const write=fetch.mock.calls.find(([path])=>path.endsWith('/bpv_write_product'));
  const body=JSON.parse(write[1].body);
  expect(body.p_expected_revision).toBe(4);
  expect(body.p_product).toMatchObject({category:'higiene',image:url,name:'Produto'});
});
