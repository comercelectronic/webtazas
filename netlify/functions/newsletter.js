// Newsletter amb doble confirmació (double opt-in).
//
//   POST {action:'subscribe', email, consent, source, website, startedAt}
//   POST {action:'confirm', id, t}
//   POST {action:'unsubscribe', id, t}
//   POST ?action=unsubscribe&id=..&t=..   (baixa amb un clic des del gestor de correu, RFC 8058)
//
// Es desa a Netlify Blobs, magatzem "newsletter", clau "sub/<hash del correu>".
const { site } = require('./lib/catalog');
const { json, parseJson, store, ipHash, sha256, randomToken, rateLimit, safeEqual, siteOrigin } = require('./lib/http');
const { emailConfigured, confirmationEmail, sendEmail } = require('./lib/email');

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i;
const SOURCES = ['inici', 'pagina-newsletter', 'gracies'];
const CONFIRM_DAYS = 7;
const RESEND_MINUTES = 10;
const GENERIC_OK = "Gairebé fet! Si l'adreça és correcta, rebràs un correu per confirmar la subscripció. Mira també a la carpeta de correu brossa.";

async function subscribe(event, body) {
  if (!emailConfigured()) {
    return json(503, { error: "La newsletter encara no està activa. Torna-ho a provar més endavant." });
  }
  // Paranys per a robots: camp ocult omplert o formulari enviat massa de pressa.
  const elapsed = Date.now() - Number(body.startedAt || 0);
  if (body.website || !Number.isFinite(elapsed) || elapsed < 2500) return json(200, { ok: true, message: GENERIC_OK });

  const email = String(body.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) return json(400, { error: "L'adreça de correu no és vàlida." });
  if (body.consent !== true) return json(400, { error: 'Cal que marquis la casella de consentiment.' });

  const st = store(event, 'newsletter');
  const ih = ipHash(event);
  if (!(await rateLimit(st, `sub/${ih}`, 5))) return json(429, { error: 'Massa intents. Torna-ho a provar demà.' });

  const id = sha256(email);
  const key = `sub/${id}`;
  const existing = await st.get(key, { type: 'json' });

  // Mateixa resposta tant si ja hi és com si no: així ningú pot esbrinar
  // si una adreça concreta està subscrita.
  if (existing && existing.status === 'confirmed') return json(200, { ok: true, message: GENERIC_OK });
  if (existing && existing.status === 'pending' &&
      Date.now() - new Date(existing.lastConfirmSentAt).getTime() < RESEND_MINUTES * 60000) {
    return json(200, { ok: true, message: GENERIC_OK });
  }

  const token = randomToken();
  const now = new Date().toISOString();
  const record = {
    email,
    status: 'pending',
    confirmTokenHash: sha256(token),
    unsubToken: (existing && existing.unsubToken) || randomToken(),
    createdAt: (existing && existing.status === 'pending' && existing.createdAt) || now,
    lastConfirmSentAt: now,
    consent: {
      at: now,
      source: SOURCES.includes(body.source) ? body.source : 'desconegut',
      ipHash: ih,
      version: site.newsletterConsent.version,
      text: site.newsletterConsent.text,
    },
  };
  await st.setJSON(key, record);

  const confirmUrl = `${siteOrigin(event, site)}/newsletter/confirmar/?id=${id}&t=${token}`;
  try {
    await sendEmail({ to: email, ...confirmationEmail({ confirmUrl }) });
  } catch (err) {
    console.error('Error enviant el correu de confirmació:', err.message);
    if (!existing) await st.delete(key);
    return json(502, { error: "No hem pogut enviar el correu de confirmació. Torna-ho a provar d'aquí a una estona." });
  }
  return json(200, { ok: true, message: GENERIC_OK });
}

async function confirm(event, body) {
  const id = String(body.id || '');
  const t = String(body.t || '');
  if (!/^[a-f0-9]{64}$/.test(id) || !/^[a-f0-9]{48}$/.test(t)) return json(400, { error: "L'enllaç no és vàlid." });
  const st = store(event, 'newsletter');
  const rec = await st.get(`sub/${id}`, { type: 'json' });
  if (rec && rec.status === 'confirmed') return json(200, { ok: true, message: 'La teva subscripció ja estava confirmada.' });
  if (!rec || rec.status !== 'pending' || !safeEqual(sha256(t), rec.confirmTokenHash)) {
    return json(400, { error: "L'enllaç no és vàlid o ja s'ha fet servir." });
  }
  if (Date.now() - new Date(rec.createdAt).getTime() > CONFIRM_DAYS * 86400000) {
    await st.delete(`sub/${id}`);
    return json(410, { error: "L'enllaç ha caducat. Torna a subscriure't des de la web." });
  }
  rec.status = 'confirmed';
  rec.confirmedAt = new Date().toISOString();
  delete rec.confirmTokenHash;
  await st.setJSON(`sub/${id}`, rec);
  return json(200, { ok: true, message: 'Subscripció confirmada. Gràcies!' });
}

async function unsubscribe(event, id, t) {
  if (!/^[a-f0-9]{64}$/.test(id) || !t) return json(400, { error: "L'enllaç no és vàlid." });
  const st = store(event, 'newsletter');
  const rec = await st.get(`sub/${id}`, { type: 'json' });
  if (!rec || rec.status === 'unsubscribed') return json(200, { ok: true, message: "T'has donat de baixa. No rebràs més correus." });
  if (!rec.unsubToken || !safeEqual(t, rec.unsubToken)) return json(400, { error: "L'enllaç no és vàlid." });
  // Esborrem l'adreça i totes les dades: només queda constància de la baixa.
  await st.setJSON(`sub/${id}`, { status: 'unsubscribed', unsubscribedAt: new Date().toISOString() });
  return json(200, { ok: true, message: "T'has donat de baixa. No rebràs més correus." });
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });

  const q = event.queryStringParameters || {};
  if (q.action === 'unsubscribe') return unsubscribe(event, String(q.id || ''), String(q.t || ''));

  const { body, error } = parseJson(event, 4096);
  if (error) return error;
  try {
    if (body.action === 'subscribe') return await subscribe(event, body);
    if (body.action === 'confirm') return await confirm(event, body);
    if (body.action === 'unsubscribe') return await unsubscribe(event, String(body.id || ''), String(body.t || ''));
    return json(400, { error: 'Acció desconeguda.' });
  } catch (err) {
    console.error('Error a la newsletter:', err);
    return json(500, { error: "S'ha produït un error. Torna-ho a provar." });
  }
};
