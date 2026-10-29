// Renderizador 3D de El Último Umbral — estilo anime/shonen.
// Sombreado por bandas (toon), contornos de tinta, formas redondeadas y cielos con rayos.
// Solo dibuja: lee el estado del motor y anima hacia él. Si WebGL falla, game.js usa el renderizador 2D.
import * as THREE from '../vendor/three/three.module.min.js';
import { EffectComposer } from '../vendor/three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from '../vendor/three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../vendor/three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from '../vendor/three/addons/postprocessing/OutputPass.js';
import { RoundedBoxGeometry } from '../vendor/three/addons/geometries/RoundedBoxGeometry.js';
import { DIM_INFO } from './engine.js';

const WH = 0.95;         // altura de pared
const TILE_H = 0.5;      // grosor de las losas
const INK = '#160b20';   // color de los contornos
const DISPLAY = "'Bangers', Impact, 'Arial Black', sans-serif";
const DIMCOL = { O: '#ffb347', E: '#5cc8ff', F: '#ff4f8b' };

// Paleta de cada dimensión: colores saturados, de cómic.
const THEMES = {
  O: { key: '#fff1d6', keyI: 2.4, sky: '#ffd6a0', ground: '#4a2440', hemiI: 1.25, accent: '#ffb347',
    floor: '#f2d3a2', wall: '#d0653c', wallTop: '#f39a5c', top: '#ffb35c', mid: '#e0526a', bottom: '#2a0f3a', fog: '#3a1530', density: 0.02 },
  E: { key: '#e4f6ff', keyI: 2.3, sky: '#9fdcff', ground: '#10204a', hemiI: 1.3, accent: '#5cc8ff',
    floor: '#cfe9f5', wall: '#3a72d0', wallTop: '#6aa8f0', top: '#7fe0ff', mid: '#2b5fd0', bottom: '#08113a', fog: '#0e1a44', density: 0.02 },
  F: { key: '#ffe6f6', keyI: 2.2, sky: '#ffb0e0', ground: '#2a0838', hemiI: 1.2, accent: '#ff4f8b',
    floor: '#ead0f4', wall: '#8a3fc4', wallTop: '#c06ef0', top: '#ff7ab8', mid: '#7a24b8', bottom: '#14031f', fog: '#2a0a3a', density: 0.022 },
};

// ------------------------------------------------------------------
// Utilidades
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
function tex(c, color = true) {
  const t = new THREE.CanvasTexture(c);
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

// Rampa de tres tonos: la clave del sombreado de anime.
function toonRamp() {
  const t = new THREE.DataTexture(new Uint8Array([90, 175, 255]), 3, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  return t;
}

// Contorno de tinta por «casco invertido»: la malla se infla por sus normales y se pinta por detrás.
const inkCache = new Map();
function inkMat(width, color = INK, opacity = 1) {
  const k = `${width}|${color}|${opacity}`;
  if (inkCache.has(k)) return inkCache.get(k);
  const m = new THREE.MeshBasicMaterial({ color, side: THREE.BackSide, transparent: opacity < 1, opacity });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uInk = { value: width };
    sh.vertexShader = `uniform float uInk;\n${sh.vertexShader}`.replace(
      '#include <begin_vertex>',
      '#include <begin_vertex>\ntransformed += normalize(normal) * uInk;',
    );
  };
  m.customProgramCacheKey = () => `ink-${width}`;
  m.userData.shared = true;
  inkCache.set(k, m);
  return m;
}
function ink(mesh, width = 0.022, color = INK, opacity = 1) {
  const o = new THREE.Mesh(mesh.geometry, inkMat(width, color, opacity));
  o.userData.ink = true;
  mesh.add(o);
  return mesh;
}
function inkInstanced(im, width = 0.022) {
  const o = new THREE.InstancedMesh(im.geometry, inkMat(width), im.count);
  o.instanceMatrix = im.instanceMatrix;
  o.frustumCulled = false;
  return o;
}

// ------------------------------------------------------------------
// Texturas dibujadas a mano (por código)
// ------------------------------------------------------------------
function floorTexture() {
  const S = 256, r = rng(47);
  const [c, g] = canvas(S);
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, S, S);
  // Brillo de borde y sombra interior, como una losa pintada
  g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 10; g.strokeRect(10, 10, S - 20, S - 20);
  g.fillStyle = 'rgba(0,0,0,.07)';
  g.beginPath(); g.moveTo(S, 0); g.lineTo(S, S); g.lineTo(0, S); g.lineTo(40, S - 40); g.lineTo(S - 40, S - 40); g.lineTo(S - 40, 40); g.closePath(); g.fill();
  // Grietas en trazo de tinta
  g.strokeStyle = 'rgba(40,20,50,.35)'; g.lineWidth = 3; g.lineCap = 'round';
  for (let i = 0; i < 2; i++) {
    let x = 40 + r() * (S - 80), y = 40 + r() * (S - 80);
    g.beginPath(); g.moveTo(x, y);
    for (let k = 0; k < 4; k++) { x += (r() - 0.5) * 50; y += (r() - 0.5) * 50; g.lineTo(x, y); }
    g.stroke();
  }
  // Destellos
  g.fillStyle = 'rgba(255,255,255,.8)';
  for (let i = 0; i < 3; i++) { const x = 30 + r() * 190, y = 30 + r() * 190; g.fillRect(x, y, 14, 4); g.fillRect(x + 5, y - 5, 4, 14); }
  return tex(c);
}

function wallTexture() {
  const W = 128, H = 128, r = rng(9);
  const [c, g] = canvas(W, H);
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
  // Sillares redondeados en trazo de cómic
  g.strokeStyle = 'rgba(30,10,40,.32)'; g.lineWidth = 3;
  const rows = 3;
  for (let i = 0; i < rows; i++) {
    const y = (H / rows) * i;
    const off = i % 2 ? W / 2 : 0;
    for (let x = -W / 2 + off; x < W; x += W / 2) {
      g.beginPath(); g.roundRect(x + 3, y + 3, W / 2 - 6, H / rows - 6, 9); g.stroke();
    }
  }
  g.fillStyle = 'rgba(255,255,255,.55)';
  for (let i = 0; i < 4; i++) g.fillRect(10 + r() * 100, 8 + r() * 110, 10, 3);
  return tex(c);
}

function crateTexture() {
  const S = 256;
  const [c, g] = canvas(S);
  g.fillStyle = '#ffc463'; g.fillRect(0, 0, S, S);
  g.fillStyle = '#e8862e'; g.fillRect(0, S * 0.62, S, S * 0.38);
  g.strokeStyle = INK; g.lineWidth = 10; g.strokeRect(14, 14, S - 28, S - 28);
  // Runa central
  g.lineWidth = 9; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(S / 2, 60); g.lineTo(S / 2, S - 60); g.moveTo(S / 2, 90); g.lineTo(S / 2 + 46, 130); g.moveTo(S / 2, 120); g.lineTo(S / 2 - 46, 160); g.stroke();
  g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(28, 28, 60, 10);
  return tex(c);
}

function glowSprite() {
  const [c, g] = canvas(64);
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.3, 'rgba(255,255,255,.5)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  return tex(c, false);
}

