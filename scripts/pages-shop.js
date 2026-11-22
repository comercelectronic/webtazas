const { site, catalog, BY_SLUG, CATEGORIES, CATEGORY_BY_ID, esc, euro, PRICE, SHIPPING, SHIPPING_LINE, FREE_SHIPPING, DELIVERY, icon, productUrl, productImg, pricing, SHOP, igOrderButton, metaDescription } = require('./lib');
const articles = require('./articles');
const { productCard, productGrid, newsletterForm, sectionHead, trustList, breadcrumb, breadcrumbLd } = require('./components');

const newProducts = catalog.filter((p) => p.new);
const offerProducts = catalog.filter((p) => pricing.hasOffer(p.slug));

const FAQ = [
  ['Quant costa cada tassa?', `${PRICE}, amb l'enviament inclòs. Algunes tasses tenen preu d'oferta, i els packs surten més barats que comprar les tasses per separat. La tassa personalitzada també costa ${PRICE}.`],
  ['Quant costa l\'enviament?', FREE_SHIPPING ? 'Res: l\'enviament és gratuït, tant si compres una tassa com si en compres deu.' : `${SHIPPING} per comanda, tant si compres una tassa com si en compres deu.`],
  ['Quant triga a arribar?', `El termini estimat és de ${DELIVERY} des del pagament. Enviem a ${site.shipping.countriesLabel}.`],
  ['Puc tornar una tassa?', `Sí. Tens 14 dies naturals des que la reps per desistir de la compra, sense haver de donar explicacions. ${site.customReturns ? 'També les tasses personalitzades. ' : 'L\'única excepció són les tasses personalitzades, que es fan a mida: no tenen desistiment, però sí la garantia legal si arriben amb defectes. '}${SHOP ? 'A la pàgina d\'enviaments i devolucions t\'expliquem com fer-ho.' : 'Escriu-nos per Instagram i t\'expliquem com fer-ho.'}`],
  ['Quina garantia tenen?', 'La garantia legal de 3 anys. Si una tassa arriba trencada o té un defecte, te la canviem o et retornem l\'import, sense cap cost. Si el defecte apareix durant els 2 primers anys, no has de demostrar res.'],
  SHOP ? ['Com es paga?', 'Amb targeta, a la pàgina de pagament segur de Stripe. Nosaltres no veiem ni guardem les dades de la teva targeta.']
    : ['Com puc comprar una tassa?', `Prem «La vull» a la tassa que t'agradi: s'obrirà un missatge directe a Instagram (@${site.instagram}) amb la tassa i el color ja escrits. T'hi responem amb el resum de la comanda i com pagar-la.`],
  ['Les opinions que publiqueu són reals?', "Sí. Només publiquem valoracions que ens envien persones a través de la web, i les revisem una a una abans de publicar-les. No n'inventem ni en paguem."],
];

