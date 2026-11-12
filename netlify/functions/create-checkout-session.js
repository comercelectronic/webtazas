// Crea la sessió de pagament de Stripe Checkout.
//
// S'executa al servidor: aquí viu la clau secreta de Stripe (STRIPE_SECRET_KEY,
// configurada a Netlify, mai al codi) i aquí es decideix el preu que es cobra.
// El preu i l'enviament surten de data/site.json, el mateix fitxer amb què es
// generen les pàgines, així que el que es mostra i el que es cobra coincideixen.
const { PRODUCTS, site } = require('./lib/catalog');
const { stockStore, readStock } = require('./lib/stock');
const { json, parseJson, siteOrigin } = require('./lib/http');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("Falta la variable d'entorn STRIPE_SECRET_KEY a Netlify.");
    return json(500, { error: 'El pagament no està configurat al servidor.' });
  }

  const { body, error } = parseJson(event, 8192);
  if (error) return error;
  const items = body.items;
  if (!Array.isArray(items) || items.length === 0) return json(400, { error: 'La cistella és buida.' });
  if (items.length > Object.keys(PRODUCTS).length) return json(400, { error: 'Petició no vàlida.' });

  let stock;
  try {
    stock = await readStock(stockStore(event));
  } catch (err) {
    console.error("Error llegint l'estoc:", err);
    return json(500, { error: "No s'ha pogut comprovar l'estoc. Torna-ho a provar." });
  }

  // Agrupem per si arriba el mateix producte repetit.
  const qtyBySlug = new Map();
  for (const item of items) {
    const product = PRODUCTS[item && item.id];
    if (!product) return json(400, { error: `Producte desconegut: ${item && item.id}` });
    const qty = Math.min(site.maxQtyPerItem, Math.max(1, parseInt(item.qty, 10) || 1));
    qtyBySlug.set(product.slug, Math.min(site.maxQtyPerItem, (qtyBySlug.get(product.slug) || 0) + qty));
  }

  const origin = siteOrigin(event, site);
  const line_items = [];
  const itemsMeta = [];
  for (const [slug, qty] of qtyBySlug) {
    const product = PRODUCTS[slug];
    const available = stock[slug];
    if (available !== null && available !== undefined && qty > available) {
      return json(409, {
        error: available > 0 ? `Només queden ${available} unitats de «${product.name}».` : `«${product.name}» s'ha exhaurit.`,
      });
    }
    itemsMeta.push(`${slug}:${qty}`);
    line_items.push({
      quantity: qty,
      price_data: {
        currency: site.currency.toLowerCase(),
        unit_amount: site.unitPriceCents,
        product_data: { name: `Tassa «${product.name}»`, images: [`${origin}${product.images.front}`] },
      },
    });
  }

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
          display_name: 'Enviament estàndard',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: site.shipping.minBusinessDays },
            maximum: { unit: 'business_day', value: site.shipping.maxBusinessDays },
          },
        },
      }],
      phone_number_collection: { enabled: true },
      metadata: { items: itemsMeta.join(',') },
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
