// Pàgina «Crea la teva tassa»: configurador amb vista prèvia en directe.
// Les dades (estructures, paraules i dibuixos) surten de data/configurator.json,
// el mateix fitxer amb què el servidor valida el disseny abans de cobrar-lo.
const { site, esc, euro, icon, pricing, SHIPPING_LINE, SHOP, IG_DM, COLORS_AVAILABLE } = require('./lib');

// Color inicial: el blau si en queda; si no, el primer disponible.
const MK_DEFAULT = (COLORS_AVAILABLE.find((c) => c.id === 'blau') || COLORS_AVAILABLE[0] || {}).id;
const { breadcrumb, breadcrumbLd } = require('./components');

const cfg = pricing.configurator;

function configurator() {
  const price = euro(pricing.customPriceCents());
  const data = {
    limits: cfg.limits,
    structures: cfg.structures,
    lists: cfg.lists,
    drawings: cfg.drawings,
    emojis: cfg.emojis || [],
    colors: COLORS_AVAILABLE,
    priceCents: pricing.customPriceCents(),
  };
  const crumbs = [{ name: 'Inici', path: '/' }, { name: 'Crea la teva tassa', path: '/crea-la-teva-tassa/' }];
  const L = cfg.limits;

  const main = `
<section class="page-hero page-hero--tight">
  <div class="container">
    ${breadcrumb(crumbs)}
    <h1 class="page-title">Crea la teva tassa</h1>
    <p class="page-lead">Tria una estructura, una paraula catalana (o escriu la teva), un dibuix i el color. La veuràs en directe abans de comprar-la. ${price}, ${SHIPPING_LINE.toLowerCase()}.</p>
  </div>
</section>

<section class="section section--flush">
  <div class="container maker" data-maker>
    <div class="maker__preview">
      <div class="maker__stage" aria-live="polite">
        <div class="mug-photo" data-mug>
          <img class="mug-photo__img" data-mug-photo src="/images/tassa-en-blanc/${MK_DEFAULT}.jpg" alt="" width="1200" height="1200">
          <svg class="mug-photo__print" viewBox="0 0 760 760" role="img" aria-labelledby="mug-title">
            <title id="mug-title" data-mug-title>Vista prèvia de la tassa</title>
            <defs>
              <path id="arc-intro" data-arc="intro" d=""/>
              <path id="arc-word" data-arc="word" d=""/>
              <path id="arc-sub" data-arc="sub" d=""/>
              <path id="arc-bword" data-arc="bword" d=""/>
              <!-- La tassa és un cilindre: el que queda cap als costats es veu més apagat. -->
              <linearGradient id="wrap-front" gradientUnits="userSpaceOnUse" x1="79" x2="479" y1="0" y2="0">
                <stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".22" stop-color="#fff"/><stop offset=".78" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".6"/>
              </linearGradient>
              <linearGradient id="wrap-back" gradientUnits="userSpaceOnUse" x1="281" x2="681" y1="0" y2="0">
                <stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".22" stop-color="#fff"/><stop offset=".78" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".6"/>
              </linearGradient>
              <mask id="mask-front" maskUnits="userSpaceOnUse" x="0" y="0" width="760" height="760"><rect x="79" y="0" width="400" height="760" fill="url(#wrap-front)"/></mask>
              <mask id="mask-back" maskUnits="userSpaceOnUse" x="0" y="0" width="760" height="760"><rect x="281" y="0" width="400" height="760" fill="url(#wrap-back)"/></mask>
            </defs>
            <g data-mug-front mask="url(#mask-front)">
              <use data-mug-drawing href="/assets/drawings.svg#d-paraigua" x="229" y="250" width="100" height="100"/>
              <text data-mug-emoji class="mug-svg__emoji" x="279" y="330" text-anchor="middle" style="display:none"></text>
              <text data-mug-intro text-anchor="middle" class="mug-svg__intro"><textPath href="#arc-intro" startOffset="50%">Tu ets el meu</textPath></text>
              <text data-mug-word text-anchor="middle" class="mug-svg__word"><textPath href="#arc-word" startOffset="50%">aixopluc</textPath></text>
              <text data-mug-sub text-anchor="middle" class="mug-svg__sub"><textPath href="#arc-sub" startOffset="50%"></textPath></text>
            </g>
            <g data-mug-back mask="url(#mask-back)" style="display:none">
              <use data-mug-bdrawing href="/assets/drawings.svg#d-paraigua" x="456" y="262" width="50" height="50"/>
              <text data-mug-bemoji class="mug-svg__emoji" x="481" y="306" text-anchor="middle" font-size="40" style="display:none"></text>
              <text data-mug-back-word class="mug-svg__bword"><textPath href="#arc-bword" startOffset="3%">aixopluc</textPath></text>
              <path data-mug-back-rule d="" fill="none" stroke="#B66F54" stroke-width="1.5"/>
              <g data-mug-back-lines></g>
            </g>
          </svg>
        </div>
      </div>
      <div class="maker__views" role="group" aria-label="Cara de la tassa">
        <button type="button" class="maker__view" aria-pressed="true" data-mug-view="front">Davant</button>
        <button type="button" class="maker__view" aria-pressed="false" data-mug-view="back">Darrere</button>
      </div>
      <p class="maker__note">La vista prèvia és orientativa: abans d'imprimir revisem cada disseny perquè quedi ben centrat.</p>
    </div>

    <form class="maker__form" data-maker-form novalidate>
      <fieldset class="maker__step">
        <legend><span class="maker__n">1</span> Estructura</legend>
        <div class="maker__structures">
          ${cfg.structures.map((s, i) => `<label class="choice">
            <input type="radio" name="structure" value="${s.id}"${i === 0 ? ' checked' : ''}>
            <span class="choice__body"><strong>${esc(s.label)}</strong><span>${esc(s.help)}</span></span>
          </label>`).join('')}
        </div>
      </fieldset>

      <fieldset class="maker__step">
        <legend><span class="maker__n">2</span> La paraula</legend>
        <div class="field" data-intro-field hidden>
          <label for="mk-intro">Frase petita (a dalt)</label>
          <input class="input" id="mk-intro" name="intro" maxlength="${L.intro}" autocomplete="off">
        </div>
        <div class="maker__gender" role="group" aria-label="Gènere" data-gender-group>
          <button type="button" class="pill" aria-pressed="true" data-gender="m">el meu / un</button>
          <button type="button" class="pill" aria-pressed="false" data-gender="f">la meva / una</button>
        </div>
        <div class="field">
          <label for="mk-word" data-word-label>Paraula</label>
          <input class="input" id="mk-word" name="word" maxlength="${L.word}" autocomplete="off" required value="aixopluc">
          <p class="field__hint"><span data-word-count>8</span>/${L.word} caràcters. Tria'n una de la llista o escriu la teva.</p>
        </div>
        <div class="maker__words" data-words-wrap>
          <label class="sr-only" for="mk-search">Cerca una paraula</label>
          <input class="input input--small" id="mk-search" type="search" placeholder="Cerca entre ${Object.values(cfg.lists).reduce((n, l) => n + l.words.length, 0)} paraules…" data-word-search>
          <div class="maker__wordlist" data-word-list role="listbox" aria-label="Paraules catalanes"></div>
        </div>
        <div class="field" data-sub-field hidden>
          <label for="mk-sub">Frase de sota (opcional)</label>
          <input class="input" id="mk-sub" name="sub" maxlength="${L.sub}" autocomplete="off" placeholder="p. ex. primer ho faig, després ho penso">
        </div>
        <div class="maker__emojis">
          <p class="maker__label" id="emoji-help">Emoticones <small>Fes clic al text on la vulguis i tria-la.</small></p>
          <div class="emoji-row" role="group" aria-labelledby="emoji-help">
            ${(cfg.emojis || []).map((e) => `<button type="button" class="emoji-btn" data-emoji="${esc(e)}" aria-label="Afegeix ${esc(e)} al text">${esc(e)}</button>`).join('')}
          </div>
        </div>
      </fieldset>

      <fieldset class="maker__step">
        <legend><span class="maker__n">3</span> Darrere: la definició <small>(opcional)</small></legend>
        <div class="field">
          <label for="mk-def1">1. Definició de diccionari</label>
          <textarea class="input" id="mk-def1" name="def1" rows="2" maxlength="${L.def}"></textarea>
        </div>
        <div class="field">
          <label for="mk-def2">2. La teva definició</label>
          <textarea class="input" id="mk-def2" name="def2" rows="2" maxlength="${L.def}" placeholder="p. ex. Persona amb qui et sents a recer, passi el que passi."></textarea>
        </div>
      </fieldset>

      <fieldset class="maker__step">
        <legend><span class="maker__n">4</span> El dibuix</legend>
        <div class="maker__drawings">
          <label class="drawing"><input type="radio" name="drawing" value=""><span class="drawing__box drawing__box--none">Sense dibuix</span></label>
          ${cfg.drawings.map((d) => `<label class="drawing" title="${esc(d.label)}">
            <input type="radio" name="drawing" value="${d.id}"${d.id === 'paraigua' ? ' checked' : ''}>
            <span class="drawing__box"><svg aria-hidden="true" width="44" height="44"><use href="/assets/drawings.svg#d-${d.id}"/></svg><span class="sr-only">${esc(d.label)}</span></span>
          </label>`).join('')}
        </div>
        <p class="maker__label">O una emoticona gran</p>
        <div class="maker__drawings maker__drawings--emoji">
          ${(cfg.emojis || []).map((e) => `<label class="drawing">
            <input type="radio" name="drawing" value="${esc(e)}">
            <span class="drawing__box drawing__box--emoji" aria-hidden="true">${esc(e)}</span><span class="sr-only">Emoticona ${esc(e)}</span>
          </label>`).join('')}
        </div>
      </fieldset>

      <fieldset class="maker__step">
        <legend><span class="maker__n">5</span> Color de l'interior i la nansa</legend>
        <div class="colors__row">
          ${COLORS_AVAILABLE.map((c) => `<label class="swatch" title="${esc(c.name)}">
            <input type="radio" name="color" value="${c.id}"${c.id === MK_DEFAULT ? ' checked' : ''}>
            <span class="swatch__dot dot--${c.id}"></span><span class="sr-only">${esc(c.name)}</span>
          </label>`).join('')}
        </div>
      </fieldset>

      <div class="maker__buy">
        <p class="maker__price"><span class="price price--lg">${price}</span><span>${esc(SHIPPING_LINE)}</span></p>
        ${SHOP ? `<div class="buybox__actions">
          <div class="qty">
            <button type="button" class="qty__btn" data-mk-step="-1" aria-label="Una unitat menys">${icon('minus')}</button>
            <label class="sr-only" for="mk-qty">Quantitat</label>
            <input class="qty__input" id="mk-qty" type="number" inputmode="numeric" min="1" max="${site.maxQtyPerItem}" value="1" data-mk-qty>
            <button type="button" class="qty__btn" data-mk-step="1" aria-label="Una unitat més">${icon('plus')}</button>
          </div>
          <button type="submit" class="btn btn--primary btn--lg btn--grow">Afegeix la meva tassa a la cistella</button>
        </div>` : `<div class="buybox__actions">
          <button type="submit" class="btn btn--primary btn--lg btn--grow" data-ig-submit="${IG_DM}">${icon('instagram')}<span>Demana-la per Instagram</span></button>
        </div>
        <p class="ig-note">S'obrirà un missatge directe a Instagram. Copiem el disseny (frase, dibuix i color) perquè només l'hagis d'enganxar.</p>`}
        <p class="form-status" role="status" aria-live="polite" data-maker-status></p>
        <p class="form-note">${site.customReturns ? '<strong>Devolució en 14 dies</strong>, també per a les tasses personalitzades, i <strong>3 anys de garantia legal</strong>.' : '<strong>Abans de comprar:</strong> com que la tassa es fa a mida amb el teu disseny, no té dret de desistiment (art. 103.c del TRLGDCU). Sí que té la garantia legal de 3 anys si arriba trencada o amb defectes.'} No imprimim textos ofensius ni marques registrades: si el disseny no es pot imprimir tal com és, t'escriurem abans de fer-lo.${SHOP ? ' <a href="/condicions-venda/#personalitzades">Condicions de venda</a>.' : ''}</p>
      </div>
    </form>
  </div>
</section>
<script type="application/json" id="maker-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

  return {
    path: '/crea-la-teva-tassa/',
    title: `Crea la teva tassa personalitzada en català · ${site.brand}`,
    description: `Dissenya la teva tassa amb paraules catalanes: tria l'estructura, la paraula, el dibuix i el color. ${price} amb enviament gratuït.`,
    jsonld: [breadcrumbLd(crumbs)],
    bodyClass: 'page-maker',
    pageScript: 'configurator.js',
    main,
  };
}

module.exports = { configurator };
