// Dades públiques que la web carrega en una sola petició:
//   stock        unitats per tassa (null = sense límit)
//   ratings      mitjana i nombre de valoracions APROVADES (només les que en tenen)
//   latest       darreres valoracions aprovades
//   bestsellers  tasses més venudes, calculades a partir de pagaments reals.
//                Només es retorna si almenys 3 tasses tenen vendes; si no, buit.
const { json, store } = require('./lib/http');
const { stockStore, readStock } = require('./lib/stock');

const MIN_PRODUCTS_WITH_SALES = 3;

exports.handler = async function (event) {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method Not Allowed' });
  try {
    const [stock, summary, counts] = await Promise.all([
      readStock(stockStore(event)),
      store(event, 'reviews').get('summary', { type: 'json' }),
      store(event, 'sales').get('counts', { type: 'json' }),
    ]);
    const sold = Object.entries(counts || {}).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
    return json(200, {
      stock,
      ratings: (summary && summary.ratings) || {},
      latest: (summary && summary.latest) || [],
      bestsellers: sold.length >= MIN_PRODUCTS_WITH_SALES ? sold.slice(0, 4).map(([slug]) => slug) : [],
    });
  } catch (err) {
    console.error('Error llegint les dades de la botiga:', err);
    return json(500, { error: "No s'han pogut llegir les dades." });
  }
};
