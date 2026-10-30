/* Agència Digital — motor del joc */
(function () {
  'use strict';

  const GD = window.GD;
  const SAVE_KEY = 'agencia-digital-partida-v1';
  const $ = (s, r) => (r || document).querySelector(s);
  const app = () => $('#app');

  /* ================= Constants de joc ================= */
  const SKILLS = {
    estrategia:  { n: 'Estratègia',  i: '🧭', d: 'Diagnòstics més encertats i plans més sòlids. +qualitat a totes les campanyes.' },
    creativitat: { n: 'Creativitat', i: '🎨', d: 'Missatges i continguts que connecten. +resultats en marca, xarxes i anuncis.' },
    analitica:   { n: 'Analítica',   i: '📊', d: 'Llegeixes les dades amb rigor. +precisió i opcions de diàleg basades en dades.' },
    comercial:   { n: 'Comercial',   i: '🤝', d: 'Negocies millor. +5% als honoraris per nivell i més confiança dels clients.' },
    gestio:      { n: 'Direcció',    i: '🏢', d: 'Organitzes equip i diners. −4% de despeses fixes per nivell i més marge en crisis.' }
  };
  const SKILL_MAX = 5;
  const CHARS_TRUST = ['carme', 'miquel', 'julia', 'berta', 'quim', 'laia'];
  const RANKS = {
    m: ['Emprenedor novell', 'Consultor local', 'Estrateg digital', 'Director d\'equip', 'Gestor de crisis', 'Director d\'agència', 'Director estratègic', 'Referent del sector', 'Llegenda d\'Osona'],
    f: ['Emprenedora novella', 'Consultora local', 'Estratega digital', 'Directora d\'equip', 'Gestora de crisis', 'Directora d\'agència', 'Directora estratègica', 'Referent del sector', 'Llegenda d\'Osona'],
    n: ['Primeres passes', 'Consultoria local', 'Estratègia digital', 'Direcció d\'equip', 'Gestió de crisis', 'Direcció d\'agència', 'Direcció estratègica', 'Referent del sector', 'Llegenda d\'Osona']
  };
  const API = '/.netlify/functions/joc-resultats';
  const xpNeed = (lvl) => 180 + 75 * Math.ceil(lvl / 4);
  const MAX_LEVEL = 30;

  /* ================= Estat ================= */
  let S = null;
  let settings = { speed: 18 };

  function newState() {
    return {
      v: 1, agency: 'Píxel d\'Osona', profile: null,
      player: { id: uid(), name: 'Pau', surname: 'Riera', g: 'm', look: Object.assign({}, ART.PLAYER_DEFAULT) },
      classe: '', quizLog: {}, syncPending: false, lastSync: 0,
      level: 1, xp: 0, sp: 0,
      skills: { estrategia: 0, creativitat: 0, analitica: 0, comercial: 0, gestio: 0 },
      money: 3000, reserve: 0, week: 1, rep: 5,
      trust: { carme: 0, miquel: 0, julia: 0, berta: 0, quim: 0, laia: 0 },
      know: Object.fromEntries(Object.keys(GD.areas).map(k => [k, 0])),
      rent: 350, tools: 50, team: [], clients: [],
      f: {}, history: [], lessons: {}, done: {}, cur: null,
      gigs: [], stats: { income: 0, expenses: 0, gigs: 0, campaigns: 0, good: 0 },
      ending: null, started: Date.now()
    };
  }

  function uid() {
    try { if (crypto.randomUUID) return crypto.randomUUID(); } catch (e) { }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); });
  }
  function applyPlayer() { if (!S) return; ART.setPlayer(S.player.look); ART.CHARS.pau.name = S.player.name; }
  function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* sense emmagatzematge */ } }
  function loadSave() { try { const r = localStorage.getItem(SAVE_KEY); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function loadSettings() { try { Object.assign(settings, JSON.parse(localStorage.getItem(SAVE_KEY + '-cfg') || '{}')); } catch (e) { } }
  function saveSettings() { try { localStorage.setItem(SAVE_KEY + '-cfg', JSON.stringify(settings)); } catch (e) { } }

  /* ================= Utilitats ================= */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const eur = (n) => (Math.round(n)).toLocaleString('ca-ES') + ' €';
  const pct = (n) => (Math.round(n * 10) / 10).toLocaleString('ca-ES') + ' %';
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rnd = (a, b) => a + Math.random() * (b - a);
  // Marcadors del guió: {nom}, {nomc} (nom complet), {en}/{En} («en Pau», «la Marta», «l'Anna»),
  // {den} («d'en Pau», «de la Marta») i {g:masculí|femení|neutre}.
  function gi() { return { m: 0, f: 1, n: 2 }[S && S.player ? S.player.g : 'm'] || 0; }
  function playerRefs() {
    const p = (S && S.player) || { name: 'Pau', surname: '', g: 'm' };
    const n = esc(p.name), vow = /^h?[aeiouàèéíòóú]/i.test(p.name);
    let en, den;
    if (p.g === 'f') { en = (vow ? 'l\'' : 'la ') + n; den = (vow ? 'de l\'' : 'de la ') + n; }
    else if (p.g === 'n') { en = n; den = (vow ? 'd\'' : 'de ') + n; }
    else { en = (vow ? 'l\'' : 'en ') + n; den = (vow ? 'de l\'' : 'd\'en ') + n; }
    return { nom: n, nomc: esc((p.name + ' ' + (p.surname || '')).trim()), en, En: en.charAt(0).toUpperCase() + en.slice(1), den };
  }
  function txt(t) {
    if (typeof t === 'function') t = t(S, H);
    const r = playerRefs(), g = gi();
    return String(t == null ? '' : t)
      .replace(/\{g:([^}]*)\}/g, (_, v) => { const o = v.split('|'); return o[g] != null && o[g] !== '' ? o[g] : o[0]; })
      .replace(/\{agencia\}/g, esc(S ? S.agency : ''))
      .replace(/\{(nomc|nom|En|en|den)\}/g, (_, k) => r[k]);
  }
  function stageOf(chId) { return GD.chapters[chId].stage; }
  function stagesDone() { return GD.stages.filter(st => st.chapters.every(c => S.done[c])).length; }
  function rank() { return Math.min(4, Math.floor(stagesDone() / 2)); }
  function title() { const L = RANKS[(S && S.player && S.player.g) || 'm']; return L[Math.min(L.length - 1, stagesDone())]; }
  function sk(k) { return S.skills[k] || 0; }
  function weeklyIncome() { return S.clients.reduce((a, c) => a + c.fee, 0) / 4; }
  function weeklyCost() {
    const base = S.rent + S.tools + S.team.reduce((a, t) => a + t.salary, 0);
    return base * (1 - 0.04 * sk('gestio')) / 4;
  }
  function knowTotal() { return Object.values(S.know).reduce((a, b) => a + b, 0); }

  // Ajudes per al contingut (data.js)
  const H = {
    sk, clamp, rnd, eur, pct,
    f: (k) => S.f[k],
    trust: (c) => S.trust[c] || 0,
    know: (k) => S.know[k] || 0,
    lesson: (id) => S.lessons[id] ? S.lessons[id].best : 0,
    // Qualitat d'una acció: base (0-1) + habilitats + coneixement + soroll
    q: (base, skills, know) => {
      let v = base;
      (skills || []).forEach(k => v += 0.035 * sk(k));
      (know || []).forEach(k => v += 0.02 * Math.min(4, S.know[k] || 0));
      return clamp(v + rnd(-0.06, 0.06), 0, 1.2);
    },
    hasClient: (id) => S.clients.some(c => c.id === id),
    teamHas: (id) => S.team.some(t => t.id === id),
    get S() { return S; }
  };
  window.H = H;

  /* ================= Efectes ================= */
  let RUN = null; // resum del capítol en curs
  function runInit() { RUN = S.cur && S.cur.run ? S.cur.run : { xp: 0, money: 0, rep: 0, trust: {}, know: {} }; if (S.cur) S.cur.run = RUN; }

  function applyFx(fx, silent) {
    if (!fx) return;
    if (typeof fx === 'function') fx = fx(S, H);
    if (!fx) return;
    const notes = [];
    if (fx.money) {
      let m = fx.money;
      if (m > 0 && fx.fee) m = Math.round(m * (1 + 0.05 * sk('comercial')));
      S.money += m; if (m > 0) S.stats.income += m; else S.stats.expenses -= m;
      if (RUN) RUN.money += m;
      notes.push((m > 0 ? '+' : '') + eur(m));
    }
    if (fx.reserve) { S.money -= fx.reserve; S.reserve += fx.reserve; }
    if (fx.rep) { S.rep = clamp(S.rep + fx.rep, 0, 100); if (RUN) RUN.rep += fx.rep; notes.push((fx.rep > 0 ? '+' : '') + fx.rep + ' reputació'); }
    if (fx.trust) for (const k in fx.trust) {
      S.trust[k] = clamp((S.trust[k] || 0) + fx.trust[k], -5, 10);
      if (RUN) RUN.trust[k] = (RUN.trust[k] || 0) + fx.trust[k];
      if (!silent && GD.names[k]) notes.push(`${GD.names[k]} ${fx.trust[k] > 0 ? '♥+' : '💔'}${fx.trust[k] > 0 ? fx.trust[k] : fx.trust[k]}`);
    }
    if (fx.know) for (const k in fx.know) { S.know[k] = (S.know[k] || 0) + fx.know[k]; if (RUN) RUN.know[k] = (RUN.know[k] || 0) + fx.know[k]; }
    if (fx.skill) for (const k in fx.skill) S.skills[k] = clamp(S.skills[k] + fx.skill[k], 0, SKILL_MAX);
    if (fx.flags) Object.assign(S.f, fx.flags);
    if (fx.client) { S.clients = S.clients.filter(c => c.id !== fx.client.id); S.clients.push(fx.client); notes.push(`Nou client recurrent: ${fx.client.name}`); }
    if (fx.dropClient) { const c = S.clients.find(x => x.id === fx.dropClient); if (c) { S.clients = S.clients.filter(x => x.id !== fx.dropClient); notes.push(`Deixes de treballar amb ${c.name}`); } }
    if (fx.clientFee) for (const k in fx.clientFee) { const c = S.clients.find(x => x.id === k); if (c) c.fee = Math.max(0, c.fee + fx.clientFee[k]); }
    if (fx.hire) { if (!S.team.some(t => t.id === fx.hire.id)) { S.team.push(fx.hire); notes.push(`S'incorpora ${fx.hire.name} a l'equip`); } }
    if (fx.fire) S.team = S.team.filter(t => t.id !== fx.fire);
    if (fx.rent != null) S.rent = fx.rent;
    if (fx.tools != null) S.tools = fx.tools;
    if (fx.log) S.history.push({ ch: S.cur ? S.cur.id : '-', week: S.week, t: txt(fx.log), key: !!fx.key });
    if (fx.xp) addXP(fx.xp);
    if (!silent && notes.length) toast(notes.join(' · '));
  }

  function addXP(n) {
    if (S.level >= MAX_LEVEL) return;
    S.xp += n; if (RUN) RUN.xp += n;
    let up = 0;
    while (S.level < MAX_LEVEL && S.xp >= xpNeed(S.level)) { S.xp -= xpNeed(S.level); S.level++; S.sp++; up++; }
    if (up) levelUpFx();
    hud();
  }

  function advanceWeeks(n) {
    let inc = 0, cost = 0;
    for (let i = 0; i < n; i++) { inc += weeklyIncome(); cost += weeklyCost(); }
    S.week += n; S.money += inc - cost; S.stats.income += inc; S.stats.expenses += cost;
    if (S.money < 0) S.f.numerosVermells = (S.f.numerosVermells || 0) + 1;
    return { inc, cost, n };
  }

  /* ================= Interfície general ================= */
  function toast(msg, cls) {
    const t = document.createElement('div');
    t.className = 'toast ' + (cls || ''); t.innerHTML = msg;
    $('#toasts').appendChild(t);
    setTimeout(() => t.classList.add('out'), 3200);
    setTimeout(() => t.remove(), 3800);
  }

  function levelUpFx() {
    const d = document.createElement('div');
    d.className = 'levelup';
    d.innerHTML = `<div class="lu-lines"></div><div class="lu-box"><div class="lu-t">LEVEL UP!</div><div class="lu-s">Nivell ${S.level} · +1 punt d'habilitat</div></div>`;
    document.body.appendChild(d);
    petals(d, 24);
    setTimeout(() => d.classList.add('out'), 1900);
    setTimeout(() => d.remove(), 2500);
  }

  function petals(container, n) {
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      p.className = 'petal';
      p.style.left = rnd(0, 100) + '%';
      p.style.animationDelay = rnd(0, 6) + 's';
      p.style.animationDuration = rnd(6, 12) + 's';
      p.style.transform = `scale(${rnd(0.6, 1.3)})`;
      container.appendChild(p);
    }
  }

  function hud() {
    const h = $('#hud'); if (!h || !S) return;
    const need = xpNeed(S.level);
    h.innerHTML = `
      <button class="hud-agency" data-act="hub" title="Tornar al centre d'operacions">
        <span class="hud-ava">${ART.portrait('pau', 'n', { rank: rank() })}</span>
        <span><b>${esc(S.agency)}</b><small>${title()}</small></span>
      </button>
      <div class="hud-stats">
        <span class="chip ${S.money < 0 ? 'neg' : ''}" title="Liquiditat">💶 ${eur(S.money)}</span>
        <span class="chip" title="Reputació">⭐ ${S.rep}</span>
        <span class="chip" title="Setmana">📅 S${S.week}</span>
        <span class="chip lvl" title="Nivell i experiència">Nv ${S.level}<i class="xpbar"><i style="width:${S.level >= MAX_LEVEL ? 100 : Math.round(S.xp / need * 100)}%"></i></i></span>
      </div>`;
  }

  /* ================= Pantalla de títol ================= */
  function titleScreen() {
    const has = loadSave();
    ART.setPlayer(has && has.player ? has.player.look : null);
    app().innerHTML = `
      <section class="title-screen">
        <div class="title-bg">${ART.background('vic')}</div>
        <div class="title-petals"></div>
        <div class="title-content">
          <div class="title-ava">${ART.portrait('pau', 'h', { rank: 0 })}</div>
          <h1 class="logo"><span>Agència</span><span>Digital</span></h1>
          <p class="tagline">De Vic al món · Un joc de màrqueting i empresa</p>
          <div class="title-btns">
            ${has ? `<button class="btn big primary" data-act="continue">▶ Continuar partida <small>${has.player ? esc(has.player.name) + ' · ' : ''}${esc(has.agency)} · Nivell ${has.level}</small></button>` : ''}
            <button class="btn big ${has ? '' : 'primary'}" data-act="new">✦ Nova partida</button>
            <button class="btn" data-act="import">⇪ Importar partida</button>
            <button class="btn ghost install-btn" data-act="install" hidden>📲 Instal·lar com a app</button>
          </div>
          <p class="fine">Personatges, empreses i resultats de les campanyes són ficticis i simulats.</p>
        </div>
      </section>`;
    petals($('.title-petals'), 18);
    updateInstallBtn();
  }

  /* ================= Centre d'operacions (hub) ================= */
  let hubTab = 'campanya';
  function hubScreen(tab) {
    if (tab) hubTab = tab;
    S.cur = null; save();
    app().innerHTML = `
      <header id="hud"></header>
      <main class="hub">
        <div class="hub-body" id="hubBody"></div>
      </main>
      <nav class="tabs">
        ${[['campanya', '🗺️', 'Campanya'], ['pau', '🧑', esc(S.player.name)], ['encarrecs', '📨', 'Encàrrecs'], ['biblioteca', '📚', 'Biblioteca'], ['empresa', '🏢', 'Empresa']]
          .map(([k, i, n]) => `<button class="tab ${hubTab === k ? 'on' : ''}" data-tab="${k}"><span>${i}</span>${n}${k === 'pau' && S.sp ? `<em class="dot">${S.sp}</em>` : ''}</button>`).join('')}
      </nav>`;
    hud();
    const body = $('#hubBody');
    ({ campanya: tabCampanya, pau: tabPau, encarrecs: tabGigs, biblioteca: tabLibrary, empresa: tabEmpresa })[hubTab](body);
  }

  function chapterState(chId) {
    if (S.done[chId]) return 'done';
    const ch = GD.chapters[chId];
    const st = GD.stages.find(s => s.id === ch.stage);
    const idx = st.chapters.indexOf(chId);
    const prevStage = GD.stages.find(s => s.id === ch.stage - 1);
    if (prevStage && !prevStage.chapters.every(c => S.done[c])) return 'locked';
    if (S.level < st.minLevel) return 'level';
    if (idx > 0 && !S.done[st.chapters[idx - 1]]) return 'locked';
    return 'open';
  }

  function tabCampanya(el) {
    const next = Object.keys(GD.chapters).find(c => chapterState(c) === 'open');
    el.innerHTML = `
      ${S.ending ? `<div class="card ending-mini"><b>Has arribat a un final: ${esc(GD.endings[S.ending].title)}</b><p>Pots continuar en mode lliure amb els encàrrecs o començar una partida nova amb una altra estratègia.</p><button class="btn" data-act="showEnding">Tornar a veure el final</button></div>` : ''}
      ${next ? `<button class="next-mission" data-ch="${next}">
          <span class="nm-ava">${ART.portrait(GD.chapters[next].who || 'pau', 'n', { rank: rank() })}</span>
          <span class="nm-txt"><small>Següent missió · Capítol ${next}</small><b>${txt(GD.chapters[next].title)}</b><i>${txt(GD.chapters[next].blurb || '')}</i></span>
          <span class="nm-go">▶</span></button>` : ''}
      ${!next && !S.ending ? `<div class="card warn">${levelHint()}</div>` : ''}
      <div class="stages">
        ${GD.stages.map(st => {
          const done = st.chapters.filter(c => S.done[c]).length;
          const prevOk = st.id === 1 || GD.stages[st.id - 2].chapters.every(c => S.done[c]);
          const lock = !prevOk;
          return `<section class="stage ${lock ? 'locked' : ''} ${done === st.chapters.length ? 'complete' : ''}" style="--sc:${st.color}">
            <header><span class="st-num">${String(st.id).padStart(2, '0')}</span><div><h3>${txt(st.title)}</h3><p>${esc(st.sub)} · Nivells ${st.levels}</p></div><span class="st-prog">${done}/${st.chapters.length}</span></header>
            ${lock ? '<p class="lockmsg">🔒 Completa l\'etapa anterior per desbloquejar-la.</p>' : `<ol>${st.chapters.map(c => {
              const s = chapterState(c);
              return `<li class="ch ${s}"><button ${s === 'open' || s === 'done' ? `data-ch="${c}"` : 'disabled'}><span class="ch-id">${c}</span><span class="ch-t">${txt(GD.chapters[c].title)}</span><span class="ch-s">${s === 'done' ? '✔' : s === 'open' ? '▶' : s === 'level' ? `Nv ${st.minLevel}` : '🔒'}</span></button></li>`;
            }).join('')}</ol>`}
          </section>`;
        }).join('')}
      </div>`;
  }

  function levelHint() {
    const st = GD.stages.find(s => s.chapters.some(c => !S.done[c]));
    if (!st) return 'Has completat la campanya!';
    if (S.level < st.minLevel) return `🔒 L'etapa <b>${txt(st.title)}</b> requereix nivell ${st.minLevel}. Fes encàrrecs a la pestanya <b>📨 Encàrrecs</b> per guanyar experiència i diners.`;
    return 'Continua amb la següent missió.';
  }

  function tabPau(el) {
    const need = xpNeed(S.level);
    el.innerHTML = `
      <div class="sheet">
        <div class="sheet-ava">${ART.portrait('pau', S.sp ? 'h' : 'n', { rank: rank() })}<span class="rank-badge">${title()}</span></div>
        <div class="sheet-info">
          <h2>${txt('{nomc}')}</h2>
          <p class="muted">${S.f.profile && GD.profiles[S.f.profile] ? GD.profiles[S.f.profile].n : 'Perfil per definir'} · ${txt('{g:Director|Directora|Direcció}')} de ${esc(S.agency)}</p>
          <div class="lvl-big">Nivell <b>${S.level}</b><span class="xpbar big"><i style="width:${S.level >= MAX_LEVEL ? 100 : Math.round(S.xp / need * 100)}%"></i></span><small>${S.level >= MAX_LEVEL ? 'Nivell màxim' : `${S.xp} / ${need} EXP`}</small></div>
          <p class="sp ${S.sp ? 'has' : ''}">Punts d'habilitat disponibles: <b>${S.sp}</b></p>
          <p class="muted small">${txt('El vestuari {den} millora a mesura que completes etapes.')}</p>
          <button class="btn small" data-act="editAvatar">✏️ Canviar aspecte i nom</button>
        </div>
      </div>
      <h3 class="sec">Habilitats</h3>
      <div class="skills">
        ${Object.entries(SKILLS).map(([k, s]) => `
          <div class="skill">
            <div class="sk-h"><span class="sk-i">${s.i}</span><b>${s.n}</b><span class="pips">${Array.from({ length: SKILL_MAX }, (_, i) => `<i class="${i < S.skills[k] ? 'on' : ''}"></i>`).join('')}</span></div>
            <p>${s.d}</p>
            <button class="btn small" data-skill="${k}" ${S.sp && S.skills[k] < SKILL_MAX ? '' : 'disabled'}>${S.skills[k] >= SKILL_MAX ? 'Màxim' : '+ Millorar'}</button>
          </div>`).join('')}
      </div>
      <h3 class="sec">Coneixement per àrees</h3>
      <div class="know">${Object.entries(GD.areas).map(([k, n]) => `<div class="kn"><span>${n}</span><span class="kbar"><i style="width:${Math.min(100, (S.know[k] || 0) * 20)}%"></i></span><b>${S.know[k] || 0}</b></div>`).join('')}</div>`;
  }

  function tabLibrary(el) {
    const ids = Object.keys(GD.lessons);
    const byArea = {};
    ids.forEach(id => { const l = GD.lessons[id]; (byArea[l.area] = byArea[l.area] || []).push(id); });
    el.innerHTML = `<p class="muted">Les lliçons es desbloquegen durant les missions. Pots repassar-les i repetir-ne l'exercici quan vulguis.</p>
      ${Object.entries(GD.areas).map(([a, n]) => byArea[a] ? `
        <h3 class="sec">${n}</h3>
        <div class="lessons">${byArea[a].map(id => {
          const l = GD.lessons[id], r = S.lessons[id];
          return `<button class="lesson-card ${r ? '' : 'locked'}" ${r ? `data-lesson="${id}"` : 'disabled'}><b>${r ? esc(l.title) : '🔒 ' + esc(l.title)}</b><small>${r ? `Millor resultat: ${r.best}/${l.quiz.length}` : 'Es desbloqueja en una missió'}</small></button>`;
        }).join('')}</div>` : '').join('')}`;
  }

  function tabEmpresa(el) {
    const inc = weeklyIncome() * 4, cost = weeklyCost() * 4;
    el.innerHTML = `
      <div class="grid2">
        <div class="card"><h3>💶 Finances</h3>
          <dl class="kv"><dt>Liquiditat</dt><dd class="${S.money < 0 ? 'neg' : ''}">${eur(S.money)}</dd>
          <dt>Reserva per imprevistos</dt><dd>${eur(S.reserve)}</dd>
          <dt>Ingressos recurrents / mes</dt><dd>${eur(inc)}</dd>
          <dt>Despeses fixes / mes</dt><dd>${eur(cost)}</dd>
          <dt>Resultat recurrent / mes</dt><dd class="${inc - cost < 0 ? 'neg' : 'pos'}">${eur(inc - cost)}</dd>
          <dt>Ingressos acumulats</dt><dd>${eur(S.stats.income)}</dd>
          <dt>Despeses acumulades</dt><dd>${eur(S.stats.expenses)}</dd></dl>
          <p class="muted small">Recorda: el pressupost publicitari d'un client no és ingrés de l'agència. Només ho són els honoraris.</p>
          ${S.reserve > 0 ? `<button class="btn small" data-act="useReserve">Moure la reserva a liquiditat</button>` : ''}
        </div>
        <div class="card"><h3>🤝 Relacions</h3>
          ${CHARS_TRUST.filter(c => S.f['met_' + c]).map(c => `<div class="rel"><span class="rel-ava">${ART.portrait(c, S.trust[c] >= 3 ? 'h' : S.trust[c] < 0 ? 'w' : 'n')}</span><b>${GD.names[c]}</b><span class="hearts">${trustHearts(S.trust[c])}</span></div>`).join('') || '<p class="muted">Encara no coneixes ningú.</p>'}
        </div>
        <div class="card"><h3>📁 Clients recurrents</h3>
          ${S.clients.length ? `<ul class="list">${S.clients.map(c => `<li><b>${esc(c.name)}</b><span>${eur(c.fee)}/mes</span></li>`).join('')}</ul>` : '<p class="muted">Cap client recurrent encara.</p>'}
        </div>
        <div class="card"><h3>👥 Equip i estructura</h3>
          <ul class="list"><li><b>${txt('{nomc}')}</b><span>Direcció</span></li>${S.team.map(t => `<li><b>${esc(t.name)}</b><span>${eur(t.salary)}/mes</span></li>`).join('')}
          <li><b>Lloguer</b><span>${eur(S.rent)}/mes</span></li><li><b>Eines</b><span>${eur(S.tools)}/mes</span></li></ul>
        </div>
      </div>
      <div class="card"><h3>📜 Historial de decisions</h3>
        ${S.history.length ? `<ul class="history">${S.history.slice().reverse().map(h => `<li class="${h.key ? 'key' : ''}"><small>Cap. ${h.ch} · S${h.week}</small>${esc(h.t)}</li>`).join('')}</ul>` : '<p class="muted">Les teves decisions apareixeran aquí.</p>'}
      </div>
      <div class="card"><h3>🎓 Resultats per al professor</h3>
        <p class="small">Codi de classe: <b>${S.classe ? esc(S.classe) : '— cap —'}</b>${S.classe ? ` · ${S.syncPending ? '<span class="neg">pendent d\'enviar</span>' : S.lastSync ? 'enviat el ' + new Date(S.lastSync).toLocaleString('ca-ES') : 'encara no enviat'}` : ''}</p>
        <p class="muted small">Si poses el codi de classe que t'ha donat el professor, el teu nom i els resultats del joc s'envien automàticament cada vegada que acabes un capítol. Si no tens connexió, pots descarregar un fitxer i enviar-l'hi.</p>
        <div class="row-btns">
          <button class="btn small" data-act="setClass">🏷️ ${S.classe ? 'Canviar' : 'Posar'} codi de classe</button>
          ${S.classe ? '<button class="btn small primary" data-act="syncNow">📤 Enviar resultats ara</button>' : ''}
          <button class="btn small" data-act="downloadResults">⇩ Descarregar fitxer de resultats</button>
        </div>
      </div>
      <div class="card"><h3>⚙️ Partida</h3>
        <div class="row-btns">
          <button class="btn small" data-act="export">⇩ Exportar partida</button>
          <button class="btn small" data-act="import">⇪ Importar partida</button>
          <button class="btn small" data-act="speed">Velocitat del text: ${settings.speed <= 8 ? 'ràpida' : settings.speed <= 18 ? 'normal' : 'lenta'}</button>
          <button class="btn small install-btn" data-act="install" hidden>📲 Instal·lar app</button>
          <button class="btn small danger" data-act="reset">Esborrar partida</button>
          <button class="btn small ghost" data-act="title">Pantalla inicial</button>
        </div>
        <p class="muted small">La partida es desa automàticament en aquest dispositiu. Per continuar-la en un altre (web ↔ app), exporta-la i importa-la allà.</p>
      </div>`;
    updateInstallBtn();
  }
  function trustHearts(v) { if (v < 0) return '💔'.repeat(Math.min(3, -v)); return '♥'.repeat(Math.min(10, v)) + '<span class="empty">' + '♡'.repeat(Math.max(0, 5 - v)) + '</span>'; }

  /* ================= Encàrrecs lliures ================= */
  function curStage() { const st = GD.stages.find(s => s.chapters.some(c => !S.done[c])); return st ? st.id : 8; }
  function genGigs() {
    const st = curStage();
    const pool = GD.gigs.filter(g => (g.minStage || 1) <= st);
    const picks = [];
    const used = new Set();
    while (picks.length < 3 && used.size < pool.length) {
      const i = Math.floor(Math.random() * pool.length); if (used.has(i)) continue; used.add(i);
      const g = pool[i];
      picks.push({ id: g.id, pay: Math.round((g.pay || 180) * (0.8 + 0.25 * st) / 10) * 10, xp: 50 + 22 * st });
    }
    S.gigs = picks;
  }
  function tabGigs(el) {
    if (!S.gigs || !S.gigs.length) genGigs();
    el.innerHTML = `<p class="muted">Petits encàrrecs que arriben per recomanacions. Cada encàrrec dura una setmana, et fa guanyar experiència i diners, i posa a prova el que has après.</p>
      <div class="gigs">${S.gigs.map((g, i) => {
        const t = GD.gigs.find(x => x.id === g.id);
        return `<div class="gig card"><span class="gig-ava">${ART.portrait(t.who || 'client', 'n')}</span><div><b>${esc(t.title)}</b><p>${esc(t.intro)}</p><small>💶 ${eur(g.pay)} · ✨ ${g.xp} EXP · 1 setmana</small></div><button class="btn primary" data-gig="${i}">Acceptar</button></div>`;
      }).join('')}</div>
      <button class="btn ghost small" data-act="refreshGigs">↻ Buscar altres encàrrecs (−1 setmana)</button>`;
  }

  function playGig(i) {
    const g = S.gigs[i]; const t = GD.gigs.find(x => x.id === g.id);
    sceneShell(t.bg || 'despatx');
    showActors(t.who || 'client', 'n');
    const learned = Object.keys(S.lessons);
    const qPool = [];
    learned.forEach(id => GD.lessons[id].quiz.forEach(q => qPool.push({ id, q })));
    const extra = qPool.length ? qPool[Math.floor(Math.random() * qPool.length)] : null;
    panel(`<div class="pn-h"><b>${esc(t.title)}</b><small>Encàrrec</small></div><p>${esc(t.problem)}</p>
      <div class="opts">${t.opts.map((o, k) => `<button class="opt" data-k="${k}"><b>${esc(o.t)}</b></button>`).join('')}</div>`, (root) => {
      root.querySelectorAll('.opt').forEach(b => b.onclick = () => {
        const o = t.opts[+b.dataset.k];
        const ok = o.q >= 0.7;
        const mult = o.q >= 0.7 ? 1 : o.q >= 0.4 ? 0.6 : 0.3;
        const finish = (bonus) => {
          const money = Math.round(g.pay * mult);
          const xp = Math.round(g.xp * mult * bonus);
          applyFx({ money, fee: true, xp, rep: ok ? 1 : (o.q < 0.4 ? -1 : 0), know: { [t.area]: ok ? 1 : 0 } }, true);
          const w = advanceWeeks(1);
          S.stats.gigs++; queueSync();
          S.gigs.splice(i, 1);
          save();
          panel(`<div class="pn-h"><b>${ok ? '✨ Bona feina!' : o.q >= 0.4 ? '🙂 Correcte, però millorable' : '😓 No ha funcionat'}</b></div>
            <p>${esc(o.r)}</p>
            <dl class="kv"><dt>Honoraris cobrats</dt><dd>${eur(money * (1 + 0.05 * sk('comercial')))}</dd><dt>Experiència</dt><dd>+${xp} EXP</dd><dt>Balanç de la setmana</dt><dd>+${eur(w.inc)} / −${eur(w.cost)}</dd></dl>
            <button class="btn primary" data-act="hubGigs">Tornar al despatx</button>`);
        };
        if (extra) {
          const q = extra.q;
          panel(`<div class="pn-h"><b>Pregunta del client</b><small>Repàs: ${esc(GD.lessons[extra.id].title)}</small></div><p>${esc(t.opts[+b.dataset.k].t)} — d'acord. Però abans, una pregunta:</p><p class="quiz-q">${esc(q.q)}</p>
            <div class="opts">${q.o.map((x, k) => `<button class="opt" data-a="${k}">${esc(x)}</button>`).join('')}</div>`, (r2) => {
            r2.querySelectorAll('[data-a]').forEach(bb => bb.onclick = () => {
              const right = +bb.dataset.a === q.c;
              toast(right ? '✔ Resposta correcta: +50% EXP' : '✘ ' + esc(q.why), right ? 'good' : 'bad');
              finish(right ? 1.5 : 1);
            });
          });
        } else finish(1);
      });
    });
  }

  /* ================= Escenes ================= */
  let curCh = null;

  function sceneShell(bg) {
    app().innerHTML = `
      <header id="hud"></header>
      <section class="scene">
        <div class="bg" id="bg">${ART.background(bg)}</div>
        <div class="actors"><div class="actor left" id="actL"></div><div class="actor right" id="actR"></div></div>
        <div class="dlg" id="dlg" hidden><div class="dlg-name" id="dlgName"></div><div class="dlg-text" id="dlgText"></div><div class="dlg-next">▼</div></div>
        <div class="panel-wrap" id="panelWrap" hidden><div class="panel" id="panel"></div></div>
        <button class="scene-menu" data-act="sceneMenu" aria-label="Menú">☰</button>
      </section>`;
    hud();
  }
  function setBg(bg) { if (S && S.cur && bg) S.cur.bg = bg; const b = $('#bg'); if (b && bg && b.dataset.bg !== bg) { b.dataset.bg = bg; b.innerHTML = ART.background(bg); b.classList.remove('fade'); void b.offsetWidth; b.classList.add('fade'); } }

  let rightActor = null;
  function showActors(who, e) {
    const L = $('#actL'), R = $('#actR');
    if (!L) return;
    if (who === 'pau') {
      L.innerHTML = ART.portrait('pau', e, { rank: rank() }); L.className = 'actor left on';
      if (R.innerHTML) R.className = 'actor right dim';
    } else if (who) {
      if (rightActor !== who + e) { R.innerHTML = ART.portrait(who, e); rightActor = who + e; }
      R.className = 'actor right on';
      L.className = L.innerHTML ? 'actor left dim' : 'actor left';
    } else {
      L.className = L.innerHTML ? 'actor left dim' : 'actor left'; R.className = R.innerHTML ? 'actor right dim' : 'actor right';
    }
  }
  function clearRight() { const R = $('#actR'); if (R) { R.innerHTML = ''; R.className = 'actor right'; rightActor = null; } }

  function panel(html, bind) {
    const w = $('#panelWrap'), p = $('#panel');
    $('#dlg').hidden = true;
    p.innerHTML = html; w.hidden = false; p.scrollTop = 0;
    if (bind) bind(p);
  }
  function hidePanel() { const w = $('#panelWrap'); if (w) w.hidden = true; }

  // Diàleg amb efecte de màquina d'escriure
  function playLines(lines, done) {
    if (typeof lines === 'function') lines = lines(S, H);
    lines = (lines || []).filter(Boolean);
    hidePanel();
    let i = 0;
    const dlg = $('#dlg'), name = $('#dlgName'), text = $('#dlgText');
    let typing = null, full = '';
    function show() {
      if (i >= lines.length) { dlg.onclick = null; dlg.hidden = true; done(); return; }
      let [who, t] = lines[i];
      if (typeof who === 'function') who = who(S, H);
      let [c, e] = String(who || '').split('.');
      if (c === 'clear') { clearRight(); i++; show(); return; }
      if (c === 'bg') { setBg(t); i++; show(); return; }
      dlg.hidden = false;
      dlg.className = 'dlg ' + (c ? (c === 'pau' ? 'from-left' : 'from-right') : 'narrator');
      name.innerHTML = c ? txt(GD.names[c] || c) : '';
      name.hidden = !c;
      showActors(c, e || 'n');
      full = txt(t);
      text.innerHTML = '';
      let k = 0;
      clearInterval(typing);
      const plain = full;
      if (settings.speed <= 0) { text.innerHTML = plain; typing = null; return; }
      typing = setInterval(() => {
        k += 2;
        text.innerHTML = plain.slice(0, k).replace(/<[^>]*$/, '');
        if (k >= plain.length) { clearInterval(typing); typing = null; text.innerHTML = plain; }
      }, settings.speed);
    }
    dlg.onclick = () => {
      if (typing) { clearInterval(typing); typing = null; text.innerHTML = full; return; }
      i++; show();
    };
    show();
  }

  function startChapter(chId, resume) {
    const ch = GD.chapters[chId];
    curCh = ch;
    if (!resume || !S.cur || S.cur.id !== chId) S.cur = { id: chId, step: 0, run: null, cache: {} };
    if (S.done[chId] && !resume) S.cur.replay = true;
    runInit();
    rightActor = null;
    sceneShell((resume && S.cur.bg) || ch.bg || 'despatx');
    if (S.cur.step === 0) {
      // Targeta de títol del capítol
      const st = GD.stages.find(s => s.id === ch.stage);
      panel(`<div class="chapter-card" style="--sc:${st.color}"><small>Etapa ${st.id} · ${txt(st.title)}</small><h2><span>Capítol ${ch.id}</span>${txt(ch.title)}</h2>${ch.blurb ? `<p>${txt(ch.blurb)}</p>` : ''}<button class="btn primary big" id="go">Començar ▶</button></div>`, (p) => {
        p.querySelector('#go').onclick = () => runStep();
      });
      $('#panelWrap').classList.add('center');
    } else runStep();
  }

  function nextStep(label) {
    const steps = curCh.steps;
    if (label) {
      const idx = steps.findIndex(s => s.label === label);
      S.cur.step = idx >= 0 ? idx : S.cur.step + 1;
    } else S.cur.step++;
    save();
    runStep();
  }

  function runStep() {
    const w = $('#panelWrap'); if (w) w.classList.remove('center');
    const steps = curCh.steps;
    while (S.cur.step < steps.length && steps[S.cur.step].when && !steps[S.cur.step].when(S, H)) S.cur.step++;
    if (S.cur.step >= steps.length) return finishChapter();
    const st = steps[S.cur.step];
    if (st.bg) setBg(st.bg);
    const h = STEP[st.t];
    if (!h) { console.warn('Pas desconegut', st); return nextStep(); }
    h(st);
  }

  function reqOk(r) {
    if (!r) return true;
    if (typeof r === 'function') return r(S, H);
    if (r.skill) return sk(r.skill) >= r.min;
    if (r.flag) return !!S.f[r.flag];
    if (r.money) return S.money >= r.money;
    return true;
  }
  function reqLabel(r) {
    if (!r) return '';
    if (r.label) return r.label;
    if (r.skill) return `Requereix ${SKILLS[r.skill].n} ${r.min}`;
    if (r.money) return `Requereix ${eur(r.money)}`;
    return 'No disponible';
  }

  const STEP = {
    dlg(st) { playLines(st.lines, () => nextStep(st.go)); },
    fx(st) { applyFx(st.fx, st.silent); nextStep(st.go); },
    go(st) { nextStep(st.to); },

    input(st) {
      panel(`<div class="pn-h"><b>${txt(st.prompt)}</b></div>${st.help ? `<p class="muted">${txt(st.help)}</p>` : ''}
        <input class="inp" id="inp" maxlength="${st.max || 28}" value="${esc(S[st.key] || st.def || '')}" />
        <div class="sugg">${(st.sugg || []).map(s => `<button class="chipbtn">${esc(s)}</button>`).join('')}</div>
        <button class="btn primary" id="ok">Confirmar</button>`, (p) => {
        const inp = p.querySelector('#inp');
        p.querySelectorAll('.chipbtn').forEach(b => b.onclick = () => { inp.value = b.textContent; });
        p.querySelector('#ok').onclick = () => {
          const v = inp.value.trim(); if (!v) { inp.focus(); return; }
          S[st.key] = v; hud(); nextStep();
        };
      });
    },

    choice(st) {
      const opts = (typeof st.opts === 'function' ? st.opts(S, H) : st.opts).filter(o => !o.hide || !o.hide(S, H));
      if (st.who) showActors(st.who.split('.')[0], st.who.split('.')[1] || 'n');
      panel(`<div class="pn-h"><b>${txt(st.prompt)}</b>${st.sub ? `<small>${txt(st.sub)}</small>` : ''}</div>
        ${st.info ? `<div class="info">${txt(st.info)}</div>` : ''}
        <div class="opts">${opts.map((o, i) => {
          const ok = reqOk(o.req);
          return `<button class="opt ${ok ? '' : 'locked'}" data-i="${i}" ${ok ? '' : 'disabled'}><b>${txt(o.t)}</b>${o.d ? `<small>${txt(o.d)}</small>` : ''}${ok ? '' : `<em>🔒 ${reqLabel(o.req)}</em>`}${o.req && ok && o.req.skill ? `<em class="perk">${SKILLS[o.req.skill].i} ${SKILLS[o.req.skill].n}</em>` : ''}</button>`;
        }).join('')}</div>`, (p) => {
        p.querySelectorAll('.opt').forEach(b => b.onclick = () => {
          const o = opts[+b.dataset.i];
          if (st.key) S.f[st.key] = o.v != null ? o.v : +b.dataset.i;
          applyFx(o.fx);
          save();
          if (o.say) playLines(o.say, () => nextStep(o.go || st.go)); else nextStep(o.go || st.go);
        });
      });
    },

    invest(st) {
      const key = 'inv_' + S.cur.step;
      const used = S.cur.cache[key] = S.cur.cache[key] || [];
      const left = st.time - used.reduce((a, i) => a + (st.opts[i].cost || 1), 0);
      if (st.who) showActors(st.who, 'n');
      panel(`<div class="pn-h"><b>${txt(st.prompt)}</b><small>⏳ Temps disponible: ${'●'.repeat(Math.max(0, left))}${'○'.repeat(Math.max(0, st.time - left))}</small></div>
        ${st.info ? `<p class="muted">${txt(st.info)}</p>` : ''}
        <div class="opts">${st.opts.map((o, i) => {
          const done = used.includes(i); const ok = reqOk(o.req); const can = !done && ok && (o.cost || 1) <= left;
          return `<button class="opt ${done ? 'done' : ''} ${ok ? '' : 'locked'}" data-i="${i}" ${can ? '' : 'disabled'}><b>${done ? '✔ ' : '🔍 '}${txt(o.t)}</b>${done && o.note ? `<small>${txt(o.note)}</small>` : ''}${!ok ? `<em>🔒 ${reqLabel(o.req)}</em>` : ''}</button>`;
        }).join('')}</div>
        <button class="btn primary" id="enough">${left > 0 ? 'Ja en tinc prou' : 'Continuar'}</button>`, (p) => {
        p.querySelectorAll('.opt').forEach(b => b.onclick = () => {
          const i = +b.dataset.i, o = st.opts[i];
          used.push(i);
          if (o.flag) S.f[o.flag] = true;
          applyFx(o.fx, true);
          save();
          playLines(o.a, () => STEP.invest(st));
        });
        p.querySelector('#enough').onclick = () => { S.f[(st.key || key) + '_n'] = used.length; nextStep(); };
      });
    },

    lesson(st) { lessonFlow(st.id, true, () => nextStep()); },

    budget(st) {
      const alloc = Object.fromEntries(st.items.map(it => [it.id, 0]));
      const stepv = st.step || 50;
      const draw = (p) => {
        const used = Object.values(alloc).reduce((a, b) => a + b, 0);
        p.innerHTML = `<div class="pn-h"><b>${txt(st.prompt)}</b><small>Pressupost: ${eur(st.total)} · Per assignar: <b class="${used > st.total ? 'neg' : ''}">${eur(st.total - used)}</b></small></div>
          ${st.info ? `<p class="muted">${txt(st.info)}</p>` : ''}
          <div class="budget">${st.items.map(it => `<div class="bud"><div><b>${txt(it.t)}</b><small>${txt(it.d || '')}</small></div>
            <div class="bud-ctl"><button class="rb" data-m="${it.id}">−</button><span>${eur(alloc[it.id])}</span><button class="rb" data-p="${it.id}">+</button></div></div>`).join('')}</div>
          <button class="btn primary" id="ok" ${used === st.total || (st.allowLeft && used <= st.total) ? '' : 'disabled'}>${used === st.total || st.allowLeft ? 'Confirmar repartiment' : 'Has d\'assignar tot el pressupost'}</button>`;
        p.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { alloc[b.dataset.m] = Math.max(0, alloc[b.dataset.m] - stepv); draw(p); });
        p.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { if (used + stepv <= st.total) { alloc[b.dataset.p] += stepv; draw(p); } });
        p.querySelector('#ok').onclick = () => { S.f[st.key] = Object.assign({}, alloc); applyFx(st.fx); save(); nextStep(); };
      };
      panel('', draw);
    },

    multi(st) {
      const sel = new Set();
      const draw = (p) => {
        p.innerHTML = `<div class="pn-h"><b>${txt(st.prompt)}</b><small>Tria'n ${st.pick} · Seleccionades: ${sel.size}</small></div>
          ${st.info ? `<div class="info">${txt(st.info)}</div>` : ''}
          <div class="opts multi">${st.opts.map((o, i) => `<button class="opt ${sel.has(i) ? 'sel' : ''}" data-i="${i}"><b>${sel.has(i) ? '☑' : '☐'} ${txt(o.t)}</b></button>`).join('')}</div>
          <button class="btn primary" id="ok" ${sel.size === st.pick ? '' : 'disabled'}>Confirmar</button>`;
        p.querySelectorAll('.opt').forEach(b => b.onclick = () => {
          const i = +b.dataset.i;
          if (sel.has(i)) sel.delete(i); else if (sel.size < st.pick) sel.add(i);
          draw(p);
        });
        p.querySelector('#ok').onclick = () => {
          const chosen = [...sel];
          const good = chosen.filter(i => st.opts[i].ok).length;
          const maxGood = Math.min(st.pick, st.opts.filter(o => o.ok).length);
          S.f[st.key] = { chosen, good, max: maxGood, ids: chosen.map(i => st.opts[i].id).filter(Boolean) };
          if (st.fx) applyFx(st.fx(S, good, maxGood));
          save();
          // Retroacció de cada opció
          p.innerHTML = `<div class="pn-h"><b>${good === maxGood ? '✨ Perfecte!' : good >= maxGood / 2 ? '🙂 Força bé' : '🤔 Cal repassar-ho'}</b><small>${good} de ${maxGood} encerts</small></div>
            <ul class="feedback">${st.opts.map((o, i) => `<li class="${o.ok ? 'ok' : 'ko'} ${sel.has(i) ? 'picked' : ''}"><b>${sel.has(i) ? '☑' : '☐'} ${txt(o.t)}</b><small>${o.ok ? '✔' : '✘'} ${txt(o.why || '')}</small></li>`).join('')}</ul>
            <button class="btn primary" id="cont">Continuar</button>`;
          p.querySelector('#cont').onclick = () => nextStep();
        };
      };
      panel('', draw);
    },

    sim(st) {
      const key = 'sim_' + S.cur.step;
      let r = S.cur.cache[key];
      if (!r) { r = st.calc(S, H); S.cur.cache[key] = r; applyFx(r.fx); S.stats.campaigns++; if (r.verdict === 'good') S.stats.good++; save(); }
      const vcls = { good: 'good', mid: 'mid', bad: 'bad' }[r.verdict] || 'mid';
      panel(`<div class="pn-h"><b>📈 ${txt(r.title || 'Resultats')}</b><small>Resultats simulats</small></div>
        ${r.intro ? `<p>${txt(r.intro)}</p>` : ''}
        <div class="metrics">${(r.metrics || []).map(([l, v, cls]) => `<div class="metric ${cls || ''}"><small>${l}</small><b data-count>${v}</b></div>`).join('')}</div>
        ${r.chart ? chart(r.chart) : ''}
        <div class="verdict ${vcls}">${txt(r.summary || '')}</div>
        <h4>Per què ha passat?</h4>
        <ul class="factors">${(r.factors || []).map(([g, t]) => `<li class="${g === true ? 'ok' : g === false ? 'ko' : 'neu'}">${g === true ? '▲' : g === false ? '▼' : '●'} ${txt(t)}</li>`).join('')}</ul>
        <button class="btn primary" id="cont">Continuar</button>`, (p) => {
        p.querySelector('#cont').onclick = () => nextStep(r.go);
      });
    },

    reward(st) { finishChapter(st); },

    report() { reportScreen(() => nextStep()); },
    ending(st) {
      const id = GD.computeEnding(S, H);
      S.ending = id; S.done[curCh.id] = true; S.cur = null; queueSync();
      S.history.push({ ch: curCh.id, week: S.week, t: 'Final aconseguit: ' + GD.endings[id].title, key: true });
      save(); endingScreen(id, true);
    }
  };

  function chart(c) {
    // Gràfic de barres senzill: {labels:[], series:[{name, values:[], cls}]}
    const max = Math.max(1, ...c.series.flatMap(s => s.values));
    return `<div class="chart"><div class="chart-bars">${c.labels.map((l, i) => `<div class="cb"><div class="cb-col">${c.series.map(s => `<i class="${s.cls || ''}" style="height:${Math.round(s.values[i] / max * 100)}%" title="${s.name}: ${s.values[i]}"></i>`).join('')}</div><small>${l}</small></div>`).join('')}</div>
      <div class="chart-leg">${c.series.map(s => `<span><i class="${s.cls || ''}"></i>${s.name}</span>`).join('')}</div></div>`;
  }

  /* ================= Lliçons ================= */
  function lessonFlow(id, inMission, done) {
    const l = GD.lessons[id];
    if (!l) { done(); return; }
    const first = !S.lessons[id];
    const page = () => panel(`<div class="lesson">
        <div class="ls-h"><small>📚 Lliçó · ${GD.areas[l.area]}</small><h2>${esc(l.title)}</h2><p class="goal">🎯 ${esc(l.goal)}</p></div>
        ${l.body.map(b => `<p>${txt(b)}</p>`).join('')}
        ${l.example ? `<div class="example"><b>${l.exampleTitle || 'Exemple (cas simulat)'}</b><p>${txt(l.example)}</p></div>` : ''}
        ${l.errors ? `<div class="errors"><b>⚠️ Errors freqüents</b><ul>${l.errors.map(e => `<li>${e}</li>`).join('')}</ul></div>` : ''}
        ${l.source ? `<p class="source">Font: ${l.source}</p>` : ''}
        <button class="btn primary" id="quiz">Fer l'exercici ✍️</button>
        ${!inMission ? '<button class="btn ghost" id="back">Tornar a la biblioteca</button>' : ''}
      </div>`, (p) => {
      p.querySelector('#quiz').onclick = () => quiz(0, 0);
      const b = p.querySelector('#back'); if (b) b.onclick = done;
    });
    const quiz = (qi, score) => {
      if (qi >= l.quiz.length) {
        const pass = score >= Math.ceil(l.quiz.length / 2);
        const prev = S.lessons[id];
        // Registre per al professor: primer intent, millor resultat i nombre d'intents
        const ql = S.quizLog[id] || (S.quizLog[id] = { first: score, best: 0, tries: 0, total: l.quiz.length });
        ql.tries++; ql.best = Math.max(ql.best, score);
        queueSync();
        if (pass || !inMission) {
          S.lessons[id] = { best: Math.max(prev ? prev.best : 0, score), tries: (prev ? prev.tries : 0) + 1 };
          if (pass && first) applyFx({ xp: 20 + 15 * score, know: { [l.area]: 1 } }, true);
          save();
        }
        panel(`<div class="pn-h"><b>${score === l.quiz.length ? '🌸 Perfecte!' : pass ? '✔ Superat' : '✘ Encara no'}</b><small>${score} de ${l.quiz.length} respostes correctes</small></div>
          ${pass && first ? `<p class="good-t">+${20 + 15 * score} EXP · +1 coneixement en ${GD.areas[l.area]}</p>` : ''}
          ${!pass && inMission ? '<p>Necessites encertar almenys la meitat de les preguntes per aplicar-ho a la missió. Repassa la lliçó i torna-ho a provar.</p>' : ''}
          <div class="row-btns">${!pass && inMission ? '<button class="btn primary" id="retry">Repassar la lliçó</button>' : '<button class="btn primary" id="cont">Continuar</button>'}</div>`, (p) => {
          const r = p.querySelector('#retry'); if (r) r.onclick = page;
          const c = p.querySelector('#cont'); if (c) c.onclick = done;
        });
        return;
      }
      const q = l.quiz[qi];
      panel(`<div class="pn-h"><b>Exercici ${qi + 1}/${l.quiz.length}</b><small>${esc(l.title)}</small></div>
        <p class="quiz-q">${q.q}</p>
        <div class="opts">${q.o.map((o, i) => `<button class="opt" data-i="${i}">${o}</button>`).join('')}</div>`, (p) => {
        p.querySelectorAll('.opt').forEach(b => b.onclick = () => {
          const ok = +b.dataset.i === q.c;
          p.querySelectorAll('.opt').forEach((bb, i) => { bb.disabled = true; if (i === q.c) bb.classList.add('right'); });
          if (!ok) b.classList.add('wrong');
          const fb = document.createElement('div');
          fb.className = 'quiz-fb ' + (ok ? 'ok' : 'ko');
          fb.innerHTML = `<b>${ok ? '✔ Correcte' : '✘ Incorrecte'}</b><p>${q.why}</p><button class="btn primary">Següent</button>`;
          p.appendChild(fb);
          fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          fb.querySelector('button').onclick = () => quiz(qi + 1, score + (ok ? 1 : 0));
        });
      });
    };
    page();
  }

  /* ================= Final de capítol ================= */
  function finishChapter(st) {
    st = st || {};
    const ch = curCh;
    const replay = S.cur && S.cur.replay;
    if (!replay) {
      const val = (v) => typeof v === 'function' ? v(S, H) : v;
      const xp = st.xp != null ? val(st.xp) : (ch.xp != null ? ch.xp : 110 + 60 * ch.stage);
      applyFx({ xp, money: val(st.money), fee: true, rep: val(st.rep), flags: st.flags }, true);
      if (st.fx) applyFx(st.fx, true);
    }
    const w = replay ? { inc: 0, cost: 0, n: 0 } : advanceWeeks(ch.weeks != null ? ch.weeks : 2);
    const wasDone = S.done[ch.id];
    S.done[ch.id] = true;
    const run = RUN || { xp: 0, money: 0, rep: 0, trust: {}, know: {} };
    const stage = GD.stages.find(s => s.id === ch.stage);
    const stageComplete = !wasDone && stage.chapters.every(c => S.done[c]);
    S.cur = null;
    queueSync();
    S.gigs = []; // nous encàrrecs disponibles
    save();
    const summary = st.text ? txt(st.text) : '';
    sceneShell(ch.bg || 'despatx');
    showActors('pau', 'h');
    panel(`<div class="reward">
        <div class="rw-h"><small>Capítol ${ch.id} completat</small><h2>${txt(ch.title)}</h2></div>
        ${summary ? `<p>${summary}</p>` : ''}
        ${replay ? '<p class="muted">Mode repàs: aquesta partida ja tenia el capítol completat, no es tornen a sumar recompenses.</p>' : `
        <div class="metrics">
          <div class="metric good"><small>Experiència</small><b>+${run.xp}</b></div>
          <div class="metric ${run.money < 0 ? 'bad' : ''}"><small>Diners del capítol</small><b>${run.money >= 0 ? '+' : ''}${eur(run.money)}</b></div>
          <div class="metric ${run.rep < 0 ? 'bad' : 'good'}"><small>Reputació</small><b>${run.rep >= 0 ? '+' : ''}${run.rep}</b></div>
          <div class="metric"><small>${w.n} setmanes de despeses i quotes</small><b>${w.inc - w.cost >= 0 ? '+' : ''}${eur(w.inc - w.cost)}</b></div>
        </div>
        ${Object.keys(run.trust).length ? `<p class="trustline">${Object.entries(run.trust).map(([k, v]) => `<span class="${v >= 0 ? 'pos' : 'neg'}">${GD.names[k]} ${v >= 0 ? '♥ +' + v : '💔 ' + v}</span>`).join('')}</p>` : ''}`}
        ${stageComplete ? `<div class="stage-clear" style="--sc:${stage.color}"><b>🌸 Etapa ${stage.id} superada!</b><p>${txt(stage.outro || '')}</p><p>Nou rang: <b>${title()}</b></p></div>` : ''}
        <button class="btn primary big" data-act="hub">Tornar al centre d'operacions</button>
      </div>`);
    if (stageComplete) petals($('.scene'), 30);
    hud();
  }

  /* ================= Informe final i finals ================= */
  function reportScreen(done) {
    const t = S.trust;
    const best = Object.entries(S.know).sort((a, b) => b[1] - a[1]).slice(0, 3).filter(x => x[1] > 0).map(x => GD.areas[x[0]]);
    const keys = S.history.filter(h => h.key).slice(-8);
    panel(`<div class="report">
      <div class="ls-h"><small>Capítol 8.1</small><h2>Informe de tota una carrera</h2></div>
      <div class="metrics">
        <div class="metric"><small>Ingressos acumulats</small><b>${eur(S.stats.income)}</b></div>
        <div class="metric"><small>Despeses acumulades</small><b>${eur(S.stats.expenses)}</b></div>
        <div class="metric ${S.money < 0 ? 'bad' : 'good'}"><small>Liquiditat actual</small><b>${eur(S.money + S.reserve)}</b></div>
        <div class="metric"><small>Reputació</small><b>${S.rep}/100</b></div>
        <div class="metric"><small>Clients recurrents</small><b>${S.clients.length}</b></div>
        <div class="metric"><small>Equip</small><b>${S.team.length + 1} persones</b></div>
        <div class="metric"><small>Campanyes amb bon resultat</small><b>${S.stats.good}/${S.stats.campaigns}</b></div>
        <div class="metric"><small>Encàrrecs lliures</small><b>${S.stats.gigs}</b></div>
      </div>
      <p><b>Especialitats dominades:</b> ${best.join(', ') || '—'}</p>
      <p><b>Risc financer:</b> ${S.money + S.reserve < 0 ? 'Alt: l\'empresa té números vermells.' : S.money + S.reserve < weeklyCost() * 8 ? 'Mitjà: la liquiditat cobreix menys de dos mesos de despeses.' : 'Baix: hi ha coixí per fer front a imprevistos.'}</p>
      <h4>Relacions</h4>
      <p class="trustline">${CHARS_TRUST.filter(c => S.f['met_' + c]).map(c => `<span class="${t[c] >= 0 ? 'pos' : 'neg'}">${GD.names[c]} ${trustHearts(t[c])}</span>`).join('')}</p>
      <h4>Les decisions que han marcat la història</h4>
      <ul class="history">${keys.map(h => `<li class="key"><small>Cap. ${h.ch}</small>${esc(h.t)}</li>`).join('') || '<li>—</li>'}</ul>
      <button class="btn primary" id="cont">Continuar</button></div>`, (p) => { p.querySelector('#cont').onclick = done; });
  }

  function endingScreen(id, fresh) {
    const e = GD.endings[id];
    app().innerHTML = `<section class="ending">
      <div class="bg">${ART.background(e.bg || 'vic')}</div>
      <div class="ending-petals"></div>
      <div class="ending-box">
        <small>${fresh ? 'Final aconseguit' : 'El teu final'}</small>
        <h1>${esc(e.title)}</h1>
        <div class="ending-cast">${(e.cast || ['pau']).map(c => `<span>${c === 'pau' ? ART.portrait('pau', 'h', { rank: rank() }) : ART.portrait(c, S.trust[c] >= 2 ? 'h' : 'n')}</span>`).join('')}</div>
        ${e.text.map(p => `<p>${txt(p)}</p>`).join('')}
        ${(GD.epilogue(S, H) || []).map(p => `<p class="epi">${txt(p)}</p>`).join('')}
        <p class="muted">${txt('Habilitats {den}')}: ${Object.entries(SKILLS).map(([k, s]) => `${s.i} ${s.n} ${S.skills[k]}`).join(' · ')}</p>
        <div class="row-btns center"><button class="btn primary" data-act="hub">Mode lliure</button><button class="btn" data-act="new">Nova partida</button></div>
      </div></section>`;
    petals($('.ending-petals'), 30);
  }

  /* ================= Accions globals ================= */
  function confirmBox(msg, yes) {
    const d = document.createElement('div');
    d.className = 'modal';
    d.innerHTML = `<div class="modal-box"><p>${msg}</p><div class="row-btns"><button class="btn danger" id="y">Sí</button><button class="btn" id="n">Cancel·lar</button></div></div>`;
    document.body.appendChild(d);
    d.querySelector('#y').onclick = () => { d.remove(); yes(); };
    d.querySelector('#n').onclick = () => d.remove();
  }
  function textBox(title, value, onOk, okLabel) {
    const d = document.createElement('div');
    d.className = 'modal';
    d.innerHTML = `<div class="modal-box"><p><b>${title}</b></p><textarea class="inp" rows="5">${esc(value || '')}</textarea><div class="row-btns">${onOk ? `<button class="btn primary" id="y">${okLabel || 'Importar'}</button>` : '<button class="btn primary" id="cp">Copiar</button>'}<button class="btn" id="n">Tancar</button></div></div>`;
    document.body.appendChild(d);
    const ta = d.querySelector('textarea');
    if (!onOk) { ta.select(); d.querySelector('#cp').onclick = () => { ta.select(); try { navigator.clipboard.writeText(ta.value); toast('Codi copiat'); } catch (e) { document.execCommand('copy'); } }; }
    else d.querySelector('#y').onclick = () => { onOk(ta.value.trim()); d.remove(); };
    d.querySelector('#n').onclick = () => d.remove();
  }

  /* ================= Creació del personatge ================= */
  const normClass = (v) => String(v || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().trim().replace(/\s+/g, '-').replace(/[^A-Z0-9_-]/g, '').slice(0, 32);

  function setupScreen(editing) {
    const base = editing ? S : newState();
    const d = { name: editing ? S.player.name : '', surname: editing ? S.player.surname : '', g: base.player.g, classe: base.classe, look: JSON.parse(JSON.stringify(base.player.look)) };
    const O = ART.LOOK_OPTIONS;
    app().innerHTML = `<section class="setup">
      <div class="setup-preview"><div class="setup-ava" id="sAva"></div><p class="setup-example" id="sEx"></p></div>
      <div class="setup-form card">
        <h2>${editing ? 'Canvia el teu personatge' : 'Crea el teu personatge'}</h2>
        <div class="row2">
          <label>Nom<input class="inp" id="sName" maxlength="20" value="${esc(d.name)}" placeholder="Per exemple: Marta" autocomplete="given-name"></label>
          <label>Cognom <small>(opcional)</small><input class="inp" id="sSur" maxlength="24" value="${esc(d.surname)}" placeholder="Per exemple: Puig" autocomplete="family-name"></label>
        </div>
        <p class="lbl">Com vols que et tractin al joc?</p>
        <div class="seg" id="sG">${[['m', 'Masculí («en»)'], ['f', 'Femení («la»)'], ['n', 'Neutre (sense article)']].map(([k, n]) => `<button data-g="${k}">${n}</button>`).join('')}</div>
        <p class="lbl">Pentinat</p>
        <div class="styles" id="sStyle">${O.style.map(([k, n]) => `<button data-style="${k}" title="${n}"><span></span><small>${n}</small></button>`).join('')}</div>
        <p class="lbl">Color dels cabells</p>
        <div class="swatches" id="sHair">${O.hair.map(c => `<button data-hair="${c}" style="background:${c}" aria-label="Color ${c}"></button>`).join('')}</div>
        <p class="lbl">Color dels ulls</p>
        <div class="swatches" id="sEye">${O.eye.map(c => `<button data-eye="${c}" style="background:${c}" aria-label="Color ${c}"></button>`).join('')}</div>
        <p class="lbl">To de pell</p>
        <div class="swatches" id="sSkin">${O.skin.map(c => `<button data-skin="${c}" style="background:${c}" aria-label="To ${c}"></button>`).join('')}</div>
        <p class="lbl">Complement</p>
        <div class="seg" id="sAcc">${O.acc.map(([k, n]) => `<button data-acc="${k}">${n}</button>`).join('')}</div>
        <p class="lbl">Codi de classe <small>(opcional, te'l dona el professor)</small></p>
        <input class="inp" id="sClass" maxlength="32" value="${esc(d.classe)}" placeholder="Per exemple: 4ESO-B">
        <p class="muted small">Si poses un codi de classe, el teu nom i els resultats del joc s'enviaran al teu professor.</p>
        <div class="row-btns">
          <button class="btn primary big" id="sGo">${editing ? 'Desar canvis' : 'Començar l\'aventura ▶'}</button>
          <button class="btn ghost" id="sBack">${editing ? 'Cancel·lar' : 'Tornar'}</button>
        </div>
      </div></section>`;
    const draw = () => {
      ART.setPlayer(d.look);
      $('#sAva').innerHTML = ART.portrait('pau', 'h', { rank: editing ? rank() : 0 });
      const prevS = S; S = { player: { name: d.name || 'Pau', surname: d.surname, g: d.g }, agency: base.agency };
      $('#sEx').innerHTML = txt('«{En} torna a Vic amb una idea: muntar una agència de màrqueting digital.»');
      S = prevS;
      document.querySelectorAll('#sG [data-g]').forEach(b => b.classList.toggle('on', b.dataset.g === d.g));
      document.querySelectorAll('#sAcc [data-acc]').forEach(b => b.classList.toggle('on', (d.look.acc[0] || '') === b.dataset.acc));
      ['style', 'hair', 'eye', 'skin'].forEach(k => document.querySelectorAll(`[data-${k}]`).forEach(b => b.classList.toggle('on', b.dataset[k] === d.look[k])));
      document.querySelectorAll('#sStyle [data-style]').forEach(b => {
        const look = Object.assign({}, d.look, { style: b.dataset.style, acc: [] });
        ART.setPlayer(look); b.querySelector('span').innerHTML = ART.portrait('pau', 'n', { rank: 0 });
      });
      ART.setPlayer(d.look);
    };
    $('#sName').oninput = (e) => { d.name = e.target.value.trim(); draw(); };
    $('#sSur').oninput = (e) => { d.surname = e.target.value.trim(); draw(); };
    $('#sClass').oninput = (e) => { d.classe = e.target.value; };
    document.querySelector('.setup').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.g) d.g = b.dataset.g;
      else if (b.dataset.acc != null) d.look.acc = b.dataset.acc ? [b.dataset.acc] : [];
      else if (b.dataset.style) d.look.style = b.dataset.style;
      else if (b.dataset.hair) d.look.hair = b.dataset.hair;
      else if (b.dataset.eye) d.look.eye = b.dataset.eye;
      else if (b.dataset.skin) d.look.skin = b.dataset.skin;
      else return;
      draw();
    });
    $('#sBack').onclick = () => editing ? hubScreen('pau') : titleScreen();
    $('#sGo').onclick = () => {
      if (!d.name) { $('#sName').focus(); toast('Escriu el teu nom', 'bad'); return; }
      if (!editing) S = base;
      Object.assign(S.player, { name: d.name, surname: d.surname, g: d.g, look: d.look });
      const c = normClass(d.classe);
      if (c !== S.classe) { S.classe = c; S.lastSync = 0; }
      applyPlayer(); save(); queueSync();
      if (editing) { toast('Personatge actualitzat', 'good'); hubScreen('pau'); } else startChapter('1.1');
    };
    draw();
  }

  /* ================= Resultats per al professor ================= */
  function buildSummary() {
    const lessonIds = Object.keys(GD.lessons);
    const passed = lessonIds.filter(id => S.lessons[id]);
    const logs = Object.entries(S.quizLog || {});
    const avg = (f) => logs.length ? Math.round(logs.reduce((a, [, q]) => a + f(q) / q.total, 0) / logs.length * 100) : null;
    const curStageObj = GD.stages.find(s => s.chapters.some(c => !S.done[c]));
    return {
      v: 1, id: S.player.id, classe: S.classe,
      nom: S.player.name, cognom: S.player.surname || '', tractament: S.player.g,
      aspecte: S.player.look,
      agencia: S.agency, perfil: S.f.profile || '',
      actualitzat: new Date().toISOString(), iniciat: new Date(S.started).toISOString(),
      nivell: S.level, setmana: S.week,
      etapaActual: curStageObj ? curStageObj.id : 8, etapesCompletades: stagesDone(),
      capitolsCompletats: Object.keys(S.done).filter(c => GD.chapters[c]).length, capitolsTotal: Object.keys(GD.chapters).length,
      capitolActual: S.cur ? S.cur.id : '',
      llicons: Object.fromEntries(lessonIds.filter(id => S.quizLog && S.quizLog[id]).map(id => [id, Object.assign({ superada: !!S.lessons[id] }, S.quizLog[id])])),
      llicionsSuperades: passed.length, llicionsTotal: lessonIds.length,
      mitjanaPrimerIntent: avg(q => q.first), mitjanaMillor: avg(q => q.best),
      reputacio: S.rep, liquiditat: Math.round(S.money + S.reserve), clients: S.clients.length, equip: S.team.length + 1,
      cami: S.f.path || '', final: S.ending ? GD.endings[S.ending].title : '',
      habilitats: S.skills, coneixement: S.know, confianca: S.trust,
      encarrecs: S.stats.gigs, campanyes: S.stats.campaigns, campanyesBones: S.stats.good,
      decisions: S.history.filter(h => h.key).map(h => `Cap. ${h.ch}: ${h.t}`)
    };
  }
  let syncTimer = null;
  function queueSync() {
    if (!S || !S.classe) return;
    S.syncPending = true; save();
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => doSync(false), 1200);
  }
  async function doSync(manual) {
    if (!S || !S.classe) return;
    try {
      const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'submit', classe: S.classe, id: S.player.id, data: buildSummary() }) });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Error ' + r.status);
      S.syncPending = false; S.lastSync = Date.now(); save();
      if (manual) { toast('📤 Resultats enviats al professor', 'good'); if ($('.hub')) hubScreen('empresa'); }
    } catch (e) {
      if (manual) toast('No s\'han pogut enviar els resultats (' + esc(e.message || 'sense connexió') + '). Torna-ho a provar o descarrega el fitxer.', 'bad');
    }
  }
  function downloadResults() {
    const data = buildSummary();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    const nm = normClass((S.player.name + '-' + (S.player.surname || '')).replace(/-$/, '')).toLowerCase() || 'alumne';
    a.href = URL.createObjectURL(blob); a.download = `agencia-digital_${nm}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  window.addEventListener('online', () => { if (S && S.syncPending) doSync(false); });

  function newGame() {
    const go = () => setupScreen(false);
    if (loadSave()) confirmBox('Començar una partida nova esborrarà la partida desada. Vols continuar?', go); else go();
  }
  function continueGame() {
    S = loadSave();
    if (!S) return titleScreen();
    S = Object.assign(newState(), S);
    applyPlayer();
    if (S.syncPending) queueSync();
    if (S.cur && GD.chapters[S.cur.id]) startChapter(S.cur.id, true); else hubScreen('campanya');
  }

  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-act],[data-ch],[data-tab],[data-skill],[data-lesson],[data-gig]');
    if (!b || b.disabled) return;
    if (b.dataset.ch) { startChapter(b.dataset.ch); return; }
    if (b.dataset.tab) { hubScreen(b.dataset.tab); return; }
    if (b.dataset.skill) {
      const k = b.dataset.skill;
      if (S.sp > 0 && S.skills[k] < SKILL_MAX) { S.sp--; S.skills[k]++; save(); toast(`${SKILLS[k].i} ${SKILLS[k].n} puja a ${S.skills[k]}`, 'good'); hubScreen('pau'); }
      return;
    }
    if (b.dataset.lesson) { sceneShell('despatx'); showActors('pau', 't'); lessonFlow(b.dataset.lesson, false, () => hubScreen('biblioteca')); return; }
    if (b.dataset.gig != null) { playGig(+b.dataset.gig); return; }
    switch (b.dataset.act) {
      case 'new': newGame(); break;
      case 'continue': continueGame(); break;
      case 'hub': if (S.ending && $('.ending')) { hubScreen('campanya'); } else hubScreen(); break;
      case 'hubGigs': hubScreen('encarrecs'); break;
      case 'title': titleScreen(); break;
      case 'showEnding': endingScreen(S.ending, false); break;
      case 'refreshGigs': advanceWeeks(1); genGigs(); save(); hubScreen('encarrecs'); toast('Ha passat una setmana. Nous encàrrecs disponibles.'); break;
      case 'useReserve': S.money += S.reserve; S.reserve = 0; save(); hubScreen('empresa'); break;
      case 'export': textBox('Codi de la teva partida (copia\'l i enganxa\'l a l\'altre dispositiu):', btoa(unescape(encodeURIComponent(JSON.stringify(S))))); break;
      case 'import': textBox('Enganxa el codi de la partida:', '', (v) => {
        try { const d = JSON.parse(decodeURIComponent(escape(atob(v)))); if (!d || !d.v) throw 0; S = Object.assign(newState(), d); applyPlayer(); save(); toast('Partida importada', 'good'); hubScreen('campanya'); }
        catch (e) { toast('El codi no és vàlid', 'bad'); }
      }); break;
      case 'speed': settings.speed = settings.speed <= 8 ? 18 : settings.speed <= 18 ? 32 : 6; saveSettings(); hubScreen('empresa'); break;
      case 'reset': confirmBox('Segur que vols esborrar la partida? No es pot desfer.', () => { try { localStorage.removeItem(SAVE_KEY); } catch (e) { } S = null; titleScreen(); }); break;
      case 'install': doInstall(); break;
      case 'editAvatar': setupScreen(true); break;
      case 'syncNow': doSync(true); break;
      case 'downloadResults': downloadResults(); break;
      case 'setClass': textBox('Codi de classe (te\'l dona el professor):', S.classe, (v) => {
        S.classe = normClass(v); S.lastSync = 0; save();
        if (S.classe) { toast('Codi desat: ' + esc(S.classe), 'good'); doSync(true); } else hubScreen('empresa');
      }, 'Desar'); break;
      case 'sceneMenu': confirmBox('Vols sortir de la missió? El progrés de la missió es desa i la podràs reprendre.', () => { const c = S.cur; save(); hubScreen('campanya'); S.cur = c; save(); }); break;
    }
  });

  /* ================= Instal·lació com a app (PWA) ================= */
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; updateInstallBtn(); });
  function updateInstallBtn() {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    document.querySelectorAll('.install-btn').forEach(b => { b.hidden = standalone || !(deferredPrompt || /iphone|ipad|ipod/i.test(navigator.userAgent)); });
  }
  function doInstall() {
    if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.finally(() => { deferredPrompt = null; updateInstallBtn(); }); }
    else confirmBox('A l\'iPhone o iPad: toca el botó <b>Compartir</b> de Safari i després <b>«Afegeix a la pantalla d\'inici»</b>.', () => { });
  }
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { }));
  }

  // Represa d'una missió interrompuda des del hub
  const _hub = hubScreen;
  hubScreen = function (tab) {
    const pending = S && S.cur && GD.chapters[S.cur.id] ? S.cur : null;
    _hub(tab);
    if (pending) { S.cur = pending; save(); const nm = document.querySelector('.next-mission'); if (nm) { nm.dataset.resume = '1'; } }
  };
  document.addEventListener('click', (ev) => {
    const nm = ev.target.closest('.next-mission[data-resume]');
    if (nm && S.cur && S.cur.id === nm.dataset.ch) { ev.stopImmediatePropagation(); startChapter(S.cur.id, true); }
  }, true);

  loadSettings();
  window.GAME = { get S() { return S; }, startChapter, hubScreen };
  titleScreen();
})();
