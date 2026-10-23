// Endpoint públic i de només lectura: retorna l'estoc actual de cada
// producte perquè la web pugui mostrar "Exhaurit" o avisar que en queden
// poques unitats. No requereix contrasenya perquè no revela res sensible,
// només quantitats.
const { stockStore, readStock } = require('./lib/stock');

exports.handler = async function (event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const stock = await readStock(stockStore(event));
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify(stock),
    };
  } catch (err) {
    console.error('Error llegint l\'estoc:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'No s\'ha pogut llegir l\'estoc.' }) };
  }
};
