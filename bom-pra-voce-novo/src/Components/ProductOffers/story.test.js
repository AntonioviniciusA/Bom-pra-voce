import {text} from './story';
test('long conditions stay inside the text area without losing words',()=>{
 const ctx={font:'',fillText:jest.fn(),measureText(value){return {width:value.length*parseFloat(this.font.slice(4))*0.55}}};
 const value=('Condições específicas para os produtos. ').repeat(25).trim();
 text(ctx,value,100,1440,880,220,26);
 expect(ctx.fillText.mock.calls.map(c=>c[0]).join(' ')).toBe(value);
 const size=parseFloat(ctx.font.slice(4));expect(Math.max(...ctx.fillText.mock.calls.map(c=>c[2]))+size*1.2).toBeLessThanOrEqual(1660);
});
test('refuses text that would overflow instead of cropping it',()=>{
 const ctx={font:'',fillText:jest.fn(),measureText:v=>({width:v.length*20})};
 expect(()=>text(ctx,'X'.repeat(120),0,0,880,100)).toThrow();expect(ctx.fillText).not.toHaveBeenCalled();
});
