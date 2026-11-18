const { site, catalog, BY_SLUG, CATEGORY_BY_ID, esc, euro, PRICE, SHIPPING, SHIPPING_LINE, FREE_SHIPPING, DELIVERY, icon, productUrl, productImg, priceHtml, pricing, offerBadge } = require('./lib');
const { productGrid, sectionHead, trustList, breadcrumb, breadcrumbLd } = require('./components');

function relatedFor(p) {
  const list = p.related.map((s) => BY_SLUG[s]);
  for (const other of catalog) {
    if (list.length >= 4) break;
    if (other.slug !== p.slug && other.category === p.category && !list.includes(other)) list.push(other);
  }
  for (const other of catalog) {
    if (list.length >= 4) break;
    if (other.slug !== p.slug && !list.includes(other)) list.push(other);
  }
  return list.slice(0, 4);
}

function definition(p) {
  if (!p.def1) {
    return `<div class="dictionary">${p.description.map((d) => `<p>${esc(d)}</p>`).join('')}</div>`;
  }
  return `<div class="dictionary" aria-label="Definició de ${esc(p.name.toLowerCase())}">
  <p class="dictionary__head"><span class="dictionary__word">${esc(p.name.toLowerCase())}</span> <span class="dictionary__ipa">${esc(p.phonetic)}</span></p>
  <ol class="dictionary__defs"><li>${esc(p.def1)}</li><li>${esc(p.def2)}</li></ol>
</div>`;
}

function colorPicker(p) {
  if (!(p.colors || []).length) return '';
  const COLORS = Object.fromEntries(site.colors.map((c) => [c.id, c]));
  return `<fieldset class="colors" data-color-picker>
  <legend>Color de l'interior i la nansa: <strong data-color-name>${esc(COLORS[p.defaultColor].name)}</strong></legend>
  <div class="colors__row">
    ${p.colors.map((c) => `<label class="swatch" title="${esc(COLORS[c].name)}">
      <input type="radio" name="color" value="${c}" data-color-input data-name="${esc(COLORS[c].name)}" data-front="/images/tasses/${p.slug}/${c}-front.jpg" ${p.images.back ? ` data-back="/images/tasses/${p.slug}/${c}-back.jpg"` : ''}${c === p.defaultColor ? ' checked' : ''}>
      <span class="swatch__dot dot--${c}"></span><span class="sr-only">${esc(COLORS[c].name)}${c === p.defaultColor ? ' (el que millor hi combina)' : ''}</span>
    </label>`).join('')}
  </div>
  <p class="colors__hint">El color de la portada és el que millor combina amb el dibuix.</p>
</fieldset>`;
}

function specs() {
  const known = site.productSpecs.filter((s) => s.value);
  return known.length ? `<dl class="specs">${known.map((s) => `<div><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`).join('')}</dl>` : '';
}

function reviewForm(p) {
  return `<form class="form review-form" data-review-form data-slug="${p.slug}" novalidate>
  <h3 class="review-form__title">Escriu una valoració</h3>
  <fieldset class="stars-input">
    <legend>Puntuació</legend>
    <div class="stars-input__row">
    ${[5, 4, 3, 2, 1].map((n) => `<input type="radio" id="r-${n}" name="rating" value="${n}" required><label for="r-${n}" title="${n} de 5">${icon('star', 'icon--fill')}<span class="sr-only">${n} ${n === 1 ? 'estrella' : 'estrelles'}</span></label>`).join('')}
    </div>
  </fieldset>
  <div class="field"><label for="rv-name">Nom o pseudònim</label><input class="input" id="rv-name" name="name" required minlength="2" maxlength="40" autocomplete="nickname"></div>
  <div class="field"><label for="rv-comment">Comentari</label><textarea class="input" id="rv-comment" name="comment" rows="4" required minlength="10" maxlength="1000"></textarea></div>
  <div class="hp" aria-hidden="true"><label>No omplis aquest camp <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
  <p class="form-note">Revisem totes les valoracions abans de publicar-les. Només es publiquen el nom o pseudònim, la puntuació, el comentari i la data. No s'hi poden posar enllaços ni dades de contacte. Més informació a les <a href="/avis-legal/">normes de valoració</a> i a la <a href="/privacitat/">política de privacitat</a>.</p>
  <button class="btn btn--primary" type="submit">Envia la valoració</button>
  <p class="form-status" role="status" aria-live="polite" data-form-status></p>
</form>`;
}

