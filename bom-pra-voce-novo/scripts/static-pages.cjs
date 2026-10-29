// Render stable institutional content at build time for readers without JavaScript.
// Offers and application availability are deliberately resolved live by the client.
const fs = require('node:fs');
const path = require('node:path');
const babel = require('@babel/core');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'src') + path.sep;
const original = require.extensions['.js'];
function load(module, filename) {
  if (!filename.startsWith(source)) return original(module, filename);
  const result = babel.transformSync(fs.readFileSync(filename, 'utf8'), {
    babelrc: false, configFile: false, cwd: root,
    presets: [['@babel/preset-react', { runtime: 'automatic' }]],
    plugins: ['@babel/plugin-transform-modules-commonjs'], filename,
  });
  module._compile(result.code, filename);
}
require.extensions['.js'] = load;
require.extensions['.jsx'] = load;
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { MemoryRouter } = require('react-router-dom');
const { storeConfig: store } = require('../src/Data/storeConfig');
const { siteUrl, pageMetadata, localBusiness } = require('../src/Data/seo');
const Privacy = require('../src/pages/Privacy.jsx').default;
const Terms = require('../src/pages/Terms.jsx').default;
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const build = path.join(root, 'build');
const manifest = JSON.parse(fs.readFileSync(path.join(build, 'asset-manifest.json'), 'utf8'));
const assets = manifest.entrypoints.map(file => file.endsWith('.css') ? `<link href="/${file}" rel="stylesheet"/>` : `<script defer src="/${file}"></script>`).join('');
const template = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8').replace(/%PUBLIC_URL%/g, '').replace('</head>', assets + '</head>');
const nav = '<nav aria-label="Principal">' + Object.entries(pageMetadata).map(([route, meta]) => `<a href="${route}">${escape(meta.title.split(' | ')[0])}</a>`).join(' · ') + '</nav>';
for (const [route, meta] of Object.entries(pageMetadata)) {
  let content;
  if (route === '/privacidade' || route === '/termos') {
    content = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [route] }, React.createElement(route === '/termos' ? Terms : Privacy)));
  } else if (route === '/') {
    content = `<section class="shell section"><h1>Bom Pra Você Supermercado em Samambaia Sul</h1><p>Compras presenciais em Brasília–DF.</p><h2>Localização</h2><address>${escape(store.address)}</address><a href="${escape(store.mapsUrl)}">Como chegar pelo Google Maps</a><h2>Horários</h2>${store.hours.map(row => `<p>${escape(row.day)}: ${escape(row.time)}</p>`).join('')}<p>${escape(store.holidayHours)}</p><h2>Setores</h2><p>Hortifrúti, bebidas e adega, laticínios e frios e congelados. A padaria está em reforma.</p><h2>Pagamentos</h2><p>${escape(store.payments.join(', '))}.</p><p>${escape(store.paymentConditions)}</p><h2>Ofertas</h2><p>Os panfletos vigentes são consultados quando o site é aberto com JavaScript. Confira validade e condições de cada oferta.</p></section>`;
  } else if (route === '/ofertas/novembro') {
    content = '<section class="shell section"><h1>Ofertas de novembro</h1><h2>Seleção Black Friday</h2><p>As ofertas de novembro estão sendo preparadas. Volte em breve.</p></section>';
  } else {
    content = '<section class="shell section"><h1>Trabalhe conosco</h1><p>Consulte as orientações para enviar seu currículo ao Bom Pra Você, em Samambaia Sul. A disponibilidade do recebimento é verificada ao abrir o site com JavaScript.</p><p>Leia o <a href="/privacidade">aviso de privacidade</a> antes de enviar dados.</p></section>';
  }
  let html = template.replace(/<title>.*?<\/title>/s, `<title>${escape(meta.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escape(meta.description)}"/>`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escape(meta.title)}"/>`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escape(meta.description)}"/>`)
    .replace('</head>', `<link rel="canonical" href="${siteUrl}${route}"/><meta property="og:url" content="${siteUrl}${route}"/><meta property="og:image" content="${siteUrl}/brand.png"/>${route === '/' ? '<script type="application/ld+json" id="store-schema">' + JSON.stringify(localBusiness(store)).replace(/</g, '\\u003c') + '</script>' : ''}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${nav}<main id="conteudo">${content}</main><footer>${escape(store.legalName)} · CNPJ ${escape(store.cnpj)}</footer></div>`);
  const directory = route === '/' ? build : path.join(build, route.slice(1));
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), html);
}
fs.writeFileSync(path.join(build, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + Object.keys(pageMetadata).map(route => `<url><loc>${siteUrl}${route}</loc></url>`).join('') + '</urlset>');
fs.writeFileSync(path.join(build, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
console.log('Generated 4 static institutional pages, local business data, sitemap and robots.txt.');
