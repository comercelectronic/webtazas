// Estoc per colors: les tasses en blanc de cada color (interior i nansa) són
// compartides per totes les paraules. L'estoc es desa a data/site.json
// (colors[].stock). 0 = exhaurit; sense valor = sense límit.
const site = require('../../../data/site.json');

const COLORS = Object.fromEntries(site.colors.map((c) => [c.id, c]));
const LOW_STOCK = 2;

function colorStock(id) {
  const c = COLORS[id];
  if (!c) return 0;
  return Number.isInteger(c.stock) ? Math.max(0, c.stock) : Infinity;
}

const inStock = (id) => colorStock(id) > 0;

/** El color preferit si n'hi ha; si no, el primer disponible de la llista. */
function pickColor(preferred, allowed) {
  if (inStock(preferred) && allowed.includes(preferred)) return preferred;
  return allowed.find(inStock) || null;
}

module.exports = { COLORS, LOW_STOCK, colorStock, inStock, pickColor };
