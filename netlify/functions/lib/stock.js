// Lògica compartida de l'estoc, feta servir per get-stock, admin-stock,
// create-checkout-session i stripe-webhook.
//
// L'estoc es desa a Netlify Blobs (un magatzem clau-valor inclòs amb
// Netlify, sense necessitat de donar-se d'alta enlloc més). Cada clau és
// l'slug d'un producte i el valor és el nombre d'unitats disponibles, com
// a text.
//
// Si un producte no té cap entrada desada, es considera "no controlat":
// es pot comprar sense límit, exactament com fins ara. Això evita que la
// botiga deixi de vendre res just després de desplegar aquesta funcionalitat,
// abans que ningú hagi posat cap quantitat real a la pàgina d'administració.
const { getStore, connectLambda } = require('@netlify/blobs');

const PRODUCT_SLUGS = [
  'fer-volar-coloms',
  'aneu-a-fer-punyetes',
  'qui-no-plora-no-mama',
  'cofoi',
  'escarransit',
  'esbojarrat',
  'carallot-oficial',
  'arsenal-insults',
  'no-em-toquis-ovaris',
];

// Les Netlify Functions clàssiques (exports.handler) no tenen l'entorn de
// Netlify Blobs configurat automàticament: cal "connectar" l'esdeveniment
// de la petició abans de demanar l'store.
function stockStore(event) {
  connectLambda(event);
  return getStore('stock');
}

// Retorna { slug: number|null } per a tots els productes. null = no controlat.
async function readStock(store) {
  const result = {};
  await Promise.all(
    PRODUCT_SLUGS.map(async (slug) => {
      const raw = await store.get(slug);
      if (raw === null || raw === undefined) {
        result[slug] = null;
        return;
      }
      const n = parseInt(raw, 10);
      result[slug] = Number.isFinite(n) ? n : null;
    })
  );
  return result;
}

module.exports = { PRODUCT_SLUGS, stockStore, readStock };
