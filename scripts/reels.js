// Genera reels d'Instagram (MP4 vertical 1080×1920, 30 fps) a instagram/reels/.
// Cada reel és una pàgina HTML amb una funció render(t) que dibuixa el fotograma
// del segon t; Playwright en fa una captura per fotograma i ffmpeg els uneix.
// El reel del configurador grava la web real: cal el servidor local (BASE_URL).
//
//   node scripts/reels.js                 # tots
//   node scripts/reels.js colors bocamoll # només aquests
//
// Els vídeos no porten música: s'hi afegeix a l'app d'Instagram en publicar-los
// (els àudios en tendència ajuden molt a l'abast).
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }

const ROOT = path.join(__dirname, '..');
const site = require('../data/site.json');
const catalog = require('../data/catalog.json');
const { PRICE } = require('./lib');
const OUT = path.join(ROOT, 'instagram/reels');
const FPS = 30;
const W = 1080;
const H = 1920;
const BASE_URL = process.env.BASE_URL || 'http://localhost:8941';
const asset = (p) => 'file://' + path.join(ROOT, p);
const P = (slug) => catalog.find((p) => p.slug === slug);
const mugImg = (slug, color, side = 'front') => asset(`images/tasses/${slug}/${color}-${side}@2x.webp`);

const C = { cream: '#F4EFE6', ink: '#292823', terra: '#B66F54', deep: '#9C5640', terraDark: '#8A4A33', sage: '#C5CDB8', soft: '#F3E2D9', white: '#FFFEFC' };

const BASE_CSS = `
@font-face { font-family: Lora; src: url('${asset('assets/fonts/lora.woff2')}'); font-weight: 400 700; }
@font-face { font-family: Lora; src: url('${asset('assets/fonts/lora-ext.woff2')}'); font-weight: 400 700; unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF; }
@font-face { font-family: Lora; src: url('${asset('assets/fonts/lora-italic.woff2')}'); font-style: italic; font-weight: 400 700; }
@font-face { font-family: Inter; src: url('${asset('assets/fonts/inter.woff2')}'); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: ${W}px; height: ${H}px; overflow: hidden; }
body { font-family: Inter, sans-serif; color: ${C.ink}; background: ${C.cream}; position: relative; }
.serif { font-family: Lora, serif; }
.abs { position: absolute; }
.center { left: 0; right: 0; text-align: center; }
.pill { display: inline-block; padding: 14px 30px; border-radius: 999px; font-weight: 700; font-size: 30px; letter-spacing: .08em; text-transform: uppercase; }
.layer { position: absolute; inset: 0; }
`;

// Funcions d'animació comunes (dins de la pàgina).
const HELPERS = `
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const prog = (t, a, b) => clamp((t - a) / (b - a));
const ease = (x) => 1 - Math.pow(1 - x, 3);
const fade = (t, a, b, c, d) => Math.min(ease(prog(t, a, b)), d === undefined ? 1 : 1 - ease(prog(t, c, d)));
const $ = (s) => document.querySelector(s);
const show = (el, o, dy = 0, s = 1) => { el.style.opacity = o; el.style.transform = 'translateY(' + dy + 'px) scale(' + s + ')'; };
`;

// Targeta final comuna (preu i com demanar-la).
const END_CARD = `
<div class="layer" id="end" style="background:${C.deep};color:#fff;opacity:0">
  <div class="abs center" style="top:560px">
    <img src="${asset('assets/brand/el-glopet-logo-light.svg')}" style="height:120px">
    <p class="serif" style="font-size:76px;line-height:1.1;margin-top:80px">Tasses amb paraules<br><em style="color:#F6DDD0">catalanes</em></p>
    <p style="font-size:40px;margin-top:60px;font-weight:600">${PRICE} · enviament gratuït</p>
    <p style="font-size:36px;margin-top:22px;color:#F7ECE6">Demana la teva per DM 📩</p>
    <p style="font-size:32px;margin-top:70px;letter-spacing:.04em;color:#F7ECE6">elglopet.com</p>
  </div>
</div>`;
const END_JS = (start) => `show($('#end'), fade(t, ${start}, ${start + 0.4}), 0, 1);`;