function starSprite() {
  const [c, g] = canvas(64);
  g.fillStyle = '#fff';
  g.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, rr = i % 2 ? 7 : 30;
    g.lineTo(32 + Math.cos(a) * rr, 32 + Math.sin(a) * rr);
  }
  g.fill();
  return tex(c, false);
}

// Círculo mágico: anillos, marcas rúnicas y la letra en el centro.
function magicCircle(letter, size = 256) {
  const [c, g] = canvas(size);
  const m = size / 2;
  g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineCap = 'round';
  g.lineWidth = size * 0.035; g.beginPath(); g.arc(m, m, size * 0.46, 0, 7); g.stroke();
  g.lineWidth = size * 0.015; g.beginPath(); g.arc(m, m, size * 0.38, 0, 7); g.stroke();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const r1 = size * 0.39, r2 = size * (i % 2 ? 0.43 : 0.45);
    g.lineWidth = size * 0.02;
    g.beginPath(); g.moveTo(m + Math.cos(a) * r1, m + Math.sin(a) * r1); g.lineTo(m + Math.cos(a) * r2, m + Math.sin(a) * r2); g.stroke();
  }
  // Estrella de seis puntas
  g.lineWidth = size * 0.012;
  for (const off of [0, Math.PI / 3]) {
    g.beginPath();
    for (let i = 0; i <= 3; i++) { const a = off + (i / 3) * Math.PI * 2 - Math.PI / 2; g.lineTo(m + Math.cos(a) * size * 0.37, m + Math.sin(a) * size * 0.37); }
    g.stroke();
  }
  if (letter) {
    g.font = `${size * 0.36}px ${DISPLAY}`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = size * 0.04; g.strokeStyle = INK; g.strokeText(letter, m, m + size * 0.02);
    g.fillText(letter, m, m + size * 0.02);
  }
  return tex(c);
}