function product(p) {
  const cat = CATEGORY_BY_ID[p.category];
  const crumbs = [
    { name: 'Inici', path: '/' },
    { name: cat.name, path: cat.path },
    { name: p.name, path: productUrl(p) },
  ];
  const combo = BY_SLUG[p.related[0]];
  const related = relatedFor(p);
  const views = ['Davant', 'Darrere'];
  const hasBack = !!p.images.back;
  const title = p.intro ? `${p.intro} ${p.name.toLowerCase()}` : p.name;

  const main = `
<div class="container">${breadcrumb(crumbs)}</div>
<section class="product container">
  <div class="gallery" data-gallery>
    <div class="gallery__track" data-gallery-track tabindex="0" role="region" aria-label="Fotos de la tassa (llisca per veure-les totes)">
      <figure class="gallery__slide">${productImg(p, 'front', { eager: true, cls: 'gallery__img', sizes: 'gallery' })}<figcaption class="gallery__label">${views[0]}</figcaption></figure>
      ${hasBack ? `<figure class="gallery__slide">${productImg(p, 'back', { cls: 'gallery__img', sizes: 'gallery' })}<figcaption class="gallery__label">${views[1]}</figcaption></figure>` : ''}
    </div>
    ${hasBack ? `<div class="gallery__thumbs" role="group" aria-label="Tria la foto">
      <button type="button" class="gallery__thumb is-active" aria-pressed="true" data-slide="0">${productImg(p, 'front', { alt: '', sizes: 'thumb' })}<span>${views[0]}</span></button>
      <button type="button" class="gallery__thumb" aria-pressed="false" data-slide="1">${productImg(p, 'back', { alt: '', sizes: 'thumb' })}<span>${views[1]}</span></button>
    </div>` : ''}
  </div>

  <div class="buybox" data-product-page="${p.slug}">
    <a class="chip chip--${p.category}" href="${cat.path}">${esc(cat.singular)}</a>
    ${p.intro ? `<p class="buybox__intro">${esc(p.intro)}</p>` : ''}
    <h1 class="buybox__title">${esc(p.name)}</h1>
    ${p.tagline ? `<p class="buybox__tagline">${esc(p.tagline)}</p>` : ''}
    <a class="rating-summary" href="#valoracions" data-rating-summary>Encara no té valoracions</a>
    <p class="buybox__price">${pricing.hasOffer(p.slug) ? `<span class="badge-offer">${offerBadge(p.slug)}</span>` : ''}${priceHtml(p.slug, { large: true })}<span class="buybox__ship">${FREE_SHIPPING ? 'Enviament gratuït inclòs' : `+ ${SHIPPING} d'enviament per comanda`}</span></p>
    ${colorPicker(p)}
    ${definition(p)}
    <p class="stock-note" data-stock-note hidden></p>
    <div class="buybox__actions" data-main-actions>
      <div class="qty" data-qty>
        <button type="button" class="qty__btn" data-qty-step="-1" aria-label="Una unitat menys">${icon('minus')}</button>
        <label class="sr-only" for="qty">Quantitat</label>
        <input class="qty__input" id="qty" type="number" inputmode="numeric" min="1" max="${site.maxQtyPerItem}" value="1" data-qty-input>
        <button type="button" class="qty__btn" data-qty-step="1" aria-label="Una unitat més">${icon('plus')}</button>
      </div>
      <button type="button" class="btn btn--primary btn--lg btn--grow" data-add="${p.slug}" data-with-qty>Afegeix a la cistella</button>
    </div>
    ${trustList()}
    ${combo ? `<div class="combo">
      <a class="combo__img" href="${productUrl(combo)}" tabindex="-1" aria-hidden="true">${productImg(combo, 'front', { alt: '' })}</a>
      <div class="combo__body">
        <p class="combo__title">Combina-la amb <a href="${productUrl(combo)}">${esc(combo.name)}</a></p>
        <p class="combo__text">Les dues per ${euro(pricing.productPriceCents(p.slug) + pricing.productPriceCents(combo.slug))}</p>
      </div>
      <button type="button" class="btn btn--small btn--ghost" data-add-both="${p.slug},${combo.slug}">Afegeix les dues</button>
    </div>` : ''}
    <div class="details">
      <details open>
        <summary>Característiques</summary>
        ${specs()}
        <p>${p.sides === 1 ? 'Missatge i il·lustració originals d\'El Glopet.' : 'Disseny imprès al davant i al darrere de la tassa: el missatge i la definició.'}</p>
      </details>
      <details>
        <summary>Enviament</summary>
        <p>${FREE_SHIPPING ? 'Gratuït, sigui quin sigui el nombre de tasses.' : `${SHIPPING} per comanda, sigui quin sigui el nombre de tasses.`} Termini estimat: ${DELIVERY}. Enviem a ${esc(site.shipping.countriesLabel)}.</p>
      </details>
      <details>
        <summary>Devolucions i garantia</summary>
        <p>Tens 14 dies naturals des que reps la comanda per desistir de la compra. Garantia legal de 3 anys. <a href="/enviaments-i-devolucions/">Com fer una devolució</a>.</p>
      </details>
    </div>
  </div>
</section>

<section class="section section--tint" id="valoracions" aria-labelledby="rv-title">
  <div class="container reviews">
    <div>
      <h2 class="section-title" id="rv-title">Valoracions</h2>
      <div data-reviews-summary><p class="empty-note">Aquesta tassa encara no té valoracions. Si ja la tens, pots ser la primera persona a opinar.</p></div>
      <div class="review-list" data-reviews-list></div>
    </div>
    ${reviewForm(p)}
  </div>
</section>

<section class="section" aria-labelledby="related-title">
  <div class="container">
    ${sectionHead('', 'També et pot agradar', '', { id: 'related-title' })}
    ${productGrid(related)}
  </div>
</section>

<div class="sticky-buy" data-sticky-buy hidden>
  <div class="sticky-buy__info"><span class="sticky-buy__name">${esc(p.name)}</span>${priceHtml(p.slug)}</div>
  <button type="button" class="btn btn--primary" data-add="${p.slug}" data-with-qty>Afegeix a la cistella</button>
</div>`;

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Tassa «${title}»`,
    description: p.metaDescription,
    sku: p.slug,
    image: [p.images.front, p.images.back].filter(Boolean).map((i) => site.siteUrl + i),
    brand: { '@type': 'Brand', name: site.brand },
    category: cat.name,
    offers: {
      '@type': 'Offer',
      url: site.siteUrl + productUrl(p),
      priceCurrency: site.currency,
      price: (pricing.productPriceCents(p.slug) / 100).toFixed(2),
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: (site.shipping.costCents / 100).toFixed(2), currency: site.currency },
        shippingDestination: site.shipping.countries.map((c) => ({ '@type': 'DefinedRegion', addressCountry: c })),
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          transitTime: { '@type': 'QuantitativeValue', minValue: site.shipping.minBusinessDays, maxValue: site.shipping.maxBusinessDays, unitCode: 'DAY' },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: site.shipping.countries,
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
      },
    },
  };

  return {
    path: productUrl(p),
    title: `Tassa «${title}» · ${site.brand}`,
    description: `${p.metaDescription} ${euro(pricing.productPriceCents(p.slug))}, enviament gratuït.`,
    ogImage: p.images.front,
    jsonld: [productLd, breadcrumbLd(crumbs)],
    bodyClass: 'page-product',
    main,
  };
}

module.exports = { product };
