// Catàleg compartit: el mateix fitxer que fa servir el generador de pàgines
// (scripts/build.js). Aquí és d'on surten els preus que es cobren de debò.
const catalog = require('../../../data/catalog.json');
const site = require('../../../data/site.json');

const PRODUCTS = Object.fromEntries(catalog.map((p) => [p.slug, p]));
const PRODUCT_SLUGS = catalog.map((p) => p.slug);

module.exports = { catalog, site, PRODUCTS, PRODUCT_SLUGS };
