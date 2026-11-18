// Única font de veritat dels preus. La fan servir el generador de pàgines
// (el que es mostra) i les funcions de pagament (el que es cobra).
const catalog = require('../../../data/catalog.json');
const site = require('../../../data/site.json');
const configurator = require('../../../data/configurator.json');

const PRODUCTS = Object.fromEntries(catalog.map((p) => [p.slug, p]));
const PACKS = Object.fromEntries(site.packs.map((p) => [p.id, p]));
const COLORS = Object.fromEntries(site.colors.map((c) => [c.id, c]));

/** Preu que es cobra per una tassa del catàleg (amb l'oferta, si en té). */
function productPriceCents(slug) {
  const offer = site.offers && site.offers.items && site.offers.items[slug];
  return Number.isInteger(offer) && offer > 0 && offer < site.unitPriceCents ? offer : site.unitPriceCents;
}

function hasOffer(slug) {
  return productPriceCents(slug) < site.unitPriceCents;
}

/** Suma del que costarien per separat les tasses d'un pack. */
function packSeparateCents(pack) {
  return pack.slugs.reduce((t, s) => t + productPriceCents(s), 0);
}

function packPriceCents(pack) {
  const separate = packSeparateCents(pack);
  return Number.isInteger(pack.priceCents) && pack.priceCents > 0 && pack.priceCents <= separate ? pack.priceCents : separate;
}

function customPriceCents() {
  return Number.isInteger(site.customPriceCents) ? site.customPriceCents : site.unitPriceCents;
}

function colorName(id) {
  return COLORS[id] ? COLORS[id].name.toLowerCase() : '';
}

module.exports = {
  site, catalog, configurator, PRODUCTS, PACKS, COLORS,
  productPriceCents, hasOffer, packSeparateCents, packPriceCents, customPriceCents, colorName,
};