// ---------- Reel 1: una paraula, 9 colors ----------
function reelColors() {
  const slug = 'aixopluc';
  const colors = site.colors.filter((c) => fs.existsSync(path.join(ROOT, `images/tasses/${slug}/${c.id}-front@2x.webp`)));
  const step = 0.55;
  const t0 = 1.4;
  const tEnd = t0 + colors.length * step + 0.3;
  const html = `
<div class="abs center" id="title" style="top:250px">
  <p class="serif" style="font-size:96px;line-height:1.05">Una paraula.</p>
  <p class="serif" style="font-size:96px;line-height:1.05;font-style:italic;color:${C.terraDark}">${colors.length} colors.</p>
</div>
<div class="abs" id="mugbox" style="left:90px;right:90px;top:640px;height:900px;background:#fff;border-radius:60px;overflow:hidden">
  ${colors.map((c, i) => `<img data-c="${i}" src="${mugImg(slug, c.id)}" style="position:absolute;inset:40px;width:calc(100% - 80px);height:calc(100% - 80px);object-fit:contain;opacity:${i ? 0 : 1}">`).join('')}
</div>
<div class="abs center" id="label" style="top:1590px"><span class="pill" id="pill" style="background:${C.soft};color:${C.terraDark};font-size:40px;padding:18px 40px">${colors[0].name}</span></div>
${END_CARD}
<script>${HELPERS}
const COLORS = ${JSON.stringify(colors.map((c) => ({ name: c.name, hex: c.hex })))};
function render(t) {
  show($('#title'), fade(t, 0, 0.5), (1 - ease(prog(t, 0, 0.5))) * 40);
  show($('#mugbox'), fade(t, 0.2, 0.8), (1 - ease(prog(t, 0.2, 0.8))) * 80);
  const i = Math.max(0, Math.min(COLORS.length - 1, Math.floor((t - ${t0}) / ${step})));
  document.querySelectorAll('[data-c]').forEach((im) => { im.style.opacity = +im.dataset.c === i ? 1 : 0; });
  const k = (t - ${t0}) / ${step} - i;
  $('#mugbox').style.transform += ' scale(' + (t > ${t0} ? 1 + 0.025 * Math.max(0, 1 - k * 4) : 1) + ')';
  $('#pill').textContent = COLORS[i].name;
  $('#pill').style.boxShadow = '0 0 0 6px ' + COLORS[i].hex;
  show($('#label'), fade(t, 0.6, 1.0));
  ${END_JS(tEnd)}
}
</script>`;
  return { name: 'colors', duration: tEnd + 2.6, html, cover: 2.2 };
}

