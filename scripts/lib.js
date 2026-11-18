// Utilitats compartides pels generadors de pàgines.
const site = require('../data/site.json');
const catalog = require('../data/catalog.json');
const pricing = require('../netlify/functions/lib/pricing');

const BY_SLUG = Object.fromEntries(catalog.map((p) => [p.slug, p]));

const CATEGORY_PATHS = { amor: 'paraules-d-amor', caracter: 'paraules-de-caracter', insults: 'insults-d-autor', humor: 'frases-amb-humor' };
const CATEGORIES = site.categories.map((c) => ({
  ...c,
  path: `/tasses/${CATEGORY_PATHS[c.id]}/`,
  products: catalog.filter((p) => p.category === c.id),
}));
const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const euro = (cents) => (cents / 100).toFixed(2).replace('.', ',') + ' €';
const PRICE = euro(site.unitPriceCents);
const FREE_SHIPPING = site.shipping.costCents === 0;
const SHIPPING = FREE_SHIPPING ? 'gratuït' : euro(site.shipping.costCents);
// Text curt per a llistes: «Enviament gratuït» o «Enviament: 4,95 €».
const SHIPPING_LINE = FREE_SHIPPING ? 'Enviament gratuït' : `Enviament: ${euro(site.shipping.costCents)}`;

/** Bloc de preu d'una tassa: preu d'oferta, si en té. */
function priceHtml(slug, { large = false } = {}) {
  const cents = pricing.productPriceCents(slug);
  const cls = `price${large ? ' price--lg' : ''}`;
  if (cents >= site.unitPriceCents) return `<span class="${cls}">${euro(cents)}</span>`;
  const ref = site.offers && site.offers.showReferencePrice
    ? ` <s class="price__ref"><span class="sr-only">Preu habitual: </span>${euro(site.unitPriceCents)}</s>` : '';
  return `<span class="${cls} price--offer"><span class="sr-only">Preu d'oferta: </span>${euro(cents)}</span>${ref}`;
}
const DELIVERY = `${site.shipping.minBusinessDays}–${site.shipping.maxBusinessDays} dies feiners`;

const icon = (name, cls = '') => `<svg class="icon ${cls}" aria-hidden="true" focusable="false"><use href="/assets/icons.svg#${name}"></use></svg>`;

// Camps que el titular encara ha de completar. Es mostren marcats a la web i
// el build en fa una llista perquè no se n'oblidi cap abans de publicar.
const pendingFields = new Set();
function value(v, label) {
  if (v !== null && v !== undefined && v !== '') return esc(v);
  pendingFields.add(label);
  return `<mark class="pending">[Pendent: ${esc(label)}]</mark>`;
}

const productUrl = (p) => `/tasses/${p.slug}/`;

function productImg(p, side = 'front', { eager = false, cls = '', alt } = {}) {
  const altText = alt === undefined ? p.alt[side] : alt;
  return `<img class="${cls}" src="${p.images[side]}" alt="${esc(altText)}" width="${p.images.width}" height="${p.images.height}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

module.exports = {
  site, catalog, BY_SLUG, CATEGORIES, CATEGORY_BY_ID, esc, euro, PRICE, SHIPPING, SHIPPING_LINE, FREE_SHIPPING, DELIVERY, icon, value, pendingFields,
  pricing, priceHtml,
  productUrl, productImg, jsonLd,
};
