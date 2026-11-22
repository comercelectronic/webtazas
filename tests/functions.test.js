// Proves de les Netlify Functions amb dobles en memòria de Netlify Blobs,
// Stripe i l'API de Resend. Execució: `npm test`.
const test = require('node:test');
const assert = require('node:assert');
const Module = require('module');

// ---------- Dobles ----------
const stores = new Map();
function fakeStore(name) {
  if (!stores.has(name)) stores.set(name, new Map());
  const data = stores.get(name);
  return {
    async get(k, opts) { if (!data.has(k)) return null; const v = data.get(k); return opts && opts.type === 'json' ? JSON.parse(v) : v; },
    async set(k, v) { data.set(k, String(v)); },
    async setJSON(k, v) { data.set(k, JSON.stringify(v)); },
    async delete(k) { data.delete(k); },
    async list({ prefix = '' } = {}) { return { blobs: [...data.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })) }; },
  };
}
let stripeSessions = [];
let stripeEvent = null;
const origLoad = Module._load;
Module._load = function (req, ...rest) {
  if (req === '@netlify/blobs') return { connectLambda() {}, getStore: (o) => fakeStore(typeof o === 'string' ? o : o.name) };
  if (req === 'stripe') {
    return () => ({
      checkout: { sessions: { create: async (s) => { stripeSessions.push(s); return { url: 'https://checkout.stripe.test/s' }; } } },
      webhooks: { constructEvent: () => stripeEvent },
    });
  }
  return origLoad.call(this, req, ...rest);
};
const sentEmails = [];
global.fetch = async (url, opts) => {
  const body = JSON.parse(opts.body);
  (Array.isArray(body) ? body : [body]).forEach((m) => sentEmails.push({ url, ...m }));
  return { ok: true, json: async () => ({ id: 'x' }), text: async () => '' };
};

process.env.STRIPE_SECRET_KEY = 'sk_test_x';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_x';
process.env.ADMIN_PASSWORD = 'secret';
process.env.SITE_URL = 'https://botiga.test';

const fn = (name) => require(`../netlify/functions/${name}.js`).handler;
let ipCounter = 0;
const ev = (method, body, { query, headers, ip } = {}) => ({
  httpMethod: method,
  body: body === undefined ? '' : JSON.stringify(body),
  queryStringParameters: query || {},
  headers: { 'x-nf-client-connection-ip': ip || `10.0.0.${++ipCounter}`, ...(headers || {}) },
});
const parse = (res) => JSON.parse(res.body);
const admin = { 'x-admin-password': 'secret' };
const site = require('../data/site.json');
// Les proves de pagament es fan en mode botiga; el mode aparador es prova a part.
const SITE_MODE = site.mode;
site.mode = 'botiga';