function spiralTexture() {
  const S = 256;
  const [c, g] = canvas(S);
  g.translate(S / 2, S / 2);
  for (let arm = 0; arm < 4; arm++) {
    g.rotate(Math.PI / 2);
    g.beginPath();
    for (let t = 0; t < 1; t += 0.01) {
      const a = t * Math.PI * 2.2, rr = t * S * 0.48;
      g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 12; g.lineCap = 'round'; g.stroke();
  }
  const grd = g.createRadialGradient(0, 0, 0, 0, 0, S / 2);
  grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.25, 'rgba(255,255,255,.2)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(-S / 2, -S / 2, S, S);
  return tex(c, false);
}

function hexTexture() {
  const W = 128, H = 128;
  const [c, g] = canvas(W, H);
  g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 3;
  const R = 14, dx = R * 1.5, dy = R * Math.sqrt(3);
  for (let x = 0, i = 0; x < W + R; x += dx, i++) {
    for (let y = (i % 2) * dy / 2; y < H + R; y += dy) {
      g.beginPath();
      for (let k = 0; k <= 6; k++) { const a = (k / 6) * Math.PI * 2; g.lineTo(x + Math.cos(a) * R * 0.9, y + Math.sin(a) * R * 0.9); }
      g.stroke();
    }
  }
  const grd = g.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, 'rgba(255,255,255,.55)'); grd.addColorStop(1, 'rgba(255,255,255,.12)');
  g.fillStyle = grd; g.fillRect(0, 0, W, H);
  const t = tex(c, false);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// Etiqueta con trazo de tinta, tipografía de cómic.
function labelTexture(text, { fg = '#ffffff', bg = null, size = 128, scale = 0.62 } = {}) {
  const [c, g] = canvas(size);
  drawLabel(g, size, text, fg, bg, scale);
  const t = tex(c);
  t.userData = { canvas: c, ctx: g, text };
  return t;
}
function drawLabel(g, size, text, fg, bg, scale = 0.62) {
  g.clearRect(0, 0, size, size);
  if (bg) {
    g.fillStyle = bg; g.strokeStyle = INK; g.lineWidth = size * 0.06;
    g.beginPath(); g.roundRect(size * 0.06, size * 0.14, size * 0.88, size * 0.72, size * 0.18); g.fill(); g.stroke();
  }
  const len = [...text].length;
  const px = Math.min(size * scale, Math.round((size * scale * 1.5) / Math.max(1, len * 0.75)));
  g.font = `${px}px ${DISPLAY}`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineJoin = 'round';
  g.lineWidth = px * 0.18; g.strokeStyle = INK;
  g.strokeText(text, size / 2, size / 2 + size * 0.03);
  g.fillStyle = fg;
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
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 300);
  const RAMP = toonRamp();
  const toon = (opts) => new THREE.MeshToonMaterial({ gradientMap: RAMP, ...opts });

  const theme = {};
  for (const k of ['key', 'sky', 'ground', 'accent', 'floor', 'wall', 'wallTop', 'top', 'mid', 'bottom', 'fog']) theme[k] = new THREE.Color(THEMES.O[k]);
  Object.assign(theme, { keyI: THEMES.O.keyI, hemiI: THEMES.O.hemiI, density: THEMES.O.density });
  const tmpC = new THREE.Color();
  const setTheme = (d, t = 1) => {
    const T = THEMES[d];
    for (const k of ['key', 'sky', 'ground', 'accent', 'floor', 'wall', 'wallTop', 'top', 'mid', 'bottom', 'fog']) theme[k].lerp(tmpC.set(T[k]), t);
    theme.keyI += (T.keyI - theme.keyI) * t;
    theme.hemiI += (T.hemiI - theme.hemiI) * t;
    theme.density += (T.density - theme.density) * t;
  };

  scene.fog = new THREE.FogExp2(theme.fog.clone(), theme.density);
  const hemi = new THREE.HemisphereLight(theme.sky, theme.ground, theme.hemiI);
  const key = new THREE.DirectionalLight(theme.key, theme.keyI);
  key.position.set(-5, 10, 6);
  key.castShadow = true;
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.03;
  scene.add(hemi, key, key.target);

  // Cielo con degradado y rayos de fondo (el clásico fondo de impacto shonen)
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { uTop: { value: theme.top }, uMid: { value: theme.mid }, uBottom: { value: theme.bottom }, uAccent: { value: theme.accent }, uTime: { value: 0 } },
    vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform vec3 uTop, uMid, uBottom, uAccent; uniform float uTime; varying vec3 vDir;
      void main(){
        float h = vDir.y;
        vec3 c = h > 0.0 ? mix(uMid, uTop, smoothstep(0.0, 0.55, h)) : mix(uMid, uBottom, smoothstep(0.0, 0.45, -h));
        float ang = atan(vDir.x, vDir.z);
        float rays = smoothstep(0.42, 0.5, fract(ang * 28.0 / 6.2831853 + uTime * 0.004)) * (1.0 - smoothstep(0.5, 0.58, fract(ang * 28.0 / 6.2831853 + uTime * 0.004)));
        c += uAccent * rays * 0.16 * smoothstep(0.05, 0.8, -h);
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(120, 32, 16), skyMat);
  sky.renderOrder = -1;
  scene.add(sky);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.45, 0.4, 0.97);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // Recursos compartidos
  const FLOOR = floorTexture(), WALL = wallTexture(), CRATE = crateTexture();
  const GLOW = glowSprite(), STAR = starSprite(), SPIRAL = spiralTexture(), HEX = hexTexture();
  for (const t of [FLOOR, WALL, CRATE, GLOW, STAR, SPIRAL, HEX]) t.userData.shared = true;
  const shared = new Set();
  const keep = (x) => { shared.add(x); return x; };

  const floorMat = keep(toon({ map: FLOOR, color: theme.floor }));
  const wallMat = keep(toon({ map: WALL, color: theme.wall }));
  const wallTopMat = keep(toon({ color: theme.wallTop }));
  const crateMat = keep(toon({ map: CRATE }));
  const stoneMat = keep(toon({ color: '#5b4a6e' }));
  const accentMats = [];
  const accentMat = (intensity = 1.5) => {
    const m = toon({ color: theme.accent.clone(), emissive: theme.accent.clone(), emissiveIntensity: intensity });
    accentMats.push(m);
    return m;
  };

  const tileGeo = keep(new RoundedBoxGeometry(0.95, TILE_H, 0.95, 3, 0.09));
  const wallGeo = keep(new RoundedBoxGeometry(0.97, WH, 0.97, 4, 0.2));
  const unitBox = keep(new THREE.BoxGeometry(1, 1, 1));
  const unitEdges = keep(new THREE.EdgesGeometry(unitBox));
  const crateGeo = keep(new RoundedBoxGeometry(0.78, 0.78, 0.78, 4, 0.16));
  const planeGeo = keep(new THREE.PlaneGeometry(1, 1));
  const crystalGeo = keep(new THREE.OctahedronGeometry(0.12, 0));

  // Chispas en el aire
  const DUST = 140;
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(DUST * 3), 3));
  const dustMat = new THREE.PointsMaterial({ size: 0.11, map: STAR, color: theme.accent, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
  const dust = new THREE.Points(dustGeo, dustMat);
  dust.frustumCulled = false;
  scene.add(dust);

  // Onda de impacto al cambiar de dimensión
  const ripple = new THREE.Mesh(new THREE.RingGeometry(0.8, 1, 64), new THREE.MeshBasicMaterial({ color: '#fff', transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  ripple.rotation.x = -Math.PI / 2;
  scene.add(ripple);

  let root = null, L = null, lvl = null;
  let view = { w: 1, h: 1 };
  const target = new THREE.Vector3();
  let lastDim = null, lastSnap = -1, rippleT = 1, bloomBoost = 0;
  let q = quality;
  let camDist = 10, camDir = new THREE.Vector3(0, 1, 1).normalize(), fitW = 1, panX = 0;

  const W2 = (x, y) => [x - (lvl.w - 1) / 2, y - (lvl.h - 1) / 2];
  const disposeTree = (obj) => obj.traverse((o) => {
    if (o.geometry && !shared.has(o.geometry)) o.geometry.dispose();
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    for (const m of mats) {
      if (shared.has(m) || m.userData?.shared) continue;
      for (const k of ['map', 'emissiveMap', 'alphaMap']) if (m[k] && !m[k].userData?.shared) m[k].dispose();
      m.dispose();
    }
  });

  function holo(color, h = WH, glyph = null) {
    const g = new THREE.Group();
    const fill = new THREE.Mesh(unitBox, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.1, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    fill.scale.set(0.9, h, 0.9); fill.position.y = h / 2;
    const edges = new THREE.LineSegments(unitEdges, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.95, toneMapped: false }));
    edges.scale.copy(fill.scale); edges.position.copy(fill.position);
    g.add(fill, edges);
    const mats = [fill.material, edges.material];
    if (glyph) {
      const d = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ map: labelTexture(glyph, { fg: color }), transparent: true, depthWrite: false, toneMapped: false }));
      d.rotation.x = -Math.PI / 2; d.position.y = h + 0.03; d.scale.setScalar(0.62);
      g.add(d);
      mats.push(d.material);
    }
    g.userData.mats = mats;
    g.userData.base = mats.map((m) => m.opacity);
    return g;
  }
  const setHolo = (g, a) => {
    g.visible = a > 0.02;
    g.userData.mats.forEach((m, i) => { m.opacity = g.userData.base[i] * a; });
  };

  function sign(text, color) {
    const m = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ map: labelTexture(text, { fg: color, bg: '#fff7e6', scale: 0.48 }), transparent: true, toneMapped: false, depthTest: false }));
    m.renderOrder = 5;
    m.scale.set(0.7, 0.7, 1);
    return m;
  }

  // ------------------------------------------------------------------
  // Protagonista de anime: cabeza grande, pelo de punta, ojos grandes y bufanda
  // ------------------------------------------------------------------
  function figure(kind) {
    const echo = kind === 'echo';
    const g = new THREE.Group();
    const body = new THREE.Group();
    const ghost = echo ? toon({ color: '#9fe6ff', emissive: '#2a8cff', emissiveIntensity: 0.9, transparent: true, opacity: 0.55, depthWrite: false }) : null;
    const M = (color) => ghost || toon({ color });
    const skin = M('#ffd8b5'), jacket = M('#ff6a2a'), jacketDark = M('#d8481c'), pants = M('#2c3258'), boots = M('#1d1b2a'), hair = M('#24264a'), scarfM = M('#e8233d'), white = M('#ffffff');
    const inkW = 0.014;
    const inkCol = echo ? '#7fe0ff' : INK;
    const add = (geo, mat, x, y, z, parent = body, inkWidth = inkW) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      if (!echo) m.castShadow = true;
      if (inkWidth) ink(m, inkWidth, inkCol, echo ? 0.6 : 1);
      parent.add(m);
      return m;
    };

    // Piernas y botas (con cadera como pivote para caminar)
    const legs = [-0.075, 0.075].map((x) => {
      const hip = new THREE.Group();
      hip.position.set(x, 0.3, 0);
      add(new THREE.CapsuleGeometry(0.055, 0.14, 4, 10), pants, 0, -0.12, 0, hip);
      add(new RoundedBoxGeometry(0.11, 0.08, 0.16, 2, 0.035), boots, 0, -0.26, 0.02, hip);
      body.add(hip);
      return hip;
    });
    // Torso con chaqueta y cremallera
    add(new THREE.CapsuleGeometry(0.13, 0.12, 6, 16), jacket, 0, 0.42, 0);
    add(new THREE.BoxGeometry(0.02, 0.18, 0.02), jacketDark, 0, 0.43, 0.13, body, 0);
    add(new THREE.TorusGeometry(0.13, 0.025, 8, 20), jacketDark, 0, 0.32, 0, body, 0).rotation.x = Math.PI / 2;
    // Brazos con guantes
    const arms = [-1, 1].map((side) => {
      const sh = new THREE.Group();
      sh.position.set(side * 0.17, 0.5, 0);
      add(new THREE.CapsuleGeometry(0.045, 0.13, 4, 10), jacket, 0, -0.1, 0, sh).rotation.z = side * 0.18;
      add(new THREE.SphereGeometry(0.05, 12, 10), white, side * 0.025, -0.22, 0, sh);
      body.add(sh);
      return sh;
    });
    // Cabeza
    const headG = new THREE.Group();
    headG.position.y = 0.76;
    body.add(headG);
    const head = add(new THREE.SphereGeometry(0.19, 24, 18), skin, 0, 0, 0, headG, 0.016);
    head.scale.set(1, 0.96, 0.95);
    // Ojos grandes
    const eyes = [-0.075, 0.075].map((x) => {
      const eg = new THREE.Group();
      eg.position.set(x, -0.015, 0.165);
      const w = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 10), echo ? ghost : white);
      w.scale.set(0.85, 1.25, 0.35);
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), echo ? ghost : toon({ color: '#3a2a8a' }));
      p.scale.set(0.8, 1.15, 0.4); p.position.set(0, -0.005, 0.012);
      const hl = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false, transparent: echo, opacity: echo ? 0.6 : 1 }));
      hl.position.set(-0.012, 0.022, 0.022);
      eg.add(w, p, hl);
      headG.add(eg);
      return eg;
    });
    // Ceja decidida
    for (const s of [-1, 1]) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.014, 0.01), echo ? ghost : toon({ color: '#1a1a33' }));
      b.position.set(s * 0.075, 0.06, 0.178); b.rotation.z = s * -0.25;
      headG.add(b);
    }
    // Pelo: casquete y mechones en punta
    const cap = add(new THREE.SphereGeometry(0.205, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hair, 0, 0.02, -0.01, headG, 0.016);
    cap.scale.set(1.04, 1.05, 1.05);
    const spikes = [
      [0, 0.2, -0.02, -0.5, 0, 0.32], [0.11, 0.17, 0, -0.25, -0.55, 0.28], [-0.11, 0.17, 0, -0.25, 0.55, 0.28],
      [0.07, 0.12, -0.14, -1.1, -0.3, 0.3], [-0.07, 0.12, -0.14, -1.1, 0.3, 0.3], [0, 0.07, -0.18, -1.5, 0, 0.3],
      [0.17, 0.06, -0.04, -0.2, -1.1, 0.24], [-0.17, 0.06, -0.04, -0.2, 1.1, 0.24],
      [0.05, 0.12, 0.15, 0.6, -0.2, 0.18], [-0.06, 0.13, 0.15, 0.7, 0.3, 0.16],
    ];
    const accentHair = echo ? ghost : accentMat(0.6);
    spikes.forEach(([x, y, z, rx, rz, len], i) => {
      const s = add(new THREE.ConeGeometry(0.07, len, 6), i === 0 ? accentHair : hair, x, y + len * 0.3, z, headG, 0.012);
      s.rotation.set(rx, 0, rz);
    });
    // Bufanda: cuello y dos colas que ondean
    add(new THREE.TorusGeometry(0.11, 0.045, 10, 20), scarfM, 0, 0.6, 0).rotation.x = Math.PI / 2;
    const tails = [-0.04, 0.05].map((x, i) => {
      const segs = [];
      let parent = body;
      for (let k = 0; k < 4; k++) {
        const pivot = new THREE.Group();
        pivot.position.set(k === 0 ? x : 0, k === 0 ? 0.58 : -0.0, k === 0 ? -0.1 : -0.1);
        const seg = new THREE.Mesh(new RoundedBoxGeometry(0.075 - k * 0.008, 0.035, 0.11, 2, 0.015), scarfM);
        seg.position.z = -0.05;
        if (!echo) seg.castShadow = true;
        ink(seg, 0.01, inkCol, echo ? 0.6 : 1);
        pivot.add(seg);
        parent.add(pivot);
        parent = pivot;
        segs.push(pivot);
      }
      return { segs, phase: i * 1.3 };
    });

    g.add(body);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.025, 8, 48), new THREE.MeshBasicMaterial({ color: '#ff3b4e', toneMapped: false, transparent: true }));
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.04; ring.visible = false;
    g.add(ring);
    const blob = new THREE.Mesh(new THREE.CircleGeometry(0.26, 24), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: echo ? 0.12 : 0.3, depthWrite: false }));
    blob.rotation.x = -Math.PI / 2; blob.position.y = 0.012;
    g.add(blob);
    body.scale.setScalar(1.35);
    return { g, body, legs, arms, headG, eyes, tails, ring, skin, ghost, pos: new THREE.Vector3(), angle: 0, walk: 0, moving: 0, blink: 2 + Math.random() * 2 };
  }

  // ------------------------------------------------------------------
  // Construcción de la sala
  // ------------------------------------------------------------------
  function setLevel(level, state) {
    if (root) { scene.remove(root); disposeTree(root); }
    accentMats.length = 0;
    lvl = level;
    root = new THREE.Group();
    scene.add(root);
    L = { dwalls: [], shifts: [], doors: [], plates: [], bridges: [], levers: [], consoles: [], terms: [], blocks: [], rocks: [], exit: null };

    const cellAtXY = (x, y) => (x < 0 || y < 0 || x >= lvl.w || y >= lvl.h ? null : lvl.cells[y * lvl.w + x]);
    const isWall = (x, y) => { const c = cellAtXY(x, y); return !c || c.t === 'wall'; };
    const interior = (c) => {
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const n = cellAtXY(c.x + dx, c.y + dy);
        if (n && n.t !== 'wall') return false;
      }
      return true;
    };
    const r = rng(lvl.id * 7919);

    // Losas
    const floors = lvl.cells.filter((c) => !['wall', 'void', 'bridge'].includes(c.t));
    const m4 = new THREE.Matrix4(), qt = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3();
    const fl = new THREE.InstancedMesh(tileGeo, floorMat, floors.length);
    floors.forEach((c, i) => {
      const [x, z] = W2(c.x, c.y);
      qt.setFromAxisAngle(new THREE.Vector3(0, 1, 0), ((c.x * 7 + c.y * 3) % 4) * Math.PI / 2);
      m4.compose(ps.set(x, -TILE_H / 2 + (r() - 0.5) * 0.02, z), qt, sc.set(1, 1, 1));
      fl.setMatrixAt(i, m4);
      const v = 0.92 + r() * 0.08;
      fl.setColorAt(i, new THREE.Color(v, v, v));
    });
    fl.receiveShadow = true;
    root.add(fl, inkInstanced(fl, 0.012));

    // Paredes: bloques redondeados con alturas ligeramente distintas
    const walls = lvl.cells.filter((c) => c.t === 'wall' && !interior(c));
    const wallMats = [wallMat, wallMat, wallTopMat, wallTopMat, wallMat, wallMat];
    const wl = new THREE.InstancedMesh(wallGeo, wallMats, walls.length);
    const crystals = [];
    walls.forEach((c, i) => {
      const [x, z] = W2(c.x, c.y);
      const hs = 0.88 + r() * 0.2;
      qt.setFromAxisAngle(new THREE.Vector3(0, 1, 0), (r() - 0.5) * 0.08);
      m4.compose(ps.set(x, (WH * hs) / 2, z), qt, sc.set(1, hs, 1));
      wl.setMatrixAt(i, m4);
      if (r() < 0.22) crystals.push([x, WH * hs, z]);
    });
    wl.castShadow = true; wl.receiveShadow = true;
    root.add(wl, inkInstanced(wl, 0.018));

    // Cristales sobre algunas paredes
    if (crystals.length) {
      const cm = new THREE.InstancedMesh(crystalGeo, accentMat(0.45), crystals.length * 2);
      let n = 0;
      for (const [x, y, z] of crystals) {
        for (let k = 0; k < 2; k++) {
          qt.setFromEuler(new THREE.Euler((r() - 0.5) * 0.8, r() * 3, (r() - 0.5) * 0.8));
          m4.compose(ps.set(x + (r() - 0.5) * 0.4, y + 0.08, z + (r() - 0.5) * 0.4), qt, sc.set(0.8, 1.6 + r() * 1.2, 0.8));
          cm.setMatrixAt(n++, m4);
        }
      }
      root.add(cm, inkInstanced(cm, 0.012));
    }

    // Islas flotantes al fondo
    for (let i = 0; i < 9; i++) {
      const rad = 0.5 + r() * 1.3;
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(rad, 0), stoneMat);
      const a = r() * Math.PI * 2, d = Math.max(lvl.w, lvl.h) * 0.55 + 2 + r() * 4;
      rock.position.set(Math.cos(a) * d, -3 - r() * 5, Math.sin(a) * d * 0.8);
      rock.scale.y = 0.6;
      rock.rotation.set(r() * 3, r() * 3, r() * 3);
      ink(rock, 0.03);
      root.add(rock);
      L.rocks.push({ rock, base: rock.position.y, ph: r() * 6 });
    }

    // Abismo: estrellas bajo el suelo
    const voids = lvl.cells.filter((c) => c.t === 'void' || c.t === 'bridge');
    if (voids.length) {
      const N = voids.length * 25;
      const pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const c = voids[i % voids.length];
        const [x, z] = W2(c.x, c.y);
        pos[i * 3] = x + (r() - 0.5); pos[i * 3 + 1] = -0.8 - r() * 6; pos[i * 3 + 2] = z + (r() - 0.5);
      }
      const sg = new THREE.BufferGeometry();
      sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      L.stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 0.14, map: STAR, color: theme.accent.clone(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
      root.add(L.stars);
    }

    for (const c of lvl.cells) {
      const [x, z] = W2(c.x, c.y);
      if (c.t === 'dwall') {
        const col = DIMCOL[c.dims[0]];
        const crack = c.dims.length > 1;
        const solid = new THREE.Mesh(wallGeo, toon({ color: crack ? '#6b5a7a' : col, map: WALL, emissive: crack ? '#000' : col, emissiveIntensity: crack ? 0 : 0.25 }));
        solid.position.set(x, WH / 2, z);
        solid.castShadow = solid.receiveShadow = true;
        ink(solid, 0.02);
        const glyph = crack ? '◆' : c.dims.map((d) => DIM_INFO[d].glyph).join('');
        const decal = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ map: labelTexture(glyph, { fg: crack ? DIMCOL.F : '#ffffff' }), transparent: true, depthWrite: false, toneMapped: false }));
        decal.rotation.x = -Math.PI / 2; decal.position.y = WH / 2 + 0.01; decal.scale.setScalar(0.6);
        solid.add(decal);
        if (crack) {
          // Grieta luminosa en zigzag
          const pts = [[0.05, 0.42], [-0.08, 0.2], [0.07, 0.02], [-0.06, -0.18], [0.04, -0.42]].map(([px, py]) => new THREE.Vector3(px, py, 0.49));
          const crk = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, 0.025, 6), new THREE.MeshBasicMaterial({ color: DIMCOL.F, toneMapped: false }));
          solid.add(crk);
        }
        const h = holo(col, WH, c.dims.map((d) => DIM_INFO[d].glyph).join(''));
        h.position.set(x, 0, z);
        root.add(solid, h);
        L.dwalls.push({ c, solid, holo: h, t: 1 });
      } else if (c.t === 'shift') {
        // Pilar de cristal que emerge del suelo
        const wall = new THREE.Group();
        const mat = toon({ color: '#c06ef0', emissive: DIMCOL.F, emissiveIntensity: 0.3 });
        const main = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.42, WH, 6), mat);
        main.position.y = 0; main.castShadow = true; ink(main, 0.02);
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.3, 6), mat);
        tip.position.y = WH / 2 + 0.15; ink(tip, 0.02);
        const lab = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ map: labelTexture(c.phase === 0 ? 'A' : 'B', { fg: '#ffffff' }), transparent: true, depthWrite: false, toneMapped: false }));
        lab.position.set(0, 0, 0.4); lab.scale.setScalar(0.4);
        wall.add(main, tip, lab);
        wall.position.set(x, WH / 2, z);
        const h = holo(DIMCOL.F, WH, c.phase === 0 ? 'A' : 'B');
        h.position.set(x, 0, z);
        root.add(wall, h);
        L.shifts.push({ c, wall, holo: h, t: 1 });
      } else if (c.t === 'door') {
        // Escudo de energía entre dos pilares
        const horizontal = !isWall(c.x - 1, c.y) && !isWall(c.x + 1, c.y);
        const g = new THREE.Group();
        g.position.set(x, 0, z);
        if (horizontal) g.rotation.y = Math.PI / 2;
        for (const sx of [-0.42, 0.42]) {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, WH, 12), toon({ color: '#3b3552' }));
          post.position.set(sx, WH / 2, 0); post.castShadow = true; ink(post, 0.018);
          const orb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), accentMat(2));
          orb.position.set(sx, WH + 0.08, 0); ink(orb, 0.014);
          g.add(post, orb);
        }
        const hexMap = HEX.clone();
        hexMap.needsUpdate = true;
        const shieldMat = new THREE.MeshBasicMaterial({ map: hexMap, color: theme.accent.clone(), transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
        const shield = new THREE.Mesh(new THREE.PlaneGeometry(0.74, WH * 0.95), shieldMat);
        shield.position.y = (WH * 0.95) / 2;
        g.add(shield);
        const sg = sign(c.req.includes('code') ? '∴' : c.req.join('·'), '#ff8a00');
        sg.position.set(x, WH + 0.55, z);
        root.add(g, sg);
        L.doors.push({ c, g, shield, shieldMat, hexMap, sign: sg, t: 0 });
      } else if (c.t === 'plate') {
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.43, 0.06, 32), toon({ color: '#3b3552' }));
        base.position.set(x, 0.03, z); base.receiveShadow = true; ink(base, 0.012);
        const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.33, 0.06, 32), accentMat(0.3));
        pad.position.set(x, 0.07, z); ink(pad, 0.012);
        const circle = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ map: magicCircle(c.id), color: theme.accent.clone(), transparent: true, depthWrite: false, toneMapped: false }));
        circle.rotation.x = -Math.PI / 2; circle.position.set(x, 0.105, z); circle.scale.setScalar(0.9);
        root.add(base, pad, circle);
        let extra = null;
        if (c.dims || c.hold) {
          extra = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ map: labelTexture('', { size: 128 }), transparent: true, depthWrite: false, toneMapped: false, depthTest: false }));
          extra.renderOrder = 4;
          extra.position.set(x, 0.75, z); extra.scale.set(0.6, 0.6, 1);
          root.add(extra);
        }
        L.plates.push({ c, pad, circle, extra, t: 0, last: null, spin: 0 });
      } else if (c.t === 'bridge') {
        const col = DIMCOL[c.dims[0]];
        const mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.55, depthWrite: false, toneMapped: false });
        const plank = new THREE.Mesh(new RoundedBoxGeometry(1.0, 0.08, 0.7, 2, 0.03), mat);
        plank.position.set(x, -0.04, z);
        const edgeMat = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false, transparent: true });
        for (const sz of [-0.36, 0.36]) {
          const rl = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.0, 8), edgeMat);
          rl.rotation.z = Math.PI / 2; rl.position.set(0, 0.05, sz);
          plank.add(rl);
        }
        const h = holo(col, 0.05, DIM_INFO[c.dims[0]].glyph);
        h.position.set(x, -0.05, z);
        root.add(plank, h);
        const first = c.req && c.x === Math.min(...lvl.bridges.filter((b) => b.y === c.y).map((b) => b.x));
        if (first) { const sg = sign(c.req.join('·'), col); sg.position.set(x - 0.55, 0.6, z); root.add(sg); }
        L.bridges.push({ c, plank, mat, edgeMat, holo: h, t: 0 });
      } else if (c.t === 'lever') {
        const g = new THREE.Group();
        g.position.set(x, 0, z);
        const base = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.22, 0.36, 3, 0.08), toon({ color: '#3b3552' }));
        base.position.y = 0.11; base.castShadow = true; ink(base, 0.016);
        const pivot = new THREE.Group();
        pivot.position.y = 0.2;
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.42, 10), toon({ color: '#d9d4e8' }));
        arm.position.y = 0.21; ink(arm, 0.012);
        const knob = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), toon({ color: DIMCOL.F, emissive: DIMCOL.F, emissiveIntensity: 1.2 }));
        knob.position.y = 0.43; ink(knob, 0.014);
        pivot.add(arm, knob);
        g.add(base, pivot);
        const h = holo(DIMCOL.F, 0.5, '◆');
        h.position.set(x, 0, z); h.scale.set(0.6, 1, 0.6);
        root.add(g, h);
        L.levers.push({ c, g, pivot, knob, holo: h, t: 0, ang: -0.6 });
      } else if (c.t === 'console') {
        // Obelisco de cristal con su número flotando encima
        const g = new THREE.Group();
        g.position.set(x, 0, z);
        const ob = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), toon({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.3 }));
        ob.scale.set(1, 1.9, 1); ob.position.y = 0.45; ob.castShadow = true; ink(ob, 0.016);
        const num = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ map: labelTexture(String(c.n), { fg: '#ffffff' }), transparent: true, depthWrite: false, toneMapped: false }));
        num.position.y = 1.05; num.scale.setScalar(0.55);
        g.add(ob, num);
        root.add(g);
        L.consoles.push({ c, ob, num });
      } else if (c.t === 'term') {
        // Pantalla holográfica flotante
        const g = new THREE.Group();
        g.position.set(x, 0, z);
        const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.25, 10), toon({ color: '#3b3552' }));
        ped.position.y = 0.125; ink(ped, 0.014);
        const screenMat = new THREE.MeshBasicMaterial({ color: theme.accent.clone(), transparent: true, opacity: 0.85, side: THREE.DoubleSide, toneMapped: false });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.28), screenMat);
        screen.position.y = 0.55; screen.rotation.x = -0.35;
        const bang = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ map: labelTexture('!', { fg: '#ffffff' }), transparent: true, depthWrite: false, toneMapped: false }));
        bang.position.set(0, 0.55, 0.01); bang.rotation.x = -0.35; bang.scale.setScalar(0.3);
        g.add(ped, screen, bang);
        root.add(g);
        L.terms.push({ c, g, screen, screenMat, bang });
      } else if (c.t === 'exit') {
        // Portal: anillo vertical con espiral, círculo mágico en el suelo y columna de luz
        const g = new THREE.Group();
        g.position.set(x, 0, z);
        const circle = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ map: magicCircle(''), color: theme.accent.clone(), transparent: true, depthWrite: false, toneMapped: false }));
        circle.rotation.x = -Math.PI / 2; circle.position.y = 0.02; circle.scale.setScalar(1.05);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.06, 14, 48), accentMat(0.9));
        ring.position.y = 0.52; ink(ring, 0.018);
        const swirl = new THREE.Mesh(new THREE.CircleGeometry(0.33, 48), new THREE.MeshBasicMaterial({ map: SPIRAL, color: theme.accent.clone(), transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false }));
        swirl.position.y = 0.52;
        const N = 30, pos = new Float32Array(N * 3), pr = rng(10);
        for (let i = 0; i < N; i++) { const a = pr() * 6.28, rr = 0.15 + pr() * 0.3; pos[i * 3] = Math.cos(a) * rr; pos[i * 3 + 1] = pr() * 1.4; pos[i * 3 + 2] = Math.sin(a) * rr; }
        const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const parts = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.12, map: STAR, color: theme.accent.clone(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
        const light = new THREE.PointLight(theme.accent.clone(), 2, 3.5, 1.6);
        light.position.y = 0.6;
        g.add(circle, ring, swirl, parts, light);
        root.add(g);
        L.exit = { g, circle, ring, swirl, parts, light };
      }
    }

    state.blocks.forEach(() => {
      const b = new THREE.Mesh(crateGeo, crateMat);
      b.castShadow = b.receiveShadow = true;
      ink(b, 0.022);
      root.add(b);
      L.blocks.push({ mesh: b, pos: new THREE.Vector3() });
    });

    L.player = figure('player');
    L.echo = figure('echo');
    root.add(L.player.g, L.echo.g);

    // Chispas dentro del volumen de la sala
    const p = dustGeo.attributes.position.array;
    for (let i = 0; i < DUST; i++) {
      p[i * 3] = (r() - 0.5) * lvl.w;
      p[i * 3 + 1] = r() * 2.4;
      p[i * 3 + 2] = (r() - 0.5) * lvl.h;
    }
    dustGeo.attributes.position.needsUpdate = true;

    const ext = Math.max(lvl.w, lvl.h) / 2 + 1;
    Object.assign(key.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 0.5, far: 40 });
    key.shadow.camera.updateProjectionMatrix();
    lastDim = null;
    lastSnap = -1;
    applyQuality();
    fitCamera();
  }

  function fitCamera() {
    if (!lvl) return;
    camera.aspect = view.w / view.h;
    camera.updateProjectionMatrix();
    // En vertical, si la sala es muy ancha se encuadran 9 columnas y la cámara sigue al jugador.
    const portrait = view.w / view.h < 0.8;
    fitW = portrait ? Math.min(lvl.w, 9) : lvl.w;
    const pitch = portrait ? 1.1 : 0.98;
    const dir = new THREE.Vector3(0, Math.sin(pitch), Math.cos(pitch));
    const hw = fitW / 2, hh = lvl.h / 2;
    const corners = [];
    for (const sx of [-hw, hw]) for (const sz of [-hh, hh]) for (const y of [0, WH]) corners.push(new THREE.Vector3(sx, y, sz));
    const fits = (d) => {
      camera.position.copy(target).addScaledVector(dir, d);
      camera.lookAt(target);
      camera.updateMatrixWorld();
      return corners.every((c) => { const v = c.clone().project(camera); return Math.abs(v.x) < 0.95 && v.y < 0.84 && v.y > -0.92; });
    };
    let lo = 2, hi = 120;
    for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (fits(mid)) hi = mid; else lo = mid; }
    camDist = hi;
    camDir = dir;
  }

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
    const dist = Math.hypot(x - F.pos.x, z - F.pos.z);
    F.pos.x = lerp(F.pos.x, x, k); F.pos.z = lerp(F.pos.z, z, k);
    F.moving = lerp(F.moving, dist > 0.02 ? 1 : 0, Math.min(1, dt * 12));
    F.walk += dt * 15 * F.moving;
    const want = FACING[facing] ?? 0;
    let da = want - F.angle;
    da = Math.atan2(Math.sin(da), Math.cos(da));
    F.angle += da * Math.min(1, dt * 16);
    F.g.position.set(F.pos.x, 0, F.pos.z);
    F.body.rotation.y = F.angle;
    const swing = Math.sin(F.walk) * 0.7 * F.moving;
    F.legs[0].rotation.x = swing; F.legs[1].rotation.x = -swing;
    F.arms[0].rotation.x = -swing; F.arms[1].rotation.x = swing;
    F.body.position.y = Math.abs(Math.sin(F.walk)) * 0.05 * F.moving + Math.sin(now / 600) * 0.008;
    F.body.rotation.x = F.moving * 0.12; // se inclina al correr
    // Bufanda al viento
    for (const tail of F.tails) {
      tail.segs.forEach((seg, i) => {
        seg.rotation.x = -0.5 - F.moving * 0.6 + Math.sin(now / 160 + i * 0.9 + tail.phase) * (0.12 + F.moving * 0.2);
        seg.rotation.y = Math.sin(now / 230 + i + tail.phase) * 0.15;
      });
    }
    // Parpadeo
    F.blink -= dt;
    const closed = F.blink < 0.12;
    if (F.blink < 0) F.blink = 2 + Math.random() * 3;
    for (const e of F.eyes) e.scale.y = closed ? 0.12 : 1;
  }

  // Posición en pantalla de una casilla (para los efectos de manga de game.js).
  const projV = new THREE.Vector3();
  function project(gx, gy, h = 0.6) {
    if (!lvl) return null;
    const [x, z] = W2(gx, gy);
    projV.set(x, h, z).project(camera);
    return { x: (projV.x * 0.5 + 0.5) * view.w, y: (-projV.y * 0.5 + 0.5) * view.h };
  }

  function frame(s, dt, now, fx) {
    if (!lvl || !L) return;
    const reduce = fx.reduceMotion;
    const k = reduce ? 1 : Math.min(1, dt * 16);

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
    hemi.color.copy(theme.sky); hemi.groundColor.copy(theme.ground); hemi.intensity = theme.hemiI;
    key.color.copy(theme.key); key.intensity = theme.keyI;
    skyMat.uniforms.uTime.value = now / 16;
    for (const m of accentMats) { m.emissive.copy(theme.accent); m.color.copy(theme.accent); }
    floorMat.color.copy(theme.floor);
    wallMat.color.copy(theme.wall);
    wallTopMat.color.copy(theme.wallTop);
    stoneMat.color.copy(theme.wall).multiplyScalar(0.55);
    dustMat.color.copy(theme.accent);
    if (L.stars) L.stars.material.color.copy(theme.accent);
    if (L.exit) for (const m of [L.exit.circle.material, L.exit.swirl.material, L.exit.parts.material]) m.color.copy(theme.accent);
    if (L.exit) L.exit.light.color.copy(theme.accent);

    const snap = fx.snapToken !== lastSnap;
    lastSnap = fx.snapToken;

    // Jugador
    let bumpX = 0, bumpZ = 0;
    if (fx.bump) {
      fx.bump.t += dt * 7;
      const d = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] }[fx.bump.dir];
      const a = Math.sin(Math.min(1, fx.bump.t) * Math.PI) * 0.14;
      bumpX = d[0] * a; bumpZ = d[1] * a;
      if (fx.bump.t >= 1) fx.bump = null;
    }
    animFigure(L.player, s.px, s.py, s.facing, dt, now, k, snap);
    L.player.g.position.x += bumpX; L.player.g.position.z += bumpZ;
    L.player.ring.visible = !!s.recording;
    if (s.recording) {
      L.player.ring.material.opacity = 0.55 + 0.45 * Math.sin(now / 160);
      L.player.ring.scale.setScalar(1 + 0.08 * Math.sin(now / 160));
    }
    L.player.skin.emissive.setRGB(fx.flash > 0.4 ? fx.flash * 0.7 : 0, 0, 0);

    // Eco
    L.echo.g.visible = !!s.echo;
    if (s.echo) {
      const last = s.echo.idx > 0 ? s.echo.queue[s.echo.idx - 1] : 'D';
      if (last !== 'W') L.echo.lastFacing = last;
      animFigure(L.echo, s.echo.x, s.echo.y, L.echo.lastFacing || 'D', dt, now, k, snap || !L.echo.seen);
      L.echo.seen = true;
      L.echo.ghost.opacity = (s.dim === 'E' ? 0.6 : 0.32) * (0.85 + 0.15 * Math.sin(now / 90));
    } else L.echo.seen = false;

    s.blocks.forEach((b, i) => {
      const B = L.blocks[i];
      if (!B) return;
      const [x, z] = W2(b.x, b.y);
      if (snap) B.pos.set(x, 0, z);
      B.pos.x = lerp(B.pos.x, x, k); B.pos.z = lerp(B.pos.z, z, k);
      B.mesh.position.set(B.pos.x, 0.39, B.pos.z);
    });

    const ease = (rate) => (reduce ? 1 : Math.min(1, dt * rate));
    for (const D of L.dwalls) {
      D.t = lerp(D.t, D.c.dims.includes(s.dim) ? 1 : 0, ease(9));
      D.solid.visible = D.t > 0.02;
      D.solid.scale.set(1, Math.max(0.02, D.t), 1);
      D.solid.position.y = (WH * D.solid.scale.y) / 2;
      setHolo(D.holo, (1 - D.t) * (0.8 + 0.2 * Math.sin(now / 400 + D.c.x)));
    }
    for (const S of L.shifts) {
      S.t = lerp(S.t, s.frac === S.c.phase ? 1 : 0, ease(6));
      S.wall.position.y = WH / 2 - (1 - S.t) * (WH + 0.35);
      S.wall.visible = S.t > 0.02;
      S.wall.rotation.y = (1 - S.t) * 1.2;
      setHolo(S.holo, (1 - S.t) * 0.75);
    }
    for (const Dr of L.doors) {
      const open = !!s.open[`${Dr.c.x},${Dr.c.y}`];
      Dr.t = lerp(Dr.t, open ? 1 : 0, ease(8));
      Dr.shield.visible = Dr.t < 0.98;
      Dr.shield.scale.y = Math.max(0.02, 1 - Dr.t);
      Dr.shield.position.y = (WH * 0.95 * Dr.shield.scale.y) / 2;
      Dr.shieldMat.opacity = (0.75 + 0.2 * Math.sin(now / 200)) * (1 - Dr.t);
      Dr.shieldMat.color.copy(theme.accent);
      Dr.hexMap.offset.y = now / 4000;
      Dr.sign.material.opacity = 1 - Dr.t * 0.7;
      Dr.sign.quaternion.copy(camera.quaternion);
    }
    for (const P of L.plates) {
      const on = !!s.active[P.c.id];
      const pressed = occupiedAt(s, P.c.x, P.c.y);
      P.t = lerp(P.t, pressed ? 1 : 0, Math.min(1, dt * 14));
      P.pad.position.y = 0.07 - P.t * 0.03;
      const pm = P.pad.material;
      pm.emissiveIntensity = lerp(pm.emissiveIntensity, on ? 1.8 : 0.25, Math.min(1, dt * 10));
      P.spin += dt * (on ? 1.6 : 0.15);
      P.circle.rotation.z = P.spin;
      P.circle.position.y = P.pad.position.y + 0.035;
      P.circle.material.color.copy(theme.accent).multiplyScalar(on ? 1.25 : 0.65);
      if (P.extra) {
        P.extra.quaternion.copy(camera.quaternion);
        const tl = s.timers[`${P.c.x},${P.c.y}`] || 0;
        const glyphs = P.c.dims ? P.c.dims.map((d) => DIM_INFO[d].glyph).join('') : '';
        const counting = on && tl > 0 && !pressed;
        const timer = P.c.hold ? ` ⧗${counting ? tl : P.c.hold}` : '';
        const text = `${glyphs}${timer}`.trim();
        if (text !== P.last) {
          const t = P.extra.material.map;
          drawLabel(t.userData.ctx, 128, text, counting ? '#ff3b4e' : '#ff8a00', '#fff7e6', 0.42);
          t.needsUpdate = true;
          P.last = text;
        }
      }
    }
    for (const Br of L.bridges) {
      const on = Br.c.dims.includes(s.dim) && !!s.bridgeOn[`${Br.c.x},${Br.c.y}`];
      Br.t = lerp(Br.t, on ? 1 : 0, ease(10));
      Br.plank.visible = Br.t > 0.02;
      Br.mat.opacity = (0.45 + 0.1 * Math.sin(now / 150 + Br.c.x)) * Br.t;
      Br.edgeMat.opacity = Br.t;
      Br.plank.scale.set(1, 1, Math.max(0.05, Br.t));
      setHolo(Br.holo, (1 - Br.t) * 0.9);
    }
    for (const Lv of L.levers) {
      Lv.t = lerp(Lv.t, s.dim === 'F' ? 1 : 0, ease(9));
      Lv.g.visible = Lv.t > 0.05;
      Lv.g.scale.setScalar(Math.max(0.05, Lv.t));
      setHolo(Lv.holo, 1 - Lv.t);
      Lv.ang = lerp(Lv.ang, s.frac === 0 ? -0.6 : 0.6, Math.min(1, dt * 10));
      Lv.pivot.rotation.x = Lv.ang;
      Lv.knob.material.emissiveIntensity = Lv.c.once && s.leverUsed ? 0.05 : 1.2;
    }
    const lit = (lvl.code || []).slice(0, s.code);
    for (const C of L.consoles) {
      const on = s.flags.code || lit.includes(C.c.n);
      C.ob.material.emissive.copy(on ? theme.accent : tmpC.set('#ffffff'));
      C.ob.material.emissiveIntensity = on ? 1.6 : 0.25;
      C.ob.rotation.y += dt * (on ? 2 : 0.4);
      C.num.quaternion.copy(camera.quaternion);
      C.num.position.y = 1.05 + Math.sin(now / 500 + C.c.n) * 0.05;
    }
    for (const Tm of L.terms) {
      const read = s.docs.includes(Tm.c.doc) || isRead(Tm.c.doc);
      Tm.screenMat.color.copy(read ? tmpC.set('#555066') : theme.accent);
      Tm.bang.visible = !read;
      Tm.screen.position.y = 0.55 + Math.sin(now / 450 + Tm.c.x) * 0.04;
      Tm.bang.position.y = Tm.screen.position.y;
      Tm.screenMat.opacity = read ? 0.5 : (Tm.c.secret ? 0.5 : 0.75) + 0.25 * Math.sin(now / 300);
    }
    if (L.exit) {
      L.exit.swirl.rotation.z -= dt * 2.4;
      L.exit.circle.rotation.z += dt * 0.5;
      L.exit.ring.position.y = 0.52 + Math.sin(now / 500) * 0.05;
      L.exit.swirl.position.y = L.exit.ring.position.y;
      L.exit.ring.quaternion.copy(camera.quaternion);
      L.exit.swirl.quaternion.copy(camera.quaternion);
      L.exit.light.intensity = 1.2 + Math.sin(now / 300) * 0.3;
      const pa = L.exit.parts.geometry.attributes.position;
      for (let i = 0; i < pa.count; i++) { let y = pa.getY(i) + dt * 0.6; if (y > 1.4) y = 0; pa.setY(i, y); }
      pa.needsUpdate = true;
    }
    for (const R of L.rocks) {
      R.rock.position.y = R.base + Math.sin(now / 1500 + R.ph) * 0.25;
      R.rock.rotation.y += dt * 0.05;
    }

    if (dust.visible && !reduce) {
      const p = dustGeo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        let y = p.getY(i) + dt * 0.08;
        if (y > 2.4) y = 0;
        p.setY(i, y);
        p.setX(i, p.getX(i) + Math.sin(now / 1800 + i) * dt * 0.03);
      }
      p.needsUpdate = true;
    }

    if (rippleT < 1) {
      rippleT = Math.min(1, rippleT + dt * 2.4);
      ripple.position.set(L.player.g.position.x, 0.06, L.player.g.position.z);
      ripple.scale.setScalar(0.3 + rippleT * Math.max(lvl.w, lvl.h) * 0.45);
      ripple.material.opacity = (1 - rippleT) * (1 - rippleT) * 0.8;
    } else ripple.material.opacity = 0;
    bloomBoost = Math.max(0, bloomBoost - dt * 2.5);
    bloom.strength = 0.4 + bloomBoost * 0.8 + (fx.flash || 0) * 0.4;

    // Cámara
    const slack = (lvl.w - fitW) / 2;
    const wantPan = slack > 0 ? Math.max(-slack, Math.min(slack, L.player.g.position.x)) : 0;
    panX = snap ? wantPan : lerp(panX, wantPan, Math.min(1, dt * 4));
    const look = target.clone().add(new THREE.Vector3(panX + (slack > 0 ? 0 : L.player.g.position.x * 0.08), 0, L.player.g.position.z * 0.05));
    camera.position.copy(look).addScaledVector(camDir, camDist);
    if (!reduce) {
      camera.position.x += Math.sin(now / 4000) * 0.05;
      if (fx.shake > 0) {
        camera.position.x += (Math.random() - 0.5) * 0.2 * fx.shake;
        camera.position.y += (Math.random() - 0.5) * 0.2 * fx.shake;
      }
    }
    camera.lookAt(look);
    sky.position.copy(camera.position);

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

  return { setLevel, frame, resize, pick, project, setQuality };
}
