/* Agència Digital — panell del professor: consulta i exportació dels resultats dels alumnes */
(function () {
  'use strict';
  const API = '/.netlify/functions/joc-resultats';
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const LESSONS = Object.keys(GD.lessons);
  const PKEY = 'agencia-digital-professor';

  let rows = new Map(); // clau "classe/id" → resum
  let cfg = null;       // configuració de la classe carregada: { classe, grants, deadlines, extensions }
  let sortKey = 'classe', sortDir = 1;

  function toast(msg, cls) {
    const t = document.createElement('div'); t.className = 'toast ' + (cls || ''); t.innerHTML = msg;
    $('#toasts').appendChild(t); setTimeout(() => t.remove(), 3500);
  }
  const normClass = (v) => String(v || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().trim().replace(/\s+/g, '-').replace(/[^A-Z0-9_-]/g, '').slice(0, 32);
  const fullName = (r) => `${r.nom || ''} ${r.cognom || ''}`.trim() || T('(sense nom)');
  const pctTxt = (v) => v == null ? '—' : v + ' %';
  const dateTxt = (d) => d ? new Date(d).toLocaleString(LOCALE, { dateStyle: 'short', timeStyle: 'short' }) : '—';
  const dayTxt = (d) => d ? new Date(d + 'T12:00:00').toLocaleDateString(LOCALE, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  // Data d'entrega d'un alumne per a un nivell: la pròrroga si en té, si no la de la classe.
  const dueFor = (r, n) => (cfg && cfg.classe === r.classe) ? ((cfg.extensions[r.id] || {})[n] || cfg.deadlines[n] || null) : null;
  const isLate = (r, n, w) => { const d = dueFor(r, n); return !!(d && w && w.at && new Date(w.at) > new Date(d + 'T23:59:59')); };
  const lateCount = (r) => (cfg && cfg.classe === r.classe) ? GD.webLevels.filter(L => isLate(r, L.n, (r.webs || {})[L.n])).length : (r.websFora || 0);
  const avatar = (r) => { ART.setPlayer(r.aspecte); return ART.portrait('pau', 'n', { rank: Math.min(4, Math.floor((r.etapesCompletades || 0) / 2)) }); };

  function add(list, source) {
    let n = 0;
    list.forEach(r => {
      if (!r || !r.id) return;
      const k = `${r.classe || '—'}/${r.id}`;
      const prev = rows.get(k);
      if (!prev || new Date(r.actualitzat) >= new Date(prev.actualitzat)) { rows.set(k, Object.assign({}, r, { _font: source })); n++; }
    });
    render();
    return n;
  }

  const COLS = [
    ['alumne', T('Alumne'), r => fullName(r).toLowerCase()],
    ['classe', T('Classe'), r => r.classe || ''],
    ['nivell', T('Nivell'), r => r.nivell || 0],
    ['etapa', T('Etapa'), r => r.etapaActual || 0],
    ['capitols', T('Capítols'), r => r.capitolsCompletats || 0],
    ['llicons', T('Lliçons superades'), r => r.llicionsSuperades || 0],
    ['primer', T('1r intent'), r => r.mitjanaPrimerIntent || 0],
    ['millor', T('Millor'), r => r.mitjanaMillor || 0],
    ['webs', T('Webs'), r => r.websEntregades || 0],
    ['rep', T('Reputació'), r => r.reputacio || 0],
    ['diners', T('Liquiditat'), r => r.liquiditat || 0],
    ['final', T('Final'), r => r.final || ''],
    ['data', T('Actualitzat'), r => r.actualitzat || '']
  ];

  function render() {
    const list = [...rows.values()];
    const col = COLS.find(c => c[0] === sortKey) || COLS[1];
    list.sort((a, b) => { const x = col[2](a), y = col[2](b); return (x > y ? 1 : x < y ? -1 : fullName(a).localeCompare(fullName(b))) * sortDir; });
    $('#csv').disabled = !list.length;
    const avg = (f) => { const v = list.map(f).filter(x => x != null); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : '—'; };
    $('#stats').innerHTML = list.length ? `
      <div class="metric"><small>${T("Alumnes")}</small><b>${list.length}</b></div>
      <div class="metric"><small>${T("Nivell mitjà")}</small><b>${avg(r => r.nivell)}</b></div>
      <div class="metric"><small>${T("Capítols mitjans")}</small><b>${avg(r => r.capitolsCompletats)} / ${list[0].capitolsTotal || 37}</b></div>
      <div class="metric"><small>${T("Lliçons: 1r intent")}</small><b>${avg(r => r.mitjanaPrimerIntent)} %</b></div>
      <div class="metric"><small>${T("Han acabat el joc")}</small><b>${list.filter(r => r.final).length}</b></div>` : '';
    if (!list.length) { $('#tbl').innerHTML = T('<tr><td class="empty">Encara no hi ha resultats. Introdueix la contrasenya o afegeix fitxers d\'alumnes.</td></tr>'); return; }
    $('#tbl').innerHTML = `<thead><tr>${COLS.map(c => `<th data-sort="${c[0]}">${c[1]}${sortKey === c[0] ? (sortDir > 0 ? ' ▲' : ' ▼') : ''}</th>`).join('')}<th></th></tr></thead>
      <tbody>${list.map(r => {
        const k = `${r.classe || '—'}/${r.id}`;
        const cp = Math.round((r.capitolsCompletats || 0) / (r.capitolsTotal || 37) * 100);
        return `<tr>
          <td><span class="ava-s">${avatar(r)}</span><b>${esc(fullName(r))}</b><br><small class="muted">${esc(r.agencia || '')}</small></td>
          <td>${esc(r.classe || '')} ${r._font === 'fitxer' ? T('<span class="tag file">fitxer</span>') : ''}</td>
          <td><b>${r.nivell || 1}</b></td>
          <td>${r.etapaActual || 1} / 8</td>
          <td><span class="bar"><i style="width:${cp}%"></i></span>${r.capitolsCompletats || 0}</td>
          <td>${r.llicionsSuperades || 0} / ${r.llicionsTotal || LESSONS.length}</td>
          <td>${pctTxt(r.mitjanaPrimerIntent)}</td>
          <td>${pctTxt(r.mitjanaMillor)}</td>
          <td>${r.websEntregades ? `<b>${r.websEntregades}</b>/${GD.webLevels.length}${lateCount(r) ? ` <span class="late" title="${T('Fora de termini')}">⚠️${lateCount(r)}</span>` : ''}` : '—'}</td>
          <td>${r.reputacio ?? '—'}</td>
          <td>${r.liquiditat != null ? r.liquiditat.toLocaleString(LOCALE) + ' €' : '—'}</td>
          <td>${esc(r.final ? r.final.replace(/^\S+ \d — /, '') : '—')}</td>
          <td><small>${dateTxt(r.actualitzat)}</small></td>
          <td style="white-space:nowrap"><button class="btn small" data-detail="${esc(k)}">${T("Detall")}</button> ${r._font === 'servidor' ? `<button class="btn small danger" data-del="${esc(k)}" title="Esborrar">✕</button>` : ''}</td>
        </tr>`;
      }).join('')}</tbody>`;
  }

  function detail(k) {
    const r = rows.get(k); if (!r) return;
    const canEdit = !!(cfg && cfg.classe === r.classe && r._font === 'servidor');
    const d = document.createElement('div'); d.className = 'modal';
    const ll = r.llicons || {};
    d.innerHTML = `<div class="modal-box wide">
      <div class="detail-h"><span class="ava-s">${avatar(r)}</span><div><h2 style="margin:0">${esc(fullName(r))}</h2><p class="muted" style="margin:0">${esc(r.classe || '')} · ${esc(r.agencia || '')} ${T("· Nivell")} ${r.nivell} ${T("· Camí")} ${esc(r.cami || '—')}</p></div></div>
      <div class="metrics">
        <div class="metric"><small>${T("Capítols")}</small><b>${r.capitolsCompletats} / ${r.capitolsTotal}</b></div>
        <div class="metric"><small>${T("Lliçons superades")}</small><b>${r.llicionsSuperades} / ${r.llicionsTotal}</b></div>
        <div class="metric"><small>${T("Mitjana 1r intent")}</small><b>${pctTxt(r.mitjanaPrimerIntent)}</b></div>
        <div class="metric"><small>${T("Campanyes bones")}</small><b>${r.campanyesBones || 0} / ${r.campanyes || 0}</b></div>
        <div class="metric"><small>${T("Encàrrecs fets")}</small><b>${r.encarrecs || 0}</b></div>
        <div class="metric"><small>${T("Final")}</small><b style="font-size:.9em">${esc(r.final || T('Encara no'))}</b></div>
      </div>
      <h4>${T("📚 Lliçons")}</h4>
      <table class="tbl"><thead><tr><th>${T("Lliçó")}</th><th>${T("Àrea")}</th><th>${T("1r intent")}</th><th>${T("Millor")}</th><th>${T("Intents")}</th></tr></thead><tbody>
        ${LESSONS.map(id => { const q = ll[id], l = GD.lessons[id]; return `<tr><td>${esc(l.title)}</td><td><small>${esc(GD.areas[l.area])}</small></td><td>${q ? q.first + '/' + q.total : '—'}</td><td>${q ? q.best + '/' + q.total : '—'}</td><td>${q ? q.tries : 0}</td></tr>`; }).join('')}
      </tbody></table>
      <h4>${T('🛠️ Taller web')}</h4>
      ${(r.webPlataformes || []).length ? `<p class="small">${T('Plataformes triades:')} ${r.webPlataformes.map(k => esc(GD.webPlatforms[k] ? GD.webPlatforms[k].n : k)).join(', ')}</p>` : ''}
      ${canEdit ? `<p class="muted small">${T('Pots donar més temps a aquest alumne: posa-li una data nova (pròrroga) a la columna «Entrega». Si la deixes buida, torna a tenir la data de la classe.')}</p>` : ''}
      <table class="tbl"><thead><tr><th>${T('Nivell')}</th><th>${T('Encàrrec')}</th><th>${T('Plataforma')}</th><th>${T('Enllaç')}</th><th>${T('Entrega')}</th></tr></thead><tbody>
        ${GD.webLevels.map(L => { const w = (r.webs || {})[L.n]; const due = dueFor(r, String(L.n)); const ext = canEdit && (cfg.extensions[r.id] || {})[L.n]; return `<tr><td>${L.n}</td><td>${esc(L.title)}${w && w.reflection ? `<br><small class="muted">${esc(w.reflection)}</small>` : ''}${w && w.note ? `<br><small>📝 ${esc(w.note)}</small>` : ''}</td><td>${w ? esc(GD.webPlatforms[w.platform] ? GD.webPlatforms[w.platform].n : w.platform) : '—'}</td><td>${w ? `<a href="${/^https?:\/\//i.test(w.url) ? esc(w.url) : '#'}" target="_blank" rel="noopener">${esc(w.url)}</a>${w.reachable === false ? ' ⚠️' : ''}<br><small class="muted">${T('Entregada el {0}', [dateTxt(w.at)])}</small>` : '—'}</td>
          <td>${due ? `${dayTxt(due)}${ext ? ` <small class="muted">(${T('pròrroga')})</small>` : ''}${w ? (isLate(r, String(L.n), w) ? `<br><span class="late">⚠️ ${T('Fora de termini')}</span>` : `<br><span class="ontime">✔ ${T('A temps')}</span>`) : ''}` : '—'}
            ${canEdit ? `<br><input class="inp" type="date" data-ext="${L.n}" value="${esc(ext || '')}" style="margin-top:4px;padding:4px 6px" title="${T('Pròrroga per a aquest alumne')}">` : ''}</td></tr>`; }).join('')}
      </tbody></table>
      ${(r.dinersProfessor || 0) ? `<p class="small">💶 ${T('Diners rebuts del professor: {0}', [`<b>${(r.dinersProfessor || 0).toLocaleString(LOCALE)} €</b>`])}</p>` : ''}
      <h4>${T("🧭 Habilitats i coneixement")}</h4>
      <p class="small">${Object.entries(r.habilitats || {}).map(([k, v]) => `${esc(k)}: <b>${v}</b>`).join(' · ')}</p>
      <p class="small">${Object.entries(r.coneixement || {}).filter(([, v]) => v).map(([k, v]) => `${esc(GD.areas[k] || k)}: <b>${v}</b>`).join(' · ') || '—'}</p>
      <h4>${T("📜 Decisions clau")}</h4>
      <ul class="history">${(r.decisions || []).map(t => `<li class="key">${esc(t)}</li>`).join('') || '<li>—</li>'}</ul>
      <div class="row-btns"><button class="btn primary" id="close">${T("Tancar")}</button></div></div>`;
    document.body.appendChild(d);
    d.querySelectorAll('[data-ext]').forEach(inp => inp.onchange = async () => {
      try {
        const { config } = await api({ action: 'extension', password: $('#pw').value, classe: r.classe, id: r.id, level: inp.dataset.ext, date: inp.value });
        cfg = Object.assign({ classe: r.classe }, config);
        toast(inp.value ? T('Pròrroga desada: {0}', [dayTxt(inp.value)]) : T('Pròrroga treta'), 'good');
        d.remove(); detail(k); render();
      } catch (err) { toast(esc(err.message), 'bad'); }
    });
    d.querySelector('#close').onclick = () => d.remove();
    d.onclick = (e) => { if (e.target === d) d.remove(); };
  }

  // ---------- Gestió de la classe: diners i dates d'entrega ----------
  function renderMgmt() {
    const box = $('#mgmt');
    if (!cfg) {
      box.hidden = !$('#pw').value;
      box.innerHTML = `<h3>${T('🎓 Gestió de la classe')}</h3><p class="muted">${T('Escriu un codi de classe a dalt i prem «Veure resultats» per donar diners als alumnes o posar les dates d\'entrega.')}</p>`;
      return;
    }
    box.hidden = false;
    const students = [...rows.values()].filter(r => r.classe === cfg.classe && r._font === 'servidor').sort((a, b) => fullName(a).localeCompare(fullName(b)));
    const grants = [...cfg.grants].reverse();
    box.innerHTML = `<h3>${T('🎓 Gestió de la classe {0}', [esc(cfg.classe)])}</h3>
      <div class="mgmt">
        <div>
          <h4>${T('💶 Donar diners')}</h4>
          <div class="form-row">
            <label>${T('Per a')}<select class="inp" id="gTo"><option value="*">${T('Tota la classe')}</option>${students.map(r => `<option value="${esc(r.id)}">${esc(fullName(r))}</option>`).join('')}</select></label>
            <label>${T('Quantitat (€)')}<input class="inp" id="gAmt" type="number" min="1" max="100000" step="50" value="500"></label>
          </div>
          <div class="form-row" style="margin-top:8px">
            <label>${T('Motiu (opcional, el veurà l\'alumne)')}<input class="inp" id="gWhy" maxlength="120" placeholder="${T('Per exemple: premi a la millor presentació')}"></label>
            <button class="btn primary" id="gGo">${T('Donar')}</button>
          </div>
          <p class="muted small">${T('Els alumnes reben els diners al joc la propera vegada que l\'obren amb connexió. Si dones diners a tota la classe, també els rebran els que s\'hi apuntin més tard.')}</p>
          ${grants.length ? `<table class="tbl"><thead><tr><th>${T('Data')}</th><th>${T('Per a')}</th><th>${T('Quantitat')}</th><th>${T('Motiu')}</th><th></th></tr></thead><tbody>
            ${grants.map(g => `<tr><td><small>${dateTxt(g.at)}</small></td><td>${g.to === '*' ? `<b>${T('Tota la classe')}</b>` : esc(g.toName || g.to)}</td><td><b>${(g.amount).toLocaleString(LOCALE)} €</b></td><td><small>${esc(g.reason || '—')}</small></td><td><button class="btn small danger" data-gdel="${esc(g.gid)}" title="${T('Anul·lar (només per als alumnes que encara no els han rebut)')}">✕</button></td></tr>`).join('')}
          </tbody></table>` : `<p class="muted small">${T('Encara no has donat diners a aquesta classe.')}</p>`}
        </div>
        <div>
          <h4>${T('📅 Dates d\'entrega del Taller web')}</h4>
          <table class="tbl"><thead><tr><th>${T('Nivell')}</th><th>${T('Encàrrec')}</th><th>${T('Data d\'entrega')}</th></tr></thead><tbody>
            ${GD.webLevels.map(L => `<tr><td>${L.n}</td><td><small>${esc(L.title)}</small></td><td><input class="inp" type="date" data-due="${L.n}" value="${esc(cfg.deadlines[L.n] || '')}" style="margin:0;padding:4px 6px"></td></tr>`).join('')}
          </tbody></table>
          <div class="row-btns"><button class="btn primary" id="dSave">${T('Desar les dates')}</button></div>
          <p class="muted small">${T('Es pot entregar fins a les 23:59 del dia indicat. Deixa-la buida si no hi ha data. Per donar més temps a un sol alumne, obre\'n el «Detall».')}</p>
        </div>
      </div>`;
    box.querySelector('#gGo').onclick = async () => {
      const amount = Math.round(Number(box.querySelector('#gAmt').value));
      const to = box.querySelector('#gTo').value;
      const toName = to === '*' ? '' : box.querySelector('#gTo').selectedOptions[0].textContent;
      if (!(amount >= 1 && amount <= 100000)) { toast(T('Escriu una quantitat entre 1 i 100.000 €.'), 'bad'); return; }
      const who = to === '*' ? T('tota la classe {0}', [cfg.classe]) : toName;
      if (!confirm(T('Vols donar {0} € a {1}?', [amount.toLocaleString(LOCALE), who]))) return;
      try {
        const { config } = await api({ action: 'grant', password: $('#pw').value, classe: cfg.classe, to, toName, amount, reason: box.querySelector('#gWhy').value });
        cfg = Object.assign({ classe: cfg.classe }, config); renderMgmt();
        toast(T('💶 Fet: {0} € per a {1}', [amount.toLocaleString(LOCALE), esc(who)]), 'good');
      } catch (err) { toast(esc(err.message), 'bad'); }
    };
    box.querySelectorAll('[data-gdel]').forEach(b => b.onclick = async () => {
      if (!confirm(T('Vols anul·lar aquest ingrés? Els alumnes que ja l\'han rebut el conservaran.'))) return;
      try { const { config } = await api({ action: 'grant-delete', password: $('#pw').value, classe: cfg.classe, gid: b.dataset.gdel }); cfg = Object.assign({ classe: cfg.classe }, config); renderMgmt(); }
      catch (err) { toast(esc(err.message), 'bad'); }
    });
    box.querySelector('#dSave').onclick = async () => {
      const deadlines = {};
      box.querySelectorAll('[data-due]').forEach(i => { if (i.value) deadlines[i.dataset.due] = i.value; });
      try {
        const { config } = await api({ action: 'deadlines', password: $('#pw').value, classe: cfg.classe, deadlines });
        cfg = Object.assign({ classe: cfg.classe }, config); renderMgmt(); render();
        toast(T('📅 Dates desades. Els alumnes les veuran al Taller web.'), 'good');
      } catch (err) { toast(esc(err.message), 'bad'); }
    };
  }

  async function api(body) {
    const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'Error ' + r.status);
    return j;
  }

  async function load() {
    const pw = $('#pw').value; const classe = normClass($('#cls').value);
    $('#cls').value = classe;
    if (!pw) { $('#pw').focus(); return; }
    $('#msg').innerHTML = T('Carregant…');
    try {
      const { results } = await api({ action: 'list', password: pw, classe });
      try { sessionStorage.setItem(PKEY, JSON.stringify({ pw, classe })); } catch (e) { }
      [...rows.keys()].forEach(k => { if (rows.get(k)._font === 'servidor') rows.delete(k); });
      add(results, 'servidor');
      cfg = null;
      if (classe) { const { config } = await api({ action: 'config', password: pw, classe }); cfg = Object.assign({ classe }, config); }
      renderMgmt(); render();
      $('#msg').innerHTML = `<span class="pos">✔ ${T(results.length === 1 ? '{0} alumne' : '{0} alumnes', [results.length])} ${classe ? T('a la classe ') + esc(classe) : T('en total')}.</span>`;
    } catch (e) { $('#msg').innerHTML = `<span class="err">${esc(e.message)}</span>`; }
  }

  // CSV per a Excel: separador «;», BOM UTF-8 i una columna per lliçó
  function exportCsv() {
    const list = [...rows.values()].sort((a, b) => (a.classe || '').localeCompare(b.classe || '') || fullName(a).localeCompare(fullName(b)));
    const head = [T('Classe'), T('Nom'), T('Cognom'), T('Agència'), T('Perfil'), T('Nivell'), T('Etapa actual'), T('Etapes completades'), T('Capítols completats'), T('Capítols totals'), T('Capítol en curs'),
      T('Lliçons superades'), T('Lliçons totals'), T('Mitjana 1r intent (%)'), T('Mitjana millor (%)'), T('Reputació'), T('Liquiditat (€)'), T('Clients'), T('Equip'), T('Camí'), T('Final'),
      T('Campanyes bones'), T('Campanyes'), T('Encàrrecs'), T('Setmana de joc'), T('Iniciat'), T('Darrera actualització'), T('Decisions clau'), T('Webs entregades'), T('Plataformes web'), T('Webs fora de termini'), T('Diners del professor (€)'),
      ...GD.webLevels.flatMap(L => [T('Web {0} · plataforma', [L.n]), T('Web {0} · enllaç', [L.n]), T('Web {0} · entregada', [L.n]), T('Web {0} · data d\'entrega', [L.n]), T('Web {0} · fora de termini', [L.n])]),
      ...LESSONS.flatMap(id => [T("{0} · 1r intent", [GD.lessons[id].title]), T("{0} · millor", [GD.lessons[id].title])])];
    const cell = (v) => { const s = v == null ? '' : String(v); return /[;"\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const lines = [head.map(cell).join(';')];
    list.forEach(r => {
      const ll = r.llicons || {};
      lines.push([r.classe, r.nom, r.cognom, r.agencia, r.perfil, r.nivell, r.etapaActual, r.etapesCompletades, r.capitolsCompletats, r.capitolsTotal, r.capitolActual,
        r.llicionsSuperades, r.llicionsTotal, r.mitjanaPrimerIntent, r.mitjanaMillor, r.reputacio, r.liquiditat, r.clients, r.equip, r.cami, r.final,
        r.campanyesBones, r.campanyes, r.encarrecs, r.setmana, dateTxt(r.iniciat), dateTxt(r.actualitzat), (r.decisions || []).join(' | '), r.websEntregades || 0, (r.webPlataformes || []).join(', '), lateCount(r), r.dinersProfessor || 0,
        ...GD.webLevels.flatMap(L => { const w = (r.webs || {})[L.n]; const due = dueFor(r, String(L.n)); return [w ? w.platform : '', w ? w.url : '', w ? dateTxt(w.at) : '', due || '', w && due ? (isLate(r, String(L.n), w) ? T('Sí') : T('No')) : '']; }),
        ...LESSONS.flatMap(id => ll[id] ? [`${ll[id].first}/${ll[id].total}`, `${ll[id].best}/${ll[id].total}`] : ['', ''])].map(cell).join(';'));
    });
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    const cls = normClass($('#cls').value);
    a.href = URL.createObjectURL(blob);
    a.download = `agencia-digital_resultats${cls ? '_' + cls : ''}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
  }

  $('#load').onclick = load;
  $('#pw').onkeydown = $('#cls').onkeydown = (e) => { if (e.key === 'Enter') load(); };
  $('#csv').onclick = exportCsv;
  $('#files').onchange = async (e) => {
    const list = [];
    for (const f of e.target.files) {
      try { const j = JSON.parse(await f.text()); if (j && j.id) list.push(j); else throw 0; }
      catch (err) { toast(T("El fitxer {0} no és un fitxer de resultats vàlid", [esc(f.name)]), 'bad'); }
    }
    const n = add(list, 'fitxer');
    if (n) toast(T("{0} alumne{1} afegit{2} des de fitxer", [n, n === 1 ? '' : 's', n === 1 ? '' : 's']), 'good');
    e.target.value = '';
  };
  document.addEventListener('click', async (e) => {
    const th = e.target.closest('th[data-sort]');
    if (th) { if (sortKey === th.dataset.sort) sortDir *= -1; else { sortKey = th.dataset.sort; sortDir = 1; } render(); return; }
    const det = e.target.closest('[data-detail]'); if (det) { detail(det.dataset.detail); return; }
    const del = e.target.closest('[data-del]');
    if (del) {
      const r = rows.get(del.dataset.del);
      if (!r || !confirm(T("Vols esborrar els resultats de {0}? No es pot desfer.", [fullName(r)]))) return;
      try { await api({ action: 'delete', password: $('#pw').value, classe: r.classe, id: r.id }); rows.delete(del.dataset.del); render(); toast(T('Resultats esborrats')); }
      catch (err) { toast(esc(err.message), 'bad'); }
    }
  });

  try { const s = JSON.parse(sessionStorage.getItem(PKEY) || 'null'); if (s) { $('#pw').value = s.pw; $('#cls').value = s.classe || ''; load(); } } catch (e) { }
  translateDom();
  document.title = T('Panell del professor') + ' · Agència Digital';
  $('#langs').innerHTML = LANGS.map(([k, n]) => `<button class="${k === LANG ? 'on' : ''}" data-lang="${k}">${n}</button>`).join('');
  $('#langs').onclick = (e) => { const b = e.target.closest('[data-lang]'); if (b && b.dataset.lang !== LANG) setLang(b.dataset.lang); };
  render();
})();
