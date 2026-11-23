// Publicació a Instagram amb l'API oficial de Meta. Accepta els dos tipus de token:
//   - «IG…»: API amb inici de sessió d'Instagram (graph.instagram.com). Dura
//     60 dies i la funció el renova sola (el desa a Netlify Blobs).
//   - «EA…»: API amb inici de sessió unificat (graph.facebook.com), token
//     d'usuari del sistema que no caduca. Cal l'identificador del compte
//     d'Instagram (data/instagram.json → igUserId, o IG_USER_ID).
//
// Variables d'entorn a Netlify (mai al codi):
//   IG_ACCESS_TOKEN  el token
//   IG_USER_ID       opcional
//   IG_API_HOST      opcional, per forçar el servidor de l'API
//   IG_API_VERSION   opcional, per defecte v23.0
const isFacebookToken = (token) => /^EA/.test(String(token || ''));
const HOST = (token) => process.env.IG_API_HOST || (isFacebookToken(token) ? 'graph.facebook.com' : 'graph.instagram.com');
const VERSION = () => process.env.IG_API_VERSION || 'v23.0';

const LATE_LIMIT_MS = 48 * 3600 * 1000;    // més tard que això, no es publica
const MIN_GAP_MS = 5 * 3600 * 1000;      // mínim entre dues publicacions
const REEL_EXPIRE_MS = 23 * 3600 * 1000; // un contenidor de vídeo caduca a les 24 h
const REFRESH_AFTER_MS = 20 * 86400 * 1000; // renova el token cada 20 dies

