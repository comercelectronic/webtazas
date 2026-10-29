// El Último Umbral — interfaz, renderizado, audio y guardado.
import { parseLevel, createState, act, cellAt, passable, DIM_INFO, ECHO_MAX } from './engine.js';
import { LEVELS } from './levels.js';
import { LEVEL_TEXT, DOCS, ACHIEVEMENTS, QUIPS, CHAPTER, FRAGMENTS_TOTAL } from './story.js';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ===================================================================
// Guardado (localStorage, siempre tolerante a fallos)
// ===================================================================
const SAVE_KEY = 'umbral.save.v1';
const defaultSave = () => ({
  completed: {},
  docs: [],
  achievements: [],
  seenIntro: {},
  prologue: false,
  log: [],
  stats: {},
  settings: {
    sfx: true,
    music: true,
    reduceMotion: typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches,
    textSpeed: 'normal',
    bigText: false,
  },
});

function loadSave() {
  const def = defaultSave();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      return { ...def, ...d, settings: { ...def.settings, ...(d.settings || {}) } };
    }
  } catch { /* almacenamiento no disponible: se juega sin guardar */ }
  return def;
}
let save = loadSave();
function persist() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch { /* sin guardado */ }
}

function statFor(id) {
  save.stats[id] ||= { plays: 0, wins: 0, resets: 0, undos: 0, hints: 0, moves: 0, switches: 0, echoes: 0, timeMs: 0, abandons: 0 };
  return save.stats[id];
}

// ===================================================================
// Audio: drones ambientales por dimensión y efectos discretos
// ===================================================================
const Sound = (() => {
  let ctx = null, master, music, sfx, drone = null, dim = 'O';
  const DRONES = { O: [110, 165, 220.5], E: [98, 147, 196.4], F: [103.8, 160.2, 207] };

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    music = ctx.createGain(); music.gain.value = save.settings.music ? 0.07 : 0; music.connect(master);
    sfx = ctx.createGain(); sfx.gain.value = save.settings.sfx ? 0.32 : 0; sfx.connect(master);
    setDim(dim, true);
  }

  function setDim(d, force) {
    if (d === dim && !force) return;
    dim = d;
    if (!ctx) return;
    const t = ctx.currentTime;
    if (drone) {
      const old = drone;
      old.gain.gain.cancelScheduledValues(t);
      old.gain.gain.setTargetAtTime(0, t, 0.25);
      setTimeout(() => old.oscs.forEach((o) => o.stop()), 1500);
    }
    const gain = ctx.createGain(); gain.gain.value = 0;
    const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = d === 'F' ? 900 : 600;
    gain.connect(filter); filter.connect(music);
    const oscs = DRONES[d].map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? 'sine' : d === 'F' ? 'sawtooth' : 'triangle';
      o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = i === 0 ? 0.6 : 0.18;
      o.connect(g); g.connect(gain); o.start();
      return o;
    });
    const lfo = ctx.createOscillator(); lfo.frequency.value = d === 'E' ? 0.35 : 0.12;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 180;
    lfo.connect(lfoGain); lfoGain.connect(filter.frequency); lfo.start();
    oscs.push(lfo);
    gain.gain.setTargetAtTime(1, t, 0.4);
    drone = { gain, oscs };
  }

  function tone(freq, dur, type = 'sine', vol = 0.4, when = 0, slideTo = null) {
    if (!ctx || !save.settings.sfx) return;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(sfx); o.start(t); o.stop(t + dur + 0.05);
  }

  function noise(dur, vol, freq) {
    if (!ctx || !save.settings.sfx) return;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 0.8;
    const g = ctx.createGain(); g.gain.value = vol;
    src.connect(f); f.connect(g); g.connect(sfx); src.start();
  }

  // El mismo motivo regresa ligeramente alterado en cada dimensión.
  function motif() {
    const shift = { O: 1, E: 0.89, F: 1.06 }[dim];
    [440, 523.3, 659.3, 587.3].forEach((f, i) => tone(f * shift, 0.5, 'sine', 0.22, i * 0.16));
  }

  const fx = {
    step: () => tone(240, 0.05, 'triangle', 0.08),
    push: () => tone(110, 0.14, 'square', 0.12, 0, 70),
    blocked: () => tone(80, 0.09, 'sawtooth', 0.07),
    plate: () => tone(660, 0.09, 'sine', 0.22),
    door: () => tone(180, 0.3, 'triangle', 0.2, 0, 360),
    dim: () => { noise(0.25, 0.5, dim === 'F' ? 2400 : 900); tone(dim === 'E' ? 330 : dim === 'F' ? 311 : 262, 0.25, 'sine', 0.12); },
    rec: () => { tone(880, 0.08, 'square', 0.1); tone(880, 0.08, 'square', 0.1, 0.14); },
    echo: () => tone(520, 0.35, 'sine', 0.2, 0, 260),
    fracture: () => { noise(0.45, 0.6, 300); tone(62, 0.45, 'sawtooth', 0.12); },
    console: (ok) => tone(ok ? 780 : 140, 0.14, ok ? 'sine' : 'square', 0.15),
    doc: () => motif(),
    win: () => [523.3, 659.3, 784, 1046.5].forEach((f, i) => tone(f, 0.4, 'triangle', 0.18, i * 0.1)),
  };

  function applySettings() {
    if (!ctx) return;
    music.gain.setTargetAtTime(save.settings.music ? 0.07 : 0, ctx.currentTime, 0.2);
    sfx.gain.setTargetAtTime(save.settings.sfx ? 0.32 : 0, ctx.currentTime, 0.05);
  }

  return { init, setDim, fx, applySettings };
})();

