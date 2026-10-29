// Renderizador 3D de El Último Umbral (Three.js r160, copia local en vendor/).
// Solo dibuja: lee el estado del motor y anima hacia él. Si WebGL falla, game.js usa el renderizador 2D.
import * as THREE from '../vendor/three/three.module.min.js';
import { EffectComposer } from '../vendor/three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from '../vendor/three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../vendor/three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from '../vendor/three/addons/postprocessing/OutputPass.js';
import { RoundedBoxGeometry } from '../vendor/three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from '../vendor/three/addons/environments/RoomEnvironment.js';
import { DIM_INFO } from './engine.js';

const WH = 0.9;          // altura de pared
const TILE_H = 0.6;      // grosor de las losas del suelo
const DIMCOL = { O: '#ffb347', E: '#6ec6ff', F: '#ff5c8a' };

// Iluminación y ambiente de cada dimensión.
const THEMES = {
  O: { key: '#ffd9ae', keyI: 2.6, sky: '#ffcf9a', ground: '#24170b', hemiI: 0.9, fog: '#0d0905', accent: '#ffb347', floor: '#8d8172', wall: '#8f8473', density: 0.035 },
  E: { key: '#b5dbff', keyI: 2.2, sky: '#76b2ff', ground: '#050d18', hemiI: 0.95, fog: '#040a13', accent: '#6ec6ff', floor: '#6f7f92', wall: '#6d8196', density: 0.04 },
  F: { key: '#ffb0dc', keyI: 2.0, sky: '#c77dff', ground: '#12041a', hemiI: 0.9, fog: '#0c0412', accent: '#ff5c8a', floor: '#7e6c86', wall: '#83688f', density: 0.045 },
};

// ------------------------------------------------------------------
// Texturas procedurales (sin imágenes externas)
// ------------------------------------------------------------------
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function canvas(w, h = w) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

function grime(g, w, h, r, n, alpha, light = false) {
  for (let i = 0; i < n; i++) {
    const x = r() * w, y = r() * h, rad = 4 + r() * w * 0.12;
    const grd = g.createRadialGradient(x, y, 0, x, y, rad);
    const v = light ? 255 : 0;
    grd.addColorStop(0, `rgba(${v},${v},${v},${alpha * r()})`);
    grd.addColorStop(1, `rgba(${v},${v},${v},0)`);
    g.fillStyle = grd;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
}

function speckle(g, w, h, r, amount) {
  const img = g.getImageData(0, 0, w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (r() - 0.5) * amount;
    img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
}

function tex(c, color = true) {
  const t = new THREE.CanvasTexture(c);
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function floorTextures() {
  const S = 512, r = rng(47);
  const [c, g] = canvas(S);
  g.fillStyle = '#827d76'; g.fillRect(0, 0, S, S);
  grime(g, S, S, r, 60, 0.18);
  grime(g, S, S, r, 25, 0.1, true);
  // Placa metálica con bisel y tornillos
  g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 10; g.strokeRect(5, 5, S - 10, S - 10);
  g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 3; g.strokeRect(14, 14, S - 28, S - 28);
  g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2; g.strokeRect(60, 60, S - 120, S - 120);
  for (const [x, y] of [[36, 36], [S - 36, 36], [36, S - 36], [S - 36, S - 36]]) {
    g.fillStyle = 'rgba(0,0,0,.5)'; g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill();
    g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.arc(x - 1.5, y - 1.5, 6, 0, 7); g.fill();
  }
  g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 1;
  for (let i = 0; i < 40; i++) {
    const x = r() * S, y = r() * S, l = 10 + r() * 60, a = r() * Math.PI;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
  }
  speckle(g, S, S, r, 26);
  const [rc, rg] = canvas(256);
  rg.fillStyle = '#b8b8b8'; rg.fillRect(0, 0, 256, 256);
  grime(rg, 256, 256, r, 40, 0.35, true);
  grime(rg, 256, 256, r, 30, 0.3);
  return { map: tex(c), bump: tex(c, false), rough: tex(rc, false) };
}

function wallTextures() {
  const W = 256, H = 256, r = rng(2189);
  const [c, g] = canvas(W, H);
  const grd = g.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, '#8e877e'); grd.addColorStop(1, '#5f5a53');
  g.fillStyle = grd; g.fillRect(0, 0, W, H);
  grime(g, W, H, r, 30, 0.2);
  // Paneles
  g.strokeStyle = 'rgba(0,0,0,.6)'; g.lineWidth = 4;
  g.strokeRect(2, 26, W - 4, H - 28);
  g.beginPath(); g.moveTo(W / 2, 26); g.lineTo(W / 2, H); g.stroke();
  g.lineWidth = 2;
  for (const y of [90, 160]) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  g.fillStyle = 'rgba(255,255,255,.08)';
  g.fillRect(8, 30, W / 2 - 14, 4);
  g.fillRect(W / 2 + 6, 30, W / 2 - 14, 4);
  // Suciedad acumulada abajo
  const dirt = g.createLinearGradient(0, H * 0.7, 0, H);
  dirt.addColorStop(0, 'rgba(0,0,0,0)'); dirt.addColorStop(1, 'rgba(10,6,2,.55)');
  g.fillStyle = dirt; g.fillRect(0, H * 0.7, W, H * 0.3);
  // Rejilla de ventilación
  g.fillStyle = 'rgba(0,0,0,.45)';
  for (let i = 0; i < 6; i++) g.fillRect(150, 104 + i * 8, 80, 3);
  speckle(g, W, H, r, 20);
  // Franja emisiva superior
  const [e, eg] = canvas(W, H);
  eg.fillStyle = '#000'; eg.fillRect(0, 0, W, H);
  eg.fillStyle = '#fff'; eg.fillRect(0, 10, W, 7);
  eg.fillStyle = 'rgba(255,255,255,.25)'; eg.fillRect(0, 7, W, 13);
  const [t, tg] = canvas(128);
  tg.fillStyle = '#6e6a63'; tg.fillRect(0, 0, 128, 128);
  tg.fillStyle = '#3c3935';
  for (let y = 10; y < 120; y += 12) for (let x = 10; x < 120; x += 12) tg.fillRect(x, y, 7, 7);
  tg.strokeStyle = 'rgba(255,255,255,.3)'; tg.lineWidth = 4; tg.strokeRect(2, 2, 124, 124);
  tg.strokeStyle = 'rgba(0,0,0,.5)'; tg.lineWidth = 2; tg.strokeRect(7, 7, 114, 114);
  return { side: tex(c), sideBump: tex(c, false), emissive: tex(e), top: tex(t) };
}

function crateTextures() {
  const S = 256, r = rng(7);
  const [c, g] = canvas(S);
  g.fillStyle = '#a69b88'; g.fillRect(0, 0, S, S);
  grime(g, S, S, r, 20, 0.25);
  g.fillStyle = '#7e7464';
  g.fillRect(0, 0, S, 26); g.fillRect(0, S - 26, S, 26); g.fillRect(0, 0, 26, S); g.fillRect(S - 26, 0, 26, S);
  g.strokeStyle = '#6c6355'; g.lineWidth = 20;
  g.beginPath(); g.moveTo(26, 26); g.lineTo(S - 26, S - 26); g.stroke();
  // Franjas de peligro
  g.save(); g.beginPath(); g.rect(26, S - 52, S - 52, 18); g.clip();
  for (let x = 0; x < S; x += 22) { g.fillStyle = '#e0a52a'; g.beginPath(); g.moveTo(x, S - 34); g.lineTo(x + 11, S - 52); g.lineTo(x + 22, S - 52); g.lineTo(x + 11, S - 34); g.fill(); }
  g.restore();
  g.fillStyle = 'rgba(30,25,18,.8)'; g.font = 'bold 28px monospace'; g.textAlign = 'center';
  g.fillText('A-47', S / 2, 64);
  speckle(g, S, S, r, 24);
  return { map: tex(c), bump: tex(c, false) };
}

function glowSprite() {
  const [c, g] = canvas(64);
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,.35)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  return tex(c, false);
}

function beamTexture() {
  const [c, g] = canvas(16, 128);
  const grd = g.createLinearGradient(0, 0, 0, 128);
  grd.addColorStop(0, 'rgba(255,255,255,0)');
  grd.addColorStop(0.7, 'rgba(255,255,255,.35)');
  grd.addColorStop(1, 'rgba(255,255,255,.9)');
  g.fillStyle = grd; g.fillRect(0, 0, 16, 128);
  return tex(c, false);
}

// Etiqueta de texto en una textura (letras de placas, puertas, consolas…)
function labelTexture(text, { fg = '#ffffff', bg = null, size = 128, font = 800, scale = 0.62 } = {}) {
  const [c, g] = canvas(size);
  drawLabel(g, size, text, fg, bg, font, scale);
  const t = tex(c);
  t.userData = { canvas: c, ctx: g, text };
  return t;
}
function drawLabel(g, size, text, fg, bg, font = 800, scale = 0.62) {
  g.clearRect(0, 0, size, size);
  if (bg) { g.fillStyle = bg; g.fillRect(0, 0, size, size); }
  g.fillStyle = fg;
  const len = [...text].length;
  const px = Math.round(size * scale / Math.max(1, len * 0.62));
  g.font = `${font} ${Math.min(px, size * scale)}px system-ui, sans-serif`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, size / 2, size / 2 + size * 0.03);
}