// ---------- Reel 2: tots tenim un bocamoll ----------
function reelWord(slug, hook1, hook2, cta) {
  const p = P(slug);
  const c = p.defaultColor;
  const defs = [p.def1, p.def2];
  const tType = 2.6;
  const tTypeEnd = tType + 2.6;
  const tMug = tTypeEnd + 0.6;
  const tBack = tMug + 2.0;
  const tCta = tBack + 1.8;
  const tEnd = tCta + 1.6;
  const html = `
<div class="abs center" id="h1" style="top:640px;padding:0 90px">
  <p class="serif" style="font-size:92px;line-height:1.08">${hook1}</p>
  <p class="serif" id="h2" style="font-size:92px;line-height:1.08;font-style:italic;color:${C.terraDark};margin-top:20px">${hook2}</p>
</div>
<div class="abs" id="dict" style="left:80px;right:80px;top:560px;background:#fff;border-radius:48px;padding:70px 70px 80px;opacity:0">
  <p><span class="serif" style="font-size:120px;font-weight:500">${p.name.toLowerCase()}</span></p>
  <p class="serif" style="font-size:38px;opacity:.6;margin-top:6px">${p.phonetic || ''}</p>
  <div style="height:3px;background:${C.terra};margin:34px 0 40px;opacity:.7"></div>
  ${defs.map((d, i) => `<p style="font-size:42px;line-height:1.35;margin-top:${i ? 26 : 0}px;min-height:114px"><span style="color:${C.terra};font-weight:700">${i + 1}.</span> <span data-def="${i}"></span></p>`).join('')}
</div>
<div class="abs" id="mug" style="left:90px;right:90px;top:520px;height:980px;background:#fff;border-radius:60px;overflow:hidden;opacity:0">
  <img id="front" src="${mugImg(slug, c)}" style="position:absolute;inset:40px;width:calc(100% - 80px);height:calc(100% - 80px);object-fit:contain">
  <img id="back" src="${mugImg(slug, c, 'back')}" style="position:absolute;inset:40px;width:calc(100% - 80px);height:calc(100% - 80px);object-fit:contain;opacity:0">
</div>
<div class="abs center" id="side" style="top:1560px;opacity:0"><span class="pill" style="background:${C.soft};color:${C.terraDark}" id="sidepill">Davant</span></div>
<div class="abs center" id="cta" style="top:300px;opacity:0"><p class="serif" style="font-size:84px;line-height:1.1">${cta}</p></div>
${END_CARD}
<script>${HELPERS}
const DEFS = ${JSON.stringify(defs)};
function render(t) {
  show($('#h1'), fade(t, 0, 0.5, ${tType - 0.5}, ${tType - 0.1}));
  show($('#h2'), fade(t, 1.0, 1.4), (1 - ease(prog(t, 1.0, 1.4))) * 30);
  show($('#dict'), fade(t, ${tType - 0.2}, ${tType + 0.2}, ${tTypeEnd + 0.4}, ${tTypeEnd + 0.8}), (1 - ease(prog(t, ${tType - 0.2}, ${tType + 0.2}))) * 50);
  const total = DEFS.join('').length;
  let n = Math.floor(total * prog(t, ${tType + 0.3}, ${tTypeEnd}));
  DEFS.forEach((d, i) => { const k = Math.max(0, Math.min(d.length, n)); document.querySelector('[data-def="' + i + '"]').textContent = d.slice(0, k); n -= d.length; });
  show($('#mug'), fade(t, ${tMug}, ${tMug + 0.4}), 0, 0.94 + 0.06 * ease(prog(t, ${tMug}, ${tMug + 0.6})));
  const back = prog(t, ${tBack}, ${tBack + 0.35});
  $('#front').style.opacity = 1 - back; $('#back').style.opacity = back;
  show($('#side'), fade(t, ${tMug + 0.3}, ${tMug + 0.6}));
  $('#sidepill').textContent = back > 0.5 ? 'Darrere' : 'Davant';
  show($('#cta'), fade(t, ${tCta}, ${tCta + 0.4}), (1 - ease(prog(t, ${tCta}, ${tCta + 0.4}))) * 30);
  ${END_JS(tEnd)}
}
</script>`;
  return { name: slug, duration: tEnd + 2.6, html, cover: tType + 2.2 };
}

