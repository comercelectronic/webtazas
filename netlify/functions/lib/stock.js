// L'estoc es desa a Netlify Blobs: cada clau és l'slug d'un producte i el
// valor, les unitats disponibles. Un producte sense entrada es considera
// "no controlat" i es ven sense límit (com abans d'activar l'estoc).
const { store } = require('./http');
const { PRODUCT_SLUGS } = require('./catalog');

function stockStore(event) {
  return store(event, 'stock');
}

// Retorna { slug: number|null } per a tots els productes. null = no controlat.
async function readStock(st) {
  const result = {};
  await Promise.all(
    PRODUCT_SLUGS.map(async (slug) => {
      const raw = await st.get(slug);
      const n = raw === null || raw === undefined ? NaN : parseInt(raw, 10);
      result[slug] = Number.isFinite(n) ? n : null;
    })
  );
  return result;
}

module.exports = { PRODUCT_SLUGS, stockStore, readStock };
