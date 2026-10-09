const { chromium } = require('C:/Users/anton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage();
  const out = path.join(__dirname, 'validacao');
  fs.mkdirSync(out, { recursive: true });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('http://127.0.0.1:4173/#setores');
    const section = page.locator('#setores');
    await section.scrollIntoViewIfNeeded();
    await page.locator('#setores .photo-sectors img').evaluateAll(async imgs => Promise.all(imgs.map(i => i.decode())));
    const cards = page.locator('#setores .photo-sectors > li');
    if (await cards.count() !== 5) throw new Error('Expected five sectors');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (overflow) throw new Error(`Page overflow at ${width}`);
    await section.screenshot({ path: path.join(out, `setores-${width}.png`) });
    for (let i = 0; i < 5; i++) {
      await cards.nth(i).click();
      const modal = page.getByRole('dialog');
      await modal.waitFor();
      await modal.locator('img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
      const main = modal.locator('.sector-modal__main-image');
      const source = await main.getAttribute('src');
      await modal.getByRole('button', { name: 'Ver foto 2', exact: true }).click();
      await main.evaluate(img => img.decode());
      if (i !== 4 && await main.getAttribute('src') === source) throw new Error('Photo did not change');
      if (await modal.getByRole('button', { name: 'Ver foto 2', exact: true }).getAttribute('aria-pressed') !== 'true') throw new Error('Thumbnail not selected');
      if (i === 0) {
        await modal.getByRole('button', { name: 'Ver foto 3', exact: true }).click();
        await main.evaluate(img => img.decode());
        if (!(await main.getAttribute('alt')).includes('Adega de madeira')) throw new Error('Wine cabinet missing');
      }
      if (await modal.evaluate(el => el.scrollWidth > el.clientWidth)) throw new Error(`Modal overflow ${width}/${i}`);
      if (width === 390 || width === 1440) await modal.screenshot({ path: path.join(out, `modal-${width}-${i}.png`) });
      await page.keyboard.press('Escape');
      if (await modal.count()) throw new Error('Escape did not dismiss modal');
    }
    console.log(`PASS ${width}px: five cards, images loaded, no horizontal overflow, five dialogs and Escape`);
  }
  await browser.close();
})().catch(err => { console.error(err); process.exit(1); });
