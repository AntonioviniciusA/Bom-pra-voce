const { chromium } = require(process.env.BPV_PLAYWRIGHT_PATH || 'playwright');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.BPV_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.join(__dirname,'galeria.html')).href);
 await page.locator('article').last().scrollIntoViewIfNeeded();
 await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode()));window.scrollTo(0,0)});
 await page.screenshot({path:path.join(__dirname,'../../../bom-pra-voce-novo/src/images/library/docs/vitrine-sazonal-2026-10-24/assets-v1/galeria-desktop.jpg'),fullPage:true,type:'jpeg',quality:85});
 const records=[];
 for(const t of JSON.parse(fs.readFileSync(path.join(__dirname,'manifesto.json'),'utf8')).themes){
  await page.selectOption('#theme',t.id);
  for(const format of ['notebook','mobile','story']){
   await page.selectOption('#format',format);
   const r=await page.evaluate(()=>({broken:[...document.querySelectorAll('#stage img')].some(i=>!i.complete||!i.naturalWidth),bodyOverflow:document.documentElement.scrollWidth>innerWidth,theme:document.getElementById('theme').value,format:document.getElementById('format').value}));
   await page.locator('#stage img').evaluateAll(async imgs=>{await Promise.all(imgs.map(i=>i.decode()))});
   r.broken=await page.locator('#stage img').evaluateAll(imgs=>imgs.some(i=>!i.naturalWidth));records.push(r);
  }
 }
 await page.selectOption('#theme','padrao');await page.selectOption('#format','mobile');await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(__dirname,'../../../bom-pra-voce-novo/src/images/library/docs/vitrine-sazonal-2026-10-24/assets-v1/galeria-celular.jpg'),fullPage:false,type:'jpeg',quality:85});
 const mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 await page.setViewportSize({width:320,height:800});const narrowOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 await page.selectOption('#theme','outubro-rosa');await page.selectOption('#format','story');const institutional=await page.locator('#intensity').isDisabled();
 const result={date:'2026-10-25',combinations:records.length,errors,broken:records.filter(x=>x.broken),overflow:records.filter(x=>x.bodyOverflow),mobileOverflow,narrowOverflow,institutionalIntensityLocked:institutional};
 fs.writeFileSync(path.join(__dirname,'validacao-galeria.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));await browser.close();if(errors.length||result.broken.length||result.overflow.length||mobileOverflow||narrowOverflow||!institutional)process.exitCode=1;
})();
