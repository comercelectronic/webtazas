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
  assert.strictEqual(site.unitPriceCents, 1495);
  assert.deepStrictEqual(s.line_items.map((l) => [l.quantity, l.price_data.unit_amount]), [[3, 1495], [1, 1495], [1, 1495]]);
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

  // La cua del repositori arriba sense res aprovat.
  assert.ok(queue.posts.length > 0 && queue.posts.every((p) => p.approved === false));
  for (const p of queue.posts) {
    assert.ok(p.caption.length <= 2200 && (p.caption.match(/#/g) || []).length <= 30, p.id);
    assert.ok(p.images.length >= 1 && p.images.length <= 10, p.id);
    for (const img of p.images) assert.ok(require('fs').existsSync(require('path').join(__dirname, '..', img)) && /\.jpe?g$/.test(img), img);
  }

  const handler = fn('instagram-publish');
  delete process.env.IG_USER_ID; delete process.env.IG_ACCESS_TOKEN;
  assert.strictEqual((await handler(ev('POST'))).body, 'not configured');

  // Amb claus i una publicació aprovada que toca: crea el carrusel i publica.
  const calls = [];
  const realFetch = global.fetch;
  global.fetch = async (url, opts = {}) => {
    const u = String(url);
    calls.push({ url: u, body: opts.body ? Object.fromEntries(new URLSearchParams(String(opts.body))) : null });
    let data = { id: `c${calls.length}` };
    if (u.includes('refresh_access_token')) data = { access_token: 'token-nou', expires_in: 5184000 };
    else if (u.includes('status_code')) data = { status_code: 'FINISHED' };
    else if (u.includes('media_publish')) data = { id: 'media-1' };
    return { ok: true, json: async () => data };
  };
  process.env.IG_USER_ID = '1784';
  process.env.IG_ACCESS_TOKEN = 'token-vell';
  const post = queue.posts[0];
  const saved = { approved: post.approved, publishAt: post.publishAt };
  post.approved = true;
  post.publishAt = new Date(Date.now() - 3600 * 1000).toISOString();
  try {
    assert.strictEqual((await handler(ev('POST'))).body, `published ${post.id}`);
    const creates = calls.filter((c) => c.url.endsWith('/1784/media'));
    assert.strictEqual(creates.length, post.images.length + 1);
    assert.strictEqual(creates[0].body.image_url, 'https://botiga.test' + post.images[0]);
    assert.strictEqual(creates.at(-1).body.media_type, 'CAROUSEL');
    assert.strictEqual(creates.at(-1).body.caption, post.caption);
    assert.strictEqual(creates.at(-1).body.access_token, 'token-nou');
    assert.ok(calls.some((c) => c.url.endsWith('/1784/media_publish')));
    // La següent execució no la torna a publicar.
    assert.strictEqual((await handler(ev('POST'))).body, 'nothing due');
  } finally {
    Object.assign(post, saved);
    global.fetch = realFetch;
    delete process.env.IG_USER_ID; delete process.env.IG_ACCESS_TOKEN;
  }
});
