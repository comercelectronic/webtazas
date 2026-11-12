const { site, catalog, CATEGORIES, CATEGORY_BY_ID, esc, PRICE, SHIPPING, DELIVERY, icon, productUrl, productImg, jsonLd } = require('./lib');

const NAV = [
  { href: '/tasses/', label: 'Totes les tasses' },
  ...CATEGORIES.map((c) => ({ href: c.path, label: c.name })),
  { href: '/#packs', label: 'Per regalar' },
];

function head({ title, description, path, ogImage, jsonld = [], noindex = false, assetVersion, adminScript = false }) {
  const url = site.siteUrl + path;
  const image = site.siteUrl + (ogImage || '/images/mug-aixopluc-front.jpg');
  return `<!doctype html>
<html lang="ca">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : `<link rel="canonical" href="${url}">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.brand)}">
<meta property="og:locale" content="${site.locale}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#FBF8F3">
<link rel="preload" href="/assets/fonts/lora.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/styles.css?v=${assetVersion}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
${jsonld.map(jsonLd).join('\n')}
<script defer src="/assets/catalog.js?v=${assetVersion}"></script>
<script defer src="/assets/app.js?v=${assetVersion}"></script>
${adminScript ? `<script defer src="/assets/admin.js?v=${assetVersion}"></script>` : ''}
</head>`;
}

function header(path) {
  const links = NAV.map((n) => `<li><a href="${n.href}"${path === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`).join('');
  return `<a class="skip-link" href="#main">Salta al contingut</a>
<div class="announce"><div class="container announce__inner">
  <span>Totes les tasses a <strong>${PRICE}</strong></span>
  <span class="announce__sep" aria-hidden="true">·</span>
  <span>Pagament segur amb Stripe</span>
  <span class="announce__sep" aria-hidden="true">·</span>
  <span>14 dies per desistir</span>
</div></div>
<header class="site-header">
  <div class="container site-header__inner">
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
      ${icon('menu')}<span class="sr-only">Menú</span>
    </button>
    <a class="logo" href="/" aria-label="${esc(site.brand)}, inici">Tassa <em>de</em> Mots</a>
    <nav class="site-nav" id="site-nav" aria-label="Principal"><ul>${links}</ul></nav>
    <button class="cart-btn" type="button" data-cart-open aria-label="Obre la cistella (0 productes)">
      ${icon('bag')}<span class="cart-btn__count" data-cart-count>0</span>
    </button>
  </div>
</header>`;
}

function footer() {
  const year = new Date().getFullYear();
  return `<footer class="site-footer">
  <div class="container site-footer__grid">
    <div class="site-footer__brand">
      <a class="logo logo--light" href="/">Tassa <em>de</em> Mots</a>
      <p>Tasses amb paraules catalanes poc habituals. Al davant, el missatge; al darrere, la definició.</p>
      <p class="site-footer__pay">${icon('lock')} Pagament segur amb Stripe</p>
    </div>
    <nav aria-label="Botiga">
      <h2 class="site-footer__title">Botiga</h2>
      <ul>
        <li><a href="/tasses/">Totes les tasses</a></li>
        ${CATEGORIES.map((c) => `<li><a href="${c.path}">${esc(c.name)}</a></li>`).join('')}
        <li><a href="/#packs">Per regalar</a></li>
      </ul>
    </nav>
    <nav aria-label="Ajuda">
      <h2 class="site-footer__title">Ajuda</h2>
      <ul>
        <li><a href="/enviaments-i-devolucions/">Enviaments i devolucions</a></li>
        <li><a href="/condicions-venda/">Condicions de venda</a></li>
        <li><a href="/#contacte">Contacte</a></li>
        <li><a href="/newsletter/">Newsletter</a></li>
      </ul>
    </nav>
    <nav aria-label="Informació legal">
      <h2 class="site-footer__title">Legal</h2>
      <ul>
        <li><a href="/avis-legal/">Avís legal</a></li>
        <li><a href="/privacitat/">Política de privacitat</a></li>
        <li><a href="/cookies/">Política de cookies</a></li>
        <li><button type="button" class="link-btn" data-cookie-settings>Configura les cookies</button></li>
      </ul>
    </nav>
  </div>
  <div class="container site-footer__bottom">
    <p>© ${year} ${esc(site.brand)}. Preus en euros.</p>
  </div>
</footer>`;
}

function cartDrawer() {
  return `<div class="drawer-backdrop" data-cart-close hidden></div>
<aside class="drawer" id="cart" role="dialog" aria-modal="true" aria-labelledby="cart-title" aria-hidden="true" data-cart>
  <div class="drawer__head">
    <h2 id="cart-title">La teva cistella</h2>
    <button type="button" class="icon-btn" data-cart-close aria-label="Tanca la cistella">${icon('close')}</button>
  </div>
  <div class="drawer__body" data-cart-items></div>
  <div class="drawer__upsell" data-cart-upsell hidden></div>
  <div class="drawer__foot" data-cart-foot hidden>
    <dl class="totals">
      <div><dt>Subtotal</dt><dd data-cart-subtotal></dd></div>
      <div><dt>Enviament</dt><dd data-cart-shipping></dd></div>
      <div class="totals__grand"><dt>Total</dt><dd data-cart-total></dd></div>
    </dl>
    <button type="button" class="btn btn--primary btn--block btn--lg" data-checkout>Finalitza la compra</button>
    <p class="drawer__legal">${icon('lock')} Pagament segur amb Stripe. En continuar acceptes les <a href="/condicions-venda/">condicions de venda</a>.</p>
  </div>
</aside>
<div class="toast" role="status" aria-live="polite" data-toast></div>`;
}

function page(opts, main) {
  return `${head(opts)}
<body class="${opts.bodyClass || ''}">
${header(opts.path)}
<main id="main">
${main}
</main>
${footer()}
${cartDrawer()}
</body>
</html>
`;
}

function trustList(cls = '') {
  return `<ul class="trust ${cls}">
  <li>${icon('lock')}<span>Pagament segur amb Stripe</span></li>
  <li>${icon('truck')}<span>Enviament en ${DELIVERY} · ${SHIPPING}</span></li>
  <li>${icon('return')}<span>14 dies per desistir de la compra</span></li>
</ul>`;
}

function productCard(p, { eager = false, headingLevel = 3 } = {}) {
  const cat = CATEGORY_BY_ID[p.category];
  const h = `h${headingLevel}`;
  return `<article class="card" data-product="${p.slug}" data-category="${p.category}">
  <a class="card__media" href="${productUrl(p)}" tabindex="-1" aria-hidden="true">
    ${productImg(p, 'front', { eager, cls: 'card__img' })}
    ${productImg(p, 'back', { cls: 'card__img card__img--back', alt: '' })}
    <span class="card__stock" data-stock-badge hidden></span>
  </a>
  <div class="card__body">
    <p class="chip chip--${p.category}">${esc(cat.singular)}</p>
    <${h} class="card__title"><a href="${productUrl(p)}">${esc(p.name)}</a></${h}>
    <p class="card__text">${esc(p.summary)}</p>
    <p class="card__rating" data-rating hidden></p>
    <div class="card__foot">
      <span class="price">${PRICE}</span>
      <button type="button" class="btn btn--small" data-add="${p.slug}">Afegeix<span class="sr-only"> «${esc(p.name)}» a la cistella</span></button>
    </div>
  </div>
</article>`;
}

function productGrid(products, opts) {
  return `<div class="grid">${products.map((p, i) => productCard(p, { ...opts, eager: opts && opts.eagerFirst && i < 4 })).join('\n')}</div>`;
}

function newsletterForm(source, idSuffix) {
  const id = `nl-${idSuffix}`;
  return `<form class="nl-form" data-newsletter-form data-source="${source}" novalidate>
  <div class="nl-form__row">
    <label class="sr-only" for="${id}-email">Correu electrònic</label>
    <input class="input" id="${id}-email" type="email" name="email" autocomplete="email" required placeholder="El teu correu electrònic">
    <button class="btn btn--primary" type="submit">Subscriu-me</button>
  </div>
  <label class="check" for="${id}-consent">
    <input type="checkbox" id="${id}-consent" name="consent" required>
    <span>${esc(site.newsletterConsent.text)}</span>
  </label>
  <div class="hp" aria-hidden="true"><label>No omplis aquest camp <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
  <p class="form-note">Rebràs un correu per confirmar la subscripció. Responsable: el titular de ${esc(site.brand)} (vegeu l'<a href="/avis-legal/">avís legal</a>). Finalitat: enviar-te la newsletter. Base legal: el teu consentiment. Proveïdor d'enviament: Resend. Pots exercir els teus drets i consultar-ne més detalls a la <a href="/privacitat/">política de privacitat</a>.</p>
  <p class="form-status" role="status" aria-live="polite" data-form-status></p>
</form>`;
}

function sectionHead(eyebrow, title, text, { id, level = 2 } = {}) {
  return `<div class="section-head">
  ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
  <h${level} class="section-title"${id ? ` id="${id}"` : ''}>${title}</h${level}>
  ${text ? `<p class="section-text">${text}</p>` : ''}
</div>`;
}

function breadcrumb(items) {
  return `<nav class="breadcrumb" aria-label="Ruta de navegació"><ol>${items.map((it, i) =>
    i === items.length - 1 ? `<li aria-current="page">${esc(it.name)}</li>` : `<li><a href="${it.path}">${esc(it.name)}</a></li>`).join('')}</ol></nav>`;
}

const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: site.siteUrl + it.path })),
});

module.exports = { page, productCard, productGrid, newsletterForm, sectionHead, trustList, breadcrumb, breadcrumbLd, NAV, catalog };
