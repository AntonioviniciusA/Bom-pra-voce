const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const base = 'https://bom-pra-voce-vert.vercel.app';
  const htmlResponse = await fetch(base);
  const html = await htmlResponse.text();
  const asset = html.match(/src="([^"]*\/static\/js\/main\.[^"]+)"/)?.[1];
  if (!htmlResponse.ok || !asset) throw new Error('Public deployment unavailable');
  const jsResponse = await fetch(new URL(asset,base)); const js = await jsResponse.text();
  if (!jsResponse.ok || !['hud_label','icon_key','theme_key','data-theme'].every(key=>js.includes(key))) throw new Error('Public deployment is missing campaign customization');
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const page = await browser.newPage({ viewport: { width:1440,height:1000 } });
    const errors=[]; page.on('pageerror',error=>errors.push(error.message));
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await page.locator('#promocoes').waitFor();
    await page.getByText('Consultando ofertas…').waitFor({state:'hidden'});
    await page.locator('#promocoes').scrollIntoViewIfNeeded();
    const out=path.resolve(__dirname,'../artifacts'); fs.mkdirSync(out,{recursive:true});
    await page.screenshot({path:path.join(out,'live-site-desktop.png'),fullPage:true});
    const promotionText=await page.locator('#promocoes').innerText();
    await page.goto(`${base}/trabalhe-conosco`,{waitUntil:'domcontentloaded'});
    await page.locator('h1').waitFor();
    const careersText=await page.locator('body').innerText();
    await page.setViewportSize({width:390,height:844});
    await page.screenshot({path:path.join(out,'live-careers-mobile.png'),fullPage:true});
    console.log(JSON.stringify({at:new Date().toISOString(),status:htmlResponse.status,asset,customization:true,promotionText,careersText,pageErrors:errors},null,2));
    if(errors.length) process.exitCode=1;
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
