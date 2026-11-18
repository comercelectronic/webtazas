// Crea la sessió de pagament de Stripe Checkout.
//
// S'executa al servidor: aquí viu la clau secreta de Stripe (STRIPE_SECRET_KEY,
// configurada a Netlify, mai al codi) i aquí es decideix el preu que es cobra.
// Els preus surten de lib/pricing.js (data/site.json), el mateix que fa servir
// el generador de pàgines: el que es mostra i el que es cobra coincideixen.
const { site, PRODUCTS } = require('./lib/pricing');
const { priceCart } = require('./lib/cart');
const { stockStore, readStock } = require('./lib/stock');
const { json, parseJson, siteOrigin } = require('./lib/http');

const truncate = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("Falta la variable d'entorn STRIPE_SECRET_KEY a Netlify.");
    return json(500, { error: 'El pagament no està configurat al servidor.' });
  }

  const { body, error } = parseJson(event, 32768);
  if (error) return error;

  const priced = priceCart(body.items);
  if (priced.error) return json(priced.status || 400, { error: priced.error });
  const { lines, units } = priced;

  let stock;
  try {
    stock = await readStock(stockStore(event));
  } catch (err) {
    console.error("Error llegint l'estoc:", err);
    return json(500, { error: "No s'ha pogut comprovar l'estoc. Torna-ho a provar." });
  }
  for (const [slug, qty] of Object.entries(units)) {
    const available = stock[slug];
    if (available !== null && available !== undefined && qty > available) {
      const name = PRODUCTS[slug].name;
      return json(409, { error: available > 0 ? `Només queden ${available} unitats de «${name}».` : `«${name}» s'ha exhaurit.` });
    }
  }

  const origin = siteOrigin(event, site);
  const metadata = {};
  const itemsMeta = [];
  let customN = 0;
  const line_items = lines.map((l) => {
    if (l.type === 'mug') itemsMeta.push(`m:${l.slug}:${l.color || ''}:${l.qty}`);
    if (l.type === 'pack') itemsMeta.push(`p:${l.id}:${l.qty}`);
    if (l.type === 'custom') {
      customN += 1;
      itemsMeta.push(`c:${customN}:${l.qty}`);
      metadata[`personalitzada_${customN}`] = truncate(JSON.stringify(l.design), 500);
    }
    const product_data = { name: truncate(l.name, 250) };
    if (l.description) product_data.description = truncate(l.description, 1000);
    if (l.image) product_data.images = [`${origin}${l.image}`];
    return {
      quantity: l.qty,
      price_data: { currency: site.currency.toLowerCase(), unit_amount: l.unitCents, product_data },
    };
  });
  metadata.items = truncate(itemsMeta.join(','), 500);

  const free = site.shipping.costCents === 0;
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      shipping_address_collection: { allowed_countries: site.shipping.countries },
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: site.shipping.costCents, currency: site.currency.toLowerCase() },
          display_name: free ? 'Enviament gratuït' : 'Enviament estàndard',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: site.shipping.minBusinessDays },
            maximum: { unit: 'business_day', value: site.shipping.maxBusinessDays },
          },
        },
      }],
      phone_number_collection: { enabled: true },
      metadata,
      success_url: `${origin}/gracies/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/tasses/`,
      locale: 'auto',
    });
    return json(200, { url: session.url });
  } catch (err) {
    console.error('Error creant la sessió de Stripe Checkout:', err);
    return json(500, { error: "No s'ha pogut crear el pagament. Torna-ho a provar." });
  }
};