// ---------- Reel 3: crea la teva (grava el configurador real) ----------
async function configuratorStates(browser, dir) {
  const ctx = await browser.newContext({ viewport: { width: 420, height: 900 }, deviceScaleFactor: 2.4 });
  await ctx.addInitScript(() => { try { localStorage.setItem('tdm-consent', JSON.stringify({ v: 2, analytics: false, at: Date.now() })); } catch (e) { /* res */ } });
  const page = await ctx.newPage();
  await page.goto(`${BASE_URL}/crea-la-teva-tassa/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelectorAll('[data-consent], .consent, .cookie-banner').forEach((e) => e.remove()));
  const states = [];
  let n = 0;
  const snap = async (caption, hold) => {
    await page.waitForTimeout(120);
    const file = path.join(dir, `s${String(n++).padStart(3, '0')}.png`);
    await (await page.$('.mug-photo')).screenshot({ path: file });
    states.push({ file, caption, hold });
  };
  // 1. Estructura i paraula, lletra a lletra
  await page.click('label.choice:nth-child(2)');
  await page.click('[data-gender="f"]');
  await page.fill('#mk-word', '');
  await page.fill('#mk-def1', '');
  await snap('1. Tria la frase', 0.9);
  for (const ch of 'tastaolletes') { await page.type('#mk-word', ch); await snap('2. Escriu la paraula', 0.09); }
  await snap('2. Escriu la paraula', 0.5);
  await page.fill('#mk-sub', 'avui ioga, demà ceràmica ');
  await page.click('#mk-sub'); await page.keyboard.press('End');
  await page.click('.emoji-btn[data-emoji="🤪"]');
  await snap('3. Afegeix-hi emoticones', 1.1);
  for (const d of ['cara-rialla', 'globus', 'estel']) { await page.click(`label.drawing:has(input[value="${d}"])`); await snap('4. Tria un dibuix', 0.55); }
  for (const c of ['Rosa', 'Verd', 'Taronja']) { await page.click(`label.swatch[title="${c}"]`); await snap('5. I el color', 0.55); }
  await page.fill('#mk-def2', 'Ho vol provar tot i no acaba mai res 😅');
  await page.click('[data-mug-view="back"]');
  await snap('6. Al darrere, la definició', 1.6);
  await ctx.close();
  return states;
}

function reelConfigurator(states) {
  let t = 1.4;
  const timeline = states.map((s) => { const a = t; t += s.hold; return { ...s, a }; });
  const tEnd = t + 0.4;
  const html = `
<div class="abs center" id="title" style="top:200px">
  <p class="serif" style="font-size:88px;line-height:1.05">No trobes la paraula?</p>
  <p class="serif" style="font-size:88px;line-height:1.05;font-style:italic;color:${C.terraDark}">Crea-la tu.</p>
</div>
<div class="abs" id="box" style="left:70px;right:70px;top:500px;height:940px;background:#fff;border-radius:60px;overflow:hidden">
  ${timeline.map((s, i) => `<img data-i="${i}" src="file://${s.file}" style="position:absolute;inset:20px;width:calc(100% - 40px);height:calc(100% - 40px);object-fit:contain;opacity:${i ? 0 : 1}">`).join('')}
</div>
<div class="abs center" id="cap" style="top:1500px"><span class="pill" id="pill" style="background:${C.ink};color:#fff;text-transform:none;letter-spacing:0;font-size:40px">${timeline[0].caption}</span></div>
${END_CARD}
<script>${HELPERS}
const TL = ${JSON.stringify(timeline.map((s) => ({ a: s.a, caption: s.caption })))};
function render(t) {
  show($('#title'), fade(t, 0, 0.5), (1 - ease(prog(t, 0, 0.5))) * 40);
  show($('#box'), fade(t, 0.2, 0.7));
  let i = 0; TL.forEach((s, k) => { if (t >= s.a) i = k; });
  document.querySelectorAll('[data-i]').forEach((im) => { im.style.opacity = +im.dataset.i === i ? 1 : 0; });
  $('#pill').textContent = TL[i].caption;
  show($('#cap'), fade(t, 0.6, 1.0));
  ${END_JS(tEnd)}
}
</script>`;
  return { name: 'crea-la-teva', duration: tEnd + 2.6, html, cover: 4.2 };
}

async function render(browser, reel) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `reel-${reel.name}-`));
  const htmlFile = path.join(tmp, 'reel.html');
  fs.writeFileSync(htmlFile, `<!doctype html><html lang="ca"><head><meta charset="utf-8"><style>${BASE_CSS}</style></head><body>${reel.html}</body></html>`);
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto('file://' + htmlFile, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = r; i.onerror = r; })))));
  const frames = Math.round(reel.duration * FPS);
  for (let f = 0; f < frames; f += 1) {
    await page.evaluate((t) => window.render(t), f / FPS);
    await page.screenshot({ path: path.join(tmp, `f${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 });
  }
  await page.evaluate((t) => window.render(t), reel.cover);
  fs.mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: path.join(OUT, `${reel.name}-portada.jpg`), type: 'jpeg', quality: 90 });
  await page.close();
  const mp4 = path.join(OUT, `${reel.name}.mp4`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%05d.jpg'),
    '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-shortest',
    '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', mp4]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`✔ ${path.relative(ROOT, mp4)} (${reel.duration.toFixed(1)} s)`);
}

(async () => {
  const only = process.argv.slice(2);
  const want = (n) => !only.length || only.includes(n);
  const browser = await chromium.launch();
  if (want('colors')) await render(browser, reelColors());
  if (want('bocamoll')) await render(browser, reelWord('bocamoll', 'Tots tenim un amic…', 'que no sap guardar un secret 🤫', 'Etiqueta el teu 👇'));
  if (want('crea-la-teva')) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reel-states-'));
    const states = await configuratorStates(browser, dir);
    await render(browser, reelConfigurator(states));
    fs.rmSync(dir, { recursive: true, force: true });
  }
  await browser.close();
})();
