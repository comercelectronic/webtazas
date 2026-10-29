/* Agència Digital — gràfics estil anime generats en SVG (retrats i escenaris). */
(function () {
  'use strict';

  const INK = '#2b1d22';

  // Fitxa visual de cada personatge
  const CHARS = {
    pau:    { name: 'Pau',        skin: '#f8dcc6', hair: '#3b2a24', hi: '#6b4c3e', eye: '#c47a28', style: 'spiky',  outfit: 'pau' },
    carme:  { name: 'Carme',      skin: '#f3d0b4', hair: '#8c5a46', hi: '#b98572', eye: '#7a4a2a', style: 'bun',    outfit: 'apron', oc: '#c8424b', age: 1 },
    miquel: { name: 'Miquel',     skin: '#efcdb2', hair: '#9aa0a8', hi: '#cfd3d8', eye: '#3c5a80', style: 'neat',   outfit: 'shirt', oc: '#2f4a6d', acc: ['glassesRect'], age: 1 },
    julia:  { name: 'Júlia',      skin: '#f9e0cf', hair: '#1f2433', hi: '#4a5577', eye: '#2f9a6e', style: 'bob',    outfit: 'cardigan', oc: '#7a5ac8', acc: ['glassesRound'] },
    berta:  { name: 'Berta',      skin: '#fbe1cf', hair: '#e2577a', hi: '#ff9bb4', eye: '#e08a2c', style: 'wavy',   outfit: 'shirt', oc: '#f2b134', acc: ['beret', 'earrings'] },
    quim:   { name: 'Quim',       skin: '#f4d2b6', hair: '#e9c25a', hi: '#fff0a8', eye: '#5a7a2a', style: 'slick',  outfit: 'polo', oc: '#ee7b30', acc: ['sunglasses'] },
    laia:   { name: 'Laia Vidal', skin: '#f6d8c8', hair: '#151320', hi: '#4d4470', eye: '#8a3fd1', style: 'long',   outfit: 'blazer', oc: '#1d1b2b', acc: ['earrings'] },
    jordi:  { name: 'Jordi',      skin: '#eec7a6', hair: '#4a2f22', hi: '#7a5444', eye: '#6b3d1f', style: 'neat',   outfit: 'chef', oc: '#ffffff', age: 1 },
    nuria:  { name: 'Núria',      skin: '#f6d6bf', hair: '#a3451f', hi: '#de7a4c', eye: '#3f7a3a', style: 'pony',   outfit: 'apron', oc: '#3f7a3a' },
    sergi:  { name: 'Sergi',      skin: '#f2cfb3', hair: '#26313f', hi: '#55657a', eye: '#2a6fb0', style: 'spiky',  outfit: 'hoodie', oc: '#d63c6b' },
    toni:   { name: 'Toni',       skin: '#e8be9c', hair: '#141414', hi: '#444', eye: '#4b2e1c', style: 'buzz',   outfit: 'polo', oc: '#1f9d55' },
    marta:  { name: 'Marta',      skin: '#f7dccb', hair: '#5a3b2a', hi: '#8c6450', eye: '#5a3fa0', style: 'long',   outfit: 'blazer', oc: '#2e6c8a', acc: ['earrings'] },
    ramon:  { name: 'Ramon',      skin: '#eccaae', hair: '#d8d8d8', hi: '#ffffff', eye: '#2d4a6a', style: 'slick',  outfit: 'suit', oc: '#2a2a35', age: 1 },
    amelie: { name: 'Amélie',     skin: '#fae3d3', hair: '#e7c46f', hi: '#fff2b8', eye: '#2c7fb8', style: 'bob',    outfit: 'blazer', oc: '#7a1f3d' },
    client: { name: 'Client',     skin: '#f1d0b6', hair: '#5a4030', hi: '#8a6a55', eye: '#5a3a20', style: 'neat',   outfit: 'shirt', oc: '#6a7a8a' }
  };

  // Vestuari d'en Pau segons el rang (millora visible del personatge)
  const PAU_OUTFITS = [
    { outfit: 'hoodie', oc: '#25b3a3' },
    { outfit: 'shirt',  oc: '#3e7bd6' },
    { outfit: 'blazer', oc: '#2c3e70', tie: false },
    { outfit: 'blazer', oc: '#263159', tie: true },
    { outfit: 'suit',   oc: '#1c1f33', tie: true, pin: true }
  ];

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
    r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /* ---------- Cabells ---------- */
  function hairBack(c, uid) {
    const f = `url(#hg${uid})`;
    switch (c.style) {
      case 'spiky': return `<path d="M72 170 C58 95 100 40 152 40 C206 40 246 92 228 172 L214 140 Z" fill="${f}" stroke="${INK}" stroke-width="2.5"/>`;
      case 'bun': return `<circle cx="150" cy="52" r="30" fill="${f}" stroke="${INK}" stroke-width="2.5"/><path d="M80 170 C70 95 108 58 150 58 C192 58 230 95 220 170 Z" fill="${f}" stroke="${INK}" stroke-width="2.5"/>`;
      case 'neat': case 'buzz': return `<path d="M82 160 C76 92 112 60 150 60 C190 60 226 92 218 160 Z" fill="${f}" stroke="${INK}" stroke-width="2.5"/>`;
      case 'bob': return `<path d="M70 150 C66 82 106 50 150 50 C194 50 234 82 230 150 L234 258 C214 268 200 262 196 250 L104 250 C100 262 86 268 66 258 Z" fill="${f}" stroke="${INK}" stroke-width="2.5"/>`;
      case 'wavy': return `<path d="M70 150 C64 78 106 46 150 46 C196 46 238 78 230 150 C246 200 226 230 246 270 C262 310 236 340 250 380 L50 380 C64 340 38 310 54 270 C74 230 54 200 70 150 Z" fill="${f}" stroke="${INK}" stroke-width="2.5"/>`;
      case 'long': return `<path d="M72 150 C68 80 108 48 150 48 C192 48 232 80 228 150 L240 380 L60 380 Z" fill="${f}" stroke="${INK}" stroke-width="2.5"/>`;
      case 'pony': return `<path d="M210 110 C262 120 268 200 246 262 C240 236 232 200 214 170 Z" fill="${f}" stroke="${INK}" stroke-width="2.5"/><path d="M80 160 C74 92 110 56 150 56 C190 56 226 92 220 160 Z" fill="${f}" stroke="${INK}" stroke-width="2.5"/>`;
      case 'slick': return `<path d="M80 160 C72 88 112 54 156 56 C198 58 228 92 220 160 Z" fill="${f}" stroke="${INK}" stroke-width="2.5"/>`;
    }
    return '';
  }

  function hairFront(c, uid) {
    const f = `url(#hg${uid})`;
    const shine = (d) => `<path d="${d}" fill="none" stroke="${c.hi}" stroke-width="5" stroke-linecap="round" opacity=".75"/>`;
    switch (c.style) {
      case 'spiky': return `<path d="M84 158 C78 92 112 54 152 54 C194 54 226 92 216 158 L206 124 L196 150 L184 106 L170 142 L156 98 L140 142 L126 106 L112 150 L100 120 Z" fill="${f}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M146 56 L136 22 L162 50 Z" fill="${f}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` + shine('M112 80 Q150 62 190 80');
      case 'bun': return `<path d="M84 160 C78 92 116 66 150 66 C188 66 224 92 216 160 C206 118 182 96 146 96 C124 104 104 120 92 148 Z" fill="${f}" stroke="${INK}" stroke-width="2.5"/>` + shine('M114 84 Q150 70 186 84');
      case 'neat': return `<path d="M86 146 C84 88 118 66 150 66 C184 66 216 88 214 146 C202 112 176 96 140 100 C118 104 98 120 86 146 Z" fill="${f}" stroke="${INK}" stroke-width="2.5"/>` + shine('M118 82 Q150 72 182 82');
      case 'buzz': return `<path d="M88 132 C88 86 118 68 150 68 C182 68 212 86 212 132 C190 112 112 112 88 132 Z" fill="${f}" stroke="${INK}" stroke-width="2.5"/>`;
      case 'bob': return `<path d="M84 150 C82 86 116 60 150 60 C184 60 218 86 216 150 L206 142 L196 150 L186 140 L174 150 L162 140 L150 150 L138 140 L126 150 L114 140 L102 150 L94 142 Z" fill="${f}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M84 148 L80 250 L100 246 L96 150 Z M216 148 L220 250 L200 246 L204 150 Z" fill="${f}" stroke="${INK}" stroke-width="2.5"/>` + shine('M110 82 Q150 64 190 82');
      case 'wavy': return `<path d="M84 160 C76 88 114 58 152 58 C192 58 226 88 216 160 C204 112 176 92 150 104 C132 128 106 140 84 160 Z" fill="${f}" stroke="${INK}" stroke-width="2.5"/><path d="M84 150 C74 200 96 230 84 270 L100 262 C108 220 92 196 98 150 Z M216 150 C226 200 204 230 216 270 L200 262 C192 220 208 196 202 150 Z" fill="${f}" stroke="${INK}" stroke-width="2.2"/>` + shine('M112 80 Q150 64 188 82');
      case 'long': return `<path d="M150 62 C112 62 84 96 84 162 L94 262 C98 190 116 120 150 84 C184 120 202 190 206 262 L216 162 C216 96 188 62 150 62 Z" fill="${f}" stroke="${INK}" stroke-width="2.5"/>` + shine('M114 86 Q150 68 186 86');
      case 'pony': return `<path d="M86 156 C80 90 116 62 150 62 C188 62 222 90 214 156 C200 120 180 100 150 98 L128 124 L118 104 C104 116 94 134 86 156 Z" fill="${f}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` + shine('M116 80 Q150 68 184 80');
      case 'slick': return `<path d="M88 142 C84 86 124 62 160 64 C196 66 216 92 214 136 C192 100 150 92 112 104 C100 112 92 126 88 142 Z" fill="${f}" stroke="${INK}" stroke-width="2.5"/>` + shine('M120 80 Q160 66 196 86');
    }
    return '';
  }

  /* ---------- Ulls i cara ---------- */
  function eye(cx, cy, e, color, uid, flip) {
    const s = flip ? -1 : 1;
    if (e === 'h') {
      return `<path d="M${cx - 18} ${cy + 4} Q${cx} ${cy - 16} ${cx + 18} ${cy + 4}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    }
    const ry = e === 's' ? 22 : 23;
    const irx = e === 's' ? 10 : 14, iry = e === 's' ? 13 : 18;
    const lid = e === 'a' ? 8 : (e === 't' ? 6 : 0);
    return `
      <ellipse cx="${cx}" cy="${cy + 2}" rx="19" ry="${ry}" fill="#fff"/>
      <ellipse cx="${cx}" cy="${cy + 6}" rx="${irx}" ry="${iry}" fill="url(#eg${uid})"/>
      <ellipse cx="${cx}" cy="${cy + 8}" rx="${irx * 0.45}" ry="${iry * 0.5}" fill="${INK}" opacity=".85"/>
      <circle cx="${cx - 5 * s}" cy="${cy - 3}" r="5.5" fill="#fff"/>
      <circle cx="${cx + 6 * s}" cy="${cy + 13}" r="2.6" fill="#fff" opacity=".9"/>
      ${lid ? `<path d="M${cx - 21} ${cy - 18} L${cx + 21} ${cy - 18} L${cx + 21} ${cy - 18 + lid + 6} Q${cx} ${cy - 14 + lid} ${cx - 21} ${cy - 18 + lid + 6} Z" fill="#f2c8b0"/>` : ''}
      <path d="M${cx - 22} ${cy - 10 + lid} Q${cx} ${cy - 30 + lid} ${cx + 22} ${cy - 12 + lid}" fill="none" stroke="${INK}" stroke-width="5.5" stroke-linecap="round"/>
      <path d="M${cx + 20 * s} ${cy - 12 + lid} l${7 * s} -5" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      <path d="M${cx - 12} ${cy + 26} Q${cx} ${cy + 29} ${cx + 12} ${cy + 26}" fill="none" stroke="${INK}" stroke-width="1.6" opacity=".5"/>`;
  }

  function brows(e, color) {
    const c = shade(color, -30);
    let l, r;
    if (e === 'w') { l = 'M102 146 Q116 138 136 136'; r = 'M164 136 Q184 138 198 146'; }
    else if (e === 'a') { l = 'M102 136 Q120 138 138 148'; r = 'M162 148 Q180 138 198 136'; }
    else if (e === 's') { l = 'M102 134 Q120 124 138 130'; r = 'M162 130 Q180 124 198 134'; }
    else if (e === 't') { l = 'M102 142 Q120 134 138 140'; r = 'M162 134 Q180 130 198 138'; }
    else { l = 'M102 142 Q120 134 138 138'; r = 'M162 138 Q180 134 198 142'; }
    return `<path d="${l}" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/><path d="${r}" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`;
  }

  function mouth(e) {
    switch (e) {
      case 'h': return `<path d="M134 222 Q150 246 166 222 Q150 230 134 222 Z" fill="#c4505a" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M142 232 Q150 238 158 232" fill="#ff9aa6"/>`;
      case 'w': return `<path d="M138 230 Q144 224 150 230 Q156 236 162 230" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
      case 'a': return `<path d="M138 232 Q150 222 162 232" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
      case 's': return `<ellipse cx="150" cy="230" rx="7" ry="9" fill="#a8404a" stroke="${INK}" stroke-width="2.2"/>`;
      case 't': return `<path d="M142 229 L160 226" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
      default: return `<path d="M139 226 Q150 233 161 226" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
    }
  }

  /* ---------- Vestuari ---------- */
  function outfit(c, o) {
    const oc = o.oc || c.oc || '#777';
    const dark = shade(oc, -35);
    const base = `<path d="M30 380 C40 312 90 290 128 282 L172 282 C210 290 260 312 270 380 Z" fill="${oc}" stroke="${INK}" stroke-width="2.5"/>`;
    switch (o.outfit) {
      case 'hoodie': return base + `<path d="M98 290 C110 312 190 312 202 290 C196 270 104 270 98 290 Z" fill="${dark}" stroke="${INK}" stroke-width="2.2"/><path d="M136 306 L132 350 M164 306 L168 350" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="132" cy="352" r="4" fill="#fff"/><circle cx="168" cy="352" r="4" fill="#fff"/>`;
      case 'shirt': return base + `<path d="M126 282 L150 322 L174 282 L162 278 L150 296 L138 278 Z" fill="#fff" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M150 322 L150 380" stroke="${dark}" stroke-width="2"/>`;
      case 'polo': return base + `<path d="M128 282 L150 304 L172 282 L184 292 L160 314 L150 304 L140 314 L116 292 Z" fill="${dark}" stroke="${INK}" stroke-width="2.2"/><circle cx="150" cy="322" r="2.6" fill="#fff"/><circle cx="150" cy="336" r="2.6" fill="#fff"/>`;
      case 'cardigan': return base + `<path d="M124 284 L150 380 L176 284 Z" fill="#fdf5e6" stroke="${INK}" stroke-width="2.2"/><path d="M132 290 Q150 300 168 290" fill="none" stroke="${INK}" stroke-width="2"/><circle cx="146" cy="330" r="3" fill="${dark}"/><circle cx="148" cy="352" r="3" fill="${dark}"/>`;
      case 'apron': return base + `<path d="M118 300 L182 300 L190 380 L110 380 Z" fill="#fffaf2" stroke="${INK}" stroke-width="2.2"/><path d="M118 300 L130 282 M182 300 L170 282" stroke="#fffaf2" stroke-width="7"/><rect x="136" y="330" width="28" height="18" rx="4" fill="none" stroke="${shade(oc, -10)}" stroke-width="2"/>`;
      case 'chef': return base.replace(oc, '#fdfdfd') + `<path d="M150 284 L150 380" stroke="#ddd" stroke-width="2"/><circle cx="136" cy="314" r="4" fill="#333"/><circle cx="136" cy="344" r="4" fill="#333"/><circle cx="164" cy="314" r="4" fill="#333"/><circle cx="164" cy="344" r="4" fill="#333"/><path d="M118 286 Q150 300 182 286" fill="none" stroke="#c8424b" stroke-width="7"/>`;
      case 'blazer': case 'suit': {
        const inner = o.outfit === 'suit' ? '#f3f5fa' : '#ffffff';
        return base + `<path d="M124 282 L150 360 L176 282 Z" fill="${inner}" stroke="${INK}" stroke-width="2"/>` +
          (o.tie ? `<path d="M144 296 L156 296 L160 350 L150 362 L140 350 Z" fill="#c23a4a" stroke="${INK}" stroke-width="1.8"/>` : '') +
          `<path d="M124 282 L104 320 L124 330 L114 352 L150 380 L150 362 Z" fill="${dark}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>` +
          `<path d="M176 282 L196 320 L176 330 L186 352 L150 380 L150 362 Z" fill="${dark}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>` +
          (o.pin ? `<circle cx="188" cy="322" r="6" fill="#f5c542" stroke="${INK}" stroke-width="1.5"/>` : '');
      }
    }
    return base;
  }

  /* ---------- Accessoris ---------- */
  function accessories(c) {
    let s = '';
    (c.acc || []).forEach(a => {
      if (a === 'glassesRound') s += `<g fill="rgba(200,230,255,.18)" stroke="#3a3350" stroke-width="3"><circle cx="120" cy="180" r="24"/><circle cx="180" cy="180" r="24"/></g><path d="M144 178 Q150 172 156 178" stroke="#3a3350" stroke-width="3" fill="none"/>`;
      if (a === 'glassesRect') s += `<g fill="rgba(200,230,255,.15)" stroke="#2a2a2a" stroke-width="3"><rect x="96" y="160" width="48" height="34" rx="6"/><rect x="156" y="160" width="48" height="34" rx="6"/></g><path d="M144 172 L156 172" stroke="#2a2a2a" stroke-width="3"/>`;
      if (a === 'beret') s += `<path d="M86 96 C90 44 210 40 222 92 C190 78 120 80 86 96 Z" fill="#f2b134" stroke="${INK}" stroke-width="2.5"/><circle cx="160" cy="48" r="6" fill="#d8901a" stroke="${INK}" stroke-width="2"/>`;
      if (a === 'earrings') s += `<circle cx="86" cy="196" r="5" fill="#f5c542" stroke="${INK}" stroke-width="1.5"/><circle cx="214" cy="196" r="5" fill="#f5c542" stroke="${INK}" stroke-width="1.5"/>`;
      if (a === 'sunglasses') s += `<path d="M98 76 L146 76 L142 92 Q122 100 102 92 Z M154 76 L202 76 L198 92 Q178 100 158 92 Z" fill="#1d1d26" stroke="${INK}" stroke-width="2"/><path d="M146 80 L154 80" stroke="${INK}" stroke-width="3"/>`;
    });
    return s;
  }

  let uidCounter = 0;
  /**
   * Retrat d'un personatge.
   * @param {string} id  identificador del personatge
   * @param {string} e   expressió: n normal, h content, w preocupat, a enfadat, s sorprès, t pensatiu
   * @param {object} opt { rank } per al vestuari d'en Pau
   */
  function portrait(id, e, opt) {
    e = e || 'n'; opt = opt || {};
    const base = CHARS[id] || CHARS.client;
    const c = Object.assign({}, base);
    let o = { outfit: c.outfit, oc: c.oc };
    if (id === 'pau') o = PAU_OUTFITS[Math.max(0, Math.min(PAU_OUTFITS.length - 1, opt.rank || 0))];
    const uid = 'u' + (++uidCounter);
    const skinS = shade(c.skin, -22);
    const blushOp = e === 'h' ? 0.55 : (e === 'a' ? 0.5 : 0.32);
    return `<svg class="portrait-svg" viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${c.name}">
      <defs>
        <linearGradient id="hg${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(c.hair, 18)}"/><stop offset="1" stop-color="${shade(c.hair, -28)}"/></linearGradient>
        <linearGradient id="eg${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(c.eye, -55)}"/><stop offset=".55" stop-color="${c.eye}"/><stop offset="1" stop-color="${shade(c.eye, 60)}"/></linearGradient>
      </defs>
      ${hairBack(c, uid)}
      <rect x="128" y="236" width="44" height="58" fill="${skinS}" stroke="${INK}" stroke-width="2.2"/>
      ${outfit(c, o)}
      <ellipse cx="86" cy="178" rx="10" ry="16" fill="${c.skin}" stroke="${INK}" stroke-width="2.2"/>
      <ellipse cx="214" cy="178" rx="10" ry="16" fill="${c.skin}" stroke="${INK}" stroke-width="2.2"/>
      <path d="M86 150 C86 96 116 72 150 72 C184 72 214 96 214 150 C214 206 190 246 150 264 C110 246 86 206 86 150 Z" fill="${c.skin}" stroke="${INK}" stroke-width="2.5"/>
      ${c.age ? `<path d="M104 214 Q110 222 118 224 M196 214 Q190 222 182 224" stroke="${skinS}" stroke-width="2" fill="none"/>` : ''}
      <ellipse cx="110" cy="208" rx="13" ry="6" fill="#ff8a98" opacity="${blushOp}"/>
      <ellipse cx="190" cy="208" rx="13" ry="6" fill="#ff8a98" opacity="${blushOp}"/>
      ${eye(120, 178, e, c.eye, uid, false)}
      ${eye(180, 178, e, c.eye, uid, true)}
      <path d="M151 198 L147 210 L153 211" fill="none" stroke="${skinS}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      ${mouth(e)}
      ${hairFront(c, uid)}
      <g opacity=".92">${brows(e, c.hair)}</g>
      ${accessories(c)}
      ${e === 'w' ? `<path d="M222 120 q6 10 0 16 q-6 -6 0 -16 Z" fill="#8fd3ff" stroke="${INK}" stroke-width="1.5"/>` : ''}
      ${e === 'a' ? `<path d="M222 96 l8 8 m0 -8 l-8 8 M234 108 l6 6" stroke="#e0313f" stroke-width="4" stroke-linecap="round"/>` : ''}
      ${e === 'h' ? `<path d="M228 100 l4 -10 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 Z" fill="#ffd84a"/>` : ''}
    </svg>`;
  }

  /* ---------- Escenaris ---------- */
  const SKY = {
    day: ['#8fd3ff', '#d9f1ff'], sunset: ['#ff9a8b', '#ffd39a'], night: ['#1b1f4a', '#3a3f7a'], warm: ['#ffe2b8', '#fff4e2']
  };
  function sky(id, k) { const [a, b] = SKY[k]; return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`; }
  function clouds(op) { return `<g fill="#fff" opacity="${op || .85}"><ellipse cx="180" cy="90" rx="70" ry="22"/><ellipse cx="230" cy="78" rx="46" ry="20"/><ellipse cx="760" cy="120" rx="80" ry="24"/><ellipse cx="820" cy="106" rx="50" ry="20"/><ellipse cx="520" cy="60" rx="60" ry="16"/></g>`; }
  function windowFrame(x, y, w, h, k) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#sk)" stroke="#6b5a4e" stroke-width="10"/>` +
      (k === 'night' ? `<circle cx="${x + w * 0.7}" cy="${y + h * 0.3}" r="22" fill="#fff6c8"/><g fill="#fff">${[0, 1, 2, 3, 4].map(i => `<circle cx="${x + 20 + i * w / 5}" cy="${y + 20 + (i % 2) * 30}" r="2"/>`).join('')}</g>` :
        `<g fill="#fff" opacity=".9"><ellipse cx="${x + w * 0.3}" cy="${y + h * 0.35}" rx="40" ry="12"/><ellipse cx="${x + w * 0.72}" cy="${y + h * 0.55}" rx="30" ry="10"/></g>`) +
      `<path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}" stroke="#6b5a4e" stroke-width="6"/>`;
  }

  const BG = {
    vic: () => `${defs(sky('sk', 'sunset'))}<rect width="1000" height="600" fill="url(#sk)"/>${clouds(.7)}
      <circle cx="800" cy="200" r="60" fill="#fff1c1" opacity=".8"/>
      <rect x="470" y="90" width="70" height="300" fill="#9a6e5e"/><path d="M462 90 L505 40 L548 90 Z" fill="#7a5040"/>
      <g fill="#5a3a30">${[0, 1, 2, 3].map(i => `<rect x="${484 + (i % 2) * 26}" y="${120 + Math.floor(i / 2) * 70}" width="14" height="40" rx="7"/>`).join('')}</g>
      <path d="M0 330 L120 330 L120 280 L240 280 L240 310 L360 310 L360 270 L470 270 L470 390 L540 390 L540 260 L680 260 L680 300 L820 300 L820 270 L1000 270 L1000 600 L0 600 Z" fill="#c98e72"/>
      <g fill="#7a4c3e">${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 86 + 10} 600 L${i * 86 + 10} 440 Q${i * 86 + 45} 395 ${i * 86 + 80} 440 L${i * 86 + 80} 600 Z"/>`).join('')}</g>
      <g fill="#ffd9a0" opacity=".8">${Array.from({ length: 10 }, (_, i) => `<rect x="${i * 100 + 30}" y="${330 + (i % 3) * 10}" width="22" height="30" rx="3"/>`).join('')}</g>
      <rect y="560" width="1000" height="40" fill="#b07a62"/>`,
    despatx: (k) => `${defs(sky('sk', k || 'day'))}<rect width="1000" height="600" fill="${k === 'night' ? '#4a4566' : '#f4e6d4'}"/>
      <rect y="440" width="1000" height="160" fill="${k === 'night' ? '#3a3350' : '#d9b994'}"/>
      ${windowFrame(80, 90, 300, 240, k)}
      <rect x="520" y="90" width="380" height="230" rx="8" fill="#fdfdfd" stroke="#b8b8c8" stroke-width="8"/>
      <g stroke="#4a6fd6" stroke-width="5" fill="none" stroke-linecap="round"><path d="M560 140 h120 M560 180 h80"/><path d="M720 270 L770 200 L810 230 L860 150" stroke="#e45a7a"/></g>
      <rect x="200" y="400" width="600" height="30" rx="6" fill="#8a5a3e"/><rect x="220" y="430" width="20" height="150" fill="#6e4630"/><rect x="760" y="430" width="20" height="150" fill="#6e4630"/>
      <rect x="420" y="330" width="160" height="72" rx="6" fill="#2b2f40"/><rect x="430" y="338" width="140" height="56" fill="${k === 'night' ? '#7fd1ff' : '#a6e3ff'}"/><path d="M400 402 h200 l-20 10 h-160 Z" fill="#3a3f55"/>
      <g transform="translate(860 330)"><rect x="-26" y="40" width="52" height="60" rx="8" fill="#e46a4a"/><path d="M0 40 C-40 0 -30 -30 0 -10 C30 -30 40 0 0 40" fill="#3fa36a"/></g>
      ${k === 'night' ? '<circle cx="300" cy="380" r="160" fill="#ffd88a" opacity=".12"/><rect width="1000" height="600" fill="#101030" opacity=".25"/>' : ''}`,
    forn: () => `<rect width="1000" height="600" fill="#f7dcb4"/><rect y="0" width="1000" height="60" fill="#c8424b"/>
      <g fill="#fff" opacity=".9">${Array.from({ length: 10 }, (_, i) => `<path d="M${i * 100} 60 q50 40 100 0 Z"/>`).join('')}</g>
      ${[150, 250, 350].map(y => `<rect x="80" y="${y}" width="520" height="14" fill="#8a5a3e"/>`).join('')}
      <g fill="#d98c3e" stroke="#9a5a22" stroke-width="3">${[0, 1, 2, 3, 4].map(i => `<ellipse cx="${130 + i * 100}" cy="135" rx="40" ry="18"/>`).join('')}${[0, 1, 2, 3].map(i => `<ellipse cx="${170 + i * 110}" cy="235" rx="46" ry="20"/>`).join('')}</g>
      <g fill="#f2c26a" stroke="#b07a2a" stroke-width="3">${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${110 + i * 80}" y="315" width="60" height="30" rx="12"/>`).join('')}</g>
      <rect x="680" y="120" width="240" height="180" rx="8" fill="#2f3a32" stroke="#8a5a3e" stroke-width="10"/>
      <g fill="#fff" font-family="M PLUS Rounded 1c, sans-serif" font-size="26"><text x="710" y="170">Pa de pagès</text><text x="710" y="210">Coca de vidre</text><text x="710" y="250">Croissants</text></g>
      <rect x="0" y="420" width="1000" height="180" fill="#a8683e"/><rect x="0" y="420" width="1000" height="20" fill="#c98a5a"/>`,
    restaurant: () => `<rect width="1000" height="600" fill="#5a2f2a"/><rect y="0" width="1000" height="380" fill="#7a3f36"/>
      <g fill="#ffd27a">${[150, 400, 650, 880].map(x => `<path d="M${x} 0 V70"/><circle cx="${x}" cy="90" r="22" opacity=".9"/><circle cx="${x}" cy="90" r="70" opacity=".12"/>`).join('')}</g>
      <g stroke="#ffd27a" stroke-width="3">${[150, 400, 650, 880].map(x => `<line x1="${x}" y1="0" x2="${x}" y2="70"/>`).join('')}</g>
      <g>${[180, 520, 840].map(x => `<ellipse cx="${x}" cy="470" rx="130" ry="34" fill="#fff"/><rect x="${x - 8}" y="480" width="16" height="110" fill="#3a1f1a"/><rect x="${x - 30}" y="420" width="8" height="40" fill="#8fd3a0"/><circle cx="${x + 40}" cy="455" r="10" fill="#f2f2f2" stroke="#ccc"/>`).join('')}</g>
      <rect x="600" y="140" width="300" height="160" rx="8" fill="#2a2a2a" stroke="#c8a06a" stroke-width="8"/><text x="640" y="200" fill="#fff" font-family="M PLUS Rounded 1c, sans-serif" font-size="30">Menú del dia</text>`,
    fabrica: () => `${defs(sky('sk', 'day'))}<rect width="1000" height="600" fill="#cdd6e0"/>
      ${[60, 300, 540, 780].map(x => `<rect x="${x}" y="60" width="170" height="130" fill="url(#sk)" stroke="#6a7a8a" stroke-width="8"/>`).join('')}
      <rect y="380" width="1000" height="220" fill="#8a96a3"/><rect y="380" width="1000" height="12" fill="#f2c94c"/>
      <g fill="#5a6a7a" stroke="#3a4450" stroke-width="4"><rect x="80" y="250" width="260" height="140" rx="10"/><rect x="420" y="220" width="180" height="170" rx="10"/><rect x="680" y="270" width="240" height="120" rx="10"/></g>
      <g fill="#f2c94c"><circle cx="150" cy="310" r="24"/><circle cx="510" cy="290" r="30"/><rect x="720" y="300" width="80" height="20"/></g>
      <path d="M0 230 H1000" stroke="#7a8a9a" stroke-width="14"/>`,
    botiga: () => `<rect width="1000" height="600" fill="#f4ecd8"/>
      ${[130, 250, 370].map(y => `<rect x="60" y="${y}" width="880" height="12" fill="#7a5038"/>`).join('')}
      <g>${Array.from({ length: 14 }, (_, i) => `<rect x="${80 + i * 62}" y="${82 + (i % 2) * 6}" width="40" height="${48 - (i % 2) * 6}" rx="6" fill="${['#c8424b', '#3f7a3a', '#f2b134', '#3e7bd6'][i % 4]}"/>`).join('')}</g>
      <g>${Array.from({ length: 12 }, (_, i) => `<path d="M${100 + i * 72} 262 q10 -40 20 0 q4 40 -10 60 q-14 -20 -10 -60 Z" fill="#a0523a" stroke="#6a3020" stroke-width="2"/>`).join('')}</g>
      <g>${Array.from({ length: 10 }, (_, i) => `<ellipse cx="${120 + i * 84}" cy="350" rx="30" ry="18" fill="#f6d28a" stroke="#b08a3a" stroke-width="3"/>`).join('')}</g>
      <rect y="430" width="1000" height="170" fill="#8a6044"/>`,
    fira: () => `<rect width="1000" height="600" fill="#e8ecf7"/><rect y="0" width="1000" height="50" fill="#3a3f7a"/>
      <g>${Array.from({ length: 10 }, (_, i) => `<circle cx="${i * 110 + 40}" cy="50" r="8" fill="#fff6c8"/>`).join('')}</g>
      ${[{ x: 40, c: '#e45a7a' }, { x: 360, c: '#25b3a3' }, { x: 680, c: '#f2b134' }].map(s => `<rect x="${s.x}" y="120" width="280" height="60" fill="${s.c}"/><rect x="${s.x + 10}" y="180" width="260" height="200" fill="#fff" stroke="#ccd" stroke-width="4"/><rect x="${s.x + 30}" y="210" width="90" height="120" rx="6" fill="${s.c}" opacity=".35"/><rect x="${s.x}" y="380" width="280" height="40" fill="#556"/>`).join('')}
      <g fill="#fff" font-family="M PLUS Rounded 1c, sans-serif" font-size="26" font-weight="700"><text x="70" y="160">FIRA EMPRESA</text><text x="390" y="160">OSONA DIGITAL</text><text x="720" y="160">INDÚSTRIA 4.0</text></g>
      <rect y="440" width="1000" height="160" fill="#b8bfd6"/>`,
    barcelona: () => `${defs(sky('sk', 'sunset'))}<rect width="1000" height="600" fill="url(#sk)"/>${clouds(.6)}
      <rect y="420" width="1000" height="180" fill="#4a7ac8" opacity=".6"/>
      <g fill="#6a5a8a">${[[40, 260], [130, 200], [210, 300], [300, 170], [380, 240], [470, 120], [560, 220], [640, 180], [720, 280], [800, 150], [900, 240]].map(([x, h]) => `<rect x="${x}" y="${440 - h}" width="76" height="${h}"/>`).join('')}</g>
      <g fill="#ffe4a0" opacity=".85">${Array.from({ length: 40 }, (_, i) => `<rect x="${50 + (i * 97) % 900}" y="${300 + (i * 37) % 120}" width="8" height="10"/>`).join('')}</g>
      <path d="M470 320 L490 120 L510 320 Z M520 320 L536 160 L552 320 Z" fill="#544472"/>`,
    oficina: () => `${defs(sky('sk', 'day'))}<rect width="1000" height="600" fill="#eef3f8"/>
      <rect x="40" y="60" width="920" height="300" fill="url(#sk)"/>${clouds(.8)}
      <g stroke="#c5d2df" stroke-width="10">${[40, 270, 500, 730, 960].map(x => `<line x1="${x}" y1="60" x2="${x}" y2="360"/>`).join('')}<line x1="40" y1="60" x2="960" y2="60"/></g>
      <g fill="#7a8fae" opacity=".45">${[[80, 120], [180, 180], [300, 90], [430, 150], [560, 70], [680, 160], [820, 110]].map(([x, h]) => `<rect x="${x}" y="${360 - h}" width="80" height="${h}"/>`).join('')}</g>
      <rect y="360" width="1000" height="240" fill="#d7dee8"/>
      <rect x="150" y="440" width="700" height="24" rx="10" fill="#fff" stroke="#b8c4d2" stroke-width="3"/>
      ${[260, 500, 740].map(x => `<rect x="${x - 50}" y="390" width="100" height="50" rx="6" fill="#2b2f40"/><rect x="${x - 44}" y="396" width="88" height="38" fill="#a6e3ff"/>`).join('')}
      <g transform="translate(70 380)"><rect x="-26" y="60" width="52" height="70" rx="8" fill="#fff" stroke="#ccc" stroke-width="3"/><path d="M0 60 C-50 10 -30 -40 0 -10 C30 -40 50 10 0 60" fill="#3fa36a"/></g>`,
    franca: () => `${defs(sky('sk', 'day'))}<rect width="1000" height="600" fill="url(#sk)"/>${clouds()}
      <g fill="#e8d8b8" stroke="#a89878" stroke-width="3">${[0, 1, 2, 3, 4].map(i => `<rect x="${i * 200 + 10}" y="${160 + (i % 2) * 30}" width="180" height="300"/><path d="M${i * 200} ${160 + (i % 2) * 30} L${i * 200 + 100} ${110 + (i % 2) * 30} L${i * 200 + 200} ${160 + (i % 2) * 30} Z" fill="#7a8aa0"/>`).join('')}</g>
      <g fill="#5a7ac8" opacity=".7">${Array.from({ length: 15 }, (_, i) => `<rect x="${30 + (i % 5) * 200 + 40 * Math.floor(i / 5)}" y="${240 + Math.floor(i / 5) * 60}" width="26" height="40"/>`).join('')}</g>
      <rect y="460" width="1000" height="140" fill="#6aa0d8"/><path d="M0 470 Q250 450 500 470 T1000 470" stroke="#fff" stroke-width="4" fill="none" opacity=".6"/>`
  };
  function defs(s) { return `<defs>${s}</defs>`; }

  function background(name) {
    let [n, k] = String(name || 'despatx').split(':');
    const fn = BG[n] || BG.despatx;
    return `<svg class="bg-svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${fn(k)}</svg>`;
  }

  window.ART = { portrait, background, CHARS, PAU_OUTFITS };
})();
