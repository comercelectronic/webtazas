// Utilitats compartides pels generadors de pàgines.
const site = require('../data/site.json');
const catalog = require('../data/catalog.json');
const pricing = require('../netlify/functions/lib/pricing');

const { colorStock, inStock, pickColor, LOW_STOCK } = require('../netlify/functions/lib/colors');

// Els colors exhaurits (data/site.json → colors[].stock = 0) no es mostren.
// Si s'exhaureix el color de portada, la portada passa al primer disponible.
// Si una tassa es queda sense cap color, surt com a exhaurida.
for (const p of catalog) {
  if (!(p.colors || []).length) continue;
  const all = p.colors;
  p.colors = all.filter(inStock);
  p.soldOut = p.colors.length === 0;
  const def = pickColor(p.defaultColor, p.colors) || p.defaultColor;
  if (def !== p.defaultColor) {
    p.images = { ...p.images, front: p.images.front.replace(`/${p.defaultColor}-`, `/${def}-`), back: p.images.back && p.images.back.replace(`/${p.defaultColor}-`, `/${def}-`) };
    p.defaultColor = def;
  }
}
const COLORS_AVAILABLE = site.colors.filter((c) => inStock(c.id));

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
// Mode de la web: «botiga» (cistella i pagament) o «aparador» (comandes per Instagram).
const SHOP = site.mode !== 'aparador';
const IG_PROFILE = `https://www.instagram.com/${site.instagram}/`;
const IG_DM = `https://ig.me/m/${site.instagram}`;

/** Botó que obre un missatge directe a Instagram i copia el text de la comanda. */
function igOrderButton(label, message, { cls = 'btn--primary', withColor = false, srText = '', soldOut = false } = {}) {
  if (soldOut) return `<span class="btn ${cls} btn--disabled" aria-disabled="true">Exhaurida${srText ? `<span class="sr-only"> ${srText}</span>` : ''}</span>`;
  return `<a class="btn ${cls}" href="${IG_DM}" target="_blank" rel="noopener" data-ig-order="${esc(message)}"${withColor ? ' data-ig-color' : ''}>${icon('instagram')}<span>${label}</span>${srText ? `<span class="sr-only"> ${srText}</span>` : ''}</a>`;
}

const FREE_SHIPPING = site.shipping.costCents === 0;
const SHIPPING = FREE_SHIPPING ? 'gratuït' : euro(site.shipping.costCents);
// Text curt per a llistes: «Enviament gratuït» o «Enviament: 4,95 €».
const SHIPPING_LINE = FREE_SHIPPING ? 'Enviament gratuït' : `Enviament: ${euro(site.shipping.costCents)}`;

/** Distintiu d'oferta: «-27 %» si es mostra el preu habitual, «Oferta» si no. */
function offerBadge(slug) {
  const cents = pricing.productPriceCents(slug);
  if (cents >= site.unitPriceCents) return '';
  if (!(site.offers && site.offers.showReferencePrice)) return 'Oferta';
  return `-${Math.round((1 - cents / site.unitPriceCents) * 100)} %`;
}

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

// Cada foto de tassa té una versió de 600 px (JPEG) i una de 1200 px (WebP)
// per a pantalles d'alta densitat i vistes grans. El navegador tria segons `sizes`.
const hiRes = (src) => (/^\/images\/tasses\/.+\.jpg$/.test(src) ? src.replace(/\.jpg$/, '@2x.webp') : null);
const srcsetFor = (src) => (hiRes(src) ? `${src} 600w, ${hiRes(src)} 1200w` : '');
const SIZES = {
  card: '(max-width: 560px) 50vw, (max-width: 1100px) 33vw, 300px',
  gallery: '(max-width: 900px) 100vw, 620px',
  thumb: '100px',
  small: '160px',
  medium: '(max-width: 900px) 90vw, 520px',
};

function productImg(p, side = 'front', { eager = false, cls = '', alt, sizes = 'card' } = {}) {
  const altText = alt === undefined ? p.alt[side] : alt;
  const src = p.images[side];
  const set = srcsetFor(src);
  return `<img class="${cls}" src="${src}"${set ? ` srcset="${set}" sizes="${SIZES[sizes] || sizes}"` : ''} alt="${esc(altText)}" width="${p.images.width}" height="${p.images.height}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

/**
 * Meta descripció que Google no talli (≈ 158 caràcters): afegeix l'extra només si hi cap
 * i, si el text principal és massa llarg, el talla per una paraula sencera.
 */
function metaDescription(main, extra = '', max = 158) {
  const m = String(main).trim();
  const both = extra ? `${m} ${extra}` : m;
  if (both.length <= max) return both;
  if (m.length <= max) return m;
  return m.slice(0, max - 1).replace(/\s+\S*$/, '').replace(/[,;:]$/, '') + '…';
}

module.exports = {
  metaDescription,
  site, catalog, BY_SLUG, CATEGORIES, CATEGORY_BY_ID, esc, euro, PRICE, SHIPPING, SHIPPING_LINE, FREE_SHIPPING, DELIVERY, icon, value, pendingFields,
  pricing, priceHtml, offerBadge, SHOP, IG_PROFILE, IG_DM, igOrderButton, COLORS_AVAILABLE, colorStock, LOW_STOCK,
  productUrl, productImg, srcsetFor, jsonLd,
};
