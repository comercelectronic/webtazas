// Secció «Idees de regal»: articles pensats per a les cerques de Google
// (amic invisible, regals de Nadal en català...). El contingut és a scripts/articles.js.
const { site, esc, BY_SLUG, productUrl } = require('./lib');
const { breadcrumb, breadcrumbLd, productGrid } = require('./components');
const articles = require('./articles');

const BASE = '/idees-de-regal/';
const fmtDate = (d) => new Intl.DateTimeFormat('ca-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' }).format(new Date(`${d}T12:00:00Z`));

function readingMinutes(a) {
  const text = [a.lead, ...a.sections.map((s) => s.html || '')].join(' ').replace(/<[^>]+>/g, ' ');
  return Math.max(2, Math.round(text.split(/\s+/).filter(Boolean).length / 200) + 1);
}

function productsOf(section) {
  return (section.products || []).map((s) => {
    const p = BY_SLUG[s];
    if (!p) throw new Error(`Article: tassa desconeguda «${s}»`);
    return p;
  });
}

function article(a) {
  const path = `${BASE}${a.slug}/`;
  const crumbs = [{ name: 'Inici', path: '/' }, { name: 'Idees de regal', path: BASE }, { name: a.title, path }];
  const mentioned = a.sections.flatMap(productsOf);
  const main = `
<article>
  <section class="page-hero">
    <div class="container narrow">
      ${breadcrumb(crumbs)}
      <h1 class="page-title">${esc(a.title)}</h1>
      <p class="article-meta"><time datetime="${a.published}">${fmtDate(a.published)}</time> · ${readingMinutes(a)} min de lectura</p>
      <p class="page-lead">${esc(a.lead)}</p>
    </div>
  </section>
  ${a.sections.map((s) => {
    const prods = productsOf(s);
    return `<section class="section section--flush article-section">
    <div class="container narrow prose">
      <h2>${esc(s.h2)}</h2>
      ${s.html || ''}
    </div>
    ${prods.length ? `<div class="container">${productGrid(prods, { headingLevel: 3 })}</div>` : ''}
  </section>`;
  }).join('\n')}
  <section class="section">
    <div class="container narrow prose">
      <p>Totes les tasses: <a href="/tasses/">tasses amb paraules catalanes</a> · <a href="/crea-la-teva-tassa/">crea la teva</a> · <a href="${BASE}">més idees de regal</a></p>
    </div>
  </section>
</article>`;

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: a.title,
      description: a.description,
      datePublished: a.published,
      dateModified: a.updated || a.published,
      inLanguage: 'ca',
      image: site.siteUrl + a.image,
      mainEntityOfPage: site.siteUrl + path,
      author: { '@type': 'Organization', name: site.brand, url: site.siteUrl + '/' },
      publisher: { '@type': 'Organization', name: site.brand, logo: { '@type': 'ImageObject', url: `${site.siteUrl}/assets/brand/el-glopet-mark-512.png` } },
      mentions: mentioned.map((p) => ({ '@type': 'Product', name: p.name, url: site.siteUrl + productUrl(p) })),
    },
    breadcrumbLd(crumbs),
  ];

  return {
    path,
    title: `${a.metaTitle || a.title} · ${site.brand}`,
    description: a.description,
    ogImage: a.image,
    jsonld,
    bodyClass: 'page-article',
    main,
  };
}

function index() {
  const crumbs = [{ name: 'Inici', path: '/' }, { name: 'Idees de regal', path: BASE }];
  const main = `
<section class="page-hero">
  <div class="container narrow">
    ${breadcrumb(crumbs)}
    <h1 class="page-title">Idees de regal en català</h1>
    <p class="page-lead">Guies per encertar el regal: per a l'amic invisible, per Nadal, per a la parella o per a la feina. Amb paraules catalanes que diuen alguna cosa de qui les rep.</p>
  </div>
</section>
<section class="section section--flush">
  <div class="container narrow">
    <ul class="article-list">
      ${articles.map((a) => `<li class="article-card">
        <a href="${BASE}${a.slug}/">
          <img src="${a.image}" alt="" width="600" height="600" loading="lazy">
          <span>
            <strong>${esc(a.title)}</strong>
            <span>${esc(a.description)}</span>
          </span>
        </a>
      </li>`).join('\n')}
    </ul>
  </div>
</section>`;
  return {
    path: BASE,
    title: `Idees de regal en català · ${site.brand}`,
    description: 'Guies de regal en català: idees per a l\'amic invisible, regals de Nadal, per a la parella, la família i la feina.',
    jsonld: [breadcrumbLd(crumbs)],
    main,
  };
}

const ideasPages = () => [index(), ...articles.map(article)];

module.exports = { ideasPages, IDEAS_PATH: BASE };
