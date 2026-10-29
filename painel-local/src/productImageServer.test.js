// @vitest-environment node
import {afterEach,expect,test,vi} from 'vitest';
import {isProductImageUrl,productImagePath,imageExists,storeProductImage} from '../../supabase/functions/_shared/productImages.ts';
import {cors} from '../../supabase/functions/_shared/http.ts';
const base='https://test.supabase.co',hash='A'.repeat(43);
afterEach(()=>vi.unstubAllGlobals());
function env(){vi.stubGlobal('Deno',{env:{get:key=>({SUPABASE_URL:base,SUPABASE_SERVICE_ROLE_KEY:'test-key'}[key])}});}
test('only accepts exact same-project content-addressed image paths',()=>{
  const url=`${base}/storage/v1/object/public/promotion-public/${productImagePath(hash,'image/webp')}`;
  expect(isProductImageUrl(url,base)).toBe(true);
  for(const invalid of [url+'?x=1',url.replace(base,'https://other.example'),url.replace('assets/','assets/../'),url.replace('.webp','.svg')])expect(isProductImageUrl(invalid,base)).toBe(false);
  expect(()=>productImagePath('../bad','image/webp')).toThrow();
});
test('storage errors do not become a successful missing-file response',async()=>{
  env();vi.stubGlobal('fetch',vi.fn(async()=>new Response(null,{status:503})));
  await expect(imageExists(productImagePath(hash,'image/webp'))).rejects.toThrow('conferir');
});
test('missing objects and existing objects are distinguished',async()=>{
  env();vi.stubGlobal('fetch',vi.fn().mockResolvedValueOnce(new Response(null,{status:404})).mockResolvedValueOnce(new Response(null,{status:200})));
  expect(await imageExists(productImagePath(hash,'image/webp'))).toBe(false);
  expect(await imageExists(productImagePath(hash,'image/webp'))).toBe(true);
});
test('rejects spoofed image bytes before writing to storage',async()=>{
  env();const fetch=vi.fn();vi.stubGlobal('fetch',fetch);
  await expect(storeProductImage(new TextEncoder().encode('not an image'),'image/webp')).rejects.toThrow();
  expect(fetch).not.toHaveBeenCalled();
});
test('installed and development panel origins are allowed, unrelated origins rejected',()=>{
  env();
  for(const origin of ['null','http://127.0.0.1:5174'])expect(cors(new Request(`${base}/functions/v1/product-showcase`,{headers:{origin}}))['Access-Control-Allow-Origin']).toBe(origin);
  expect(()=>cors(new Request(`${base}/functions/v1/product-showcase`,{headers:{origin:'https://evil.example'}}))).toThrow();
});
