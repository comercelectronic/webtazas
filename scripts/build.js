#!/usr/bin/env node
// Genera totes les pàgines de la botiga a partir de data/catalog.json i
// data/site.json. Execució: `npm run build` (Netlify ho fa a cada desplegament).
//
// Per canviar un preu, un text o afegir una tassa, edita els fitxers de
// data/ i torna a executar el build: no editis els HTML generats a mà.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { site, catalog, CATEGORIES, pendingFields } = require('./lib');
const { page } = require('./components');
const shop = require('./pages-shop');
const { product } = require('./pages-product');
const other = require('./pages-other');

const ROOT = path.join(__dirname, '..');
const out = (rel, content) => {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

// 1. Catàleg per al navegador (cistella, venda creuada, packs).
const browserCatalog = {
  priceCents: site.unitPriceCents,
  shippingCents: site.shipping.costCents,
  maxQty: site.maxQtyPerItem,
  products: Object.fromEntries(catalog.map((p) => [p.slug, {
    name: p.name, url: `/tasses/${p.slug}/`, image: p.images.front, related: p.related, category: p.category,
  }])),
};
out('assets/catalog.js', `// Generat per scripts/build.js a partir de data/. No l'editis a mà.\nwindow.TDM_CATALOG = ${JSON.stringify(browserCatalog)};\n`);

// 2. Versió dels recursos per invalidar la memòria cau del navegador.
const assetVersion = crypto.createHash('sha1')
  .update(['assets/styles.css', 'assets/app.js', 'assets/admin.js', 'assets/catalog.js']
    .map((f) => fs.readFileSync(path.join(ROOT, f), 'utf8')).join(''))
  .digest('hex').slice(0, 10);

// 3. Pàgines.
const pages = [
  shop.home(),
  ...shop.catalogPages(),
  ...catalog.map(product),
  other.newsletter(),
  other.nlAction('confirm'),
  other.nlAction('unsubscribe'),
  other.thanks(),
  other.contactSent(),
  other.notFound(),
  ...other.legalPages(),
  other.admin(),
];

fs.rmSync(path.join(ROOT, 'tasses'), { recursive: true, force: true });
for (const pg of pages) {
  const file = pg.path === '/' ? 'index.html' : pg.path.endsWith('/') ? `${pg.path.slice(1)}index.html` : pg.path.slice(1);
  out(file, page({ ...pg, assetVersion }, pg.main));
}

// 4. Sitemap i robots.
const indexable = pages.filter((p) => !p.noindex);
out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>${site.siteUrl}${p.path}</loc></url>`).join('\n')}
</urlset>
`);
out('robots.txt', `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /newsletter/confirmar/
Disallow: /newsletter/baixa/

Sitemap: ${site.siteUrl}/sitemap.xml
`);

// 5. Redireccions permanents des de les adreces antigues.
const retired = ['fer-volar-coloms', 'aneu-a-fer-punyetes', 'qui-no-plora-no-mama', 'cofoi', 'escarransit', 'esbojarrat', 'carallot-oficial', 'no-em-toquis-ovaris'];
const redirects = [
  '# Generat per scripts/build.js',
  '/admin-estoc.html  /admin/  301',
  '/gracies.html  /gracies/  301',
  ...['avis-legal', 'privacitat', 'cookies', 'condicions-venda'].map((s) => `/${s}.html  /${s}/  301`),
  ...catalog.map((p) => `/tasses/${p.slug}.html  /tasses/${p.slug}/  301`),
  ...retired.map((s) => `/tasses/${s}.html  /tasses/  301`),
];
out('_redirects', redirects.join('\n') + '\n');

// 6. Informe de camps pendents.
const missingSpecs = site.productSpecs.filter((s) => !s.value).map((s) => `fitxa de producte: ${s.label}`);
const pending = [...pendingFields, ...missingSpecs];
console.log(`✔ ${pages.length} pàgines generades (${catalog.length} tasses, ${CATEGORIES.length} categories). Preu: ${(site.unitPriceCents / 100).toFixed(2)} €`);
if (pending.length) {
  console.log(`\n⚠ Dades pendents de completar a data/site.json abans de publicar (${pending.length}):`);
  pending.forEach((p) => console.log(`  - ${p}`));
}
