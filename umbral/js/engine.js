// Motor lógico de El Último Umbral.
// Sin DOM: el mismo código lo usan el juego y las pruebas de Node.
// Todas las dimensiones comparten un único sistema de reglas (ver passable()).

export const DIM_INFO = {
  O: { name: 'Origen', glyph: '■' },
  E: { name: 'Eco', glyph: '◎' },
  F: { name: 'Fractura', glyph: '◆' },
};

export const DIRS = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };
export const ECHO_MAX = 16;

const BASE_LEGEND = {
  '#': { t: 'wall' },
  '.': { t: 'floor' },
  '~': { t: 'void' },
  'P': { t: 'floor', start: true },
  'B': { t: 'floor', block: true },
  'X': { t: 'exit' },
  '1': { t: 'dwall', dims: ['O'] },
  '2': { t: 'dwall', dims: ['E'] },
  '3': { t: 'dwall', dims: ['F'] },
  '%': { t: 'dwall', dims: ['O', 'E'] },
  '[': { t: 'shift', phase: 0 },
  ']': { t: 'shift', phase: 1 },
  'L': { t: 'lever' },
};

export function parseLevel(def) {
  const legend = { ...BASE_LEGEND, ...(def.legend || {}) };
  const rows = def.map;
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const cells = [];
  const blocks = [];
  let start = null;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x] ?? '#';
      const src = legend[ch];
      if (!src) throw new Error(`Nivel ${def.id}: carácter desconocido "${ch}" en ${x},${y}`);
      const cell = { ...src, x, y, ch };
      if (cell.start) { start = { x, y }; cell.t = 'floor'; }
      if (cell.block) { blocks.push({ x, y }); cell.t = cell.under || 'floor'; }
      delete cell.start; delete cell.block;
      cells.push(cell);
    }
  }
  if (!start) throw new Error(`Nivel ${def.id}: falta la posición inicial P`);
  const plates = cells.filter((c) => c.t === 'plate');
  const doors = cells.filter((c) => c.t === 'door');
  const bridges = cells.filter((c) => c.t === 'bridge');
  return {
    def, id: def.id, w, h, cells, start, blocks, plates, doors, bridges,
    dims: def.dims || ['O'],
    echo: !!def.echo,
    code: def.code || null,
  };
}

export const cellAt = (lvl, x, y) =>
  x < 0 || y < 0 || x >= lvl.w || y >= lvl.h ? null : lvl.cells[y * lvl.w + x];

const key = (x, y) => `${x},${y}`;

export function createState(lvl) {
  const s = {
    dim: lvl.dims[0],
    px: lvl.start.x, py: lvl.start.y, facing: 'D',
    blocks: lvl.blocks.map((b) => ({ ...b })),
    frac: 0,
    leverUsed: false,
    timers: {},
    active: {},
    open: {},
    bridgeOn: {},
    echo: null,
    recording: null,
    code: 0,
    flags: {},
    docs: [],
    turn: 0,
    won: false,
  };
  recompute(lvl, s, false);
  return s;
}

export const clone = (s) => structuredClone(s);

const blockAt = (s, x, y) => s.blocks.findIndex((b) => b.x === x && b.y === y);
const echoAt = (s, x, y) => !!s.echo && s.echo.x === x && s.echo.y === y;

function occupied(s, x, y) {
  return (s.px === x && s.py === y) || echoAt(s, x, y) || blockAt(s, x, y) >= 0;
}

// La regla común: ¿se puede ocupar esta casilla desde la dimensión dada?
export function passable(lvl, s, x, y, dim) {
  const c = cellAt(lvl, x, y);
  if (!c) return false;
  switch (c.t) {
    case 'wall': return false;
    case 'void': return false;
    case 'dwall': return !c.dims.includes(dim);
    case 'shift': return s.frac !== c.phase;
    case 'bridge': return c.dims.includes(dim) && !!s.bridgeOn[key(x, y)];
    case 'door': return !!s.open[key(x, y)];
    default: return true;
  }
}

function plateFeels(c, dim) {
  return !c.dims || c.dims.includes(dim);
}

