const crypto = require('crypto');
const { getStore, connectLambda } = require('@netlify/blobs');

const json = (statusCode, body, headers = {}) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  body: JSON.stringify(body),
});

function parseJson(event, maxBytes = 20 * 1024) {
  const raw = event.body || '';
  if (raw.length > maxBytes) return { error: json(413, { error: 'La petició és massa gran.' }) };
  try {
    return { body: JSON.parse(raw || '{}') };
  } catch (e) {
    return { error: json(400, { error: 'Petició no vàlida.' }) };
  }
}

// Les Netlify Functions clàssiques no tenen l'entorn de Blobs configurat:
// cal connectar l'esdeveniment abans de demanar cap magatzem.
function store(event, name) {
  connectLambda(event);
  return getStore({ name, consistency: 'strong' });
}

function clientIp(event) {
  const h = event.headers || {};
  return h['x-nf-client-connection-ip'] || (h['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
}

// Mai desem l'adreça IP: només un hash amb sal, que serveix per limitar
// abusos però no permet saber quina IP era.
function ipHash(event) {
  const salt = process.env.HASH_SALT || 'tassa-de-mots';
  return crypto.createHash('sha256').update(salt + '|' + clientIp(event)).digest('hex').slice(0, 32);
}

const sha256 = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');
const randomToken = () => crypto.randomBytes(24).toString('hex');
const today = () => new Date().toISOString().slice(0, 10).replace(/-/g, '');

// Comptador simple per dia. Retorna false si ja s'ha superat el límit.
async function rateLimit(st, key, max) {
  const k = `rl/${key}/${today()}`;
  const current = parseInt((await st.get(k)) || '0', 10);
  if (current >= max) return false;
  await st.set(k, String(current + 1));
  return true;
}

// Esborra els comptadors de límit de fa més de 2 dies.
async function cleanupRateLimits(st) {
  const { blobs } = await st.list({ prefix: 'rl/' });
  const cutoff = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10).replace(/-/g, '');
  await Promise.all(blobs.filter((b) => b.key.slice(-8) < cutoff).map((b) => st.delete(b.key)));
}

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

// Contrasenya d'administració (variable d'entorn ADMIN_PASSWORD), amb un
// límit d'intents fallits per evitar que s'endevini per força bruta.
async function requireAdmin(event) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return json(500, { error: "Falta configurar ADMIN_PASSWORD a Netlify." });
  const given = (event.headers || {})['x-admin-password'] || '';
  const st = store(event, 'admin-security');
  const key = `rl/fail/${ipHash(event)}/${today()}`;
  const fails = parseInt((await st.get(key)) || '0', 10);
  if (fails >= 20) return json(429, { error: "Massa intents fallits. Torna-ho a provar demà." });
  if (!given || !safeEqual(given, expected)) {
    await st.set(key, String(fails + 1));
    return json(401, { error: 'Contrasenya incorrecta.' });
  }
  return null;
}

function siteOrigin(event, site) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const h = event.headers || {};
  if (h.origin) return h.origin;
  if (h.host) return `https://${h.host}`;
  return site.siteUrl;
}

module.exports = {
  json, parseJson, store, ipHash, sha256, randomToken, rateLimit, cleanupRateLimits, requireAdmin, safeEqual, siteOrigin, today,
};
