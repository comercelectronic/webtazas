// Moderació de valoracions (contrasenya ADMIN_PASSWORD).
//   GET  → pendents + publicades
//   POST {action:'approve'|'reject', id}
//   POST {action:'delete', slug, id}   (retira una valoració ja publicada)
const { PRODUCT_SLUGS, PRODUCTS } = require('./lib/catalog');
const { json, parseJson, store, requireAdmin, cleanupRateLimits } = require('./lib/http');
const { publicReview, summarize, approvedFor } = require('./lib/reviews');

const GUARD_DAYS = 365;

async function rebuildSummary(st) {
  const ratings = {};
  let all = [];
  for (const slug of PRODUCT_SLUGS) {
    const list = await approvedFor(st, slug);
    const s = summarize(list);
    if (s.count) ratings[slug] = s;
    all = all.concat(list.map((r) => ({ ...publicReview(r), slug, productName: PRODUCTS[slug].name })));
  }
  all.sort((a, b) => (a.date < b.date ? 1 : -1));
  await st.setJSON('summary', { ratings, latest: all.slice(0, 6), updatedAt: new Date().toISOString() });
}

// Neteja de dades que ja no calen: comptadors de límit antics i marques
// "ja ha valorat" de fa més d'un any (vegeu la política de privacitat).
async function cleanup(st) {
  await cleanupRateLimits(st);
  const { blobs: guards } = await st.list({ prefix: 'guard/' });
  for (const b of guards) {
    const at = await st.get(b.key);
    if (at && Date.now() - new Date(at).getTime() > GUARD_DAYS * 86400000) await st.delete(b.key);
  }
}

exports.handler = async function (event) {
  const denied = await requireAdmin(event);
  if (denied) return denied;
  const st = store(event, 'reviews');

  try {
    if (event.httpMethod === 'GET') {
      await cleanup(st);
      const { blobs } = await st.list({ prefix: 'pending/' });
      const pending = (await Promise.all(blobs.map((b) => st.get(b.key, { type: 'json' })))).filter(Boolean)
        .map((r) => ({ id: r.id, slug: r.slug, productName: (PRODUCTS[r.slug] || {}).name, name: r.name, rating: r.rating, comment: r.comment, createdAt: r.createdAt, flags: r.flags || [] }))
        .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
      const approved = [];
      for (const slug of PRODUCT_SLUGS) {
        (await approvedFor(st, slug)).forEach((r) => approved.push({ ...publicReview(r), slug, productName: PRODUCTS[slug].name }));
      }
      return json(200, { pending, approved });
    }

    if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });
    const { body, error } = parseJson(event);
    if (error) return error;
    const id = String(body.id || '');
    if (!/^[a-f0-9]{16}$/.test(id)) return json(400, { error: 'Identificador no vàlid.' });

    if (body.action === 'approve' || body.action === 'reject') {
      const rec = await st.get(`pending/${id}`, { type: 'json' });
      if (!rec) return json(404, { error: 'Aquesta valoració ja no està pendent.' });
      if (body.action === 'approve') {
        const list = await approvedFor(st, rec.slug);
        // Es publica sense el hash de la IP (minimització de dades).
        list.push({ id: rec.id, name: rec.name, rating: rec.rating, comment: rec.comment, createdAt: rec.createdAt, approvedAt: new Date().toISOString() });
        await st.setJSON(`approved/${rec.slug}`, list);
      }
      await st.delete(`pending/${id}`);
      await rebuildSummary(st);
      return json(200, { ok: true });
    }

    if (body.action === 'delete') {
      const slug = String(body.slug || '');
      if (!PRODUCTS[slug]) return json(400, { error: 'Producte desconegut.' });
      const list = await approvedFor(st, slug);
      await st.setJSON(`approved/${slug}`, list.filter((r) => r.id !== id));
      await rebuildSummary(st);
      return json(200, { ok: true });
    }

    return json(400, { error: 'Acció desconeguda.' });
  } catch (err) {
    console.error('Error a la moderació:', err);
    return json(500, { error: "S'ha produït un error." });
  }
};