// Recalcula placas, temporizadores, puertas y puentes.
// tick = true cuando ha pasado un turno (los temporizadores descuentan).
export function recompute(lvl, s, tick) {
  const active = {};
  for (const p of lvl.plates) {
    const k = key(p.x, p.y);
    const pressed =
      blockAt(s, p.x, p.y) >= 0 ||
      (s.px === p.x && s.py === p.y && plateFeels(p, s.dim)) ||
      (echoAt(s, p.x, p.y) && plateFeels(p, 'E'));
    if (pressed) s.timers[k] = p.hold || 0;
    else if (tick && s.timers[k] > 0) s.timers[k]--;
    const on = pressed || (s.timers[k] || 0) > 0;
    active[p.id] = active[p.id] || on;
  }
  for (const f in s.flags) if (s.flags[f]) active[f] = true;
  s.active = active;
  const reqOk = (req) => !req || req.every((r) => active[r]);
  for (const d of lvl.doors) {
    const k = key(d.x, d.y);
    s.open[k] = reqOk(d.req) || (s.open[k] && occupied(s, d.x, d.y));
  }
  for (const b of lvl.bridges) {
    const k = key(b.x, b.y);
    s.bridgeOn[k] = reqOk(b.req) || (s.bridgeOn[k] && occupied(s, b.x, b.y));
  }
}

// Mueve a un cuerpo (jugador o eco) en una dirección, empujando bloques.
function moveBody(lvl, s, who, dir, dim, ev) {
  const [dx, dy] = DIRS[dir];
  const fx = who === 'P' ? s.px : s.echo.x;
  const fy = who === 'P' ? s.py : s.echo.y;
  const tx = fx + dx, ty = fy + dy;
  const bi = blockAt(s, tx, ty);
  if (bi >= 0) {
    const bx = tx + dx, by = ty + dy;
    const bc = cellAt(lvl, bx, by);
    const ok =
      passable(lvl, s, bx, by, dim) && bc.t !== 'exit' &&
      blockAt(s, bx, by) < 0 && !echoAt(s, bx, by) && !(s.px === bx && s.py === by);
    if (!ok) { ev.push({ type: 'blocked', who, x: tx, y: ty, reason: 'block' }); return false; }
    s.blocks[bi] = { x: bx, y: by };
    ev.push({ type: 'push', who });
  } else if (!passable(lvl, s, tx, ty, dim)) {
    ev.push({ type: 'blocked', who, x: tx, y: ty, reason: cellAt(lvl, tx, ty)?.t || 'edge' });
    return false;
  }
  if (who === 'P') { s.px = tx; s.py = ty; } else { s.echo.x = tx; s.echo.y = ty; }
  return true;
}

function toggleFracture(lvl, s, ev) {
  const lever = cellAt(lvl, s.px, s.py);
  if (lever.once && s.leverUsed) { ev.push({ type: 'lever-spent' }); return; }
  const next = 1 - s.frac;
  const clash = lvl.cells.some((c) => c.t === 'shift' && c.phase === next && occupied(s, c.x, c.y));
  if (clash) { ev.push({ type: 'fracture-blocked' }); return; }
  s.frac = next;
  if (lever.once) s.leverUsed = true;
  ev.push({ type: 'fracture', frac: next, once: !!lever.once });
}

function enterCell(lvl, s, ev) {
  const c = cellAt(lvl, s.px, s.py);
  if (c.t === 'lever' && s.dim === 'F') toggleFracture(lvl, s, ev);
  if (c.t === 'term' && !s.docs.includes(c.doc)) {
    s.docs.push(c.doc);
    ev.push({ type: 'doc', doc: c.doc, secret: !!c.secret });
  }
  if (c.t === 'console' && lvl.code && !s.flags.code) {
    if (c.n === lvl.code[s.code]) s.code++;
    else s.code = c.n === lvl.code[0] ? 1 : 0;
    const done = s.code >= lvl.code.length;
    if (done) s.flags.code = true;
    ev.push({ type: 'console', n: c.n, progress: s.code, done });
  }
  if (c.t === 'exit') { s.won = true; ev.push({ type: 'win' }); }
}

function endTurn(lvl, s, action, ev) {
  if (s.echo && s.echo.idx < s.echo.queue.length) {
    const a = s.echo.queue[s.echo.idx++];
    if (a !== 'W') moveBody(lvl, s, 'E', a, 'E', ev);
    if (s.echo.idx >= s.echo.queue.length) ev.push({ type: 'echo-done' });
  }
  s.turn++;
  const before = { ...s.open };
  recompute(lvl, s, true);
  for (const k in s.open) if (s.open[k] && !before[k]) ev.push({ type: 'door-open', at: k });
  if (s.recording) {
    s.recording.moves.push(action);
    if (s.recording.moves.length >= ECHO_MAX) stopRecording(lvl, s, ev, true);
  }
}

