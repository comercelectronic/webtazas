// Escolta els esdeveniments de Stripe. Quan un pagament es completa de
// debò (checkout.session.completed), descompta les unitats venudes de
// l'estoc. Fer-ho aquí —i no en crear la sessió de pagament— evita
// descomptar estoc de carretons que algú abandona sense pagar.
//
// Cal configurar-ho a Stripe (Dashboard → Desenvolupadors → Webhooks):
// URL de l'endpoint: https://<el-teu-domini>/.netlify/functions/stripe-webhook
// Esdeveniment a escoltar: checkout.session.completed
// Això et dona un "signing secret" (comença per whsec_) que has de desar
// a Netlify com a variable d'entorn STRIPE_WEBHOOK_SECRET.
const { stockStore } = require('./lib/stock');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Falten STRIPE_SECRET_KEY o STRIPE_WEBHOOK_SECRET a Netlify.');
    return { statusCode: 500, body: 'Server not configured' };
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const sig = event.headers['stripe-signature'];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Signatura de webhook no vàlida:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const itemsMeta = (session.metadata && session.metadata.items) || '';
    const pairs = itemsMeta
      .split(',')
      .filter(Boolean)
      .map((pair) => {
        const [slug, qtyStr] = pair.split(':');
        return { slug, qty: parseInt(qtyStr, 10) || 0 };
      });

    try {
      const store = stockStore(event);
      for (const { slug, qty } of pairs) {
        if (!slug || qty <= 0) continue;
        const raw = await store.get(slug);
        if (raw === null) continue; // producte no controlat: no fem res
        const current = parseInt(raw, 10);
        const next = Math.max(0, (Number.isFinite(current) ? current : 0) - qty);
        await store.set(slug, String(next));
      }
    } catch (err) {
      console.error('Error actualitzant l\'estoc des del webhook:', err);
      return { statusCode: 500, body: 'Error processing webhook' };
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
