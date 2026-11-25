// Run against npm run preview. Playwright must be available in NODE_PATH.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const output = path.resolve(__dirname, '../../docs/validacao-acessibilidade-2026-10-21');
async function main() {
  fs.mkdirSync(output, { recursive: true });
  const server = require('node:child_process').spawn(process.execPath, [path.join(__dirname, 'preview.cjs')], { env: { ...process.env, PORT: '4174' }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { server.kill(); reject(new Error('Preview startup timeout')); }, 15000);
    server.once('error', error => { clearTimeout(timer); reject(error); });
    server.stdout.once('data', () => { clearTimeout(timer); resolve(); });
    server.once('exit', code => { clearTimeout(timer); reject(new Error('Preview exited: ' + code)); });
  });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = [];
  try {
    for (const width of [1440, 390, 320]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      // Deterministic offline state: do not send applications or depend on live offers.
      await page.route('**/*.supabase.co/**', route => route.abort());
      await page.route('**/challenges.cloudflare.com/**', route => route.abort());
      await page.route('**/maps.google.com/**', route => route.abort());
      const maps = [];
      page.on('request', request => { if (/maps\.google/.test(request.url())) maps.push(request.url()); });
      for (const route of ['/', '/privacidade', '/termos', '/trabalhe-conosco']) {
        await page.goto('http://127.0.0.1:4174' + route);
        await page.locator('footer.site-footer').waitFor();
        await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
        const result = await page.evaluate(async () => {
          const report = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } });
          return {
            violations: report.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })),
            incomplete: report.incomplete.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })),
            markedText: Array.from(document.querySelectorAll('mark')).map(el => ({ text: el.textContent, color: getComputedStyle(el).color, background: getComputedStyle(el).backgroundColor })),
            overflow: document.documentElement.scrollWidth > innerWidth,
            title: document.title,
          };
        });
        results.push({ width, route, ...result });
        if (width === 390 && route === '/') await page.screenshot({ path: path.join(output, 'inicio-mobile.png') });
        if (width === 390 && await page.locator('mark').count()) await page.locator('mark').screenshot({ path: path.join(output, route === '/' ? 'destaque-inicio.png' : 'destaque-candidaturas.png') });
        if (route === '/') {
          assert.equal(maps.length, 0, 'Google must not receive a request before permission');
          await page.getByRole('button', { name: 'Rejeitar opcionais' }).click();
          const card = page.getByRole('button', { name: 'Conheça o setor Hortifrúti' });
          await card.focus(); await page.keyboard.press('Enter');
          await page.getByRole('dialog').waitFor();
          await page.keyboard.press('Shift+Tab');
          assert.equal(await page.getByRole('button', { name: 'Próxima foto' }).evaluate(el => el === document.activeElement), true);
          await page.keyboard.press('Escape');
          assert.equal(await card.evaluate(el => el === document.activeElement), true);
          const settings = page.getByRole('button', { name: 'Preferências de cookies' });
          await settings.click();
          await page.getByRole('button', { name: 'Permitir mapa do Google' }).click();
          await page.locator('iframe[title="Localização do supermercado Bom Pra Você"]').waitFor();
          await settings.click();
          await page.getByRole('button', { name: 'Rejeitar opcionais' }).click();
          assert.equal(await page.locator('iframe[title="Localização do supermercado Bom Pra Você"]').count(), 0);
          if (width < 1180) {
            const menu = page.getByRole('button', { name: 'Menu', exact: true });
            await menu.focus(); await page.keyboard.press('Enter');
            assert.equal(await menu.getAttribute('aria-expanded'), 'true');
            await page.keyboard.press('Escape');
            assert.equal(await menu.getAttribute('aria-expanded'), 'false');
            assert.equal(await menu.evaluate(el => el === document.activeElement), true);
          }
          await page.screenshot({ path: path.join(output, `home-${width}.png`), fullPage: true });
        }
      }
      await context.close();
    }
    const nojs = await browser.newContext({ javaScriptEnabled: false });
    const page = await nojs.newPage();
    for (const route of ['/', '/privacidade', '/termos', '/trabalhe-conosco']) {
      await page.goto('http://127.0.0.1:4174' + route);
      assert.equal(await page.locator('h1').count(), 1, 'Every static route needs its own content');
      assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://www.bompravocesupermercado.com.br' + route);
    }
    await nojs.close();
  } finally {
    fs.writeFileSync(path.join(output, 'resultados.json'), JSON.stringify(results, null, 2));
    await browser.close();
    server.kill();
  }
  console.log(JSON.stringify(results, null, 2));
  if (results.some(r => r.violations.length || r.overflow)) process.exitCode = 1;
}
main().catch(error => { console.error(error); process.exitCode = 1; });