function stopRecording(lvl, s, ev, auto) {
  const { snap, moves } = s.recording;
  const fresh = clone(snap);
  Object.assign(s, fresh);
  s.recording = null;
  s.echo = { x: snap.px, y: snap.py, queue: moves, idx: 0 };
  recompute(lvl, s, false);
  ev.push({ type: 'echo-start', length: moves.length, auto: !!auto });
}

// Aplica una acción y devuelve { state, events }. No modifica el estado de entrada.
// Acciones: 'U' 'D' 'L' 'R' (mover), 'W' (esperar), 'dim:O|E|F', 'echo' (grabar/parar).
export function act(lvl, s0, action) {
  const s = clone(s0);
  const ev = [];
  if (s.won) return { state: s0, events: [] };

  if (action in DIRS) {
    s.facing = action;
    if (!moveBody(lvl, s, 'P', action, s.dim, ev)) {
      return { state: { ...s0, facing: action }, events: ev };
    }
    enterCell(lvl, s, ev);
    endTurn(lvl, s, action, ev);
    return { state: s, events: ev };
  }

  if (action === 'W') {
    endTurn(lvl, s, 'W', ev);
    return { state: s, events: ev };
  }

  if (action.startsWith('dim:')) {
    const d = action.slice(4);
    if (d === s.dim) return { state: s0, events: [] };
    if (!lvl.dims.includes(d)) return { state: s0, events: [{ type: 'dim-locked', dim: d }] };
    if (s.recording) return { state: s0, events: [{ type: 'dim-recording' }] };
    if (!passable(lvl, s, s.px, s.py, d)) {
      return { state: s0, events: [{ type: 'interference', dim: d, what: 'player' }] };
    }
    for (const b of s.blocks) {
      if (!passable(lvl, s, b.x, b.y, d)) {
        return { state: s0, events: [{ type: 'interference', dim: d, what: 'block', x: b.x, y: b.y }] };
      }
    }
    s.dim = d;
    recompute(lvl, s, false);
    ev.push({ type: 'dim', dim: d });
    return { state: s, events: ev };
  }

  if (action === 'echo') {
    if (!lvl.echo) return { state: s0, events: [{ type: 'echo-locked' }] };
    if (s.recording) {
      if (!s.recording.moves.length) {
        s.recording = null;
        return { state: s, events: [{ type: 'record-cancel' }] };
      }
      stopRecording(lvl, s, ev, false);
      return { state: s, events: ev };
    }
    if (s.dim !== 'E') return { state: s0, events: [{ type: 'echo-wrong-dim' }] };
    s.echo = null;
    recompute(lvl, s, false);
    s.recording = { snap: clone({ ...s, recording: null }), moves: [] };
    ev.push({ type: 'record-start' });
    return { state: s, events: ev };
  }

  throw new Error(`Acción desconocida: ${action}`);
}

// Ejecuta una secuencia de acciones separadas por espacios ("R R D dim:E echo ...").
export function runScript(lvl, script, s = createState(lvl)) {
  const events = [];
  for (const tok of script.trim().split(/\s+/).filter(Boolean)) {
    const expanded = /^[UDLRW]\d+$/.test(tok) ? Array(+tok.slice(1)).fill(tok[0]) : [tok];
    for (const a of expanded) {
      const r = act(lvl, s, a);
      s = r.state;
      events.push(...r.events);
    }
  }
  return { state: s, events };
}

// Búsqueda en anchura sin eco: sirve para comprobar que un nivel NO se resuelve
// sin la mecánica que pretende enseñar, y para encontrar atajos no previstos.
export function solveWithoutEcho(lvl, limit = 300000) {
  const actions = ['U', 'D', 'L', 'R', 'W', ...lvl.dims.map((d) => `dim:${d}`)];
  const sig = (s) => JSON.stringify([s.px, s.py, s.dim, s.blocks.map((b) => key(b.x, b.y)).sort(),
    s.frac, s.leverUsed, s.timers, s.open, s.bridgeOn, s.code]);
  const start = createState(lvl);
  const seen = new Set([sig(start)]);
  let frontier = [{ s: start, path: [] }];
  while (frontier.length && seen.size < limit) {
    const next = [];
    for (const { s, path } of frontier) {
      for (const a of actions) {
        const { state } = act(lvl, s, a);
        if (state === s) continue;
        if (state.won) return [...path, a];
        const k = sig(state);
        if (seen.has(k)) continue;
        seen.add(k);
        next.push({ s: state, path: [...path, a] });
      }
    }
    frontier = next;
  }
  return frontier.length ? 'limit' : null;
}
