// @vitest-environment node
import {afterEach,expect,test,vi} from 'vitest';
import {dataImageBlob,prepareCampaignImages,optimizeProductImage} from './productImages';
const photo='data:image/webp;base64,UklGRgAAAABXRUJQ';
const campaign=()=>({items:[{product:{name:'Produto',image:photo,imageSmall:photo,imageOptimizationVersion:1}}]});
afterEach(()=>vi.unstubAllGlobals());

test('reuses stored photos across campaigns without uploading bytes',async()=>{
  const request=vi.fn(async()=>({exists:true,url:'https://example/photo.webp'}));
  const source=campaign(),result=await prepareCampaignImages(source,request);
  expect(request).toHaveBeenCalledTimes(1);
  expect(request.mock.calls[0][0].action).toBe('image-status');
  expect(result.items[0].product.image).toBe('https://example/photo.webp');
  expect(source.items[0].product.image).toBe(photo);
});
test('uploads only missing files and never sends the campaign on an image failure',async()=>{
  const request=vi.fn(async value=>{
    if(value instanceof Blob)throw new Error('Conexão interrompida');
    return {exists:false};
  });
  await expect(prepareCampaignImages(campaign(),request)).rejects.toThrow('Conexão interrompida');
  expect(request).toHaveBeenCalledTimes(2);
  expect(request.mock.calls[1][0]).toBeInstanceOf(Blob);
});
test('rejects remote URLs and invalid input instead of fetching arbitrary content',()=>{
  expect(()=>dataImageBlob('https://example/image')).toThrow();
  expect(()=>dataImageBlob('data:image/svg+xml;base64,aGVsbG8=')).toThrow();
});
test('preserves aspect ratio and releases decoded bitmap on encoding failure',async()=>{
  const close=vi.fn(),drawImage=vi.fn();
  vi.stubGlobal('createImageBitmap',vi.fn(async()=>({width:2400,height:1200,close})));
  vi.stubGlobal('document',{createElement:()=>({getContext:()=>({drawImage}),toBlob:fn=>fn(null)})});
  await expect(optimizeProductImage(dataImageBlob(photo))).rejects.toThrow('otimizar');
  expect(drawImage.mock.calls[0].slice(1)).toEqual([0,300,1200,600]);
  expect(close).toHaveBeenCalledOnce();
});
