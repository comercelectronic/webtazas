const { site, esc, icon, PRICE } = require('./lib');
const { newsletterForm, breadcrumb } = require('./components');
const legal = require('./legal');

function simple({ path, title, description, h1, lead, body, noindex = false, crumbs }) {
  return {
    path, title, description, noindex,
    main: `<section class="page-hero">
  <div class="container narrow">
    ${crumbs ? breadcrumb(crumbs) : ''}
    <h1 class="page-title">${h1}</h1>
    ${lead ? `<p class="page-lead">${lead}</p>` : ''}
  </div>
</section>
<section class="section section--flush">
  <div class="container narrow">${body}</div>
</section>`,
  };
}

const newsletter = () => simple({
  path: '/newsletter/',
  title: `Newsletter · ${site.brand}`,
  description: `Subscriu-te a la newsletter de ${site.brand}: nous dissenys de tasses, ofertes i descomptes. Et pots donar de baixa quan vulguis.`,
  h1: 'La newsletter de Tassa de Mots',
  lead: "T'escriurem quan tinguem paraules noves, ofertes o descomptes. Sense spam i amb la baixa sempre a un clic.",
  crumbs: [{ name: 'Inici', path: '/' }, { name: 'Newsletter', path: '/newsletter/' }],
  body: `<div class="card-panel">
  ${newsletterForm('pagina-newsletter', 'page')}
</div>
<div class="prose">
  <h2>Com funciona</h2>
  <ol>
    <li>Escriu el teu correu i marca la casella de consentiment (no està marcada per defecte).</li>
    <li>T'enviarem un correu: obre'l i confirma la subscripció. Si no ho fas, no rebràs res i esborrarem la sol·licitud en 7 dies.</li>
    <li>Cada correu porta un enllaç per donar-te de baixa amb un clic.</li>
  </ol>
  <p>Subscriure't és voluntari i no té res a veure amb comprar.</p>
</div>`,
});

const nlAction = (kind) => {
  const confirm = kind === 'confirm';
  return simple({
    path: confirm ? '/newsletter/confirmar/' : '/newsletter/baixa/',
    title: `${confirm ? 'Confirma la subscripció' : 'Baixa de la newsletter'} · ${site.brand}`,
    description: confirm ? 'Confirma la teva subscripció a la newsletter.' : 'Dona\'t de baixa de la newsletter.',
    h1: confirm ? 'Confirma la teva subscripció' : 'Donar-me de baixa',
    lead: confirm
      ? 'Prem el botó per començar a rebre la newsletter.'
      : 'Prem el botó i no et tornarem a escriure. Esborrarem la teva adreça.',
    noindex: true,
    body: `<div class="card-panel center" data-nl-action="${confirm ? 'confirm' : 'unsubscribe'}">
  <button type="button" class="btn btn--primary btn--lg" data-nl-action-btn>${confirm ? 'Confirmo la subscripció' : 'Dona\'m de baixa'}</button>
  <p class="form-status" role="status" aria-live="polite" data-form-status></p>
</div>`,
  });
};

const thanks = () => simple({
  path: '/gracies/',
  title: `Gràcies per la compra · ${site.brand}`,
  description: 'Hem rebut la teva comanda.',
  noindex: true,
  h1: 'Gràcies, ja és teva!',
  lead: "El pagament s'ha completat i hem rebut la teva comanda.",
  body: `<div class="card-panel center" data-order-complete>
  <p>Quan rebis la tassa, ens agradarà saber què en penses: pots deixar-ne una valoració a la seva fitxa.</p>
  <p><a class="btn btn--primary" href="/tasses/">Torna a la botiga</a></p>
</div>
<div class="card-panel">
  <h2 class="h3">Vols saber quan traiem paraules noves?</h2>
  ${newsletterForm('gracies', 'thanks')}
</div>`,
});

const contactSent = () => simple({
  path: '/contacte-enviat/',
  title: `Missatge enviat · ${site.brand}`,
  description: 'Hem rebut el teu missatge.',
  noindex: true,
  h1: 'Hem rebut el teu missatge',
  lead: 'Et respondrem per correu electrònic tan aviat com puguem.',
  body: `<p class="center"><a class="btn btn--primary" href="/">Torna a l'inici</a></p>`,
});

const notFound = () => simple({
  path: '/404.html',
  title: `Pàgina no trobada · ${site.brand}`,
  description: 'Aquesta pàgina no existeix.',
  noindex: true,
  h1: 'Aquesta paraula no és al diccionari',
  lead: "La pàgina que busques no existeix o ha canviat d'adreça.",
  body: `<p class="center"><a class="btn btn--primary" href="/tasses/">Veure totes les tasses</a> <a class="btn btn--ghost" href="/">Inici</a></p>`,
});

function legalPages() {
  return Object.entries(legal.pages).map(([slug, pg]) => simple({
    path: `/${slug}/`,
    title: `${pg.title} · ${site.brand}`,
    description: pg.description,
    h1: esc(pg.title),
    lead: `Darrera actualització: ${legal.updated}`,
    crumbs: [{ name: 'Inici', path: '/' }, { name: pg.title, path: `/${slug}/` }],
    body: `<div class="prose legal">${pg.body()}</div>`,
  }));
}

function admin() {
  return {
    path: '/admin/',
    title: `Administració · ${site.brand}`,
    description: 'Administració de la botiga.',
    noindex: true,
    bodyClass: 'page-admin',
    adminScript: true,
    main: `<section class="section">
  <div class="container">
    <h1 class="page-title">Administració</h1>
    <form class="card-panel admin-login" data-admin-login>
      <label for="admin-pass">Contrasenya</label>
      <div class="nl-form__row">
        <input class="input" id="admin-pass" type="password" autocomplete="current-password" required>
        <button class="btn btn--primary" type="submit">Entra</button>
      </div>
      <p class="form-status" role="status" data-form-status></p>
    </form>
    <div class="admin" data-admin hidden>
      <div class="tabs" role="tablist">
        <button role="tab" class="tabs__tab" aria-selected="true" data-tab="reviews">Valoracions <span class="badge" data-pending-count></span></button>
        <button role="tab" class="tabs__tab" aria-selected="false" data-tab="newsletter">Newsletter</button>
        <button role="tab" class="tabs__tab" aria-selected="false" data-tab="stock">Estoc i vendes</button>
        <button type="button" class="btn btn--small btn--ghost tabs__logout" data-admin-logout>Surt</button>
      </div>
      <div class="tab-panel" data-panel="reviews"></div>
      <div class="tab-panel" data-panel="newsletter" hidden></div>
      <div class="tab-panel" data-panel="stock" hidden></div>
    </div>
  </div>
</section>`,
  };
}

module.exports = { newsletter, nlAction, thanks, contactSent, notFound, legalPages, admin, PRICE, icon };
