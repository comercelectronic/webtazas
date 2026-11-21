// Genera els pins de Pinterest de totes les tasses: una imatge vertical
// (1000×1500) per tassa a pinterest/pins/ i els fitxers CSV per a la càrrega
// massiva de Pinterest (pinterest/lot-N.csv), en lots petits per anar-los
// pujant un cada dia.
//
// No forma part del build de Netlify: s'executa a mà quan canvia el catàleg.
//   node scripts/pinterest-pins.js
const fs = require('fs');
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }

const ROOT = path.join(__dirname, '..');
const site = require('../data/site.json');
const catalog = require('../data/catalog.json');
const OUT = path.join(ROOT, 'pinterest');
const PINS = path.join(OUT, 'pins');
const W = 1000;
const H = 1500;
const LOT_SIZE = 9;

const C = { cream: '#F4EFE6', ink: '#292823', deep: '#9C5640', terraDark: '#8A4A33', soft: '#F3E2D9', white: '#FFFEFC' };
const asset = (p) => 'file://' + path.join(ROOT, p);
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const CAT = Object.fromEntries(site.categories.map((c) => [c.id, c]));

// Taulers de Pinterest (cal crear-los abans de pujar els CSV, amb aquests noms exactes).
const BOARDS = {
  amor: 'Paraules d\'amor en català',
  caracter: 'Paraules catalanes de caràcter',
  insults: 'Insults catalans d\'autor',
  humor: 'Frases en català amb humor',
};

const title = (p) => (p.intro ? `${p.intro} ${p.name.toLowerCase()}` : p.name);
const meaning = (p) => (p.def2 || p.tagline || p.summary || '').replace(/\.$/, '');