function packCard(pack) {
  const items = pack.slugs.map((s) => BY_SLUG[s]);
  const price = pricing.packPriceCents(pack);
  const saving = pricing.packSeparateCents(pack) - price;
  return `<article class="pack pack--${pack.id}">
  <div class="pack__media" aria-hidden="true">${items.map((p) => `<span class="pack__mug">${productImg(p, 'front', { sizes: 'small', alt: '' })}</span>`).join('')}</div>
  <div class="pack__body">
    <p class="pack__count">${items.length} tasses${saving > 0 ? ` · <span class="pack__save">Estalvies ${euro(saving)}</span>` : ''}</p>
    <h3 class="pack__title">${esc(pack.name)}</h3>
    <p class="pack__text">${esc(pack.text)}</p>
    <p class="pack__items">${items.map((p) => `<a href="${productUrl(p)}">${esc(p.name)}</a>`).join('<span aria-hidden="true"> · </span>')}</p>
    <div class="pack__foot">
      <p class="pack__price"><span class="price price--lg">${euro(price)}</span>${saving > 0 ? `<span class="pack__vs">per separat, ${euro(pricing.packSeparateCents(pack))}</span>` : ''}</p>
      ${SHOP ? `<button type="button" class="btn btn--primary" data-add-pack="${pack.id}">Afegeix el pack a la cistella<span class="sr-only"> (${esc(pack.name)}, ${euro(price)})</span></button>`
    : igOrderButton('Demana el pack per Instagram', `Hola! M'agradaria el ${pack.name} (${items.map((p) => p.name).join(', ')}).`, { srText: `(${esc(pack.name)}, ${euro(price)})`, soldOut: items.some((p) => p.soldOut) })}
    </div>
  </div>
</article>`;
}

function recommenderSlugs(r) {
  return catalog.filter((p) => r.categories.includes(p.category) || (p.tags || []).some((t) => r.tags.includes(t))).map((p) => p.slug);
}

function recommender() {
  const opts = site.recommender.map((r) => ({
    ...r,
    slugs: recommenderSlugs(r),
    href: r.categories.length === 1 ? CATEGORY_BY_ID[r.categories[0]].path : '/tasses/',
  }));
  const first = opts[0];
  const SHOW = 4;
  return `<section class="section finder" id="recomanador" aria-labelledby="finder-title">
  <div class="container">
    ${sectionHead('Recomanador', 'Troba la tassa perfecta', 'Per a qui busques una tassa?', { id: 'finder-title' })}
    <div class="finder__options" role="group" aria-label="Per a qui busques una tassa?">
      ${opts.map((r, i) => `<button type="button" class="finder__option" aria-pressed="${i === 0}" data-finder-option="${r.id}" data-slugs="${r.slugs.join(',')}" data-href="${r.href}">${esc(r.label)}</button>`).join('')}
    </div>
    <p class="finder__status" role="status" aria-live="polite" data-finder-status>${first.slugs.length} tasses ${esc(first.label.toLowerCase())}</p>
    <div class="grid finder__results" data-finder-results data-show="${SHOW}">${first.slugs.slice(0, SHOW).map((x) => productCard(BY_SLUG[x])).join('')}</div>
    <p class="section-cta"><a class="btn btn--ghost btn--lg" href="${first.href}" data-finder-more>Veure-les totes (${first.slugs.length}) ${icon('arrow')}</a></p>
  </div>
</section>`;
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
      <p class="form-note">Responsable: el titular ${esc(site.brandOf)}. Finalitat: respondre la teva consulta. Base legal: el teu consentiment. Les dades es desen a Netlify (allotjament). Drets i més informació a la <a href="/privacitat/">política de privacitat</a>.</p>
      <button class="btn btn--primary" type="submit">Envia el missatge</button>
      <p class="form-status" role="status" aria-live="polite" data-form-status></p>
    </form>
  </div>
</section>`;
}

function heroWord(p, i) {
  return `<div class="hero-word${i === 0 ? ' is-active' : ''}" data-hero-word${i === 0 ? '' : ' hidden'}>
  <div class="hero-word__card">
    <p class="hero-word__head"><span class="hero-word__word">${esc(p.name.toLowerCase())}</span> <span class="hero-word__ipa">${esc(p.phonetic)}</span></p>
    <ol class="hero-word__defs"><li>${esc(p.def1)}</li><li>${esc(p.def2)}</li></ol>
  </div>
  <a class="hero-word__mug" href="${productUrl(p)}" tabindex="-1" aria-hidden="true">${productImg(p, 'front', { sizes: 'medium', eager: i === 0, alt: '' })}</a>
  <p class="hero-word__link"><a href="${productUrl(p)}">Veure la tassa «${esc(p.intro)} ${esc(p.name.toLowerCase())}» ${icon('arrow')}</a></p>
</div>`;
}