// ===================================================================
// Paletas por dimensión
// ===================================================================
const PAL = {
  O: { bg: '#0d0a06', floor: '#2a2016', line: '#3a2c1d', wallTop: '#c98a3c', wallFront: '#6f4618', accent: '#ffb347', void: '#040302', star: '#5c4426' },
  E: { bg: '#050b14', floor: '#112035', line: '#1a3150', wallTop: '#4b88da', wallFront: '#1f406f', accent: '#7fd0ff', void: '#01040a', star: '#2c5e8f' },
  F: { bg: '#0f0614', floor: '#25112e', line: '#391a46', wallTop: '#9a48c8', wallFront: '#4f1a61', accent: '#ff5c8a', void: '#050108', star: '#7a2a5a' },
};
const DIMCOL = { O: '#ffb347', E: '#6ec6ff', F: '#ff5c8a' };

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function mix(a, b, t) {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
}
function palette(from, to, t) {
  if (t >= 1 || from === to) return PAL[to];
  const out = {};
  for (const k in PAL[to]) out[k] = mix(PAL[from][k], PAL[to][k], t);
  return out;
}
const hash = (x, y) => {
  let h = (x * 374761393 + y * 668265263) ^ 0x5bd1e995;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

// ===================================================================
// Estado de la partida
// ===================================================================
const G = {
  levelIdx: 0,
  lvl: null,
  state: null,
  history: [],
  vis: null,
  pal: { from: 'O', to: 'O', t: 1 },
  shake: 0,
  flash: 0,
  bump: null,
  solidWalls: new Set(),
  taught: new Set(),
  resetsThisLevel: 0,
  hintsThisPlay: 0,
  warned: false,
  startedAt: 0,
  input: true,
  dialog: null,
};

const screens = ['title', 'levels', 'game', 'archive', 'achievements', 'settings', 'pause', 'hint', 'win', 'end', 'doc'];
const overlayStack = [];
let baseScreen = 'title';

function showBase(name) {
  baseScreen = name;
  overlayStack.length = 0;
  for (const s of screens) $(`#screen-${s}`).classList.toggle('active', s === name);
  if (name === 'levels') renderLevelGrid();
  if (name !== 'game') setBodyDim('O');
  else setBodyDim(G.state?.dim || 'O');
}
function openOverlay(name) {
  overlayStack.push(name);
  $(`#screen-${name}`).classList.add('active');
}
function closeOverlay() {
  const name = overlayStack.pop();
  if (name) $(`#screen-${name}`).classList.remove('active');
}
const overlayOpen = () => overlayStack.length > 0;

function setBodyDim(d) {
  document.body.dataset.dim = d;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = PAL[d].bg;
}

function applySettings() {
  document.body.classList.toggle('reduce-motion', !!save.settings.reduceMotion);
  document.body.classList.toggle('big-text', !!save.settings.bigText);
  Sound.applySettings();
}

// ===================================================================
// Carga de niveles
// ===================================================================
const parsed = LEVELS.map(parseLevel);
const isUnlocked = (i) => i === 0 || !!save.completed[LEVELS[i - 1].id];

function startLevel(idx, { skipIntro = false } = {}) {
  closeStaleStats();
  G.levelIdx = idx;
  G.lvl = parsed[idx];
  G.state = createState(G.lvl);
  G.history = [];
  G.taught = new Set();
  G.resetsThisLevel = 0;
  G.hintsThisPlay = 0;
  G.warned = false;
  G.startedAt = performance.now();
  G.pal = { from: G.state.dim, to: G.state.dim, t: 1 };
  G.solidWalls = interiorWalls(G.lvl);
  snapVisuals();
  statFor(G.lvl.id).plays++;
  save.lastLevel = idx;
  persist();
  $('#toasts').innerHTML = '';
  showBase('game');
  Sound.setDim(G.state.dim);
  updateHud();
  resize();

  const txt = LEVEL_TEXT[G.lvl.id];
  const lines = [];
  if (idx === 0 && !save.prologue) {
    lines.push(...PROLOGUE);
    save.prologue = true;
  }
  if (!skipIntro && !save.seenIntro[G.lvl.id]) lines.push(...txt.intro);
  else if (!skipIntro) lines.push(txt.intro[txt.intro.length - 1]);
  save.seenIntro[G.lvl.id] = true;
  persist();
  if (lines.length) say(lines);
}

// Paredes rodeadas solo de paredes: no se dibujan, para que las salas se lean como volúmenes.
function interiorWalls(lvl) {
  const out = new Set();
  for (const c of lvl.cells) {
    if (c.t !== 'wall') continue;
    let inner = true;
    for (let dy = -1; dy <= 1 && inner; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const n = cellAt(lvl, c.x + dx, c.y + dy);
        if (n && n.t !== 'wall') { inner = false; break; }
      }
    }
    if (inner) out.add(c.y * lvl.w + c.x);
  }
  return out;
}

const PROLOGUE = [
  { who: '', text: 'Año 2189. Un proyecto científico llamado Arquitectura intenta responder a una pregunta que ha obsesionado a la humanidad durante milenios.' },
  { who: '', text: 'Para averiguarlo, conecta diez dimensiones paralelas. El experimento debía durar once minutos.' },
  { who: '', text: 'Duró menos de lo previsto en algunos informes y muchísimo más en otros. El proyecto fue declarado un éxito provisional.' },
  { who: '', text: 'Despiertas en una instalación abandonada. Sin nombre. Sin recuerdos. Un terminal averiado se enciende.' },
];

// Si el jugador sale de una sala sin terminarla, cuenta como abandono para las métricas de prueba.
function closeStaleStats() {
  if (G.lvl && G.state && !G.state.won) {
    const st = statFor(G.lvl.id);
    st.abandons++;
    st.timeMs += Math.round(performance.now() - G.startedAt);
  }
}

// ===================================================================
// Acciones del jugador
// ===================================================================
const DIRS_SET = { U: 1, D: 1, L: 1, R: 1 };
function doAction(action) {
  if (!G.input || !G.state || G.state.won || baseScreen !== 'game' || overlayOpen() || G.dialog) return;
  Sound.init();
  const prev = G.state;
  const { state, events } = act(G.lvl, prev, action);
  // Un choque contra una pared solo cambia hacia dónde miras: no se guarda en el historial.
  const onlyTurned = state.turn === prev.turn && state.px === prev.px && state.py === prev.py && action in DIRS_SET;
  if (state !== prev && !onlyTurned) {
    G.history.push(prev);
    if (G.history.length > 600) G.history.shift();
  }
  G.state = state;
  const st = statFor(G.lvl.id);
  if (state.turn > prev.turn) st.moves++;
  if (action.startsWith('dim:') && state.dim !== prev.dim) st.switches++;
  handleEvents(events, prev, state);
  updateHud();
}

function undo() {
  if (!G.history.length || G.dialog || overlayOpen() || G.state?.won) return;
  const prev = G.state;
  G.state = G.history.pop();
  statFor(G.lvl.id).undos++;
  if (G.state.dim !== prev.dim) changePalette(prev.dim, G.state.dim);
  updateHud();
}

function reset() {
  if (G.dialog || G.state?.won) return;
  const prevDim = G.state.dim;
  G.state = createState(G.lvl);
  G.history = [];
  G.resetsThisLevel++;
  statFor(G.lvl.id).resets++;
  snapVisuals();
  if (prevDim !== G.state.dim) changePalette(prevDim, G.state.dim);
  if (G.resetsThisLevel >= 2) {
    const q = QUIPS.resets[(G.resetsThisLevel - 2) % QUIPS.resets.length];
    toast(q);
  }
  updateHud();
}

function handleEvents(events, prev, s) {
  const moved = s.px !== prev.px || s.py !== prev.py;
  if (moved && !events.some((e) => e.type === 'echo-start')) Sound.fx.step();
  const newlyActive = Object.keys(s.active).some((k) => s.active[k] && !prev.active[k]);
  if (newlyActive) Sound.fx.plate();

  for (const e of events) {
    switch (e.type) {
      case 'blocked':
        if (e.who !== 'P') break;
        Sound.fx.blocked();
        G.bump = { dir: s.facing, t: 0 };
        teach(e);
        break;
      case 'push': if (e.who === 'P') Sound.fx.push(); break;
      case 'door-open': Sound.fx.door(); break;
      case 'dim':
        changePalette(prev.dim, e.dim);
        Sound.setDim(e.dim);
        Sound.fx.dim();
        break;
      case 'interference':
        G.warned = true;
        G.flash = 1;
        Sound.fx.blocked();
        toast(QUIPS.interference[e.what](DIM_INFO[e.dim].name), 'warn');
        break;
      case 'dim-locked': toast(QUIPS.dimLocked); break;
      case 'dim-recording': toast(QUIPS.dimRecording, 'warn'); break;
      case 'echo-locked': toast(QUIPS.echoLocked); break;
      case 'echo-wrong-dim': G.warned = true; toast(QUIPS.echoWrongDim, 'warn'); break;
      case 'record-start': Sound.fx.rec(); toastOnce('rec', QUIPS.recordStart); break;
      case 'record-cancel': toast(QUIPS.recordCancel); break;
      case 'echo-start':
        Sound.fx.echo();
        statFor(G.lvl.id).echoes++;
        snapVisuals();
        toast(e.auto ? QUIPS.echoAuto : QUIPS.echoStart(e.length));
        break;
      case 'fracture':
        Sound.fx.fracture();
        G.shake = save.settings.reduceMotion ? 0 : 1;
        toastOnce('fracture', QUIPS.fracture);
        break;
      case 'fracture-blocked': G.warned = true; toast(QUIPS.fractureBlocked, 'warn'); break;
      case 'lever-spent': toast(QUIPS.leverSpent); break;
      case 'doc': {
        Sound.fx.doc();
        addDoc(e.doc);
        const d = DOCS[e.doc];
        toast(e.secret ? `${QUIPS.docSecret} «${d.title}» añadido al archivo.` : `Registro recuperado: «${d.title}». Consúltalo en el ARCHIVO.`, 'good');
        break;
      }
      case 'console':
        Sound.fx.console(e.progress > 0);
        if (e.done) toast(QUIPS.consoleDone, 'good');
        else if (e.progress > 0) toast(QUIPS.consoleOk(e.progress, G.lvl.code.length));
        else toast(QUIPS.consoleBad, 'warn');
        break;
      case 'win': onWin(); break;
      default: break;
    }
  }
}

