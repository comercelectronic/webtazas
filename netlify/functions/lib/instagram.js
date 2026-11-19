// Publicació a Instagram amb l'API oficial de Meta («Instagram API with
// Instagram login»: no cal pàgina de Facebook, només un compte professional).
//
// Variables d'entorn a Netlify (mai al codi):
//   IG_USER_ID       identificador del compte d'Instagram professional
//   IG_ACCESS_TOKEN  token de llarga durada (60 dies). La funció el renova
//                    sola i desa el token nou a Netlify Blobs.
//   IG_API_HOST      opcional, per defecte graph.instagram.com
//   IG_API_VERSION   opcional, per defecte v23.0
const HOST = () => process.env.IG_API_HOST || 'graph.instagram.com';
const VERSION = () => process.env.IG_API_VERSION || 'v23.0';

const LATE_LIMIT_MS = 48 * 3600 * 1000;    // més tard que això, no es publica
const REFRESH_AFTER_MS = 20 * 86400 * 1000; // renova el token cada 20 dies

async function api(path, params, { method = 'POST', token } = {}) {
  const url = new URL(`https://${HOST()}/${VERSION()}/${path}`);
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
async function waitReady(id, token, tries = 10) {
  for (let i = 0; i < tries; i += 1) {
    const { status_code: s } = await api(id, { fields: 'status_code' }, { method: 'GET', token });
    if (s === 'FINISHED') return;
    if (s === 'ERROR' || s === 'EXPIRED') throw new Error(`El contenidor ${id} ha fallat (${s}).`);
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error(`El contenidor ${id} no ha estat llest a temps.`);
}

/** Publica una imatge o un carrusel. `images` són URL públiques de JPEG. */
async function publish({ userId, token, images, caption }) {
  let creationId;
  if (images.length === 1) {
    ({ id: creationId } = await api(`${userId}/media`, { image_url: images[0], caption }, { token }));
  } else {
    const children = [];
    for (const image_url of images.slice(0, 10)) {
      const { id } = await api(`${userId}/media`, { image_url, is_carousel_item: 'true' }, { token });
      children.push(id);
    }
    for (const id of children) await waitReady(id, token);
    ({ id: creationId } = await api(`${userId}/media`, { media_type: 'CAROUSEL', children: children.join(','), caption }, { token }));
  }
  await waitReady(creationId, token);
  const { id } = await api(`${userId}/media_publish`, { creation_id: creationId }, { token });
  return id;
}

/** Retorna el token vigent i el renova si fa més de 20 dies. */
async function currentToken(store) {
  const saved = await store.get('token', { type: 'json' });
  let token = (saved && saved.token) || process.env.IG_ACCESS_TOKEN;
  const since = saved ? Date.now() - new Date(saved.refreshedAt).getTime() : Infinity;
  if (token && since > REFRESH_AFTER_MS) {
    try {
      const url = `https://${HOST()}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.access_token) {
        token = data.access_token;
        await store.setJSON('token', { token, refreshedAt: new Date().toISOString() });
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

module.exports = { publish, currentToken, pickDue, LATE_LIMIT_MS };