function home() {
  const words = site.heroWords.map((x) => BY_SLUG[x]);
  const flip = BY_SLUG.caliu;
  const fresh = newProducts.slice(0, 6);

  const main = `
<section class="hero hero--bold" aria-labelledby="hero-title">
  <div class="container hero__grid">
    <div class="hero__copy">
      <h1 class="hero__title" id="hero-title">Hi ha coses que costen de dir. <em>Per això hi ha tasses.</em></h1>
      <p class="hero__lead">Paraules i expressions catalanes per regalar: per dir t'estimo, per riure o per començar el dia amb un somriure.</p>
      <div class="hero__ctas">
        <a class="btn btn--light btn--lg" href="/tasses/">Regala una paraula ${icon('arrow')}</a>
        <a class="btn btn--outline-light btn--lg" href="#recomanador">Troba la tassa per a qui vulguis</a>
      </div>
      <ul class="hero__trust">
        <li>${SHOP ? `${icon('lock')} Pagament segur amb Stripe` : `${icon('instagram')} Comandes per Instagram`}</li>
        <li>${icon('truck')} ${SHIPPING_LINE}</li>
        <li>${icon('return')} 14 dies per desistir</li>
      </ul>
    </div>
    <div class="hero__stage" data-hero-words>
      <p class="hero__sticker" aria-label="${PRICE} amb enviament gratuït"><strong>${PRICE}</strong><span>enviament gratuït</span></p>
      ${words.map(heroWord).join('')}
      <button type="button" class="hero__pause" data-hero-pause aria-pressed="false" hidden>${icon('pause')}<span class="sr-only">Atura el canvi de paraules</span></button>
    </div>
  </div>
</section>

<section class="promo" aria-labelledby="promo-title">
  <div class="container promo__inner">
    <p class="promo__tag">Aquest Nadal</p>
    <h2 class="promo__title" id="promo-title">Regals amb paraula, <span>enviament gratuït</span></h2>
    <p class="promo__text">Tasses a ${PRICE} amb l'enviament inclòs, packs amb descompte i la tassa que tu mateix dissenyes.</p>
    <a class="btn btn--light" href="#packs">Veure els packs ${icon('arrow')}</a>
  </div>
</section>

<section class="section explain" aria-labelledby="explain-title">
  <div class="container explain__grid">
    <figure class="flip" data-flip>
      <div class="flip__stage">
        ${productImg(flip, 'front', { sizes: 'medium', cls: 'flip__img flip__img--front', alt: `Davant de la tassa: «${flip.intro} ${flip.name.toLowerCase()}»` })}
        ${productImg(flip, 'back', { sizes: 'medium', cls: 'flip__img flip__img--back', alt: `Darrere de la tassa: definició de «${flip.name.toLowerCase()}»` })}
      </div>
      <figcaption class="flip__bar">
        <span class="flip__label" data-flip-label>Davant: el missatge</span>
        <button type="button" class="btn btn--small" data-flip-toggle aria-pressed="false">Gira la tassa</button>
      </figcaption>
    </figure>
    <div>
      ${sectionHead('Què fa diferent una tassa d\'El Glopet', 'Una paraula, dues definicions.', '', { id: 'explain-title' })}
      <ol class="steps">
        <li><span class="steps__n">1</span><div><h3>Paraules catalanes que es mereixen una segona vida</h3><p>Caliu, aixopluc, bocamoll, llepafils… Paraules i expressions de sempre que diuen molt amb molt poc.</p></div></li>
        <li><span class="steps__n">2</span><div><h3>Una definició de diccionari i una amb personalitat</h3><p>La del diccionari, per si de cas. I una de nostra, pensada per a la persona que tindrà la tassa a les mans.</p></div></li>
        <li><span class="steps__n">3</span><div><h3>Un regal que explica alguna cosa sense haver de dir-la</h3><p>Per dir «tu ets el meu caliu» sense posar-te vermell. O per confessar, amb tota la calma, que ets un cagadubtes.</p></div></li>
      </ol>
    </div>
  </div>
</section>

<section class="section section--white" id="categories" aria-labelledby="cat-title">
  <div class="container">
    ${sectionHead('Categories', 'Quina paraula busques?', '', { id: 'cat-title' })}
    <div class="wordtiles">
      ${CATEGORIES.map((c) => `<a class="wordtile wordtile--${c.id}" href="${c.path}">
        <span class="wordtile__word" aria-hidden="true">${esc(c.word)}</span>
        <span class="wordtile__name">${esc(c.name)}</span>
        <span class="wordtile__text">${esc(c.text)}</span>
        <span class="wordtile__count">${c.products.length} tasses ${icon('arrow')}</span>
      </a>`).join('')}
    </div>
  </div>
</section>

<section class="section packs-section" id="packs" aria-labelledby="packs-title">
  <div class="container">
    ${sectionHead('Packs per regalar', 'Un regal, diverses paraules.', 'Hi ha persones que es mereixen més d\'una tassa.', { id: 'packs-title' })}
    <div class="packs">${site.packs.map(packCard).join('')}</div>
    <p class="packs__note">Els packs inclouen les tasses amb el color de portada i l'enviament gratuït.</p>
  </div>
</section>

${recommender()}

${offerProducts.length ? `<section class="section offers-band" aria-labelledby="offers-title">
  <div class="container">
    ${sectionHead('Ofertes', 'Tasses en oferta', `${offerProducts.length} paraules rebaixades fins a un ${Math.max(...offerProducts.map((p) => Math.round((1 - pricing.productPriceCents(p.slug) / site.unitPriceCents) * 100)))} %, amb l'enviament gratuït.`, { id: 'offers-title' })}
    <div class="rail" tabindex="0" role="region" aria-label="Tasses en oferta (llisca per veure'n més)">${offerProducts.map((p) => productCard(p)).join('')}</div>
    <p class="section-cta"><a class="btn btn--ghost btn--lg" href="/tasses/ofertes/">Veure totes les ofertes ${icon('arrow')}</a></p>
  </div>
</section>` : ''}

<section class="section section--white" aria-labelledby="new-title">
  <div class="container">
    ${sectionHead('Novetats', 'Acabades d\'arribar.', `Frases enginyoses, expressions de tota la vida i un tros de pa.`, { id: 'new-title' })}
    <div class="rail" tabindex="0" role="region" aria-label="Novetats (llisca per veure'n més)">${fresh.map((p) => productCard(p)).join('')}</div>
    <p class="section-cta"><a class="btn btn--ghost btn--lg" href="/tasses/">Veure les ${catalog.length} tasses ${icon('arrow')}</a></p>
  </div>
</section>

<section class="section" aria-labelledby="ideas-title">
  <div class="container narrow">
    ${sectionHead('Idees de regal', 'No saps què regalar?', 'Guies per encertar-la, amb paraules catalanes per a cada persona.', { id: 'ideas-title' })}
    <ul class="article-list">
      ${articles.map((a) => `<li class="article-card"><a href="/idees-de-regal/${a.slug}/"><img src="${a.image}" alt="" width="600" height="600" loading="lazy"><span><strong>${esc(a.title)}</strong><span>${esc(a.description)}</span></span></a></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="best-title" data-bestsellers hidden>
  <div class="container">
    ${sectionHead('Més venudes', 'Les que més s\'emporten.', 'Calculat a partir de les comandes pagades a la botiga.', { id: 'best-title' })}
    <div class="grid" data-bestsellers-grid></div>
  </div>
</section>
${catalog.map((p) => `<template data-card-template="${p.slug}">${productCard(p)}</template>`).join('')}

<section class="section" aria-labelledby="reviews-title">
  <div class="container">
    ${sectionHead('Opinions', 'El que en diuen.', '', { id: 'reviews-title' })}
    <div class="latest-reviews" data-latest-reviews>
      <div class="empty-note empty-note--invite">
        <p class="empty-note__title">Encara no hi ha opinions publicades.</p>
        <p>Si ja tens la teva tassa, ens encantarà saber què en penses. Pots deixar la teva opinió a la fitxa de la tassa: les llegim totes abans de publicar-les i no n'inventem cap.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section--white" aria-labelledby="faq-title">
  <div class="container narrow">
    ${sectionHead('Preguntes freqüents', 'Abans de comprar', '', { id: 'faq-title' })}
    <div class="faq">${FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
  </div>
</section>

<section class="section newsletter-band" aria-labelledby="nl-title">
  <div class="container newsletter-band__inner">
    <div>
      <p class="eyebrow eyebrow--light">Newsletter</p>
      <h2 class="section-title" id="nl-title">Paraules noves, abans que ningú.</h2>
      <p>Subscriu-te i descobreix les noves paraules, dissenys i novetats d'El Glopet.</p>
    </div>
    ${newsletterForm('inici', 'home')}
  </div>
</section>

${contactSection()}`;

  const jsonld = [
    {
      '@context': 'https://schema.org', '@type': 'Organization', name: site.brand, url: site.siteUrl + '/',
      logo: site.siteUrl + '/assets/brand/el-glopet-mark-512.png',
    },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: site.brand, url: site.siteUrl + '/', inLanguage: 'ca' },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ];

  return {
    path: '/',
    title: `Tasses amb paraules catalanes per regalar · ${site.brand}`,
    description: `Tasses originals amb paraules i expressions catalanes: regals en català per a parelles, amics, família o la feina. ${PRICE} amb enviament gratuït.`,
    jsonld,
    bodyClass: 'page-home',
    main,
  };
}

function listing({ path, title, h1, intro, products, crumbs, seoText, description }) {
  const chips = [{ path: '/tasses/', name: 'Totes' }, ...CATEGORIES.map((c) => ({ path: c.path, name: c.name })), ...(offerProducts.length ? [{ path: '/tasses/ofertes/', name: 'Ofertes' }] : [])];
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
    <p class="result-count">${products.length} ${products.length === 1 ? 'tassa' : 'tasses'} · ${PRICE} amb enviament gratuït</p>
    ${productGrid(products, { eagerFirst: true, headingLevel: 2 })}
    ${seoText ? `<div class="seo-text">${seoText}</div>` : ''}
  </div>
</section>`;
  return {
    path, title, description: description || metaDescription(intro, `Tasses a ${PRICE} amb enviament gratuït.`),
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
    title: `Totes les tasses amb paraules catalanes · ${site.brand}`,
    h1: 'Totes les tasses',
    description: `Totes les tasses amb paraules catalanes: d'amor, de caràcter, insults d'autor i frases amb humor. ${PRICE} amb enviament gratuït.`,
    intro: 'Tasses amb paraules catalanes per regalar: per dir t\'estimo, per riure\'s de les manies de cadascú, per desfogar-se amb insults d\'autor o per començar el dia amb humor.',
    products: catalog,
    crumbs: [{ name: 'Inici', path: '/' }, { name: 'Totes les tasses', path: '/tasses/' }],
  })];
  for (const c of CATEGORIES) {
    out.push(listing({
      path: c.path,
      title: `${c.name}: tasses per regalar · ${site.brand}`,
      h1: c.name,
      intro: c.text,
      seoText: c.seoText,
      products: c.products,
      crumbs: [{ name: 'Inici', path: '/' }, { name: 'Totes les tasses', path: '/tasses/' }, { name: c.name, path: c.path }],
    }));
  }
  if (offerProducts.length) {
    out.push(listing({
      path: '/tasses/ofertes/',
      title: `Tasses en oferta · ${site.brand}`,
      h1: 'Tasses en oferta',
      intro: 'Algunes paraules a preu d\'oferta, amb l\'enviament gratuït com sempre.',
      products: offerProducts,
      crumbs: [{ name: 'Inici', path: '/' }, { name: 'Totes les tasses', path: '/tasses/' }, { name: 'Ofertes', path: '/tasses/ofertes/' }],
    }));
  }
  return out;
}

module.exports = { home, catalogPages, contactSection };