// Mensajes que enseñan una regla la primera vez que el jugador choca con ella.
function teach(e) {
  const c = cellAt(G.lvl, e.x, e.y);
  if (!c) return;
  const once = (k, msg) => toastOnce(`teach-${k}`, msg);
  if (c.t === 'door') {
    const req = c.req.map((r) => (r === 'code' ? 'el protocolo de consolas' : `la placa ${r}`)).join(' y ');
    once(`door-${c.x},${c.y}`, `Puerta cerrada. Necesita ${req}. Las puertas, a diferencia del personal, siguen instrucciones.`);
  } else if (c.t === 'dwall') {
    const names = c.dims.map((d) => `${DIM_INFO[d].name} ${DIM_INFO[d].glyph}`).join(' y ');
    once(`dwall-${c.dims.join('')}`, `Esa pared solo existe en ${names}. En otra dimensión, quizá no.`);
  } else if (c.t === 'shift') {
    once('shift', 'Pared desplazable. La mueve una palanca, y la palanca solo responde en Fractura.');
  } else if (c.t === 'bridge' || c.t === 'void') {
    const hasBridge = G.lvl.bridges.length > 0;
    once('void', hasBridge ? 'Vacío. Hay un puente, pero no en esta dimensión, o no ahora. Mira su símbolo y su letra.' : 'Vacío. Caer no está contemplado en el protocolo, así que no te lo permito.');
  }
}

function changePalette(from, to) {
  G.pal = { from, to, t: save.settings.reduceMotion ? 1 : 0 };
  setBodyDim(to);
  if (!save.settings.reduceMotion) G.flash = Math.max(G.flash, 0.35);
}

function addDoc(id) {
  if (!save.docs.includes(id)) { save.docs.push(id); persist(); }
}

// ===================================================================
// Victoria, logros y fin de capítulo
// ===================================================================
function onWin() {
  const s = G.state;
  const id = G.lvl.id;
  const txt = LEVEL_TEXT[id];
  Sound.fx.win();
  const st = statFor(id);
  st.wins++;
  st.timeMs += Math.round(performance.now() - G.startedAt);
  const prevBest = save.completed[id];
  save.completed[id] = {
    moves: Math.min(prevBest?.moves ?? Infinity, s.turn),
    hints: Math.min(prevBest?.hints ?? Infinity, G.hintsThisPlay),
  };
  s.docs.forEach(addDoc);
  addDoc(txt.reward);

  const unlocked = [];
  const grant = (aid) => {
    if (!save.achievements.includes(aid)) { save.achievements.push(aid); unlocked.push(aid); }
  };
  if (id === 10) grant('sujeto47');
  if ((id === 6 || id === 10) && G.hintsThisPlay === 0) grant('comite');
  if (id === 9 && s.leverUsed) grant('noerapuerta');
  if (G.warned) grant('confianza');
  const allDocs = Object.keys(DOCS);
  if (allDocs.every((d) => save.docs.includes(d))) grant('burocracia');
  const frags = allDocs.filter((d) => DOCS[d].fragment);
  if (frags.every((d) => save.docs.includes(d))) grant('fragmentos');
  persist();

  const lines = [...txt.outro];
  if (txt.outroIf) {
    for (const [cond, extra] of Object.entries(txt.outroIf)) {
      const neg = cond.startsWith('!');
      const has = save.docs.includes(neg ? cond.slice(1) : cond);
      if (has !== neg) lines.unshift(...extra);
    }
  }
  setTimeout(() => say(lines, () => showWin(unlocked)), 450);
}

function showWin(unlocked) {
  const id = G.lvl.id;
  const txt = LEVEL_TEXT[id];
  const last = G.levelIdx === LEVELS.length - 1;
  const reward = DOCS[txt.reward];
  const achHtml = unlocked.map((a) => {
    const def = ACHIEVEMENTS.find((x) => x.id === a);
    return `<p class="toast good" style="margin:0 auto"><b>LOGRO</b>${esc(def.title)} — ${esc(def.desc)}</p>`;
  }).join('');
  $('#win-body').innerHTML = `
    <div class="win-kicker">${esc(txt.sector)} · SALA ${String(id).padStart(2, '0')}</div>
    <h2 class="win-title">${esc(txt.title)}</h2>
    <p class="win-stats">Completada en ${G.state.turn} turnos · ${G.hintsThisPlay ? `${G.hintsThisPlay} pista(s)` : 'sin pistas'}</p>
    <p class="note">Nuevo registro en el archivo: <strong>«${esc(reward.title)}»</strong></p>
    ${achHtml}
    <div class="win-actions">
      <button class="btn primary" data-action="${last ? 'chapter-end' : 'next'}">${last ? 'Cruzar el portal' : 'Siguiente sala'}</button>
      <button class="btn" data-action="read-reward" data-doc="${esc(txt.reward)}">Leer el registro</button>
      <button class="btn" data-action="replay">Repetir sala</button>
    </div>`;
  openOverlay('win');
}

function showChapterEnd() {
  const frags = Object.keys(DOCS).filter((d) => DOCS[d].fragment && save.docs.includes(d)).length;
  $('#end-body').innerHTML = `
    <div class="win-kicker">FIN DEL ${esc(CHAPTER.title.toUpperCase())}</div>
    <h2 class="win-title">No es la primera vez</h2>
    <p class="note">Fragmentos del umbral: ${frags}/${FRAGMENTS_TOTAL} · Registros: ${save.docs.length}/${Object.keys(DOCS).length}</p>
    <p class="end-q">Pregunta pendiente: ¿quién grabó ese mensaje?</p>
    <div class="paywall">
      <strong>${esc(CHAPTER.next)}</strong><br>
      Congelar mecanismos. Consultar rastros del pasado. Una grabación de la doctora Elara Voss hablando contigo antes de que despertaras.<br><br>
      <span class="note">Los capítulos posteriores formarán parte de la campaña completa. En este prototipo todavía no están disponibles: tu progreso del Capítulo 1 queda guardado.</span>
    </div>
    <div class="win-actions">
      <button class="btn primary" data-action="archive">Revisar el archivo</button>
      <button class="btn" data-action="levels">Volver a las salas</button>
      <button class="btn" data-action="title">Portada</button>
    </div>`;
  showBase('end');
}

// ===================================================================
// Diálogos y avisos
// ===================================================================
const SPEED = { lenta: 22, normal: 45, rapida: 110, instantanea: Infinity };

function logLine(who, text) {
  save.log.push({ who, text, lvl: G.lvl?.id ?? 0 });
  if (save.log.length > 300) save.log.splice(0, save.log.length - 300);
}

function say(lines, onDone) {
  G.dialog = { lines: [...lines], i: -1, onDone, typing: null };
  $('#dialog').classList.remove('hidden');
  nextLine();
}

