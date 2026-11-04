import {clearProductShowcaseCache,readProductShowcaseCache,writeProductShowcaseCache} from './productShowcaseCache';
afterEach(clearProductShowcaseCache);
const payload={serverTime:1000,nextChangeAt:5000,version:'v1',campaigns:[{id:'c',ends:6000,items:[]}]};
test('restores a public offer snapshot only while it is valid',()=>{
 writeProductShowcaseCache(payload,10000);
 expect(readProductShowcaseCache(12000)).toMatchObject({serverTime:3000,version:'v1',fromCache:true});
 expect(readProductShowcaseCache(14000)).toBeNull();
});
test('does not cache a snapshot with no safe expiry',()=>{
 writeProductShowcaseCache({serverTime:1000,nextChangeAt:null,campaigns:[]},10000);
 expect(readProductShowcaseCache(10000)).toBeNull();
});