// ------------------------------------------------------------------
// Renderizador
// ------------------------------------------------------------------
export function createRenderer3D(canvasEl, { quality = 'alta', isRead = () => false } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  if (!renderer.getContext()) return null;

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 200);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const theme = {
    key: new THREE.Color(), sky: new THREE.Color(), ground: new THREE.Color(), fog: new THREE.Color(),
    accent: new THREE.Color(), floor: new THREE.Color(), wall: new THREE.Color(), keyI: 2, hemiI: 0.5, density: 0.04,
  };
  const setTheme = (d, t = 1) => {
    const T = THEMES[d];
    for (const k of ['key', 'sky', 'ground', 'fog', 'accent', 'floor', 'wall']) theme[k].lerp(new THREE.Color(T[k]), t);
    theme.keyI += (T.keyI - theme.keyI) * t;
    theme.hemiI += (T.hemiI - theme.hemiI) * t;
    theme.density += (T.density - theme.density) * t;
  };
  setTheme('O', 1);

  scene.fog = new THREE.FogExp2(theme.fog.clone(), theme.density);
  scene.background = theme.fog.clone();
  const hemi = new THREE.HemisphereLight(theme.sky, theme.ground, theme.hemiI);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(theme.key, theme.keyI);
  key.position.set(-4, 9, 5);
  key.castShadow = true;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key, key.target);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.6, 0.45, 0.96);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // Recursos compartidos entre salas
  const FT = floorTextures(), WT = wallTextures(), CT = crateTextures();
  for (const set of [FT, WT, CT]) for (const t of Object.values(set)) t.userData.shared = true;
  const GLOW = glowSprite(), BEAM = beamTexture();
  const shared = new Set();
  const keep = (x) => { shared.add(x); return x; };

  const floorMat = keep(new THREE.MeshStandardMaterial({ map: FT.map, bumpMap: FT.bump, bumpScale: 2.2, roughnessMap: FT.rough, roughness: 0.85, metalness: 0.35, envMapIntensity: 0.5 }));
  const wallSideMat = keep(new THREE.MeshStandardMaterial({ map: WT.side, bumpMap: WT.sideBump, bumpScale: 2, roughness: 0.8, metalness: 0.25, emissiveMap: WT.emissive, emissive: new THREE.Color('#ffb347'), emissiveIntensity: 1.4, envMapIntensity: 0.4 }));
  const wallTopMat = keep(new THREE.MeshStandardMaterial({ map: WT.top, roughness: 0.7, metalness: 0.6, envMapIntensity: 0.4 }));
  const crateMat = keep(new THREE.MeshStandardMaterial({ map: CT.map, bumpMap: CT.bump, bumpScale: 1.5, roughness: 0.55, metalness: 0.55, envMapIntensity: 0.8 }));
  const darkMetal = keep(new THREE.MeshStandardMaterial({ color: '#4a4744', roughness: 0.5, metalness: 0.7, envMapIntensity: 1 }));
  const steel = keep(new THREE.MeshStandardMaterial({ color: '#a3a6ab', roughness: 0.42, metalness: 0.7, envMapIntensity: 1.1 }));
  const accentMats = [];   // materiales cuyo brillo sigue el color de la dimensión
  const accentMat = (opts = {}) => {
    const m = new THREE.MeshStandardMaterial({ color: '#111', emissive: theme.accent.clone(), emissiveIntensity: 2, roughness: 0.4, metalness: 0.2, ...opts });
    accentMats.push(m);
    return m;
  };

  const tileGeo = keep(new THREE.BoxGeometry(0.985, TILE_H, 0.985));
  const wallGeo = keep(new THREE.BoxGeometry(1, WH, 1));
  const unitBox = keep(new THREE.BoxGeometry(1, 1, 1));
  const unitEdges = keep(new THREE.EdgesGeometry(unitBox));
  const crateGeo = keep(new RoundedBoxGeometry(0.8, 0.8, 0.8, 3, 0.07));
  const planeGeo = keep(new THREE.PlaneGeometry(1, 1));

  // Polvo en suspensión
  const DUST = 260;
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(DUST * 3), 3));
  const dustMat = new THREE.PointsMaterial({ size: 0.045, map: GLOW, color: theme.accent, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending });
  const dust = new THREE.Points(dustGeo, dustMat);
  dust.frustumCulled = false;
  scene.add(dust);

  // Onda al cambiar de dimensión
  const ripple = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 64), new THREE.MeshBasicMaterial({ color: '#fff', transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  ripple.rotation.x = -Math.PI / 2;
  scene.add(ripple);

  let root = null, L = null, lvl = null;
  let view = { w: 1, h: 1 };
  let target = new THREE.Vector3();
  let lastDim = null, lastSnap = -1, rippleT = 1, bloomBoost = 0;
  let q = quality;

  const W2 = (x, y) => [x - (lvl.w - 1) / 2, y - (lvl.h - 1) / 2];
  const disposeTree = (obj) => obj.traverse((o) => {
    if (o.geometry && !shared.has(o.geometry)) o.geometry.dispose();
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    for (const m of mats) {
      if (shared.has(m)) continue;
      for (const k of ['map', 'emissiveMap', 'alphaMap']) if (m[k] && ![GLOW, BEAM].includes(m[k]) && !m[k].userData?.shared) m[k].dispose();
      m.dispose();
    }
  });

  function holo(color, h = WH, glyph = null) {
    const g = new THREE.Group();
    const fill = new THREE.Mesh(unitBox, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.07, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    fill.scale.set(0.94, h, 0.94); fill.position.y = h / 2;
    const edges = new THREE.LineSegments(unitEdges, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9, toneMapped: false }));
    edges.scale.copy(fill.scale); edges.position.copy(fill.position);
    g.add(fill, edges);
    if (glyph) {
      const d = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ map: labelTexture(glyph, { fg: color }), transparent: true, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending }));
      d.rotation.x = -Math.PI / 2; d.position.y = h + 0.02; d.scale.setScalar(0.6);
      g.add(d);
    }
    g.userData.mats = [fill.material, edges.material, ...(g.children[2] ? [g.children[2].material] : [])];
    g.userData.base = g.userData.mats.map((m) => m.opacity);
    return g;
  }
  const setHolo = (g, a) => {
    g.visible = a > 0.02;
    g.userData.mats.forEach((m, i) => { m.opacity = g.userData.base[i] * a; });
  };

  function sign(text, color) {
    const m = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ map: labelTexture(text, { fg: color, bg: 'rgba(8,6,4,.78)', scale: 0.5 }), transparent: true, toneMapped: false }));
    m.scale.set(0.62, 0.62, 1);
    return m;
  }

  function figure(kind) {
    const echo = kind === 'echo';
    const g = new THREE.Group();
    const shell = echo
      ? new THREE.MeshStandardMaterial({ color: '#7fd0ff', emissive: '#3aa0ff', emissiveIntensity: 1.2, transparent: true, opacity: 0.5, roughness: 0.3, depthWrite: false })
      : new THREE.MeshStandardMaterial({ color: '#cfc8bc', roughness: 0.45, metalness: 0.1, envMapIntensity: 0.7 });
    const joint = echo ? shell : new THREE.MeshStandardMaterial({ color: '#3a3836', roughness: 0.6, metalness: 0.5 });
    const glow = echo
      ? new THREE.MeshBasicMaterial({ color: '#bfeaff', toneMapped: false, transparent: true, opacity: 0.8 })
      : accentMat({ emissiveIntensity: 2.6 });
    const body = new THREE.Group();
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.2, 6, 16), shell);
    torso.position.y = 0.42;
    const belt = new THREE.Mesh(new THREE.TorusGeometry(0.152, 0.018, 8, 24), glow);
    belt.rotation.x = Math.PI / 2; belt.position.y = 0.38;
    const pack = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.22, 0.1, 2, 0.03), joint);
    pack.position.set(0, 0.46, -0.15);
    const packLight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.025, 0.02), glow);
    packLight.position.set(0, 0.5, -0.205);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.125, 24, 16), shell);
    head.position.y = 0.73;
    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.105, 24, 12, -Math.PI * 0.42, Math.PI * 0.84, Math.PI * 0.32, Math.PI * 0.3),
      echo ? glow : new THREE.MeshStandardMaterial({ color: '#0b0d10', roughness: 0.05, metalness: 0.9, envMapIntensity: 1.6 }));
    visor.position.set(0, 0.73, 0.035);
    visor.scale.setScalar(1.12);
    const legs = [-0.07, 0.07].map((x) => {
      const l = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.16, 4, 10), joint);
      l.position.set(x, 0.15, 0);
      return l;
    });
    const arms = [-0.2, 0.2].map((x) => {
      const a = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.18, 4, 10), joint);
      a.position.set(x, 0.43, 0);
      return a;
    });
    body.add(torso, belt, pack, packLight, head, visor, ...legs, ...arms);
    g.add(body);
    if (!echo) body.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.02, 8, 48), new THREE.MeshBasicMaterial({ color: '#ff4b3e', toneMapped: false, transparent: true }));
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.04; ring.visible = false;
    g.add(ring);
    const shadowBlob = new THREE.Mesh(new THREE.CircleGeometry(0.24, 24), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: echo ? 0.15 : 0.35, depthWrite: false }));
    shadowBlob.rotation.x = -Math.PI / 2; shadowBlob.position.y = 0.012;
    g.add(shadowBlob);
    body.scale.setScalar(1.2);
    return { g, body, legs, arms, head, visor, ring, shell, glow, pos: new THREE.Vector3(), angle: 0, walk: 0, moving: 0 };
  }

  function setLevel(level, state) {
    if (root) { scene.remove(root); disposeTree(root); }
    accentMats.length = 0;
    lvl = level;
    root = new THREE.Group();
    scene.add(root);
    L = { dwalls: [], shifts: [], doors: [], plates: [], bridges: [], levers: [], consoles: [], terms: [], blocks: [], exit: null };
    wallSideMat.emissive = theme.accent; accentMats.push(wallSideMat);

    const isWall = (x, y) => { const c = lvl.cells[y * lvl.w + x]; return !c || c.t === 'wall'; };
    const cellAtXY = (x, y) => (x < 0 || y < 0 || x >= lvl.w || y >= lvl.h ? null : lvl.cells[y * lvl.w + x]);
    const interior = (c) => {
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const n = cellAtXY(c.x + dx, c.y + dy);
        if (n && n.t !== 'wall') return false;
      }
      return true;
    };

    // Suelo y paredes instanciados
    const floors = lvl.cells.filter((c) => !['wall', 'void', 'bridge'].includes(c.t));
    const walls = lvl.cells.filter((c) => c.t === 'wall' && !interior(c));
    const m4 = new THREE.Matrix4();
    const fl = new THREE.InstancedMesh(tileGeo, floorMat, floors.length);
    floors.forEach((c, i) => {
      const [x, z] = W2(c.x, c.y);
      m4.makeRotationY(((c.x * 7 + c.y * 3) % 4) * Math.PI / 2);
      m4.setPosition(x, -TILE_H / 2, z);
      fl.setMatrixAt(i, m4);
      const v = 0.86 + ((c.x * 13 + c.y * 29) % 10) / 70;
      fl.setColorAt(i, new THREE.Color(v, v, v));
    });
    fl.receiveShadow = true;
    root.add(fl);
    const wallMats = [wallSideMat, wallSideMat, wallTopMat, wallTopMat, wallSideMat, wallSideMat];
    const wl = new THREE.InstancedMesh(wallGeo, wallMats, walls.length);
    walls.forEach((c, i) => {
      const [x, z] = W2(c.x, c.y);
      m4.makeTranslation(x, WH / 2, z);
      wl.setMatrixAt(i, m4);
    });
    wl.castShadow = true; wl.receiveShadow = true;
    root.add(wl);

    // Abismo: estrellas bajo el suelo
    const voids = lvl.cells.filter((c) => c.t === 'void' || c.t === 'bridge');
    if (voids.length) {
      const N = voids.length * 40;
      const pos = new Float32Array(N * 3);
      const r = rng(lvl.id * 977);
      for (let i = 0; i < N; i++) {
        const c = voids[i % voids.length];
        const [x, z] = W2(c.x, c.y);
        pos[i * 3] = x + (r() - 0.5);
        pos[i * 3 + 1] = -0.8 - r() * 6;
        pos[i * 3 + 2] = z + (r() - 0.5);
      }
      const sg = new THREE.BufferGeometry();
      sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 0.05, map: GLOW, color: theme.accent.clone(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
      stars.userData.accent = true;
      root.add(stars);
      L.stars = stars;
    }

    for (const c of lvl.cells) {
      const [x, z] = W2(c.x, c.y);
      if (c.t === 'dwall') {
        const col = DIMCOL[c.dims[0]];
        const crack = c.dims.length > 1;
        const solidMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(col).lerp(new THREE.Color('#777'), 0.55), roughness: 0.5, metalness: 0.4,
          emissive: crack ? DIMCOL.F : col, emissiveIntensity: crack ? 0.0 : 0.35, map: WT.side,
        });
        const solid = new THREE.Mesh(wallGeo, solidMat);
        solid.position.set(x, WH / 2, z);
        solid.castShadow = solid.receiveShadow = true;
        const decal = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({
          map: labelTexture(crack ? '⚡' : c.dims.map((d) => DIM_INFO[d].glyph).join(''), { fg: crack ? DIMCOL.F : '#120a04' }),
          transparent: true, depthWrite: false, toneMapped: !crack,
        }));
        decal.rotation.x = -Math.PI / 2; decal.position.y = WH / 2 + 0.002; decal.scale.setScalar(crack ? 0.9 : 0.55);
        solid.add(decal);
        if (crack) {
          // Grieta luminosa en las caras visibles
          const crk = new THREE.Mesh(new THREE.PlaneGeometry(0.08, WH * 0.9), new THREE.MeshBasicMaterial({ color: DIMCOL.F, toneMapped: false }));
          crk.position.set(0.02, 0, 0.502); crk.rotation.z = 0.2;
          solid.add(crk);
        }
        const h = holo(col, WH, c.dims.map((d) => DIM_INFO[d].glyph).join(''));
        h.position.set(x, 0, z);
        root.add(solid, h);
        L.dwalls.push({ c, solid, holo: h, t: 1 });
      } else if (c.t === 'shift') {
        const mat = new THREE.MeshStandardMaterial({ color: '#7a6e86', roughness: 0.55, metalness: 0.5, map: CT.map, emissive: DIMCOL.F, emissiveIntensity: 0.25 });
        const wall = new THREE.Mesh(wallGeo, mat);
        wall.castShadow = wall.receiveShadow = true;
        wall.position.set(x, WH / 2, z);
        const lab = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ map: labelTexture(c.phase === 0 ? 'A' : 'B', { fg: '#ffffff' }), transparent: true, depthWrite: false, toneMapped: false }));
        lab.rotation.x = -Math.PI / 2; lab.position.y = WH / 2 + 0.002; lab.scale.setScalar(0.5);
        wall.add(lab);
        const h = holo(DIMCOL.F, WH, c.phase === 0 ? 'A' : 'B');
        h.position.set(x, 0, z);
        root.add(wall, h);
        L.shifts.push({ c, wall, holo: h, t: 1 });
      } else if (c.t === 'door') {
        const horizontal = !isWall(c.x - 1, c.y) && !isWall(c.x + 1, c.y);
        const g = new THREE.Group();
        g.position.set(x, 0, z);
        if (horizontal) g.rotation.y = Math.PI / 2;
        // marco
        for (const sx of [-0.46, 0.46]) {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, WH + 0.06, 1), darkMetal);
          post.position.set(sx, (WH + 0.06) / 2, 0); post.castShadow = true;
          g.add(post);
        }
        const lintel = new THREE.Mesh(new THREE.BoxGeometry(1, 0.08, 1), darkMetal);
        lintel.position.y = WH + 0.02;
        g.add(lintel);
        const lightStrip = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.03, 0.04), accentMat());
        lightStrip.position.set(0, WH - 0.04, 0.48);
        g.add(lightStrip);
        const panels = [-1, 1].map((side) => {
          const p = new THREE.Mesh(new THREE.BoxGeometry(0.42, WH - 0.04, 0.14), steel);
          p.castShadow = true;
          p.position.set(side * 0.21, (WH - 0.04) / 2, 0);
          const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.04, WH * 0.6, 0.15), accentMat({ emissiveIntensity: 1.2 }));
          stripe.position.x = -side * 0.17;
          p.add(stripe);
          g.add(p);
          return { p, side };
        });
        const sg = sign(c.req.includes('code') ? '∴' : c.req.join('·'), '#ffd27a');
        sg.position.set(x, WH + 0.45, z + 0.1);
        root.add(g, sg);
        L.doors.push({ c, g, panels, sign: sg, t: 0 });
      } else if (c.t === 'plate') {
        const ringMat = accentMat({ emissiveIntensity: 0.6 });
        const base = new THREE.Mesh(new RoundedBoxGeometry(0.78, 0.05, 0.78, 2, 0.02), darkMetal);
        base.position.set(x, 0.02, z); base.receiveShadow = true;
        const pad = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.06, 0.62, 2, 0.02), ringMat);
        pad.position.set(x, 0.06, z); pad.receiveShadow = true;
        const tx = labelTexture(c.id, { fg: '#ffffff' });
        const label = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ map: tx, transparent: true, depthWrite: false, toneMapped: false }));
        label.rotation.x = -Math.PI / 2; label.position.set(x, 0.095, z); label.scale.setScalar(0.42);
        root.add(base, pad, label);
        let extra = null;
        if (c.dims || c.hold) {
          const ex = labelTexture('', { fg: '#fff', size: 128 });
          extra = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ map: ex, transparent: true, depthWrite: false, toneMapped: false }));
          extra.rotation.x = -Math.PI / 2; extra.position.set(x, 0.1, z + 0.27); extra.scale.set(0.5, 0.5, 1);
          root.add(extra);
        }
        L.plates.push({ c, pad, ringMat, label, extra, t: 0, last: null });
      } else if (c.t === 'bridge') {
        const col = DIMCOL[c.dims[0]];
        const mat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.3, transparent: true, opacity: 0.45, roughness: 0.1, metalness: 0.3, depthWrite: false });
        const plank = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.06, 0.72), mat);
        plank.position.set(x, -0.03, z);
        const rails = new THREE.Group();
        for (const sz of [-0.38, 0.38]) {
          const rl = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.03, 0.03), new THREE.MeshBasicMaterial({ color: col, toneMapped: false }));
          rl.position.set(0, 0.02, sz);
          rails.add(rl);
        }
        plank.add(rails);
        const h = holo(col, 0.05, DIM_INFO[c.dims[0]].glyph);
        h.position.set(x, -0.05, z);
        root.add(plank, h);
        let sg = null;
        const first = c.req && c.x === Math.min(...lvl.bridges.filter((b) => b.y === c.y).map((b) => b.x));
        if (first) { sg = sign(c.req.join('·'), col); sg.position.set(x - 0.6, 0.55, z); root.add(sg); }
        L.bridges.push({ c, plank, mat, holo: h, t: 0 });
      } else if (c.t === 'lever') {
        const g = new THREE.Group();
        g.position.set(x, 0, z);
        const base = new THREE.Mesh(new RoundedBoxGeometry(0.44, 0.22, 0.34, 2, 0.04), darkMetal);
        base.position.y = 0.11; base.castShadow = true;
        const pivot = new THREE.Group();
        pivot.position.y = 0.2;
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.42, 10), steel);
        arm.position.y = 0.21;
        const knob = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), new THREE.MeshStandardMaterial({ color: DIMCOL.F, emissive: DIMCOL.F, emissiveIntensity: 1.5 }));
        knob.position.y = 0.43;
        pivot.add(arm, knob);
        g.add(base, pivot);
        const h = holo(DIMCOL.F, 0.5, '◆');
        h.position.set(x, 0, z);
        h.scale.set(0.6, 1, 0.6);
        root.add(g, h);
        L.levers.push({ c, g, pivot, knob, holo: h, t: 0, ang: -0.6 });
      } else if (c.t === 'console') {
        const g = new THREE.Group();
        g.position.set(x, 0, z);
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.45, 6), darkMetal);
        col.position.y = 0.225; col.castShadow = true;
        const scr = labelTexture(String(c.n), { fg: '#ffffff' });
        const screenMat = new THREE.MeshStandardMaterial({ color: '#000', emissive: '#ffffff', emissiveMap: scr, emissiveIntensity: 1.2 });
        const screen = new THREE.Mesh(new THREE.CircleGeometry(0.2, 6), screenMat);
        screen.rotation.x = -Math.PI / 2; screen.rotation.z = Math.PI / 6; screen.position.y = 0.455;
        g.add(col, screen);
        root.add(g);
        L.consoles.push({ c, screenMat });
      } else if (c.t === 'term') {
        const g = new THREE.Group();
        g.position.set(x, 0, z);
        const stand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.35, 0.1), darkMetal);
        stand.position.y = 0.175;
        const box = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.3, 0.08, 2, 0.02), darkMetal);
        box.position.set(0, 0.42, 0); box.rotation.x = -0.55; box.castShadow = true;
        const screenMat = new THREE.MeshBasicMaterial({ color: theme.accent.clone(), toneMapped: false });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.22), screenMat);
        screen.position.set(0, 0, 0.042);
        box.add(screen);
        g.add(stand, box);
        root.add(g);
        L.terms.push({ c, screenMat });
      } else if (c.t === 'exit') {
        const g = new THREE.Group();
        g.position.set(x, 0, z);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.035, 12, 64), accentMat({ emissiveIntensity: 2.2 }));
        ring.rotation.x = Math.PI / 2; ring.position.y = 0.05;
        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.015, 8, 48), accentMat({ emissiveIntensity: 1.8 }));
        ring2.rotation.x = Math.PI / 2; ring2.position.y = 0.3;
        const disc = new THREE.Mesh(new THREE.CircleGeometry(0.34, 48), new THREE.MeshBasicMaterial({ map: GLOW, color: theme.accent.clone(), transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
        disc.rotation.x = -Math.PI / 2; disc.position.y = 0.04;
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 1.6, 32, 1, true), new THREE.MeshBasicMaterial({ map: BEAM, color: theme.accent.clone(), transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, toneMapped: false }));
        beam.position.y = 0.8; beam.rotation.x = Math.PI;
        const N = 40, pos = new Float32Array(N * 3), r = rng(10);
        for (let i = 0; i < N; i++) { const a = r() * 6.28, rr = 0.1 + r() * 0.25; pos[i * 3] = Math.cos(a) * rr; pos[i * 3 + 1] = r() * 1.5; pos[i * 3 + 2] = Math.sin(a) * rr; }
        const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const parts = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.06, map: GLOW, color: theme.accent.clone(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
        const light = new THREE.PointLight(theme.accent.clone(), 3, 3.5, 1.6);
        light.position.y = 0.6;
        g.add(ring, ring2, disc, beam, parts, light);
        root.add(g);
        L.exit = { g, ring2, disc, beam, parts, light };
      }
    }

    state.blocks.forEach(() => {
      const b = new THREE.Mesh(crateGeo, crateMat);
      b.castShadow = b.receiveShadow = true;
      root.add(b);
      L.blocks.push({ mesh: b, pos: new THREE.Vector3() });
    });

    L.player = figure('player');
    L.echo = figure('echo');
    L.playerLight = new THREE.PointLight(theme.accent.clone(), 0.9, 2.4, 1.8);
    L.playerLight.position.set(0, 1.3, 0.3);
    L.player.g.add(L.playerLight);
    root.add(L.player.g, L.echo.g);

    // Polvo dentro del volumen de la sala
    const p = dustGeo.attributes.position.array;
    const r = rng(lvl.id * 31);
    for (let i = 0; i < DUST; i++) {
      p[i * 3] = (r() - 0.5) * lvl.w;
      p[i * 3 + 1] = r() * 2.2;
      p[i * 3 + 2] = (r() - 0.5) * lvl.h;
    }
    dustGeo.attributes.position.needsUpdate = true;

    // Sombras ajustadas al tamaño de la sala
    const ext = Math.max(lvl.w, lvl.h) / 2 + 1;
    Object.assign(key.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 0.5, far: 30 });
    key.shadow.camera.updateProjectionMatrix();
    target.set(0, 0, 0);
    lastDim = null;
    lastSnap = -1;
    applyQuality();
    fitCamera();
  }

  function fitCamera() {
    if (!lvl) return;
    camera.aspect = view.w / view.h;
    camera.updateProjectionMatrix();
    const pitch = view.w / view.h < 0.8 ? 1.12 : 1.0;
    const dir = new THREE.Vector3(0, Math.sin(pitch), Math.cos(pitch));
    // En vertical, si la sala es muy ancha se encuadran 9 columnas y la cámara sigue al jugador.
    const portrait = view.w / view.h < 0.8;
    fitW = portrait ? Math.min(lvl.w, 9) : lvl.w;
    const hw = fitW / 2, hh = lvl.h / 2;
    const corners = [];
    for (const sx of [-hw, hw]) for (const sz of [-hh, hh]) for (const y of [0, WH]) corners.push(new THREE.Vector3(sx, y, sz));
    const fits = (d) => {
      camera.position.copy(target).addScaledVector(dir, d);
      camera.lookAt(target);
      camera.updateMatrixWorld();
      return corners.every((c) => { const v = c.clone().project(camera); return Math.abs(v.x) < 0.95 && v.y < 0.86 && v.y > -0.92; });
    };
    let lo = 2, hi = 120;
    for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (fits(mid)) hi = mid; else lo = mid; }
    camDist = hi;
    camDir = dir;
  }
  let camDist = 10, camDir = new THREE.Vector3(0, 1, 1).normalize(), fitW = 1, panX = 0;

  function applyQuality() {
    const high = q === 'alta';
    renderer.shadowMap.enabled = high;
    key.castShadow = high;
    const mobile = Math.min(view.w, view.h) < 600;
    key.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
    if (key.shadow.map) { key.shadow.map.dispose(); key.shadow.map = null; }
    dust.visible = high;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, high ? 2 : 1));
    renderer.setSize(view.w, view.h, false);
    composer.setPixelRatio(renderer.getPixelRatio());
    composer.setSize(view.w, view.h);
    scene.traverse((o) => { if (o.material) [].concat(o.material).forEach((m) => { m.needsUpdate = true; }); });
  }

  function resize(w, h) {
    view = { w: Math.max(1, w), h: Math.max(1, h) };
    renderer.setSize(view.w, view.h, false);
    composer.setSize(view.w, view.h);
    bloom.resolution.set(view.w / 2, view.h / 2);
    fitCamera();
  }

  const lerp = (a, b, k) => a + (b - a) * k;
  const occupiedAt = (s, x, y) => (s.px === x && s.py === y) || (s.echo && s.echo.x === x && s.echo.y === y) || s.blocks.some((b) => b.x === x && b.y === y);
  const FACING = { D: 0, U: Math.PI, R: Math.PI / 2, L: -Math.PI / 2 };

  function animFigure(F, gx, gy, facing, dt, now, k, snap) {
    const [x, z] = W2(gx, gy);
    if (snap) F.pos.set(x, 0, z);
    const dx = x - F.pos.x, dz = z - F.pos.z;
    const dist = Math.hypot(dx, dz);
    F.pos.x = lerp(F.pos.x, x, k); F.pos.z = lerp(F.pos.z, z, k);
    F.moving = lerp(F.moving, dist > 0.02 ? 1 : 0, Math.min(1, dt * 12));
    F.walk += dt * 14 * F.moving;
    const want = FACING[facing] ?? 0;
    let da = want - F.angle;
    da = Math.atan2(Math.sin(da), Math.cos(da));
    F.angle += da * Math.min(1, dt * 14);
    F.g.position.set(F.pos.x, 0, F.pos.z);
    F.body.rotation.y = F.angle;
    const swing = Math.sin(F.walk) * 0.5 * F.moving;
    F.legs[0].rotation.x = swing; F.legs[1].rotation.x = -swing;
    F.arms[0].rotation.x = -swing * 0.8; F.arms[1].rotation.x = swing * 0.8;
    F.body.position.y = Math.abs(Math.sin(F.walk)) * 0.04 * F.moving + Math.sin(now / 700) * 0.006;
  }

  function frame(s, dt, now, fx) {
    if (!lvl || !L) return;
    const reduce = fx.reduceMotion;
    const k = reduce ? 1 : Math.min(1, dt * 16);

    // Tema de la dimensión
    if (lastDim !== s.dim) {
      if (lastDim !== null) {
        rippleT = reduce ? 1 : 0;
        bloomBoost = reduce ? 0 : 1;
        ripple.material.color.set(THEMES[s.dim].accent);
      }
      lastDim = s.dim;
    }
    setTheme(s.dim, reduce ? 1 : Math.min(1, dt * 5));
    scene.fog.color.copy(theme.fog); scene.fog.density = theme.density * Math.min(1, 9 / camDist);
    scene.background.copy(theme.fog);
    hemi.color.copy(theme.sky); hemi.groundColor.copy(theme.ground); hemi.intensity = theme.hemiI;
    key.color.copy(theme.key); key.intensity = theme.keyI;
    for (const m of accentMats) m.emissive.copy(theme.accent);
    dustMat.color.copy(theme.accent);
    if (L.stars) L.stars.material.color.copy(theme.accent);
    L.playerLight.color.copy(theme.accent);
    if (L.exit) {
      L.exit.light.color.copy(theme.accent);
      L.exit.disc.material.color.copy(theme.accent);
      L.exit.beam.material.color.copy(theme.accent);
      L.exit.parts.material.color.copy(theme.accent);
    }

    const snap = fx.snapToken !== lastSnap;
    lastSnap = fx.snapToken;

    // Jugador y eco
    let bumpX = 0, bumpZ = 0;
    if (fx.bump) {
      fx.bump.t += dt * 7;
      const d = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] }[fx.bump.dir];
      const a = Math.sin(Math.min(1, fx.bump.t) * Math.PI) * 0.12;
      bumpX = d[0] * a; bumpZ = d[1] * a;
      if (fx.bump.t >= 1) fx.bump = null;
    }
    animFigure(L.player, s.px, s.py, s.facing, dt, now, k, snap);
    L.player.g.position.x += bumpX; L.player.g.position.z += bumpZ;
    L.player.ring.visible = !!s.recording;
    if (s.recording) {
      L.player.ring.material.opacity = 0.55 + 0.45 * Math.sin(now / 160);
      L.player.ring.scale.setScalar(1 + 0.06 * Math.sin(now / 160));
    }
    if (fx.flash > 0.4) L.player.shell.emissive?.setRGB(fx.flash * 0.8, 0.05, 0.02);
    else L.player.shell.emissive?.setRGB(0, 0, 0);

    L.echo.g.visible = !!s.echo;
    if (s.echo) {
      const facing = s.echo.idx > 0 && s.echo.idx <= s.echo.queue.length ? s.echo.queue[s.echo.idx - 1] : 'D';
      animFigure(L.echo, s.echo.x, s.echo.y, facing === 'W' ? L.echo.lastFacing || 'D' : facing, dt, now, k, snap || !L.echo.seen);
      if (facing !== 'W') L.echo.lastFacing = facing;
      L.echo.seen = true;
      const vis = s.dim === 'E' ? 0.55 : 0.28;
      L.echo.shell.opacity = vis * (0.85 + 0.15 * Math.sin(now / 90));
    } else L.echo.seen = false;

    // Bloques
    s.blocks.forEach((b, i) => {
      const B = L.blocks[i];
      if (!B) return;
      const [x, z] = W2(b.x, b.y);
      if (snap) B.pos.set(x, 0, z);
      B.pos.x = lerp(B.pos.x, x, k); B.pos.z = lerp(B.pos.z, z, k);
      B.mesh.position.set(B.pos.x, 0.4, B.pos.z);
    });

    // Paredes de dimensión
    for (const D of L.dwalls) {
      const on = D.c.dims.includes(s.dim);
      D.t = lerp(D.t, on ? 1 : 0, reduce ? 1 : Math.min(1, dt * 9));
      D.solid.visible = D.t > 0.02;
      D.solid.scale.y = Math.max(0.02, D.t);
      D.solid.position.y = (WH * D.solid.scale.y) / 2;
      setHolo(D.holo, (1 - D.t) * (0.8 + 0.2 * Math.sin(now / 400 + D.c.x)));
    }
    for (const S of L.shifts) {
      const solid = s.frac === S.c.phase;
      S.t = lerp(S.t, solid ? 1 : 0, reduce ? 1 : Math.min(1, dt * 6));
      S.wall.position.y = WH / 2 - (1 - S.t) * (WH + 0.04);
      S.wall.visible = S.t > 0.02;
      setHolo(S.holo, (1 - S.t) * 0.7);
    }
    for (const Dr of L.doors) {
      const open = !!s.open[`${Dr.c.x},${Dr.c.y}`];
      Dr.t = lerp(Dr.t, open ? 1 : 0, reduce ? 1 : Math.min(1, dt * 8));
      for (const { p, side } of Dr.panels) p.position.x = side * (0.21 + Dr.t * 0.36);
      Dr.sign.material.opacity = 1 - Dr.t * 0.6;
      Dr.sign.quaternion.copy(camera.quaternion);
    }
    for (const P of L.plates) {
      const on = !!s.active[P.c.id];
      const pressed = occupiedAt(s, P.c.x, P.c.y);
      P.t = lerp(P.t, pressed ? 1 : 0, Math.min(1, dt * 14));
      P.pad.position.y = 0.06 - P.t * 0.03;
      P.ringMat.emissiveIntensity = lerp(P.ringMat.emissiveIntensity, on ? 1.5 : 0.3, Math.min(1, dt * 10));
      P.label.position.y = P.pad.position.y + 0.035;
      if (P.extra) {
        const tl = s.timers[`${P.c.x},${P.c.y}`] || 0;
        const glyphs = P.c.dims ? P.c.dims.map((d) => DIM_INFO[d].glyph).join('') : '';
        const timer = P.c.hold ? ` ⧗${on && tl > 0 && !pressed ? tl : P.c.hold}` : '';
        const text = `${glyphs}${timer}`.trim();
        if (text !== P.last) {
          const t = P.extra.material.map;
          drawLabel(t.userData.ctx, 128, text, on && !pressed && tl > 0 ? '#ffffff' : THEMES.O.accent, 'rgba(0,0,0,.55)', 800, 0.5);
          t.needsUpdate = true;
          P.last = text;
        }
      }
    }
    for (const Br of L.bridges) {
      const on = Br.c.dims.includes(s.dim) && !!s.bridgeOn[`${Br.c.x},${Br.c.y}`];
      Br.t = lerp(Br.t, on ? 1 : 0, reduce ? 1 : Math.min(1, dt * 10));
      Br.plank.visible = Br.t > 0.02;
      Br.mat.opacity = 0.45 * Br.t;
      Br.plank.scale.set(1, 1, Math.max(0.05, Br.t));
      setHolo(Br.holo, (1 - Br.t) * 0.9);
    }
    for (const Lv of L.levers) {
      const here = s.dim === 'F';
      Lv.t = lerp(Lv.t, here ? 1 : 0, reduce ? 1 : Math.min(1, dt * 9));
      Lv.g.visible = Lv.t > 0.05;
      Lv.g.scale.setScalar(Math.max(0.05, Lv.t));
      setHolo(Lv.holo, 1 - Lv.t);
      Lv.ang = lerp(Lv.ang, s.frac === 0 ? -0.6 : 0.6, Math.min(1, dt * 10));
      Lv.pivot.rotation.x = Lv.ang;
      Lv.knob.material.emissiveIntensity = Lv.c.once && s.leverUsed ? 0.1 : 1.5;
    }
    const lit = (lvl.code || []).slice(0, s.code);
    for (const C of L.consoles) {
      const on = s.flags.code || lit.includes(C.c.n);
      C.screenMat.emissive.copy(on ? theme.accent : new THREE.Color('#ffffff'));
      C.screenMat.emissiveIntensity = on ? 2.5 : 0.6;
    }
    for (const Tm of L.terms) {
      const read = s.docs.includes(Tm.c.doc) || isRead(Tm.c.doc);
      Tm.screenMat.color.copy(read ? new THREE.Color('#2a2a2a') : theme.accent);
      if (!read) Tm.screenMat.color.multiplyScalar((Tm.c.secret ? 0.5 : 0.8) + 0.4 * Math.abs(Math.sin(now / 500)));
    }
    if (L.exit) {
      L.exit.ring2.position.y = 0.3 + Math.sin(now / 600) * 0.12;
      L.exit.beam.rotation.y += dt * 0.6;
      L.exit.light.intensity = 1.8 + Math.sin(now / 300) * 0.4;
      const pa = L.exit.parts.geometry.attributes.position;
      for (let i = 0; i < pa.count; i++) {
        let y = pa.getY(i) + dt * 0.5;
        if (y > 1.5) y = 0;
        pa.setY(i, y);
      }
      pa.needsUpdate = true;
    }

    // Polvo
    if (dust.visible && !reduce) {
      const p = dustGeo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        let y = p.getY(i) + dt * 0.05;
        if (y > 2.2) y = 0;
        p.setY(i, y);
        p.setX(i, p.getX(i) + Math.sin(now / 2000 + i) * dt * 0.02);
      }
      p.needsUpdate = true;
    }

    // Onda de cambio de dimensión
    if (rippleT < 1) {
      rippleT = Math.min(1, rippleT + dt * 2.4);
      ripple.position.set(L.player.g.position.x, 0.05, L.player.g.position.z);
      ripple.scale.setScalar(0.3 + rippleT * Math.max(lvl.w, lvl.h) * 0.45);
      ripple.material.opacity = (1 - rippleT) * (1 - rippleT) * 0.6;
    } else ripple.material.opacity = 0;
    bloomBoost = Math.max(0, bloomBoost - dt * 2.5);
    bloom.strength = 0.6 + bloomBoost * 0.9 + (fx.flash || 0) * 0.4;

    // Cámara: encuadre fijo con un leve seguimiento y temblor
    const slack = (lvl.w - fitW) / 2;
    const wantPan = slack > 0 ? Math.max(-slack, Math.min(slack, L.player.g.position.x)) : 0;
    panX = snap ? wantPan : lerp(panX, wantPan, Math.min(1, dt * 4));
    const follow = new THREE.Vector3(panX + (slack > 0 ? 0 : L.player.g.position.x * 0.08), 0, L.player.g.position.z * 0.05);
    const look = target.clone().add(follow);
    camera.position.copy(look).addScaledVector(camDir, camDist);
    if (!reduce) {
      camera.position.x += Math.sin(now / 4000) * 0.05;
      if (fx.shake > 0) {
        camera.position.x += (Math.random() - 0.5) * 0.15 * fx.shake;
        camera.position.y += (Math.random() - 0.5) * 0.15 * fx.shake;
      }
    }
    camera.lookAt(look);
    key.target.position.set(0, 0, 0);

    if (q === 'alta') composer.render(dt);
    else renderer.render(scene, camera);
  }

  const raycaster = new THREE.Raycaster();
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  function pick(clientX, clientY) {
    if (!lvl) return null;
    const r = canvasEl.getBoundingClientRect();
    const ndc = new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = new THREE.Vector3();
    if (!raycaster.ray.intersectPlane(ground, hit)) return null;
    return { x: hit.x + (lvl.w - 1) / 2, y: hit.z + (lvl.h - 1) / 2 };
  }

  function setQuality(v) { q = v; applyQuality(); }

  return { setLevel, frame, resize, pick, setQuality };
}