function nextLine() {
  const d = G.dialog;
  if (!d) return;
  if (d.typing) { finishTyping(); return; }
  d.i++;
  if (d.i >= d.lines.length) {
    $('#dialog').classList.add('hidden');
    G.dialog = null;
    persist();
    d.onDone?.();
    return;
  }
  const line = d.lines[d.i];
  logLine(line.who, line.text);
  const who = $('#dialog-who');
  who.textContent = line.who;
  who.className = `dialog-who${line.who === 'TÚ' ? ' you' : line.who === 'GRABACIÓN' ? ' rec' : ''}`;
  const el = $('#dialog-text');
  const cps = SPEED[save.settings.textSpeed] ?? 45;
  if (!Number.isFinite(cps) || save.settings.reduceMotion && cps > 200) { el.textContent = line.text; return; }
  el.textContent = '';
  const start = performance.now();
  const tick = () => {
    if (!G.dialog || G.dialog !== d) return;
    const n = Math.floor(((performance.now() - start) / 1000) * cps);
    el.textContent = line.text.slice(0, n);
    if (n >= line.text.length) { d.typing = null; return; }
    d.typing = requestAnimationFrame(tick);
  };
  d.typing = requestAnimationFrame(tick);
}

function finishTyping() {
  const d = G.dialog;
  cancelAnimationFrame(d.typing);
  d.typing = null;
  $('#dialog-text').textContent = d.lines[d.i].text;
}

function toast(text, kind = '', who = 'NEXO') {
  logLine(who, text);
  const box = $('#toasts');
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.innerHTML = `<b>${esc(who)}</b>${esc(text)}`;
  box.appendChild(el);
  while (box.children.length > 2) box.firstChild.remove();
  const ms = Math.min(9000, 2600 + text.length * 45);
  setTimeout(() => el.classList.add('out'), ms);
  setTimeout(() => el.remove(), ms + 450);
}
function toastOnce(k, text, kind) {
  if (G.taught.has(k)) return;
  G.taught.add(k);
  toast(text, kind);
}

// ===================================================================
// HUD
// ===================================================================
function updateHud() {
  const s = G.state, lvl = G.lvl;
  if (!s) return;
  const txt = LEVEL_TEXT[lvl.id];
  $('#hud-sector').textContent = txt.sector;
  $('#hud-title').textContent = `${String(lvl.id).padStart(2, '0')} · ${txt.title}`;
  $('#hud-objective').textContent = `Objetivo: ${txt.objective}`;
  for (const b of $$('.dim-btn')) {
    const d = b.dataset.dim;
    const has = lvl.dims.includes(d);
    b.classList.toggle('active', s.dim === d);
    b.classList.toggle('locked', !has);
    b.setAttribute('aria-pressed', String(s.dim === d));
    b.title = has ? `${DIM_INFO[d].name}` : `${DIM_INFO[d].name}: bloqueada en esta sala`;
  }
  const echoBtn = $('#btn-echo');
  echoBtn.disabled = !lvl.echo;
  echoBtn.classList.toggle('recording', !!s.recording);
  $('#echo-label').textContent = s.recording ? `Parar (${s.recording.moves.length}/${ECHO_MAX})` : 'Grabar eco';

  const parts = [`Turno ${s.turn}`];
  if (s.recording) parts.push(`<span class="rec">● GRABANDO ${s.recording.moves.length}/${ECHO_MAX}</span>`);
  if (s.echo) {
    const left = s.echo.queue.length - s.echo.idx;
    parts.push(left > 0 ? `<span class="on">◎ Eco: ${s.echo.idx}/${s.echo.queue.length}</span>` : '◎ Eco en reposo');
  }
  if (lvl.cells.some((c) => c.t === 'shift')) parts.push(`Estructura: ${s.frac === 0 ? 'A' : 'B'}${s.leverUsed ? ' (fija)' : ''}`);
  if (lvl.code) parts.push(`Protocolo: ${s.flags.code ? 'completo' : `${s.code}/${lvl.code.length}`}`);
  $('#status').innerHTML = parts.join(' · ');
}

// ===================================================================
// Renderizado 2.5D
// ===================================================================
const cv = $('#cv');
const ctx = cv.getContext('2d');
let view = { w: 0, h: 0, ts: 32, ox: 0, oy: 0, dpr: 1 };

function resize() {
  const stage = $('#stage');
  const r = stage.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.max(1, Math.round(r.width * dpr));
  cv.height = Math.max(1, Math.round(r.height * dpr));
  view.dpr = dpr; view.w = r.width; view.h = r.height;
  if (!G.lvl) return;
  const padTop = 40, padBottom = 30;
  const ts = Math.floor(Math.min((r.width - 16) / G.lvl.w, (r.height - padTop - padBottom) / (G.lvl.h + 0.35)));
  view.ts = Math.max(12, Math.min(ts, 72));
  view.ox = Math.round((r.width - view.ts * G.lvl.w) / 2);
  view.oy = Math.round(padTop + (r.height - padTop - padBottom - view.ts * G.lvl.h) / 2 + view.ts * 0.18);
}

function snapVisuals() {
  const s = G.state;
  G.vis = {
    p: { x: s.px, y: s.py },
    e: s.echo ? { x: s.echo.x, y: s.echo.y } : null,
    b: s.blocks.map((b) => ({ x: b.x, y: b.y })),
  };
}

function approach(v, tx, ty, k) {
  v.x += (tx - v.x) * k; v.y += (ty - v.y) * k;
  if (Math.abs(tx - v.x) < 0.01) v.x = tx;
  if (Math.abs(ty - v.y) < 0.01) v.y = ty;
}

function rr(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const FONT = getComputedStyle(document.body).fontFamily;
function label(text, x, y, size, color, weight = 700) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${Math.round(size)}px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

function dashedCell(X, Y, ts, color, inset = 0.12) {
  ctx.save();
  ctx.setLineDash([ts * 0.12, ts * 0.09]);
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = Math.max(1, ts * 0.05);
  ctx.strokeRect(X + ts * inset, Y + ts * inset, ts * (1 - inset * 2), ts * (1 - inset * 2));
  ctx.restore();
}

function raised(X, Y, ts, top, front, h) {
  ctx.fillStyle = front;
  ctx.fillRect(X, Y + ts - h, ts, h);
  ctx.fillStyle = top;
  ctx.fillRect(X, Y - h, ts, ts);
  ctx.fillStyle = 'rgba(255,255,255,.08)';
  ctx.fillRect(X, Y - h, ts, Math.max(1, ts * 0.05));
}

let lastFrame = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - lastFrame) / 1000);
  lastFrame = now;
  if (baseScreen === 'game' && G.state) draw(now, dt);
  requestAnimationFrame(frame);
}

