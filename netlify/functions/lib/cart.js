// Valida el contingut de la cistella que arriba del navegador i el converteix
// en línies amb el preu calculat aquí (mai el que digui el navegador).
//
// Tipus de línia:
//   { type: 'mug',    id: <slug>, color: <color>, qty }
//   { type: 'pack',   id: <pack>, qty }
//   { type: 'custom', design: {...}, qty }     tassa creada amb el configurador
const {
  site, configurator, PRODUCTS, PACKS, COLORS,
  productPriceCents, packPriceCents, customPriceCents, colorName,
} = require('./pricing');
const { check } = require('./moderation');
const { colorStock } = require('./colors');

const MAX_LINES = 30;
const DRAWINGS = new Set(configurator.drawings.map((d) => d.id));
const EMOJIS = new Set(configurator.emojis || []);
const STRUCTURES = Object.fromEntries(configurator.structures.map((s) => [s.id, s]));
// Lletres, números, puntuació habitual i emoticones (amb modificadors de to i unions).
const TEXT_RE = /^(?:[\p{L}\p{M}\p{N} .,'’·!?¡¿«»"\-:;()…&/]|\p{Extended_Pictographic}|\p{Emoji_Modifier}|\u200D|\uFE0F)*$/u;

const clampQty = (q) => Math.min(site.maxQtyPerItem, Math.max(1, parseInt(q, 10) || 1));
const clean = (s) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();

function productTitle(p) {
  return p.intro ? `${p.intro} ${p.name.toLowerCase()}` : p.name;
}

/** Valida un disseny del configurador. Retorna { design } o { error }. */
function validateDesign(raw) {
  if (!raw || typeof raw !== 'object') return { error: 'Disseny no vàlid.' };
  const L = configurator.limits;
  const structure = STRUCTURES[raw.structure];
  if (!structure) return { error: 'Tria una estructura per a la tassa.' };
  const d = {
    structure: structure.id,
    intro: clean(raw.intro).slice(0, L.intro),
    word: clean(raw.word).slice(0, L.word),
    sub: structure.sub ? clean(raw.sub).slice(0, L.sub) : '',
    def1: clean(raw.def1).slice(0, L.def),
    def2: clean(raw.def2).slice(0, L.def),
    drawing: DRAWINGS.has(raw.drawing) || EMOJIS.has(raw.drawing) ? raw.drawing : '',
    color: COLORS[raw.color] ? raw.color : site.colors[0].id,
  };
  if (!d.word) return { error: 'Escriu la paraula o la frase principal de la tassa.' };
  const texts = [d.intro, d.word, d.sub, d.def1, d.def2];
  if (texts.some((t) => !TEXT_RE.test(t))) return { error: 'El text conté caràcters que no podem imprimir.' };
  const verdict = check(texts.join(' · '));
  if (verdict.block) return { error: verdict.block };
  if ((verdict.flags || []).includes('possible contingut ofensiu')) {
    return { error: 'No imprimim textos ofensius. Prova amb una altra paraula.' };
  }
  return { design: d };
}

function describeDesign(d) {
  const front = [d.intro, d.word].filter(Boolean).join(' ');
  const parts = [`Davant: «${front}»`];
  if (d.sub) parts.push(`subtítol: «${d.sub}»`);
  if (d.drawing) parts.push(`dibuix: ${d.drawing}`);
  if (d.def1 || d.def2) parts.push(`darrere: 1. ${d.def1 || '—'} 2. ${d.def2 || '—'}`);
  parts.push(`interior i nansa: ${colorName(d.color)}`);
  return parts.join(' · ');
}

/**
 * Converteix els elements de la cistella en línies de cobrament.
 * Retorna { lines, units } o { error, status }.
 * `units` compta les unitats de cada tassa del catàleg (per a l'estoc).
 */
function priceCart(items) {
  if (!Array.isArray(items) || items.length === 0) return { error: 'La cistella és buida.', status: 400 };
  if (items.length > MAX_LINES) return { error: 'Petició no vàlida.', status: 400 };

  const merged = new Map();
  for (const raw of items) {
    if (!raw || typeof raw !== 'object') return { error: 'Petició no vàlida.', status: 400 };
    const type = raw.type || 'mug';
    const qty = clampQty(raw.qty);

    if (type === 'mug') {
      const p = PRODUCTS[raw.id];
      if (!p) return { error: `Producte desconegut: ${raw.id}`, status: 400 };
      const colors = p.colors || [];
      const color = colors.length ? (colors.includes(raw.color) ? raw.color : p.defaultColor) : null;
      const key = `mug:${p.slug}:${color || ''}`;
      const prev = merged.get(key);
      merged.set(key, {
        type, slug: p.slug, color, qty: Math.min(site.maxQtyPerItem, (prev ? prev.qty : 0) + qty),
        unitCents: productPriceCents(p.slug),
        name: `Tassa «${productTitle(p)}»${color ? ` · ${colorName(color)}` : ''}`,
        image: p.colors && color ? `/images/tasses/${p.slug}/${color}-front.jpg` : p.images.front,
      });
    } else if (type === 'pack') {
      const pack = PACKS[raw.id];
      if (!pack) return { error: `Pack desconegut: ${raw.id}`, status: 400 };
      const key = `pack:${pack.id}`;
      const prev = merged.get(key);
      const names = pack.slugs.map((s) => PRODUCTS[s].name).join(', ');
      merged.set(key, {
        type, id: pack.id, slugs: pack.slugs, qty: Math.min(site.maxQtyPerItem, (prev ? prev.qty : 0) + qty),
        unitCents: packPriceCents(pack),
        name: `${pack.name}: ${names}`,
        image: PRODUCTS[pack.slugs[0]].images.front,
      });
    } else if (type === 'custom') {
      const { design, error } = validateDesign(raw.design);
      if (error) return { error, status: 400 };
      const key = `custom:${JSON.stringify(design)}`;
      const prev = merged.get(key);
      merged.set(key, {
        type, design, qty: Math.min(site.maxQtyPerItem, (prev ? prev.qty : 0) + qty),
        unitCents: customPriceCents(),
        name: `Tassa personalitzada «${[design.intro, design.word].filter(Boolean).join(' ')}»`,
        description: describeDesign(design),
      });
    } else {
      return { error: 'Petició no vàlida.', status: 400 };
    }
  }

  const lines = [...merged.values()];
  const units = {};
  for (const l of lines) {
    if (l.type === 'mug') units[l.slug] = (units[l.slug] || 0) + l.qty;
    if (l.type === 'pack') l.slugs.forEach((s) => { units[s] = (units[s] || 0) + l.qty; });
  }
  // Estoc per colors: totes les tasses d'un color comparteixen les tasses en blanc.
  const colorUnits = {};
  const addColor = (c, n) => { if (c) colorUnits[c] = (colorUnits[c] || 0) + n; };
  for (const l of lines) {
    if (l.type === 'mug') addColor(l.color, l.qty);
    if (l.type === 'custom') addColor(l.design.color, l.qty);
    if (l.type === 'pack') l.slugs.forEach((s) => addColor(PRODUCTS[s].defaultColor, l.qty));
  }
  for (const [c, n] of Object.entries(colorUnits)) {
    const left = colorStock(c);
    if (n > left) {
      return {
        status: 409,
        error: left === 0
          ? `El color ${colorName(c).toLowerCase()} s'ha exhaurit. Tria'n un altre.`
          : `Només queden ${left} tasses de color ${colorName(c).toLowerCase()}.`,
      };
    }
  }
  return { lines, units, colorUnits };
}

module.exports = { priceCart, validateDesign, describeDesign, productTitle };
