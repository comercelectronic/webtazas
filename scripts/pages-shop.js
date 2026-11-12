const { site, catalog, BY_SLUG, CATEGORIES, CATEGORY_BY_ID, esc, euro, PRICE, SHIPPING, DELIVERY, icon, productUrl, productImg } = require('./lib');
const { productCard, productGrid, newsletterForm, sectionHead, trustList, breadcrumb, breadcrumbLd } = require('./components');

const newProducts = catalog.filter((p) => p.new);

const FAQ = [
  ['Quant costa cada tassa?', `Totes les tasses costen ${PRICE}. L'enviament costa ${SHIPPING} per comanda i el veuràs a la cistella abans de pagar.`],
  ['Quant triga a arribar?', `El termini estimat és de ${DELIVERY} des del pagament. Enviem a ${site.shipping.countriesLabel}.`],
  ['Puc tornar una tassa?', 'Sí. Tens 14 dies naturals des que la reps per desistir de la compra, sense haver de donar explicacions.'],
  ['Com es paga?', 'Amb targeta, a la pàgina de pagament segur de Stripe. Nosaltres no veiem ni guardem les dades de la teva targeta.'],
  ['Les opinions que publiqueu són reals?', "Sí. Només publiquem valoracions que ens envien persones a través de la web, i les revisem una a una abans de publicar-les. No n'inventem ni en paguem."],
];

function packCard(pack) {
  const items = pack.slugs.map((s) => BY_SLUG[s]);
  const total = euro(site.unitPriceCents * items.length);
  return `<article class="pack">
  <div class="pack__media">${items.map((p) => `<a href="${productUrl(p)}" tabindex="-1" aria-hidden="true">${productImg(p, 'front', { alt: '' })}</a>`).join('')}</div>
  <div class="pack__body">
    <h3 class="pack__title">${esc(pack.name)}</h3>
    <p class="pack__text">${esc(pack.text)}</p>
    <p class="pack__items">${items.map((p) => `<a href="${productUrl(p)}">${esc(p.name)}</a>`).join(' · ')}</p>
    <div class="pack__foot">
      <span class="price">${total}<small> · ${items.length} tasses</small></span>
      <button type="button" class="btn btn--primary" data-add-pack="${pack.slugs.join(',')}">Afegeix-les totes</button>
    </div>
  </div>
</article>`;
}

function contactSection() {
  return `<section class="section section--tint" id="contacte" aria-labelledby="contacte-title">
  <div class="container contact">
    <div>
      ${sectionHead('Contacte', 'Tens algun dubte?', "Escriu-nos i et respondrem per correu electrònic. També ens pots proposar paraules per a noves tasses.", { id: 'contacte-title' })}
    </div>
    <form class="form" name="contacte" method="POST" action="/contacte-enviat/" data-netlify="true" netlify-honeypot="bot-field" data-contact-form>
      <input type="hidden" name="form-name" value="contacte">
      <p class="hp" aria-hidden="true"><label>No omplis aquest camp <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
      <div class="field"><label for="c-name">Nom</label><input class="input" id="c-name" name="nom" autocomplete="name" required maxlength="80"></div>
      <div class="field"><label for="c-email">Correu electrònic</label><input class="input" id="c-email" name="email" type="email" autocomplete="email" required maxlength="254"></div>
      <div class="field"><label for="c-msg">Missatge</label><textarea class="input" id="c-msg" name="missatge" rows="5" required minlength="10" maxlength="3000"></textarea></div>
      <label class="check" for="c-privacy"><input type="checkbox" id="c-privacy" name="privacitat" value="si" required><span>He llegit la informació sobre protecció de dades.</span></label>
      <p class="form-note">Responsable: el titular de ${esc(site.brand)}. Finalitat: respondre la teva consulta. Base legal: el teu consentiment. Les dades es desen a Netlify (allotjament). Drets i més informació a la <a href="/privacitat/">política de privacitat</a>.</p>
      <button class="btn btn--primary" type="submit">Envia el missatge</button>
      <p class="form-status" role="status" aria-live="polite" data-form-status></p>
    </form>
  </div>
</section>`;
}

