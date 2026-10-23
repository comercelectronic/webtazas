// Funció serverless que crea una sessió de pagament de Stripe Checkout.
//
// S'executa al servidor (Netlify Functions), no al navegador: aquí és on
// viu la clau secreta de Stripe (variable d'entorn STRIPE_SECRET_KEY,
// configurada al tauler de Netlify, MAI al codi ni al repositori) i on es
// validen els preus reals de cada producte, perquè ningú els pugui alterar
// manipulant el JavaScript del navegador.
//
// IMPORTANT: aquest catàleg ha de coincidir amb el de script.js (noms i
// preus en cèntims). Si afegeixes o canvies un producte a la web, actualitza
// els dos llocs.
const { stockStore, readStock } = require('./lib/stock');

const PRODUCTS = {
  'fer-volar-coloms': { name: 'Fer Volar Coloms', price: 1890, image: 'images/mug-coloms.jpg' },
  'aneu-a-fer-punyetes': { name: 'Aneu a Fer Punyetes', price: 1890, image: 'images/mug-punyetes.jpg' },
  'qui-no-plora-no-mama': { name: 'Qui no plora, no mama', price: 1490, image: null },
  'cofoi': { name: 'Cofoi', price: 1550, image: null },
  'escarransit': { name: 'Escarransit', price: 1550, image: null },
  'esbojarrat': { name: 'Esbojarrat', price: 1550, image: null },
  'carallot-oficial': { name: 'Carallot Oficial', price: 1690, image: null },
  'arsenal-insults': { name: "L'Arsenal d'Insults", price: 1890, image: 'images/mug-insults-front.jpg' },
  'no-em-toquis-ovaris': { name: 'No em Toquis els Ovaris', price: 1890, image: 'images/mug-no-toquis-front.jpg' },
};

// Tarifa d'enviament fixa, en cèntims. Ajusta-la a les teves tarifes reals
// (o substitueix-la per diverses opcions / zones) abans de vendre de debò.
const SHIPPING_CENTS = 495;

const MAX_QTY_PER_ITEM = 20;

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Falta la variable d\'entorn STRIPE_SECRET_KEY a Netlify.');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'El pagament no està configurat al servidor.' }),
    };
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  let items;
  try {
    const body = JSON.parse(event.body || '{}');
    items = body.items;
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Petició no vàlida.' }) };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'La cistella és buida.' }) };
  }

  const origin = event.headers.origin || `https://${event.headers.host}`;

  let stock;
  try {
    stock = await readStock(stockStore(event));
  } catch (err) {
    console.error('Error llegint l\'estoc:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'No s\'ha pogut comprovar l\'estoc. Torna-ho a provar.' }) };
  }

  const line_items = [];
  const itemsMeta = [];
  for (const item of items) {
    const product = PRODUCTS[item && item.id];
    if (!product) {
      return { statusCode: 400, body: JSON.stringify({ error: `Producte desconegut: ${item && item.id}` }) };
    }
    const qty = Math.min(MAX_QTY_PER_ITEM, Math.max(1, parseInt(item.qty, 10) || 1));

    const available = stock[item.id];
    if (available !== null && available !== undefined && qty > available) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          error: available > 0
            ? `Només queden ${available} unitats de «${product.name}».`
            : `«${product.name}» s'ha exhaurit.`,
        }),
      };
    }

    itemsMeta.push(`${item.id}:${qty}`);
    line_items.push({
      quantity: qty,
      price_data: {
        currency: 'eur',
        unit_amount: product.price,
        product_data: {
          name: product.name,
          images: product.image ? [`${origin}/${product.image}`] : undefined,
        },
      },
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      shipping_address_collection: {
        allowed_countries: ['ES', 'FR', 'PT', 'AD', 'IT', 'DE'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: SHIPPING_CENTS, currency: 'eur' },
            display_name: 'Enviament estàndard',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
      ],
      phone_number_collection: { enabled: true },
      metadata: { items: itemsMeta.join(',') },
      success_url: `${origin}/gracies.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#productes`,
      locale: 'auto',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('Error creant la sessió de Stripe Checkout:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'No s\'ha pogut crear el pagament. Torna-ho a provar.' }),
    };
  }
};