function draw(now, dt) {
  const s = G.state, lvl = G.lvl, ts = view.ts;
  if (G.pal.t < 1) G.pal.t = Math.min(1, G.pal.t + dt * 4);
  const P = palette(G.pal.from, G.pal.to, G.pal.t);
  const k = save.settings.reduceMotion ? 1 : Math.min(1, dt * 18);
  approach(G.vis.p, s.px, s.py, k);
  if (s.echo) {
    if (!G.vis.e) G.vis.e = { x: s.echo.x, y: s.echo.y };
    approach(G.vis.e, s.echo.x, s.echo.y, k);
  } else G.vis.e = null;
  if (G.vis.b.length !== s.blocks.length) G.vis.b = s.blocks.map((b) => ({ ...b }));
  s.blocks.forEach((b, i) => approach(G.vis.b[i], b.x, b.y, k));

  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  ctx.fillStyle = P.bg;
  ctx.fillRect(0, 0, view.w, view.h);

  let sx = 0, sy = 0;
  if (G.shake > 0) {
    G.shake = Math.max(0, G.shake - dt * 3);
    sx = (Math.random() - 0.5) * 8 * G.shake; sy = (Math.random() - 0.5) * 8 * G.shake;
  }
  ctx.save();
  ctx.translate(sx, sy);

  const hgt = ts * 0.32;
  const at = (x, y) => [view.ox + x * ts, view.oy + y * ts];
  const pulse = 0.5 + 0.5 * Math.sin(now / 380);
  const lit = (lvl.code || []).slice(0, s.code);

  // Pasada 1: suelo y elementos a ras de suelo
  for (const c of lvl.cells) {
    const [X, Y] = at(c.x, c.y);
    if (c.t === 'wall') continue;
    if (c.t === 'void' || c.t === 'bridge') {
      ctx.fillStyle = P.void;
      ctx.fillRect(X, Y, ts, ts);
      for (let i = 0; i < 3; i++) {
        const hx = hash(c.x * 3 + i, c.y * 7 - i);
        if (hx > 0.55) {
          ctx.fillStyle = P.star;
          ctx.globalAlpha = 0.3 + 0.5 * Math.abs(Math.sin(now / 900 + hx * 9));
          ctx.fillRect(X + hash(c.x + i, c.y) * ts, Y + hash(c.y + i, c.x) * ts, 1.5, 1.5);
          ctx.globalAlpha = 1;
        }
      }
      if (c.t === 'bridge') {
        const here = c.dims.includes(s.dim) && s.bridgeOn[`${c.x},${c.y}`];
        if (here) {
          ctx.fillStyle = mix(DIMCOL[c.dims[0]], '#000000', 0.55);
          ctx.fillRect(X + 1, Y + ts * 0.12, ts - 2, ts * 0.76);
          ctx.strokeStyle = DIMCOL[c.dims[0]];
          ctx.globalAlpha = 0.8;
          ctx.lineWidth = 1;
          for (let i = 1; i < 4; i++) {
            ctx.beginPath(); ctx.moveTo(X + (ts * i) / 4, Y + ts * 0.12); ctx.lineTo(X + (ts * i) / 4, Y + ts * 0.88); ctx.stroke();
          }
          ctx.globalAlpha = 1;
        } else {
          dashedCell(X, Y, ts, DIMCOL[c.dims[0]], 0.18);
          label(DIM_INFO[c.dims[0]].glyph, X + ts / 2, Y + ts / 2, ts * 0.3, DIMCOL[c.dims[0]]);
        }
        if (c.req && c.x === Math.min(...lvl.bridges.filter((b) => b.y === c.y).map((b) => b.x))) {
          label(c.req.join('·'), X + ts * 0.2, Y + ts * 0.2, ts * 0.22, P.accent);
        }
      }
      continue;
    }
    ctx.fillStyle = P.floor;
    ctx.fillRect(X, Y, ts, ts);
    ctx.strokeStyle = P.line;
    ctx.lineWidth = 1;
    ctx.strokeRect(X + 0.5, Y + 0.5, ts - 1, ts - 1);

    if (c.t === 'dwall' && !c.dims.includes(s.dim)) {
      dashedCell(X, Y, ts, DIMCOL[c.dims[0]]);
      label(c.dims.map((d) => DIM_INFO[d].glyph).join(''), X + ts / 2, Y + ts / 2, ts * 0.28, DIMCOL[c.dims[0]]);
    } else if (c.t === 'shift' && s.frac === c.phase) {
      // Visible aunque no exista ahora: el jugador ve dónde aparecerá.
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = PAL.F.accent;
      ctx.setLineDash([ts * 0.1, ts * 0.08]);
      ctx.lineWidth = Math.max(1, ts * 0.04);
      ctx.strokeRect(X + ts * 0.1, Y + ts * 0.1, ts * 0.8, ts * 0.8);
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(X + ts * 0.1, Y + ts * 0.9); ctx.lineTo(X + ts * 0.9, Y + ts * 0.1); ctx.stroke();
      ctx.restore();
      label(c.phase === 0 ? 'A' : 'B', X + ts / 2, Y + ts / 2, ts * 0.24, PAL.F.accent);
    } else if (c.t === 'plate') {
      const on = s.active[c.id];
      const k2 = `${c.x},${c.y}`;
      rr(X + ts * 0.14, Y + ts * 0.14, ts * 0.72, ts * 0.72, ts * 0.1);
      ctx.fillStyle = on ? P.accent : mix(PAL[s.dim].floor, '#000000', 0.35);
      ctx.globalAlpha = on ? 0.85 : 1;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = on ? '#ffffff' : P.accent;
      ctx.lineWidth = Math.max(1, ts * 0.04);
      ctx.stroke();
      label(c.id, X + ts / 2, Y + ts / 2, ts * 0.34, on ? '#1a1006' : P.accent, 800);
      if (c.dims) label(c.dims.map((d) => DIM_INFO[d].glyph).join(''), X + ts * 0.8, Y + ts * 0.22, ts * 0.2, DIMCOL[c.dims[0]]);
      if (c.hold) {
        const tleft = s.timers[k2] || 0;
        const pressed = on && tleft === c.hold;
        label(pressed ? `⧗${c.hold}` : tleft > 0 ? `⧗${tleft}` : `⧗${c.hold}`, X + ts * 0.5, Y + ts * 0.86, ts * 0.2, tleft > 0 ? '#ffffff' : P.accent);
      }
    } else if (c.t === 'exit') {
      const r0 = ts * 0.38;
      for (let i = 3; i >= 1; i--) {
        ctx.beginPath();
        ctx.arc(X + ts / 2, Y + ts / 2, (r0 * i) / 3 + pulse * 2, 0, Math.PI * 2);
        ctx.strokeStyle = P.accent;
        ctx.globalAlpha = 0.25 + i * 0.2;
        ctx.lineWidth = Math.max(1, ts * 0.05);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    } else if (c.t === 'term') {
      const read = s.docs.includes(c.doc) || save.docs.includes(c.doc);
      rr(X + ts * 0.25, Y + ts * 0.28, ts * 0.5, ts * 0.38, ts * 0.06);
      ctx.fillStyle = read ? mix(P.floor, '#000000', 0.3) : P.accent;
      ctx.globalAlpha = read ? 1 : c.secret ? 0.35 + pulse * 0.25 : 0.6 + pulse * 0.4;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = P.line;
      ctx.fillRect(X + ts * 0.42, Y + ts * 0.66, ts * 0.16, ts * 0.1);
    } else if (c.t === 'door' && s.open[`${c.x},${c.y}`]) {
      ctx.fillStyle = P.wallFront;
      ctx.fillRect(X, Y, ts * 0.12, ts);
      ctx.fillRect(X + ts * 0.88, Y, ts * 0.12, ts);
    } else if (c.t === 'lever' && s.dim !== 'F') {
      dashedCell(X, Y, ts, DIMCOL.F, 0.22);
      label('◆', X + ts / 2, Y + ts / 2, ts * 0.28, DIMCOL.F);
    } else if (c.t === 'console') {
      const on = lit.includes(c.n) || s.flags.code;
      rr(X + ts * 0.18, Y + ts * 0.18, ts * 0.64, ts * 0.64, ts * 0.32);
      ctx.fillStyle = on ? P.accent : mix(P.floor, '#000000', 0.35);
      ctx.fill();
      ctx.strokeStyle = P.accent; ctx.lineWidth = Math.max(1, ts * 0.04); ctx.stroke();
      label(String(c.n), X + ts / 2, Y + ts / 2, ts * 0.36, on ? '#1a1006' : P.accent, 800);
    }
  }

  // Pasada 2: volúmenes y cuerpos, fila a fila para que se solapen bien
  const rowsEnt = Array.from({ length: lvl.h }, () => []);
  G.vis.b.forEach((b) => rowsEnt[Math.min(lvl.h - 1, Math.max(0, Math.round(b.y)))].push({ kind: 'block', v: b }));
  if (G.vis.e) rowsEnt[Math.round(G.vis.e.y)]?.push({ kind: 'echo', v: G.vis.e });
  rowsEnt[Math.round(G.vis.p.y)]?.push({ kind: 'player', v: G.vis.p });

  for (let y = 0; y < lvl.h; y++) {
    for (let x = 0; x < lvl.w; x++) {
      const c = lvl.cells[y * lvl.w + x];
      const [X, Y] = at(x, y);
      if (c.t === 'wall') {
        if (G.solidWalls.has(y * lvl.w + x)) continue;
        raised(X, Y, ts, P.wallTop, P.wallFront, hgt);
      } else if (c.t === 'dwall' && c.dims.includes(s.dim)) {
        const col = DIMCOL[c.dims[0]];
        raised(X, Y, ts, mix(P.wallTop, col, 0.35), P.wallFront, hgt);
        if (c.dims.length > 1) {
          // Grieta: se atraviesa en Fractura
          ctx.strokeStyle = DIMCOL.F; ctx.lineWidth = Math.max(1, ts * 0.05);
          ctx.beginPath();
          ctx.moveTo(X + ts * 0.5, Y - hgt + ts * 0.05);
          ctx.lineTo(X + ts * 0.38, Y - hgt + ts * 0.35);
          ctx.lineTo(X + ts * 0.6, Y - hgt + ts * 0.58);
          ctx.lineTo(X + ts * 0.45, Y - hgt + ts * 0.95);
          ctx.stroke();
        } else {
          label(DIM_INFO[c.dims[0]].glyph, X + ts / 2, Y - hgt + ts / 2, ts * 0.32, '#1a1006');
        }
      } else if (c.t === 'shift' && s.frac !== c.phase) {
        raised(X, Y, ts, mix(P.wallTop, PAL.F.accent, 0.45), P.wallFront, hgt);
        ctx.save();
        ctx.beginPath(); ctx.rect(X, Y - hgt, ts, ts); ctx.clip();
        ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = ts * 0.08;
        for (let i = -1; i < 3; i++) { ctx.beginPath(); ctx.moveTo(X + i * ts * 0.4, Y - hgt + ts); ctx.lineTo(X + i * ts * 0.4 + ts, Y - hgt); ctx.stroke(); }
        ctx.restore();
        label(c.phase === 0 ? 'A' : 'B', X + ts / 2, Y - hgt + ts / 2, ts * 0.26, '#ffffff');
      } else if (c.t === 'door' && !s.open[`${x},${y}`]) {
        raised(X, Y, ts, mix(P.wallTop, P.accent, 0.25), P.wallFront, hgt);
        ctx.fillStyle = 'rgba(0,0,0,.45)';
        for (let i = 1; i < 4; i++) ctx.fillRect(X + (ts * i) / 4 - ts * 0.03, Y - hgt + ts * 0.15, ts * 0.06, ts * 0.7);
        const lab = c.req.map((r) => (r === 'code' ? '∴' : r)).join('·');
        rr(X + ts * 0.18, Y - hgt + ts * 0.3, ts * 0.64, ts * 0.4, ts * 0.08);
        ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fill();
        label(lab, X + ts / 2, Y - hgt + ts * 0.5, ts * 0.28, P.accent, 800);
      } else if (c.t === 'lever' && s.dim === 'F') {
        ctx.fillStyle = P.wallFront;
        rr(X + ts * 0.3, Y + ts * 0.25, ts * 0.4, ts * 0.6, ts * 0.08); ctx.fill();
        const ang = s.frac === 0 ? -0.6 : 0.6;
        ctx.save();
        ctx.translate(X + ts / 2, Y + ts * 0.45);
        ctx.rotate(ang);
        ctx.fillStyle = c.once && s.leverUsed ? '#777' : PAL.F.accent;
        ctx.fillRect(-ts * 0.04, -ts * 0.42, ts * 0.08, ts * 0.42);
        ctx.beginPath(); ctx.arc(0, -ts * 0.42, ts * 0.09, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }
    for (const ent of rowsEnt[y]) {
      if (ent.kind === 'block') drawBlock(ent.v, P, ts, hgt);
      else if (ent.kind === 'echo') drawFigure(ent.v, ts, 'echo', now);
      else drawFigure(ent.v, ts, 'player', now);
    }
  }
  ctx.restore();

  // Destello al cambiar de dimensión o recibir una interferencia
  if (G.flash > 0) {
    G.flash = Math.max(0, G.flash - dt * 2.5);
    if (!save.settings.reduceMotion) {
      ctx.fillStyle = `rgba(255,255,255,${G.flash * 0.12})`;
      for (let y = 0; y < view.h; y += 4) ctx.fillRect(0, y, view.w, 1);
    }
  }
}

function drawBlock(v, P, ts, hgt) {
  const X = view.ox + v.x * ts, Y = view.oy + v.y * ts;
  const h = hgt * 0.8;
  const inset = ts * 0.08;
  ctx.fillStyle = 'rgba(0,0,0,.35)';
  ctx.fillRect(X + inset, Y + inset + 2, ts - inset * 2, ts - inset * 2);
  ctx.fillStyle = '#6f6455';
  ctx.fillRect(X + inset, Y + ts - inset - h, ts - inset * 2, h);
  ctx.fillStyle = '#c9bba3';
  ctx.fillRect(X + inset, Y + inset - h, ts - inset * 2, ts - inset * 2);
  ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = Math.max(1, ts * 0.04);
  ctx.strokeRect(X + inset + ts * 0.12, Y + inset - h + ts * 0.12, ts - inset * 2 - ts * 0.24, ts - inset * 2 - ts * 0.24);
}

function drawFigure(v, ts, kind, now) {
  const s = G.state;
  let X = view.ox + v.x * ts, Y = view.oy + v.y * ts;
  if (kind === 'player' && G.bump) {
    G.bump.t += 1 / 10;
    const d = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] }[G.bump.dir];
    const amt = Math.sin(Math.min(1, G.bump.t) * Math.PI) * ts * 0.1;
    X += d[0] * amt; Y += d[1] * amt;
    if (G.bump.t >= 1) G.bump = null;
  }
  const cx = X + ts / 2;
  const base = Y + ts * 0.78;
  ctx.save();
  if (kind === 'echo') {
    ctx.globalAlpha = s.dim === 'E' ? 0.7 : 0.38;
  }
  ctx.fillStyle = 'rgba(0,0,0,.4)';
  ctx.beginPath(); ctx.ellipse(cx, base, ts * 0.24, ts * 0.09, 0, 0, Math.PI * 2); ctx.fill();
  const body = kind === 'echo' ? '#8fd6ff' : '#ece4d6';
  const trim = kind === 'echo' ? '#2f78b8' : DIMCOL[s.dim];
  rr(cx - ts * 0.19, base - ts * 0.56, ts * 0.38, ts * 0.52, ts * 0.14);
  ctx.fillStyle = body; ctx.fill();
  ctx.fillStyle = trim;
  ctx.fillRect(cx - ts * 0.19, base - ts * 0.3, ts * 0.38, ts * 0.06);
  ctx.beginPath(); ctx.arc(cx, base - ts * 0.66, ts * 0.15, 0, Math.PI * 2);
  ctx.fillStyle = body; ctx.fill();
  const face = kind === 'echo' ? 'D' : s.facing;
  const fd = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] }[face];
  if (face !== 'U') {
    ctx.fillStyle = kind === 'echo' ? '#0b2a45' : '#1a1006';
    ctx.fillRect(cx - ts * 0.09 + fd[0] * ts * 0.06, base - ts * 0.7, ts * 0.18, ts * 0.05);
  }
  if (kind === 'echo') {
    ctx.strokeStyle = '#bfe9ff'; ctx.lineWidth = 1; ctx.globalAlpha *= 0.6;
    for (let i = 0; i < 3; i++) {
      const yy = base - ts * (0.1 + ((now / 900 + i / 3) % 1) * 0.7);
      ctx.beginPath(); ctx.moveTo(cx - ts * 0.2, yy); ctx.lineTo(cx + ts * 0.2, yy); ctx.stroke();
    }
  }
  ctx.restore();
  if (kind === 'player' && s.recording) {
    ctx.strokeStyle = '#ff6b5b';
    ctx.lineWidth = Math.max(1.5, ts * 0.05);
    ctx.globalAlpha = 0.5 + 0.5 * Math.sin(now / 200);
    ctx.beginPath(); ctx.arc(cx, base - ts * 0.35, ts * 0.46, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;
    label('REC', cx, base - ts * 0.98, ts * 0.2, '#ff6b5b', 800);
  }
}