function home() {
  const hero = [BY_SLUG.aixopluc, BY_SLUG.niu, BY_SLUG.cagadubtes];
  const featured = ['aixopluc', 'cagadubtes', 'caliu', 'escalfacadires', 'niu', 'bocamoll', 'deler', 'llepafils'].map((s) => BY_SLUG[s]);
  const explain = BY_SLUG.caliu;

  const main = `
<section class="hero" aria-labelledby="hero-title">
  <div class="container hero__grid">
    <div class="hero__copy">
      <p class="eyebrow">Nova col·lecció · ${newProducts.length} paraules catalanes</p>
      <h1 class="hero__title" id="hero-title">Regala una paraula que digui <em>exactament</em> el que sents</h1>
      <p class="hero__lead">Tasses amb paraules catalanes poc habituals. Al davant, un missatge per a qui la rep; al darrere, la definició de diccionari. Totes a <strong>${PRICE}</strong>.</p>
      <div class="hero__ctas">
        <a class="btn btn--primary btn--lg" href="/tasses/">Veure totes les tasses ${icon('arrow')}</a>
        <a class="btn btn--ghost btn--lg" href="#categories">Troba la paraula per a algú</a>
      </div>
      ${trustList('trust--inline')}
    </div>
    <div class="hero__media">
      <a class="hero__photo hero__photo--main" href="${productUrl(hero[0])}">${productImg(hero[0], 'front', { eager: true })}<span class="sr-only">Veure la tassa ${esc(hero[0].name)}</span></a>
      <a class="hero__photo hero__photo--a" href="${productUrl(hero[1])}" tabindex="-1" aria-hidden="true">${productImg(hero[1], 'back', { alt: '' })}</a>
      <a class="hero__photo hero__photo--b" href="${productUrl(hero[2])}" tabindex="-1" aria-hidden="true">${productImg(hero[2], 'front', { alt: '' })}</a>
    </div>
  </div>
</section>

<section class="section explain" aria-labelledby="explain-title">
  <div class="container explain__grid">
    <figure class="explain__pair">
      <div class="explain__side">${productImg(explain, 'front', { alt: `Davant de la tassa: «${explain.intro} ${explain.name.toLowerCase()}»` })}<figcaption><strong>Davant</strong> El missatge</figcaption></div>
      <div class="explain__side">${productImg(explain, 'back', { alt: `Darrere de la tassa: definició de «${explain.name.toLowerCase()}»` })}<figcaption><strong>Darrere</strong> La definició</figcaption></div>
    </figure>
    <div>
      ${sectionHead('Què fa diferent una tassa de Mots', 'Una paraula, dues definicions', '', { id: 'explain-title' })}
      <ol class="steps">
        <li><span class="steps__n">1</span><div><h3>Paraules que gairebé ja no es diuen</h3><p>Caliu, aixopluc, bocamoll, llepafils… Paraules catalanes que es mereixen una segona vida.</p></div></li>
        <li><span class="steps__n">2</span><div><h3>La del diccionari i la teva</h3><p>Al darrere, la definició de sempre i una de nova, pensada per a una persona.</p></div></li>
        <li><span class="steps__n">3</span><div><h3>Pensades per regalar</h3><p>Per dir «tu ets el meu aixopluc» sense haver-ho de dir en veu alta. O per confessar que ets un cagadubtes.</p></div></li>
      </ol>
    </div>
  </div>
</section>

<section class="section" id="categories" aria-labelledby="cat-title">
  <div class="container">
    ${sectionHead('Categories', 'Per a qui és la tassa?', '', { id: 'cat-title' })}
    <div class="categories">
      ${CATEGORIES.map((c) => `<a class="category category--${c.id}" href="${c.path}">
        ${productImg(BY_SLUG[c.cover], 'front', { alt: '' })}
        <span class="category__body"><span class="category__name">${esc(c.name)}</span><span class="category__text">${esc(c.text)}</span><span class="category__count">${c.products.length} ${c.products.length === 1 ? 'tassa' : 'tasses'} ${icon('arrow')}</span></span>
      </a>`).join('')}
    </div>
  </div>
</section>

<section class="section section--tint" aria-labelledby="new-title">
  <div class="container">
    ${sectionHead('Novetats', 'La nova col·lecció', `${newProducts.length} paraules noves, totes a ${PRICE}.`, { id: 'new-title' })}
    ${productGrid(featured)}
    <p class="section-cta"><a class="btn btn--ghost btn--lg" href="/tasses/">Veure les ${catalog.length} tasses ${icon('arrow')}</a></p>
  </div>
</section>

<section class="section" aria-labelledby="best-title" data-bestsellers hidden>
  <div class="container">
    ${sectionHead('Els més venuts', 'Les que més s\'emporten', 'Calculat a partir de les comandes pagades a la botiga.', { id: 'best-title' })}
    <div class="grid" data-bestsellers-grid></div>
  </div>
  ${catalog.map((p) => `<template data-card-template="${p.slug}">${productCard(p)}</template>`).join('')}
</section>

<section class="section" id="packs" aria-labelledby="packs-title">
  <div class="container">
    ${sectionHead('Per regalar', 'Combinacions que funcionen', `Al preu de sempre: ${PRICE} per tassa, sense recàrrecs.`, { id: 'packs-title' })}
    <div class="packs">${site.packs.map(packCard).join('')}</div>
  </div>
</section>

<section class="section section--tint" aria-labelledby="reviews-title">
  <div class="container">
    ${sectionHead('Opinions', 'El que en diuen', '', { id: 'reviews-title' })}
    <div class="latest-reviews" data-latest-reviews>
      <p class="empty-note">Encara no hi ha opinions publicades. Quan rebis la teva tassa, pots deixar-ne una a la seva fitxa: les llegim totes abans de publicar-les i no n'inventem cap.</p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="faq-title">
  <div class="container narrow">
    ${sectionHead('Preguntes freqüents', 'Abans de comprar', '', { id: 'faq-title' })}
    <div class="faq">${FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
  </div>
</section>

<section class="section newsletter-band" aria-labelledby="nl-title">
  <div class="container newsletter-band__inner">
    <div>
      <p class="eyebrow eyebrow--light">Newsletter</p>
      <h2 class="section-title" id="nl-title">Paraules noves, abans que ningú</h2>
      <p>T'escriurem quan tinguem nous dissenys, ofertes o descomptes. Res més.</p>
    </div>
    ${newsletterForm('inici', 'home')}
  </div>
</section>

${contactSection()}`;

  const jsonld = [
    {
      '@context': 'https://schema.org', '@type': 'Organization', name: site.brand, url: site.siteUrl + '/',
      logo: site.siteUrl + '/favicon.svg',
    },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: site.brand, url: site.siteUrl + '/', inLanguage: 'ca' },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ];

  return {
    path: '/',
    title: `${site.brand} · Tasses amb paraules catalanes per regalar`,
    description: `Tasses amb paraules catalanes poc habituals i la seva definició de diccionari. Regals originals per a la parella, la família o la feina, a ${PRICE}.`,
    jsonld,
    bodyClass: 'page-home',
    main,
  };
}