async function api(path, params, { method = 'POST', token } = {}) {
  const url = new URL(`https://${HOST(token)}/${VERSION()}/${path}`);
  const body = new URLSearchParams({ ...params, access_token: token });
  const res = method === 'GET'
    ? await fetch(`${url}?${body}`)
    : await fetch(url, { method, body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    const msg = (data.error && data.error.message) || `HTTP ${res.status}`;
    throw new Error(`Instagram API (${path}): ${msg}`);
  }
  return data;
}

/** Espera que un contenidor estigui llest (les imatges es processen uns segons). */
async function waitReady(id, token, tries = 12) {
  for (let i = 0; i < tries; i += 1) {
    const { status_code: s } = await api(id, { fields: 'status_code' }, { method: 'GET', token });
    if (s === 'FINISHED') return;
    if (s === 'ERROR' || s === 'EXPIRED') throw new Error(`El contenidor ${id} ha fallat (${s}).`);
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`El contenidor ${id} no ha estat llest a temps.`);
}

/** Publica una imatge o un carrusel. `images` són URL públiques de JPEG. */
async function publish({ userId, token, images, caption }) {
  let creationId;
  if (images.length === 1) {
    ({ id: creationId } = await api(`${userId}/media`, { image_url: images[0], caption }, { token }));
  } else {
    const children = await Promise.all(images.slice(0, 10).map((image_url) => api(`${userId}/media`, { image_url, is_carousel_item: 'true' }, { token }).then((r) => r.id)));
    await Promise.all(children.map((id) => waitReady(id, token)));
    ({ id: creationId } = await api(`${userId}/media`, { media_type: 'CAROUSEL', children: children.join(','), caption }, { token }));
  }
  await waitReady(creationId, token);
  const { id } = await api(`${userId}/media_publish`, { creation_id: creationId }, { token });
  return id;
}

const norm = (t) => String(t || '').replace(/\s+/g, ' ').trim().slice(0, 120);

/**
 * Reels, en dos passos (el vídeo pot trigar més a processar-se que el temps
 * màxim d'una execució): 1) es crea el contenidor; 2) en una execució posterior,
 * quan Instagram l'ha processat (FINISHED), es publica.
 */
async function createReel({ userId, token, video, cover, caption }) {
  const params = { media_type: 'REELS', video_url: video, caption, share_to_feed: 'true' };
  if (cover) params.cover_url = cover;
  const { id } = await api(`${userId}/media`, params, { token });
  return id;
}

async function containerStatus(id, token) {
  const { status_code: s } = await api(id, { fields: 'status_code' }, { method: 'GET', token });
  return s;
}

async function publishContainer(userId, token, creationId) {
  const { id } = await api(`${userId}/media_publish`, { creation_id: creationId }, { token });
  return id;
}

/** Busca entre les darreres publicacions del compte una amb el mateix text. Retorna l'id o null. */
async function findPublished(userId, token, caption) {
  const data = await api(`${userId}/media`, { fields: 'id,caption,timestamp', limit: '25' }, { method: 'GET', token });
  const want = norm(caption);
  const hit = (data.data || []).find((m) => norm(m.caption) === want);
  return hit ? hit.id : null;
}

/** Comprova el token i retorna { user_id, username } del compte connectat. */
async function whoAmI(token, userId) {
  if (isFacebookToken(token)) {
    if (!userId) throw new Error("Amb un token EA… cal l'identificador del compte d'Instagram (igUserId a data/instagram.json o IG_USER_ID).");
    const data = await api(String(userId), { fields: 'id,username' }, { method: 'GET', token });
    return { user_id: data.id, username: data.username };
  }
  return api('me', { fields: 'user_id,username' }, { method: 'GET', token });
}

/** Token de la variable d'entorn, net d'espais, salts de línia i cometes enganxats per error. */
function envToken() {
  return String(process.env.IG_ACCESS_TOKEN || '').trim().replace(/^["']+|["']+$/g, '').trim();
}

/** Diagnòstic sense revelar el token: tipus aparent i llargada. */
function describeToken(t) {
  const kind = /^IG/.test(t) ? 'Instagram (IG…)' : isFacebookToken(t) ? 'inici de sessió unificat (EA…)' : 'desconegut';
  return `token ${kind}, ${t.length} caràcters`;
}

const fingerprint = (t) => require('crypto').createHash('sha256').update(t).digest('hex').slice(0, 16);

/**
 * Retorna el token vigent i el renova si fa més de 20 dies.
 * El token renovat es desa a Blobs lligat al token de Netlify del qual surt:
 * si canvies IG_ACCESS_TOKEN a Netlify, es torna a fer servir el nou.
 */
async function currentToken(store) {
  const base = envToken();
  const saved = await store.get('token', { type: 'json' });
  const valid = saved && saved.from === fingerprint(base);
  let token = valid ? saved.token : base;
  const since = valid ? Date.now() - new Date(saved.refreshedAt).getTime() : Infinity;
  // Els tokens EA… d'usuari del sistema no caduquen: no cal renovar-los.
  if (token && !isFacebookToken(token) && since > REFRESH_AFTER_MS) {
    try {
      const url = `https://${HOST(token)}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.access_token) {
        token = data.access_token;
        await store.setJSON('token', { token, from: fingerprint(base), refreshedAt: new Date().toISOString() });
      }
    } catch (err) {
      console.error('No s\'ha pogut renovar el token d\'Instagram:', err.message);
    }
  }
  return token;
}

/**
 * Tria la publicació que toca: aprovada, amb la data passada, no publicada
 * i amb menys de 48 h de retard. Retorna { due, late }.
 */
function pickDue(posts, published, now = Date.now()) {
  const late = [];
  const due = posts
    .filter((p) => p.approved === true && !published[p.id])
    .filter((p) => {
      const at = new Date(p.publishAt).getTime();
      if (!Number.isFinite(at) || at > now) return false;
      if (now - at > LATE_LIMIT_MS) { late.push(p.id); return false; }
      return true;
    })
    .sort((a, b) => new Date(a.publishAt) - new Date(b.publishAt));
  return { due: due[0] || null, late };
}

module.exports = { MIN_GAP_MS, REEL_EXPIRE_MS, createReel, containerStatus, publishContainer, publish, findPublished, currentToken, pickDue, whoAmI, envToken, describeToken, LATE_LIMIT_MS };