// ===================================================================
// Pantallas: salas, archivo, logros, ajustes, pistas
// ===================================================================
function renderLevelGrid() {
  const cards = LEVELS.map((def, i) => {
    const txt = LEVEL_TEXT[def.id];
    const done = save.completed[def.id];
    const locked = !isUnlocked(i);
    const dims = def.dims.map((d) => `<span class="${d}">${DIM_INFO[d].glyph}</span>`).join('');
    const secret = Object.values(DOCS).find((d) => d.level === def.id && d.fragment);
    const secretKey = secret && Object.keys(DOCS).find((k) => DOCS[k] === secret);
    return `<button class="level-card" data-level="${i}" ${locked ? 'disabled' : ''}>
      <span class="num">SALA ${String(def.id).padStart(2, '0')}</span>
      <span class="name">${locked ? '· · ·' : esc(txt.title)}</span>
      <span class="meta"><span class="dims-mini">${dims}</span>${done ? `<span class="done">✓ ${done.moves} turnos</span>` : ''}${secretKey && save.docs.includes(secretKey) ? '<span class="done">✶ fragmento</span>' : ''}</span>
    </button>`;
  }).join('');
  $('#level-grid').innerHTML = `${cards}
    <button class="level-card paid" disabled>
      <span class="num">${esc(CHAPTER.next.toUpperCase())}</span>
      <span class="name">El futuro ya presentó una queja</span>
      <span class="meta">Capítulo de pago · próximamente</span>
    </button>`;
}