// ---------- Pagament ----------
test('checkout: cobra el preu de data/site.json, amb enviament gratuït, i agrupa per tassa i color', async () => {
  stores.clear(); stripeSessions = [];
  const items = [
    { type: 'mug', id: 'aixopluc', color: 'blau', qty: 2 },
    { type: 'mug', id: 'aixopluc', color: 'blau', qty: 1 },
    { type: 'mug', id: 'aixopluc', color: 'groc', qty: 1 },
    { id: 'niu', qty: 1 },
  ];
  const res = await fn('create-checkout-session')(ev('POST', { items }));
  assert.strictEqual(res.statusCode, 200);
  const s = stripeSessions[0];
  assert.strictEqual(site.unitPriceCents, 1195);
  assert.deepStrictEqual(s.line_items.map((l) => [l.quantity, l.price_data.unit_amount]), [[3, 1195], [1, 1195], [1, 1195]]);
  assert.match(s.line_items[0].price_data.product_data.name, /aixopluc» · blau$/);
  assert.match(s.line_items[2].price_data.product_data.name, /niu» · blau$/, 'sense color, el de portada');
  assert.strictEqual(s.shipping_options[0].shipping_rate_data.fixed_amount.amount, 0);
  assert.strictEqual(s.shipping_options[0].shipping_rate_data.display_name, 'Enviament gratuït');
  assert.strictEqual(s.metadata.items, 'm:aixopluc:blau:3,m:aixopluc:groc:1,m:niu:blau:1');
  assert.match(s.success_url, /^https:\/\/botiga\.test\/gracies\//);
});

test('checkout: ofertes i packs es cobren al preu del servidor', async () => {
  stores.clear(); stripeSessions = [];
  const res = await fn('create-checkout-session')(ev('POST', { items: [
    { type: 'mug', id: 'cuca-de-llum', color: 'verd', qty: 1, price: 1 },
    { type: 'pack', id: 'casa', qty: 2 },
  ] }));
  assert.strictEqual(res.statusCode, 200);
  const [mug, pack] = stripeSessions[0].line_items;
  assert.strictEqual(mug.price_data.unit_amount, site.offers.items['cuca-de-llum']);
  assert.strictEqual(pack.quantity, 2);
  assert.strictEqual(pack.price_data.unit_amount, site.packs.find((p) => p.id === 'casa').priceCents);
  assert.ok(pack.price_data.unit_amount < 3 * site.unitPriceCents, 'el pack surt més barat');
  assert.strictEqual(stripeSessions[0].metadata.items, 'm:cuca-de-llum:verd:1,p:casa:2');
  // un color que no existeix es canvia pel de portada
  stripeSessions = [];
  await fn('create-checkout-session')(ev('POST', { items: [{ type: 'mug', id: 'caliu', color: 'lila', qty: 1 }] }));
  assert.strictEqual(stripeSessions[0].metadata.items, 'm:caliu:taronja:1');
});

test('checkout: tassa personalitzada validada al servidor', async () => {
  stores.clear(); stripeSessions = [];
  const design = { structure: 'caracter', intro: 'Sóc un', word: 'garrepa', sub: 'avui convides tu, oi?', def1: 'Persona que no vol gastar ni un cèntim.', def2: '', drawing: 'regal', color: 'verd' };
  const res = await fn('create-checkout-session')(ev('POST', { items: [{ type: 'custom', design, qty: 2 }] }));
  assert.strictEqual(res.statusCode, 200);
  const l = stripeSessions[0].line_items[0];
  assert.deepStrictEqual([l.quantity, l.price_data.unit_amount], [2, site.customPriceCents]);
  assert.match(l.price_data.product_data.name, /Sóc un garrepa/);
  assert.match(l.price_data.product_data.description, /dibuix: regal · darrere: 1\. Persona/);
  assert.strictEqual(stripeSessions[0].metadata.items, 'c:1:2');
  assert.strictEqual(JSON.parse(stripeSessions[0].metadata.personalitzada_1).word, 'garrepa');

  const bad = (d) => fn('create-checkout-session')(ev('POST', { items: [{ type: 'custom', design: { ...design, ...d }, qty: 1 }] }));
  assert.strictEqual((await bad({ word: '' })).statusCode, 400);
  assert.strictEqual((await bad({ structure: 'inventada' })).statusCode, 400);
  assert.strictEqual((await bad({ word: 'visita www.spam.com' })).statusCode, 400);
  assert.strictEqual((await bad({ word: 'subnormal' })).statusCode, 400);
  assert.strictEqual((await bad({ word: '<script>' })).statusCode, 400);
  // camps llargs es retallen i dibuixos desconeguts es descarten
  stripeSessions = [];
  await bad({ word: 'paraula llarga '.repeat(20), drawing: 'no-existeix' });
  const saved = JSON.parse(stripeSessions[0].metadata.personalitzada_1);
  assert.strictEqual(saved.word.length, 28);
  assert.strictEqual(saved.drawing, '');
});

test('checkout: en mode aparador no es pot pagar a la web', async () => {
  site.mode = 'aparador';
  try {
    const res = await fn('create-checkout-session')(ev('POST', { items: [{ id: 'niu', qty: 1 }] }));
    assert.strictEqual(res.statusCode, 403);
    assert.match(parse(res).error, /Instagram/);
  } finally { site.mode = 'botiga'; }
  assert.ok(['aparador', 'botiga', undefined].includes(SITE_MODE));
});

test('checkout: rebutja productes desconeguts, limita quantitats i respecta l\'estoc', async () => {
  stores.clear(); stripeSessions = [];
  assert.strictEqual((await fn('create-checkout-session')(ev('POST', { items: [{ id: 'fals', qty: 1 }] }))).statusCode, 400);
  const niuColor = site.colors.find((c) => c.id === require('../data/catalog.json').find((p) => p.slug === 'niu').defaultColor);
  const savedStock = niuColor.stock;
  niuColor.stock = 999;
  try {
    await fn('create-checkout-session')(ev('POST', { items: [{ id: 'niu', qty: 999 }] }));
  } finally { niuColor.stock = savedStock; }
  assert.strictEqual(stripeSessions[0].line_items[0].quantity, site.maxQtyPerItem);
  await fakeStore('stock').set('niu', '2');
  const res = await fn('create-checkout-session')(ev('POST', { items: [{ id: 'niu', qty: 3 }] }));
  assert.strictEqual(res.statusCode, 409);
  assert.match(parse(res).error, /Només queden 2/);
});

test('checkout: estoc per colors compartit entre tasses, packs i personalitzades', async () => {
  stores.clear(); stripeSessions = [];
  const blau = site.colors.find((c) => c.id === 'blau');
  const saved = blau.stock;
  try {
    blau.stock = 3;
    const ok = await fn('create-checkout-session')(ev('POST', { items: [{ id: 'niu', qty: 1, color: 'blau' }, { id: 'caliu', qty: 2, color: 'blau' }] }));
    assert.strictEqual(ok.statusCode, 200);
    const tooMany = await fn('create-checkout-session')(ev('POST', { items: [{ id: 'niu', qty: 2, color: 'blau' }, { id: 'caliu', qty: 2, color: 'blau' }] }));
    assert.strictEqual(tooMany.statusCode, 409);
    assert.match(parse(tooMany).error, /Només queden 3 tasses de color blau/);
    blau.stock = 0;
    const out = await fn('create-checkout-session')(ev('POST', { items: [{ type: 'custom', qty: 1, design: { structure: 'ets', word: 'garrepa', color: 'blau' } }] }));
    assert.strictEqual(out.statusCode, 409);
    assert.match(parse(out).error, /exhaurit/);
  } finally { blau.stock = saved; }
  assert.ok(!site.colors.some((c) => c.id === 'blau-mari'), 'el proveïdor no té blau marí');
});

test('webhook: descompta estoc i compta vendes una sola vegada encara que Stripe el reenviï', async () => {
  stores.clear();
  await fakeStore('stock').set('niu', '10');
  stripeEvent = { type: 'checkout.session.completed', data: { object: { id: 'cs_1', payment_status: 'paid', metadata: { items: 'niu:3,arrel:1' } } } };
  const hook = fn('stripe-webhook');
  await hook(ev('POST', {}, { headers: { 'stripe-signature': 's' } }));
  await hook(ev('POST', {}, { headers: { 'stripe-signature': 's' } }));
  assert.strictEqual(await fakeStore('stock').get('niu'), '7');
  assert.strictEqual(await fakeStore('stock').get('arrel'), null);
  assert.deepStrictEqual(await fakeStore('sales').get('counts', { type: 'json' }), { niu: 3, arrel: 1 });
  // format nou: tasses amb color, packs (compten cada tassa) i personalitzades (no compten)
  stripeEvent = { type: 'checkout.session.completed', data: { object: { id: 'cs_3', payment_status: 'paid', metadata: { items: 'm:niu:blau:1,p:casa:1,c:1:4' } } } };
  await hook(ev('POST', {}, { headers: { 'stripe-signature': 's' } }));
  assert.strictEqual(await fakeStore('stock').get('niu'), '5');
  assert.deepStrictEqual(await fakeStore('sales').get('counts', { type: 'json' }), { niu: 5, arrel: 2, aixopluc: 1 });
  stripeEvent = { type: 'checkout.session.completed', data: { object: { id: 'cs_2', payment_status: 'unpaid', metadata: { items: 'niu:1' } } } };
  await hook(ev('POST', {}, { headers: { 'stripe-signature': 's' } }));
  assert.strictEqual(await fakeStore('stock').get('niu'), '5');
});

test('store-data: "més venuts" només apareix amb vendes reals d\'almenys 3 tasses', async () => {
  stores.clear();
  await fakeStore('sales').setJSON('counts', { niu: 3, arrel: 1 });
  assert.deepStrictEqual(parse(await fn('store-data')(ev('GET'))).bestsellers, []);
  await fakeStore('sales').setJSON('counts', { niu: 3, arrel: 1, caliu: 5 });
  assert.deepStrictEqual(parse(await fn('store-data')(ev('GET'))).bestsellers, ['caliu', 'niu', 'arrel']);
});

// ---------- Valoracions ----------
const review = (extra) => ({ slug: 'caliu', name: 'Marta', rating: 5, comment: 'Una tassa preciosa, la regalaré.', startedAt: Date.now() - 10000, ...extra });

test('valoracions: res es publica sense moderació i la mitjana es calcula de valoracions reals', async () => {
  stores.clear();
  const reviews = fn('reviews');
  const empty = parse(await reviews(ev('GET', undefined, { query: { slug: 'caliu' } })));
  assert.deepStrictEqual([empty.count, empty.average, empty.reviews.length], [0, null, 0]);

  assert.strictEqual((await reviews(ev('POST', review()))).statusCode, 202);
  assert.strictEqual((await reviews(ev('POST', review({ name: 'Pau', rating: 4 })))).statusCode, 202);
  assert.strictEqual(parse(await reviews(ev('GET', undefined, { query: { slug: 'caliu' } }))).count, 0, 'les pendents no es mostren');

  const adminFn = fn('admin-reviews');
  assert.strictEqual((await adminFn(ev('GET'))).statusCode, 401);
  const { pending } = parse(await adminFn(ev('GET', undefined, { headers: admin })));
  assert.strictEqual(pending.length, 2);
  for (const r of pending) await adminFn(ev('POST', { action: 'approve', id: r.id }, { headers: admin }));

  const pub = parse(await reviews(ev('GET', undefined, { query: { slug: 'caliu' } })));
  assert.deepStrictEqual([pub.count, pub.average], [2, 4.5]);
  assert.ok(!('ipHash' in pub.reviews[0]));
  const data = parse(await fn('store-data')(ev('GET')));
  assert.deepStrictEqual(data.ratings.caliu, { count: 2, average: 4.5 });
  assert.strictEqual(data.latest.length, 2);

  await adminFn(ev('POST', { action: 'delete', slug: 'caliu', id: pub.reviews[0].id }, { headers: admin }));
  assert.strictEqual(parse(await reviews(ev('GET', undefined, { query: { slug: 'caliu' } }))).count, 1);
});

test('valoracions: protecció contra spam i abusos', async () => {
  stores.clear();
  const reviews = fn('reviews');
  const countPending = async () => (await fakeStore('reviews').list({ prefix: 'pending/' })).blobs.length;

  await reviews(ev('POST', review({ website: 'http://spam' })));
  await reviews(ev('POST', review({ startedAt: Date.now() })));
  assert.strictEqual(await countPending(), 0, 'paranys de robots: no es desa res');

  assert.strictEqual((await reviews(ev('POST', review({ comment: 'Compra a www.ofertes.com ara mateix' })))).statusCode, 400);
  assert.strictEqual((await reviews(ev('POST', review({ comment: 'curt' })))).statusCode, 400);
  assert.strictEqual((await reviews(ev('POST', review({ rating: 9 })))).statusCode, 400);

  const ip = '192.168.1.1';
  assert.strictEqual((await reviews(ev('POST', review(), { ip }))).statusCode, 202);
  assert.strictEqual((await reviews(ev('POST', review(), { ip }))).statusCode, 409, 'una valoració per tassa i visitant');
  for (const slug of ['niu', 'arrel', 'deler', 'solell']) await reviews(ev('POST', review({ slug }), { ip }));
  assert.strictEqual((await reviews(ev('POST', review({ slug: 'rosada' }), { ip }))).statusCode, 429, 'màxim 5 al dia');

  await reviews(ev('POST', review({ slug: 'bonanca', comment: 'Ets un subnormal, quina tassa més lletja' })));
  const { pending } = parse(await fn('admin-reviews')(ev('GET', undefined, { headers: admin })));
  assert.ok(pending.find((p) => p.slug === 'bonanca').flags.includes('possible contingut ofensiu'));
});

// ---------- Newsletter ----------
const subscribe = (email, extra) => ({ action: 'subscribe', email, consent: true, source: 'inici', startedAt: Date.now() - 5000, ...extra });

test('newsletter: no simula res si el correu no està configurat', async () => {
  stores.clear();
  delete process.env.RESEND_API_KEY;
  const res = await fn('newsletter')(ev('POST', subscribe('a@exemple.cat')));
  assert.strictEqual(res.statusCode, 503);
  assert.strictEqual((await fakeStore('newsletter').list({ prefix: 'sub/' })).blobs.length, 0);
});

test('newsletter: doble confirmació, registre del consentiment i baixa', async () => {
  stores.clear(); sentEmails.length = 0;
  process.env.RESEND_API_KEY = 're_x';
  process.env.NEWSLETTER_FROM = 'El Glopet <hola@exemple.cat>';
  const nl = fn('newsletter');

  assert.strictEqual((await nl(ev('POST', subscribe('A@Exemple.cat', { consent: false })))).statusCode, 400, 'cal consentiment explícit');
  assert.strictEqual((await nl(ev('POST', subscribe('A@Exemple.cat')))).statusCode, 200);
  assert.strictEqual(sentEmails.length, 1);
  const link = sentEmails[0].html.match(/https:\/\/botiga\.test\/newsletter\/confirmar\/\?id=([a-f0-9]+)&amp;t=([a-f0-9]+)/);
  assert.ok(link, 'el correu porta l\'enllaç de confirmació');
  const [, id, t] = link;

  const rec = await fakeStore('newsletter').get(`sub/${id}`, { type: 'json' });
  assert.strictEqual(rec.status, 'pending');
  assert.strictEqual(rec.email, 'a@exemple.cat');
  assert.strictEqual(rec.consent.source, 'inici');
  assert.strictEqual(rec.consent.text, site.newsletterConsent.text);
  assert.match(rec.consent.at, /^\d{4}-\d\d-\d\dT/);
  assert.ok(rec.consent.ipHash && !rec.consent.ipHash.includes('10.0.0'));

  assert.strictEqual((await nl(ev('POST', { action: 'confirm', id, t: 'f'.repeat(48) }))).statusCode, 400);
  assert.strictEqual((await nl(ev('POST', { action: 'confirm', id, t }))).statusCode, 200);
  const confirmed = await fakeStore('newsletter').get(`sub/${id}`, { type: 'json' });
  assert.strictEqual(confirmed.status, 'confirmed');
  assert.ok(confirmed.confirmedAt);

  await nl(ev('POST', subscribe('a@exemple.cat')));
  assert.strictEqual(sentEmails.length, 1, 'ja confirmada: no s\'envia res i la resposta no ho revela');

  sentEmails.length = 0;
  const adminNl = fn('admin-newsletter');
  const list = parse(await adminNl(ev('GET', undefined, { headers: admin })));
  assert.strictEqual(list.subscribers.length, 1);
  await nl(ev('POST', subscribe('b@exemple.cat')));
  sentEmails.length = 0;
  const sent = parse(await adminNl(ev('POST', { action: 'send', subject: 'Novetats', body: 'Hem tret tasses noves.' }, { headers: admin })));
  assert.deepStrictEqual([sent.sent, sentEmails.length], [1, 1], 'només s\'envia a persones confirmades');
  const msg = sentEmails[0];
  assert.match(msg.html, /newsletter\/baixa\/\?id=/);
  assert.match(msg.headers['List-Unsubscribe'], /action=unsubscribe/);
  assert.strictEqual(msg.headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click');

  const oneClick = new URL(msg.headers['List-Unsubscribe'].slice(1, -1));
  const res = await nl({ ...ev('POST'), queryStringParameters: Object.fromEntries(oneClick.searchParams) });
  assert.strictEqual(res.statusCode, 200);
  const after = await fakeStore('newsletter').get(`sub/${id}`, { type: 'json' });
  assert.deepStrictEqual(Object.keys(after).sort(), ['status', 'unsubscribedAt'], 'en donar-se de baixa s\'esborra l\'adreça');
});

test('newsletter: límit d\'intents i paranys de robots', async () => {
  stores.clear(); sentEmails.length = 0;
  const nl = fn('newsletter');
  await nl(ev('POST', subscribe('robot@exemple.cat', { website: 'x' })));
  await nl(ev('POST', subscribe('robot2@exemple.cat', { startedAt: Date.now() })));
  assert.strictEqual(sentEmails.length, 0);
  const ip = '172.16.0.9';
  for (let i = 0; i < 5; i++) await nl(ev('POST', subscribe(`p${i}@exemple.cat`), { ip }));
  assert.strictEqual((await nl(ev('POST', subscribe('p9@exemple.cat'), { ip }))).statusCode, 429);
});

test('administració: contrasenya obligatòria a totes les funcions', async () => {
  for (const name of ['admin-reviews', 'admin-newsletter', 'admin-stock']) {
    assert.strictEqual((await fn(name)(ev('GET', undefined, { headers: { 'x-admin-password': 'dolenta' } }))).statusCode, 401, name);
  }
  const res = await fn('admin-stock')(ev('POST', { slug: 'niu', stock: 4 }, { headers: admin }));
  assert.strictEqual(parse(res).stock.niu, 4);
  const cleared = await fn('admin-stock')(ev('POST', { slug: 'niu', stock: null }, { headers: admin }));
  assert.strictEqual(parse(cleared).stock.niu, null);
});

test('instagram: només publica el que està aprovat i toca, una vegada, i sense claus no fa res', async () => {
  const queue = require('../data/instagram.json');
  // Les proves controlen elles mateixes què està aprovat (la cua real pot tenir publicacions aprovades i vençudes).
  const realApproval = queue.posts.map((p) => p.approved);
  const { pickDue, LATE_LIMIT_MS } = require('../netlify/functions/lib/instagram');
  const now = Date.parse('2026-12-01T12:00:00Z');
  const posts = [
    { id: 'futur', approved: true, publishAt: '2026-12-02T12:00:00Z' },
    { id: 'no-aprovat', approved: false, publishAt: '2026-11-30T12:00:00Z' },
    { id: 'massa-tard', approved: true, publishAt: new Date(now - LATE_LIMIT_MS - 1000).toISOString() },
    { id: 'toca-b', approved: true, publishAt: '2026-12-01T11:00:00Z' },
    { id: 'toca-a', approved: true, publishAt: '2026-12-01T10:00:00Z' },
  ];
  const r = pickDue(posts, {}, now);
  assert.strictEqual(r.due.id, 'toca-a');
  assert.deepStrictEqual(r.late, ['massa-tard']);
  assert.strictEqual(pickDue(posts, { 'toca-a': {}, 'toca-b': {} }, now).due, null);

  // La cua del repositori: dates vàlides, sense identificadors repetits, aprovació explícita (true/false).
  assert.ok(queue.posts.length > 0);
  assert.strictEqual(new Set(queue.posts.map((p) => p.id)).size, queue.posts.length);
  for (const p of queue.posts) {
    assert.ok(typeof p.approved === 'boolean', p.id);
    assert.ok(Number.isFinite(Date.parse(p.publishAt)) && /[+-]\d\d:\d\d$|Z$/.test(p.publishAt), `${p.id}: data amb zona horària`);
  }
  for (const p of queue.posts) {
    assert.ok(p.caption.length <= 2200 && (p.caption.match(/#/g) || []).length <= 30, p.id);
    assert.ok(p.images.length >= 1 && p.images.length <= 10, p.id);
    for (const img of p.images) assert.ok(require('fs').existsSync(require('path').join(__dirname, '..', img)) && /\.jpe?g$/.test(img), img);
  }

  queue.posts.forEach((p) => { p.approved = false; });
  const mod = await import('../netlify/functions/instagram-publish.mjs');
  // Sense token, la funció no toca res; amb token, provem la feina amb el magatzem fals.
  const handler = async () => (process.env.IG_ACCESS_TOKEN ? mod.run(fakeStore('instagram')) : mod.default());
  const body = async (res) => res.text();
  delete process.env.IG_USER_ID; delete process.env.IG_ACCESS_TOKEN;
  // Interruptor de pausa a data/instagram.json.
  const savedPaused = queue.paused;
  queue.paused = true;
  assert.strictEqual(await body(await mod.default()), 'paused');
  queue.paused = false;
  assert.strictEqual(await body(await handler()), 'not configured');
  queue.paused = savedPaused;

  // Amb el token i una publicació aprovada que toca: crea el carrusel i publica.
  // L'identificador del compte es demana a l'API si no hi ha IG_USER_ID.
  const calls = [];
  const realFetch = global.fetch;
  global.fetch = async (url, opts = {}) => {
    const u = String(url);
    calls.push({ url: u, body: opts.body ? Object.fromEntries(new URLSearchParams(String(opts.body))) : null });
    let data = { id: `c${calls.length}` };
    if (u.includes('refresh_access_token')) data = { access_token: 'token-nou', expires_in: 5184000 };
    else if (u.includes('/me?')) data = { user_id: '1784', username: 'elglopet' };
    else if (u.includes('status_code')) data = { status_code: 'FINISHED' };
    else if (u.includes('media_publish')) data = { id: 'media-1' };
    return { ok: true, json: async () => data };
  };
  process.env.IG_ACCESS_TOKEN = 'token-vell';
  const savedIgUserId = queue.igUserId;
  delete queue.igUserId;
  const post = queue.posts[0];
  const saved = { approved: post.approved, publishAt: post.publishAt };
  post.approved = true;
  post.publishAt = new Date(Date.now() - 3600 * 1000).toISOString();
  try {
    assert.strictEqual(await body(await handler()), `published ${post.id}`);
    const creates = calls.filter((c) => c.url.endsWith('/1784/media'));
    assert.strictEqual(creates.length, post.images.length + 1);
    assert.strictEqual(creates[0].body.image_url, 'https://botiga.test' + post.images[0]);
    assert.strictEqual(creates.at(-1).body.media_type, 'CAROUSEL');
    assert.strictEqual(creates.at(-1).body.caption, post.caption);
    assert.strictEqual(creates.at(-1).body.access_token, 'token-nou');
    assert.ok(calls.some((c) => c.url.endsWith('/1784/media_publish')));
    // La següent execució no la torna a publicar.
    assert.strictEqual(await body(await handler()), 'nothing due');
    // Una publicació que ja és al compte (mateix text) no es torna a publicar.
    const post3 = queue.posts[2];
    const saved3 = { approved: post3.approved, publishAt: post3.publishAt };
    post3.approved = true;
    post3.publishAt = new Date(Date.now() - 600 * 1000).toISOString();
    const before = calls.length;
    const listFetch = global.fetch;
    global.fetch = async (url, opts) => (String(url).includes('/1784/media?')
      ? { ok: true, json: async () => ({ data: [{ id: 'ja-hi-era', caption: `  ${post3.caption.replace(/\n/g, ' \n')}  ` }] }) }
      : listFetch(url, opts));
    assert.strictEqual(await body(await handler()), `already ${post3.id}`);
    assert.ok(!calls.slice(before).some((c) => c.url.endsWith('/media_publish')), 'no publica res');
    global.fetch = listFetch;
    // Si se n'han acumulat, la següent espera 6 hores des de l'última publicació.
    const post5 = queue.posts[4];
    const saved5 = { approved: post5.approved, publishAt: post5.publishAt };
    post5.approved = true;
    post5.publishAt = new Date(Date.now() - 120 * 1000).toISOString();
    assert.strictEqual(await body(await handler()), 'waiting gap');
    Object.assign(post5, saved5);
    // Una publicació que s'havia quedat «publicant» (p. ex. temps esgotat) no es repeteix sola.
    const db0 = fakeStore('instagram');
    const pub = await db0.get('published', { type: 'json' });
    const post4 = queue.posts[3];
    const saved4 = { approved: post4.approved, publishAt: post4.publishAt };
    post4.approved = true;
    post4.publishAt = new Date(Date.now() - 300 * 1000).toISOString();
    await db0.setJSON('published', { ...pub, [post4.id]: { status: 'publishing', at: new Date().toISOString() } });
    assert.strictEqual(await body(await handler()), 'nothing due');
    // Si Blobs no deixa anotar «publicant», no es publica.
    const old = Object.fromEntries(Object.entries(pub).map(([k, v]) => [k, { ...v, at: '2000-01-01T00:00:00Z' }]));
    await db0.setJSON('published', old);
    const realSet = db0.setJSON;
    const failingStore = { ...db0, setJSON: async () => { throw new Error('blobs caigut'); } };
    const before2 = calls.length;
    assert.strictEqual((await mod.run(failingStore)).status, 500);
    assert.ok(!calls.slice(before2).some((c) => c.url.endsWith('/media_publish') || (c.url.endsWith('/media') && c.body)), 'res creat');
    db0.setJSON = realSet;
    Object.assign(post3, saved3); Object.assign(post4, saved4);
    // Si canvies el token a Netlify, el renovat que hi havia a Blobs es descarta.
    const ig = require('../netlify/functions/lib/instagram');
    const db = fakeStore('instagram');
    assert.strictEqual(await ig.currentToken(db), 'token-nou');
    process.env.IG_ACCESS_TOKEN = '  "IGtoken-canviat"\n';
    assert.strictEqual(ig.envToken(), 'IGtoken-canviat');
    const seen = [];
    const prevFetch = global.fetch;
    global.fetch = async (url) => { seen.push(String(url)); return { ok: false, json: async () => ({ error: { message: 'too new' } }) }; };
    assert.strictEqual(await ig.currentToken(db), 'IGtoken-canviat');
    assert.ok(seen[0].includes('IGtoken-canviat'));
    global.fetch = prevFetch;
    assert.match(ig.describeToken('EAAxyz'), /unificat/);
    // Un token dolent no peta: queda registrat com a error.
    global.fetch = async () => ({ ok: false, status: 400, json: async () => ({ error: { message: 'Invalid OAuth access token' } }) });
    assert.strictEqual((await handler()).status, 500);
  } finally {
    Object.assign(post, saved);
    queue.igUserId = savedIgUserId;
    global.fetch = realFetch;
    delete process.env.IG_USER_ID; delete process.env.IG_ACCESS_TOKEN;
  }

  // Token d'inici de sessió unificat (EA…): graph.facebook.com, compte de data/instagram.json, sense renovació.
  assert.ok(/^\d+$/.test(queue.igUserId));
  const fbCalls = [];
  global.fetch = async (url, opts = {}) => {
    const u = String(url);
    fbCalls.push({ url: u, body: opts.body ? Object.fromEntries(new URLSearchParams(String(opts.body))) : null });
    let data = { id: `c${fbCalls.length}` };
    if (u.includes('fields=id%2Cusername') || u.includes('fields=id,username')) data = { id: queue.igUserId, username: 'elglopet' };
    else if (u.includes('status_code')) data = { status_code: 'FINISHED' };
    else if (u.includes('media_publish')) data = { id: 'media-2' };
    return { ok: true, json: async () => data };
  };
  process.env.IG_ACCESS_TOKEN = 'EAGtest';
  stores.delete('instagram');
  const post2 = queue.posts[1];
  const saved2 = { approved: post2.approved, publishAt: post2.publishAt };
  post2.approved = true;
  post2.publishAt = new Date(Date.now() - 1800 * 1000).toISOString();
  try {
    assert.strictEqual(await body(await handler()), `published ${post2.id}`);
    assert.ok(fbCalls.every((c) => c.url.startsWith('https://graph.facebook.com/')), 'tot va a graph.facebook.com');
    assert.ok(!fbCalls.some((c) => c.url.includes('refresh_access_token')), 'no es renova');
    assert.ok(fbCalls.some((c) => c.url.endsWith(`/${queue.igUserId}/media`) && c.body.image_url === 'https://botiga.test' + post2.images[0]));
    assert.ok(fbCalls.some((c) => c.url.endsWith(`/${queue.igUserId}/media_publish`)));
  } finally {
    Object.assign(post2, saved2);
    global.fetch = realFetch;
    delete process.env.IG_ACCESS_TOKEN;
    queue.posts.forEach((p, i) => { p.approved = realApproval[i]; });
  }
});

test('configurador: emoticones, dibuixos nous i filtre de paraules senceres', () => {
  const { validateDesign } = require('../netlify/functions/lib/cart');
  const { check } = require('../netlify/functions/lib/moderation');
  const cfg = require('../data/configurator.json');
  const base = { structure: 'caracter', word: 'cagadubtes', color: 'blau' };
  // Emoticones dins del text (també amb to de pell) i com a dibuix.
  assert.ok(validateDesign({ ...base, sub: 'la festa acaba aquí 😎', def2: 'Sempre té raó 🙄👍🏽' }).design);
  assert.strictEqual(validateDesign({ ...base, drawing: '🥳' }).design.drawing, '🥳');
  assert.strictEqual(validateDesign({ ...base, drawing: '💩' }).design.drawing, '', 'només les emoticones de la llista');
  assert.strictEqual(validateDesign({ ...base, drawing: 'porro' }).design.drawing, 'porro');
  assert.ok(validateDesign({ ...base, word: '<b>' }).error);
  // Tots els dibuixos de la llista existeixen a l'SVG.
  const svg = require('fs').readFileSync(require('path').join(__dirname, '../assets/drawings.svg'), 'utf8');
  for (const d of cfg.drawings) assert.ok(svg.includes(`id="d-${d.id}"`), d.id);
  // Totes les paraules de les llistes es poden fer servir (sense falsos positius del filtre).
  for (const [k, l] of Object.entries(cfg.lists)) {
    const st = k === 'tendres' ? 'tendra' : k === 'caracter' ? 'caracter' : 'ets';
    for (const w of l.words) assert.ok(validateDesign({ structure: st, word: w.w, def1: w.d, color: 'blau' }).design, w.w);
  }
  for (const e of cfg.emojis) assert.ok(validateDesign({ structure: 'lliure', word: e, color: 'blau' }).design, e);
  assert.deepStrictEqual(check('disputa').flags, []);
  assert.deepStrictEqual(check('aixafaguitarres').flags, []);
  assert.deepStrictEqual(check('Hi ha retard').flags, []);
  assert.ok(check('ets una puta').flags.includes('possible contingut ofensiu'));
});
