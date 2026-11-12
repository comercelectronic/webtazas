// Estoc i vendes per a /admin/ (contrasenya ADMIN_PASSWORD).
//   GET  → { stock: {slug: n|null}, sales: {slug: unitats venudes} }
//   POST {slug, stock}       stock = número ≥ 0, o null per tornar a "sense límit"
const { PRODUCT_SLUGS } = require('./lib/catalog');
const { json, parseJson, store, requireAdmin } = require('./lib/http');
const { stockStore, readStock } = require('./lib/stock');

exports.handler = async function (event) {
  const denied = await requireAdmin(event);
  if (denied) return denied;
  const st = stockStore(event);

  const payload = async () => ({
    stock: await readStock(st),
    sales: (await store(event, 'sales').get('counts', { type: 'json' })) || {},
  });

  if (event.httpMethod === 'GET') return json(200, await payload());

  if (event.httpMethod === 'POST') {
    const { body, error } = parseJson(event);
    if (error) return error;
    if (!PRODUCT_SLUGS.includes(body.slug)) return json(400, { error: 'Producte desconegut.' });
    if (body.stock === null || body.stock === '') {
      await st.delete(body.slug);
      return json(200, await payload());
    }
    const qty = parseInt(body.stock, 10);
    if (!Number.isFinite(qty) || qty < 0 || qty > 100000) return json(400, { error: 'La quantitat ha de ser un número de 0 o més.' });
    await st.set(body.slug, String(qty));
    return json(200, await payload());
  }

  return json(405, { error: 'Method Not Allowed' });
};