function image(p, side) {
  if (p.colors && p.colors.length) {
    if (side === 'back' && !p.images.back) return null;
    const c = p.defaultColor;
    const webp = `images/tasses/${p.slug}/${c}-${side}@2x.webp`;
    return asset(fs.existsSync(path.join(ROOT, webp)) ? webp : `images/tasses/${p.slug}/${c}-${side}.jpg`);
  }
  const src = side === 'front' ? p.images.front : p.images.back;
  return src ? asset(src.replace(/^\//, '')) : null;
}

function html(p) {
  const cat = CAT[p.category];
  const back = image(p, 'back');
  const head = p.intro
    ? `<p class="serif intro">${esc(p.intro)}</p><p class="serif word">${esc(p.name.toLowerCase())}</p>`
    : `<p class="serif word word--long">${esc(p.name)}</p>`;
  return `<!doctype html><html lang="ca"><head><meta charset="utf-8"><style>
@font-face { font-family: Lora; src: url('${asset('assets/fonts/lora.woff2')}'); font-weight: 400 700; }
@font-face { font-family: Lora; src: url('${asset('assets/fonts/lora-ext.woff2')}'); font-weight: 400 700; unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF; }
@font-face { font-family: Lora; src: url('${asset('assets/fonts/lora-italic.woff2')}'); font-style: italic; font-weight: 400 700; }
@font-face { font-family: Inter; src: url('${asset('assets/fonts/inter.woff2')}'); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: ${W}px; height: ${H}px; overflow: hidden; }
body { font-family: Inter, sans-serif; color: ${C.ink}; background: ${C.cream}; position: relative; display: flex; flex-direction: column; }
.serif { font-family: Lora, serif; }
.top { padding: 76px 72px 0; }
.pill { display: inline-block; padding: 10px 24px; border-radius: 999px; background: ${C.soft}; color: ${C.terraDark}; font-weight: 700; font-size: 24px; letter-spacing: .08em; text-transform: uppercase; }
.intro { font-size: 52px; line-height: 1.1; margin-top: 34px; }
.word { font-size: 104px; line-height: 1.02; font-style: italic; color: ${C.terraDark}; font-weight: 500; }
.word--long { font-size: 72px; line-height: 1.08; margin-top: 34px; }
.ipa { font-family: Lora, serif; font-size: 28px; opacity: .65; margin-top: 14px; }
.def { font-size: 32px; line-height: 1.35; margin-top: 14px; max-width: 840px; }
.mug { position: relative; flex: 1; margin: 44px 72px 150px; background: #fff; border-radius: 40px; overflow: hidden; }
.mug img { position: absolute; inset: 24px; width: calc(100% - 48px); height: calc(100% - 48px); object-fit: contain; }
.back { position: absolute; right: 96px; bottom: 176px; width: 250px; background: #fff; border-radius: 26px; box-shadow: 0 10px 30px rgba(41,40,35,.16); padding: 10px 10px 14px; text-align: center; }
.back img { width: 100%; display: block; border-radius: 18px; }
.back span { font-size: 20px; font-weight: 600; opacity: .7; }
.foot { position: absolute; left: 72px; right: 72px; bottom: 64px; display: flex; align-items: center; justify-content: space-between; }
.foot img { height: 56px; }
.foot span { font-size: 30px; font-weight: 600; }
</style></head><body>
<div class="top">
  <p class="pill">${esc(cat ? cat.singular : 'Tassa')}</p>
  ${head}
  ${p.phonetic ? `<p class="ipa">${esc(p.phonetic)}</p>` : ''}
  <p class="def">${esc(meaning(p))}.</p>
</div>
<div class="mug"><img src="${image(p, 'front')}" alt=""></div>
${back ? `<div class="back"><img src="${back}" alt=""><span>Al darrere</span></div>` : ''}
<div class="foot"><img src="${asset('assets/brand/el-glopet-logo.svg')}" alt=""><span>elglopet.com</span></div>
</body></html>`;
}

// Textos del pin (títol ≤ 100 caràcters, descripció ≤ 500).
function pinTitle(p) {
  const t = `Tassa «${title(p)}» · regal en català`;
  return t.length <= 100 ? t : `Tassa «${title(p)}»`.slice(0, 100);
}

function pinDescription(p) {
  const what = p.def2
    ? `${p.name}: ${p.def2.charAt(0).toLowerCase()}${p.def2.slice(1)}`
    : (p.tagline ? `${p.name}: ${p.tagline}.` : p.summary);
  const parts = [
    what.replace(/\.?$/, '.'),
    p.def1 ? 'Al davant, el missatge; al darrere, la definició de diccionari.' : '',
    p.colors && p.colors.length ? `Interior i nansa en ${p.colors.length} colors.` : '',
    `Tassa de ceràmica ${site.brandOf}, amb enviament gratuït.`,
    'Un regal original en català.',
  ].filter(Boolean);
  return parts.join(' ').slice(0, 500);
}

function keywords(p) {
  const base = ['tassa catalana', 'regal en català', 'paraules catalanes', 'tassa personalitzada', 'regal original'];
  const byCat = { amor: ['regal per a la parella', 'paraules boniques en català'], caracter: ['humor en català', 'regal per a amics'], insults: ['insults catalans', 'humor en català'], humor: ['frases divertides', 'humor en català'] };
  return [p.name.toLowerCase(), ...(byCat[p.category] || []), ...base].join(', ');
}

const link = (p) => `${site.siteUrl}/tasses/${p.slug}/?utm_source=pinterest&utm_medium=social&utm_campaign=pins`;
const media = (p) => `${site.siteUrl}/pinterest/pins/${p.slug}.jpg`;

function csvCell(v) {
  const s = String(v == null ? '' : v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Ordre: alterna categories perquè cada lot sigui variat.
function interleave(items) {
  const groups = {};
  items.forEach((p) => { (groups[p.category] = groups[p.category] || []).push(p); });
  const lists = Object.values(groups);
  const out = [];
  for (let i = 0; out.length < items.length; i += 1) lists.forEach((l) => { if (l[i]) out.push(l[i]); });
  return out;
}

(async () => {
  fs.mkdirSync(PINS, { recursive: true });
  const products = interleave(catalog);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  const tmp = path.join(OUT, '.tmp.html');
  for (const p of products) {
    fs.writeFileSync(tmp, html(p));
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(PINS, `${p.slug}.jpg`), type: 'jpeg', quality: 88 });
  }
  fs.unlinkSync(tmp);
  await browser.close();

  const header = ['Title', 'Media URL', 'Pinterest board', 'Thumbnail', 'Description', 'Link', 'Publish date', 'Keywords'];
  const rows = products.map((p) => [pinTitle(p), media(p), BOARDS[p.category], '', pinDescription(p), link(p), '', keywords(p)]);
  const toCsv = (rs) => [header, ...rs].map((r) => r.map(csvCell).join(',')).join('\n') + '\n';
  fs.readdirSync(OUT).filter((f) => /^lot-\d+\.csv$/.test(f)).forEach((f) => fs.unlinkSync(path.join(OUT, f)));
  fs.writeFileSync(path.join(OUT, 'tots-els-pins.csv'), toCsv(rows));
  for (let i = 0; i < rows.length; i += LOT_SIZE) {
    fs.writeFileSync(path.join(OUT, `lot-${i / LOT_SIZE + 1}.csv`), toCsv(rows.slice(i, i + LOT_SIZE)));
  }
  console.log(`${products.length} pins · ${Math.ceil(rows.length / LOT_SIZE)} lots · taulers: ${[...new Set(rows.map((r) => r[2]))].join(' | ')}`);
})();
