// Escolta els esdeveniments de Stripe. Quan un pagament s'ha cobrat de debò:
//   1. descompta les unitats venudes de l'estoc;
//   2. suma les unitats al comptador de vendes (per a "Els més venuts").
// Es fa aquí, i no en crear la sessió, per no comptar carretons abandonats.
//
// Stripe pot reenviar el mateix esdeveniment diverses vegades: cada sessió
// es marca com a processada per no descomptar-la dues vegades.
//
// Configuració a Stripe (Desenvolupadors → Webhooks):
//   URL: https://<domini>/.netlify/functions/stripe-webhook
//   Esdeveniments: checkout.session.completed, checkout.session.async_payment_succeeded
// El "signing secret" (whsec_...) va a Netlify com a STRIPE_WEBHOOK_SECRET.
const { PRODUCTS } = require('./lib/catalog');
const { store } = require('./lib/http');
const { stockStore } = require('./lib/stock');

function parseItems(meta) {
  return String(meta || '').split(',').filter(Boolean).map((pair) => {
    const [slug, q] = pair.split(':');
    return { slug, qty: parseInt(q, 10) || 0 };
  }).filter((i) => PRODUCTS[i.slug] && i.qty > 0);
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Falten STRIPE_SECRET_KEY o STRIPE_WEBHOOK_SECRET a Netlify.');
    return { statusCode: 500, body: 'Server not configured' };
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const rawBody = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body;
  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, event.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Signatura de webhook no vàlida:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  const relevant = ['checkout.session.completed', 'checkout.session.async_payment_succeeded'];
  const session = stripeEvent.data && stripeEvent.data.object;
  if (!relevant.includes(stripeEvent.type) || !session || session.payment_status !== 'paid') {
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  }

  try {
    const stock = stockStore(event);
    const doneKey = `processed/${session.id}`;
    if (await stock.get(doneKey)) return { statusCode: 200, body: JSON.stringify({ received: true, duplicate: true }) };

    const items = parseItems(session.metadata && session.metadata.items);
    for (const { slug, qty } of items) {
      const raw = await stock.get(slug);
      if (raw === null) continue; // producte sense estoc controlat
      const current = parseInt(raw, 10);
      await stock.set(slug, String(Math.max(0, (Number.isFinite(current) ? current : 0) - qty)));
    }

    const sales = store(event, 'sales');
    const counts = (await sales.get('counts', { type: 'json' })) || {};
    for (const { slug, qty } of items) counts[slug] = (counts[slug] || 0) + qty;
    await sales.setJSON('counts', counts);

    await stock.set(doneKey, new Date().toISOString());
  } catch (err) {
    console.error("Error processant el webhook:", err);
    return { statusCode: 500, body: 'Error processing webhook' };
  }
  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