function listing({ path, title, h1, intro, products, crumbs, seoText }) {
  const chips = [{ path: '/tasses/', name: 'Totes' }, ...CATEGORIES.map((c) => ({ path: c.path, name: c.name }))];
  const main = `
<section class="page-hero">
  <div class="container">
    ${breadcrumb(crumbs)}
    <h1 class="page-title">${esc(h1)}</h1>
    <p class="page-lead">${esc(intro)}</p>
    <nav class="chips" aria-label="Categories">${chips.map((c) => `<a class="chips__item" href="${c.path}"${c.path === path ? ' aria-current="page"' : ''}>${esc(c.name)}</a>`).join('')}</nav>
  </div>
</section>
<section class="section section--flush">
  <div class="container">
    <p class="result-count">${products.length} ${products.length === 1 ? 'tassa' : 'tasses'} · ${PRICE} cadascuna</p>
    ${productGrid(products, { eagerFirst: true, headingLevel: 2 })}
    ${seoText ? `<div class="seo-text">${seoText}</div>` : ''}
  </div>
</section>`;
  return {
    path, title, description: `${intro} Totes les tasses a ${PRICE}.`,
    jsonld: [
      breadcrumbLd(crumbs),
      {
        '@context': 'https://schema.org', '@type': 'ItemList', name: h1,
        itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: site.siteUrl + productUrl(p), name: p.name })),
      },
    ],
    main,
  };
}

function catalogPages() {
  const out = [listing({
    path: '/tasses/',
    title: `Totes les tasses · ${site.brand}`,
    h1: 'Totes les tasses',
    intro: 'Tasses amb paraules catalanes per regalar: per dir t\'estimo, per riure\'s de les manies de cadascú o per desfogar-se amb setze insults.',
    products: catalog,
    crumbs: [{ name: 'Inici', path: '/' }, { name: 'Totes les tasses', path: '/tasses/' }],
  })];
  for (const c of CATEGORIES) {
    out.push(listing({
      path: c.path,
      title: `${c.name}: tasses per regalar · ${site.brand}`,
      h1: c.name,
      intro: c.text,
      products: c.products,
      crumbs: [{ name: 'Inici', path: '/' }, { name: 'Totes les tasses', path: '/tasses/' }, { name: c.name, path: c.path }],
    }));
  }
  return out;
}

module.exports = { home, catalogPages, contactSection };
