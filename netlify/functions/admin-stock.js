// Endpoint protegit per contrasenya (variable d'entorn ADMIN_PASSWORD a
// Netlify) perquè puguis consultar i actualitzar l'estoc de cada producte
// des de la pàgina admin-estoc.html, sense haver de tocar codi.
const { PRODUCT_SLUGS, stockStore, readStock } = require('./lib/stock');

exports.handler = async function (event) {
  if (!process.env.ADMIN_PASSWORD) {
    console.error('Falta la variable d\'entorn ADMIN_PASSWORD a Netlify.');
    return { statusCode: 500, body: JSON.stringify({ error: 'La pàgina d\'administració no està configurada.' }) };
  }

  const store = stockStore(event);

  if (event.httpMethod === 'GET') {
    const password = event.headers['x-admin-password'];
    if (password !== process.env.ADMIN_PASSWORD) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Contrasenya incorrecta.' }) };
    }
    const stock = await readStock(store);
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(stock) };
  }

  if (event.httpMethod === 'POST') {
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (e) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Petició no vàlida.' }) };
    }

    if (body.password !== process.env.ADMIN_PASSWORD) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Contrasenya incorrecta.' }) };
    }
    if (!PRODUCT_SLUGS.includes(body.slug)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Producte desconegut.' }) };
    }
    const qty = parseInt(body.stock, 10);
    if (!Number.isFinite(qty) || qty < 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'La quantitat ha de ser un número de 0 o més.' }) };
    }

    await store.set(body.slug, String(qty));
    const stock = await readStock(store);
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(stock) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