let archiveTab = 'docs';
function renderArchive() {
  for (const t of $$('.tab')) t.classList.toggle('active', t.dataset.tab === archiveTab);
  const body = $('#archive-body');
  if (archiveTab === 'docs') {
    const byLevel = {};
    for (const [id, d] of Object.entries(DOCS)) if (!d.fragment) (byLevel[d.level] ||= []).push([id, d]);
    let html = '<p class="note">Los registros importantes se guardan solos. Algunos solo aparecen si exploras. Ninguno es necesario para avanzar… salvo cuando lo es.</p>';
    for (const lvlId of Object.keys(byLevel)) {
      const items = byLevel[lvlId];
      html += `<div class="doc-group"><h3>Sala ${String(lvlId).padStart(2, '0')} · ${esc(LEVEL_TEXT[lvlId].title)}</h3>`;
      for (const [id, d] of items) {
        const has = save.docs.includes(id);
        html += has
          ? `<button class="doc-item" data-doc="${id}"><span class="kind">${esc(d.kind)}</span><span>${esc(d.title)}</span></button>`
          : `<div class="doc-item missing"><span class="kind">—</span><span>Registro no recuperado</span></div>`;
      }
      html += '</div>';
    }
    body.innerHTML = html;
  } else if (archiveTab === 'frags') {
    const names = ['Origen', 'Eco', 'Fractura', 'Instante', 'Inverso', 'Reflejo', 'Laberinto', 'Nexo', 'Vacío', 'Umbral'];
    const codes = { Origen: 'O', Eco: 'E', Fractura: 'F' };
    const found = Object.entries(DOCS).filter(([id, d]) => d.fragment && save.docs.includes(id));
    let html = `<p class="note"><strong>Condición del final secreto:</strong> reúne un fragmento de cada una de las diez dimensiones. Cada uno contradice una parte de la versión oficial. Juntos permiten reconstruir la pregunta original. Llevas ${found.length}/${FRAGMENTS_TOTAL}.</p><div class="frag-grid">`;
    names.forEach((n, i) => {
      const hit = found.find(([, d]) => d.fragment === codes[n]);
      html += hit
        ? `<button class="frag found" data-doc="${hit[0]}"><div class="n">${String(i + 1).padStart(2, '0')}</div>${n}</button>`
        : `<div class="frag"><div class="n">${String(i + 1).padStart(2, '0')}</div>${i < 3 ? `${n} · oculto` : `${n} · capítulo futuro`}</div>`;
    });
    body.innerHTML = `${html}</div>`;
  } else {
    const lines = save.log.slice(-120).reverse();
    body.innerHTML = lines.length
      ? lines.map((l) => `<div class="log-line">${l.who ? `<b>${esc(l.who)}</b>` : ''}${esc(l.text)}</div>`).join('')
      : '<p class="note">Todavía no hay diálogos registrados. NEXO está, por una vez, en silencio.</p>';
  }
}

function openDoc(id) {
  const d = DOCS[id];
  if (!d) return;
  $('#doc-title').textContent = d.title;
  $('#doc-text').textContent = d.body;
  openOverlay('doc');
}

function renderAchievements() {
  $('#ach-body').innerHTML = ACHIEVEMENTS.map((a) => {
    const has = save.achievements.includes(a.id);
    return `<div class="ach ${has ? '' : 'locked'}"><div class="medal">${has ? '✶' : '·'}</div><div><strong>${esc(a.title)}</strong><p>${esc(a.desc)}</p></div></div>`;
  }).join('');
}

function renderSettings() {
  const st = save.settings;
  $('#settings-body').innerHTML = `
    <div class="setting"><label for="set-sfx">Efectos de sonido</label><input type="checkbox" id="set-sfx" ${st.sfx ? 'checked' : ''}></div>
    <div class="setting"><label for="set-music">Música ambiental<small>Un zumbido distinto por dimensión.</small></label><input type="checkbox" id="set-music" ${st.music ? 'checked' : ''}></div>
    <div class="setting"><label for="set-motion">Reducir movimiento y destellos<small>Sin temblores, transiciones ni parpadeos.</small></label><input type="checkbox" id="set-motion" ${st.reduceMotion ? 'checked' : ''}></div>
    <div class="setting"><label for="set-big">Texto grande</label><input type="checkbox" id="set-big" ${st.bigText ? 'checked' : ''}></div>
    <div class="setting"><label for="set-speed">Velocidad del texto</label>
      <select id="set-speed">
        ${['lenta', 'normal', 'rapida', 'instantanea'].map((v) => `<option value="${v}" ${st.textSpeed === v ? 'selected' : ''}>${{ lenta: 'Lenta', normal: 'Normal', rapida: 'Rápida', instantanea: 'Instantánea' }[v]}</option>`).join('')}
      </select></div>
    <h3>Datos de prueba</h3>
    <p class="note">Métricas locales para las pruebas de juego (niveles completados, intentos, pistas, abandonos). No se envían a ningún sitio: puedes copiarlas y compartirlas tú.</p>
    <textarea class="export" id="export" readonly></textarea>
    <p><button class="btn small" id="btn-copy">Copiar datos</button> <button class="btn small" id="btn-wipe">Borrar progreso</button></p>`;
  $('#export').value = JSON.stringify({ version: 1, completed: save.completed, stats: save.stats, docs: save.docs.length, achievements: save.achievements }, null, 1);
  const bind = (id, key, after) => $(id).addEventListener('change', (e) => {
    save.settings[key] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    persist(); applySettings(); after?.();
  });
  bind('#set-sfx', 'sfx');
  bind('#set-music', 'music');
  bind('#set-motion', 'reduceMotion');
  bind('#set-big', 'bigText', () => setTimeout(resize, 50));
  bind('#set-speed', 'textSpeed');
  $('#btn-copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('#export').value); $('#btn-copy').textContent = 'Copiado'; } catch { $('#export').select(); }
  });
  $('#btn-wipe').addEventListener('click', (e) => {
    // Confirmación en dos pasos dentro de la página (sin diálogos del navegador).
    if (!e.currentTarget.dataset.armed) {
      e.currentTarget.dataset.armed = '1';
      e.currentTarget.textContent = 'Pulsa otra vez para borrarlo todo';
      return;
    }
    const settings = save.settings;
    save = defaultSave();
    save.settings = settings;
    persist();
    renderSettings();
  });
}

function renderHints() {
  const txt = LEVEL_TEXT[G.lvl.id];
  const shown = G.hintsThisPlay;
  const labels = ['Orientación', 'Regla relevante', 'Explicación directa'];
  let html = '<p class="note">Las pistas son gratuitas e ilimitadas. Pedir ayuda no es un fracaso: es un dato.</p>';
  for (let i = 0; i < shown; i++) html += `<div class="hint-card"><span class="lbl">PISTA ${i + 1} · ${labels[i].toUpperCase()}</span>${esc(txt.hints[i])}</div>`;
  if (shown < txt.hints.length) {
    html += `<button class="btn primary" id="btn-more-hint">${shown === 0 ? 'Ver la primera pista' : `Ver pista ${shown + 1} · ${labels[shown].toLowerCase()}`}</button>`;
  } else {
    html += '<p class="note">No quedan más pistas. NEXO sugiere probar a hacer exactamente lo que dice la última.</p>';
  }
  $('#hint-body').innerHTML = html;
  $('#btn-more-hint')?.addEventListener('click', () => {
    G.hintsThisPlay++;
    statFor(G.lvl.id).hints++;
    persist();
    renderHints();
  });
}

// ===================================================================
// Entrada: botones, teclado, gestos
// ===================================================================
function onAction(a, el) {
  Sound.init();
  switch (a) {
    case 'play': {
      const firstOpen = LEVELS.findIndex((l) => !save.completed[l.id]);
      const idx = firstOpen === -1 ? (save.lastLevel ?? 0) : firstOpen;
      startLevel(idx);
      break;
    }
    case 'levels': showBase('levels'); break;
    case 'title': closeStaleStats(); G.lvl = null; G.state = null; persist(); showBase('title'); refreshTitle(); break;
    case 'back': showBase('title'); refreshTitle(); break;
    case 'archive': renderArchive(); openOverlay('archive'); break;
    case 'achievements': renderAchievements(); openOverlay('achievements'); break;
    case 'settings': renderSettings(); openOverlay('settings'); break;
    case 'pause': openOverlay('pause'); break;
    case 'hint': if (G.state && !G.state.won) { renderHints(); openOverlay('hint'); } break;
    case 'close': closeOverlay(); break;
    case 'echo': doAction('echo'); break;
    case 'wait': doAction('W'); break;
    case 'undo': undo(); break;
    case 'reset': if (overlayOpen()) closeOverlay(); reset(); break;
    case 'next': closeOverlay(); startLevel(G.levelIdx + 1); break;
    case 'replay': closeOverlay(); startLevel(G.levelIdx, { skipIntro: true }); break;
    case 'read-reward': openDoc(el.dataset.doc); break;
    case 'chapter-end': closeOverlay(); showChapterEnd(); break;
    default: break;
  }
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action],[data-level],[data-doc],[data-tab],.dim-btn');
  if (!el) return;
  if (el.dataset.level !== undefined && !el.disabled) { startLevel(+el.dataset.level); return; }
  if (el.dataset.tab) { archiveTab = el.dataset.tab; renderArchive(); return; }
  if (el.classList.contains('dim-btn')) { doAction(`dim:${el.dataset.dim}`); return; }
  if (el.dataset.action) { onAction(el.dataset.action, el); return; }
  if (el.dataset.doc) openDoc(el.dataset.doc);
});

$('#dialog').addEventListener('click', () => nextLine());

// Cruceta con repetición al mantener pulsado
for (const pad of $$('.pad')) {
  let timer = null;
  const stop = () => { clearTimeout(timer); clearInterval(timer); timer = null; pad.classList.remove('held'); };
  pad.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (G.dialog) { nextLine(); return; }
    pad.classList.add('held');
    const a = pad.dataset.move;
    doAction(a);
    if (a === 'W') return;
    timer = setTimeout(() => { timer = setInterval(() => doAction(a), 150); }, 320);
  });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) pad.addEventListener(ev, stop);
}

// Gestos sobre el tablero: deslizar mueve; tocar una casilla avanza hacia ella
let touchStart = null;
cv.addEventListener('pointerdown', (e) => { touchStart = { x: e.clientX, y: e.clientY }; });
cv.addEventListener('pointerup', (e) => {
  if (!touchStart || !G.state) return;
  if (G.dialog) { nextLine(); touchStart = null; return; }
  const dx = e.clientX - touchStart.x, dy = e.clientY - touchStart.y;
  touchStart = null;
  let dir = null;
  if (Math.hypot(dx, dy) > 24) {
    dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'R' : 'L') : (dy > 0 ? 'D' : 'U');
  } else {
    const r = cv.getBoundingClientRect();
    const tx = (e.clientX - r.left - view.ox) / view.ts - 0.5 - G.state.px;
    const ty = (e.clientY - r.top - view.oy) / view.ts - 0.5 - G.state.py;
    if (Math.abs(tx) < 0.5 && Math.abs(ty) < 0.5) return;
    dir = Math.abs(tx) > Math.abs(ty) ? (tx > 0 ? 'R' : 'L') : (ty > 0 ? 'D' : 'U');
  }
  doAction(dir);
});

const KEYMAP = {
  ArrowUp: 'U', ArrowDown: 'D', ArrowLeft: 'L', ArrowRight: 'R',
  w: 'U', s: 'D', a: 'L', d: 'R', W: 'U', S: 'D', A: 'L', D: 'R',
};
document.addEventListener('keydown', (e) => {
  if (e.target.matches('input, select, textarea')) return;
  Sound.init();
  if (G.dialog && ['Enter', ' ', 'Escape', 'ArrowRight'].includes(e.key)) { e.preventDefault(); nextLine(); return; }
  if (e.key === 'Escape') {
    if (overlayOpen()) closeOverlay();
    else if (baseScreen === 'game') openOverlay('pause');
    else if (baseScreen !== 'title') showBase('title');
    return;
  }
  if (baseScreen !== 'game' || overlayOpen() || G.dialog) return;
  const k = e.key;
  if (KEYMAP[k]) { e.preventDefault(); doAction(KEYMAP[k]); return; }
  if (k === ' ' || k === '.') { e.preventDefault(); doAction('W'); return; }
  if (k === '1' || k === '2' || k === '3') { doAction(`dim:${'OEF'[+k - 1]}`); return; }
  if (k === 'e' || k === 'E') { doAction('echo'); return; }
  if (k === 'z' || k === 'Z' || k === 'Backspace' || k === 'u') { e.preventDefault(); undo(); return; }
  if (k === 'r' || k === 'R') { reset(); return; }
  if (k === 'h' || k === 'H' || k === '?') { onAction('hint'); return; }
  if (k === 'Tab' || k === 'q' || k === 'Q') {
    e.preventDefault();
    const dims = G.lvl.dims;
    doAction(`dim:${dims[(dims.indexOf(G.state.dim) + 1) % dims.length]}`);
  }
});

window.addEventListener('resize', () => resize());
new ResizeObserver(() => resize()).observe($('#stage'));
document.addEventListener('visibilitychange', () => { if (document.hidden) persist(); });

function refreshTitle() {
  const anyDone = Object.keys(save.completed).length > 0;
  $('#btn-play').textContent = anyDone ? 'Continuar' : 'Empezar';
}

// ===================================================================
// Arranque
// ===================================================================
applySettings();
refreshTitle();
requestAnimationFrame(frame);

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => { /* sin modo offline */ });
}

// Ganchos de depuración para pruebas automáticas en navegador.
window.__umbral = { G, doAction, startLevel, passable };
