/* Agència Digital — panell del professor: consulta i exportació dels resultats dels alumnes */
(function () {
  'use strict';
  const API = '/.netlify/functions/joc-resultats';
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const LESSONS = Object.keys(GD.lessons);
  const PKEY = 'agencia-digital-professor';

  let rows = new Map(); // clau "classe/id" → resum
  let sortKey = 'classe', sortDir = 1;

  function toast(msg, cls) {
    const t = document.createElement('div'); t.className = 'toast ' + (cls || ''); t.innerHTML = msg;
    $('#toasts').appendChild(t); setTimeout(() => t.remove(), 3500);
  }
  const normClass = (v) => String(v || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().trim().replace(/\s+/g, '-').replace(/[^A-Z0-9_-]/g, '').slice(0, 32);
  const fullName = (r) => `${r.nom || ''} ${r.cognom || ''}`.trim() || '(sense nom)';
  const pctTxt = (v) => v == null ? '—' : v + ' %';
  const dateTxt = (d) => d ? new Date(d).toLocaleString('ca-ES', { dateStyle: 'short', timeStyle: 'short' }) : '—';
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
    ['alumne', 'Alumne', r => fullName(r).toLowerCase()],
    ['classe', 'Classe', r => r.classe || ''],
    ['nivell', 'Nivell', r => r.nivell || 0],
    ['etapa', 'Etapa', r => r.etapaActual || 0],
    ['capitols', 'Capítols', r => r.capitolsCompletats || 0],
    ['llicons', 'Lliçons superades', r => r.llicionsSuperades || 0],
    ['primer', '1r intent', r => r.mitjanaPrimerIntent || 0],
    ['millor', 'Millor', r => r.mitjanaMillor || 0],
    ['rep', 'Reputació', r => r.reputacio || 0],
    ['diners', 'Liquiditat', r => r.liquiditat || 0],
    ['final', 'Final', r => r.final || ''],
    ['data', 'Actualitzat', r => r.actualitzat || '']
  ];

  function render() {
    const list = [...rows.values()];
    const col = COLS.find(c => c[0] === sortKey) || COLS[1];
    list.sort((a, b) => { const x = col[2](a), y = col[2](b); return (x > y ? 1 : x < y ? -1 : fullName(a).localeCompare(fullName(b))) * sortDir; });
    $('#csv').disabled = !list.length;
    const avg = (f) => { const v = list.map(f).filter(x => x != null); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : '—'; };
    $('#stats').innerHTML = list.length ? `
      <div class="metric"><small>Alumnes</small><b>${list.length}</b></div>
      <div class="metric"><small>Nivell mitjà</small><b>${avg(r => r.nivell)}</b></div>
      <div class="metric"><small>Capítols mitjans</small><b>${avg(r => r.capitolsCompletats)} / ${list[0].capitolsTotal || 37}</b></div>
      <div class="metric"><small>Lliçons: 1r intent</small><b>${avg(r => r.mitjanaPrimerIntent)} %</b></div>
      <div class="metric"><small>Han acabat el joc</small><b>${list.filter(r => r.final).length}</b></div>` : '';
    if (!list.length) { $('#tbl').innerHTML = '<tr><td class="empty">Encara no hi ha resultats. Introdueix la contrasenya o afegeix fitxers d\'alumnes.</td></tr>'; return; }
    $('#tbl').innerHTML = `<thead><tr>${COLS.map(c => `<th data-sort="${c[0]}">${c[1]}${sortKey === c[0] ? (sortDir > 0 ? ' ▲' : ' ▼') : ''}</th>`).join('')}<th></th></tr></thead>
      <tbody>${list.map(r => {
        const k = `${r.classe || '—'}/${r.id}`;
        const cp = Math.round((r.capitolsCompletats || 0) / (r.capitolsTotal || 37) * 100);
        return `<tr>
          <td><span class="ava-s">${avatar(r)}</span><b>${esc(fullName(r))}</b><br><small class="muted">${esc(r.agencia || '')}</small></td>
          <td>${esc(r.classe || '')} ${r._font === 'fitxer' ? '<span class="tag file">fitxer</span>' : ''}</td>
          <td><b>${r.nivell || 1}</b></td>
          <td>${r.etapaActual || 1} / 8</td>
          <td><span class="bar"><i style="width:${cp}%"></i></span>${r.capitolsCompletats || 0}</td>
          <td>${r.llicionsSuperades || 0} / ${r.llicionsTotal || LESSONS.length}</td>
          <td>${pctTxt(r.mitjanaPrimerIntent)}</td>
          <td>${pctTxt(r.mitjanaMillor)}</td>
          <td>${r.reputacio ?? '—'}</td>
          <td>${r.liquiditat != null ? r.liquiditat.toLocaleString('ca-ES') + ' €' : '—'}</td>
          <td>${esc(r.final ? r.final.replace(/^Final \d — /, '') : '—')}</td>
          <td><small>${dateTxt(r.actualitzat)}</small></td>
          <td style="white-space:nowrap"><button class="btn small" data-detail="${esc(k)}">Detall</button> ${r._font === 'servidor' ? `<button class="btn small danger" data-del="${esc(k)}" title="Esborrar">✕</button>` : ''}</td>
        </tr>`;
      }).join('')}</tbody>`;
  }

  function detail(k) {
    const r = rows.get(k); if (!r) return;
    const d = document.createElement('div'); d.className = 'modal';
    const ll = r.llicons || {};
    d.innerHTML = `<div class="modal-box wide">
      <div class="detail-h"><span class="ava-s">${avatar(r)}</span><div><h2 style="margin:0">${esc(fullName(r))}</h2><p class="muted" style="margin:0">${esc(r.classe || '')} · ${esc(r.agencia || '')} · Nivell ${r.nivell} · Camí ${esc(r.cami || '—')}</p></div></div>
      <div class="metrics">
        <div class="metric"><small>Capítols</small><b>${r.capitolsCompletats} / ${r.capitolsTotal}</b></div>
        <div class="metric"><small>Lliçons superades</small><b>${r.llicionsSuperades} / ${r.llicionsTotal}</b></div>
        <div class="metric"><small>Mitjana 1r intent</small><b>${pctTxt(r.mitjanaPrimerIntent)}</b></div>
        <div class="metric"><small>Campanyes bones</small><b>${r.campanyesBones || 0} / ${r.campanyes || 0}</b></div>
        <div class="metric"><small>Encàrrecs fets</small><b>${r.encarrecs || 0}</b></div>
        <div class="metric"><small>Final</small><b style="font-size:.9em">${esc(r.final || 'Encara no')}</b></div>
      </div>
      <h4>📚 Lliçons</h4>
      <table class="tbl"><thead><tr><th>Lliçó</th><th>Àrea</th><th>1r intent</th><th>Millor</th><th>Intents</th></tr></thead><tbody>
        ${LESSONS.map(id => { const q = ll[id], l = GD.lessons[id]; return `<tr><td>${esc(l.title)}</td><td><small>${esc(GD.areas[l.area])}</small></td><td>${q ? q.first + '/' + q.total : '—'}</td><td>${q ? q.best + '/' + q.total : '—'}</td><td>${q ? q.tries : 0}</td></tr>`; }).join('')}
      </tbody></table>
      <h4>🧭 Habilitats i coneixement</h4>
      <p class="small">${Object.entries(r.habilitats || {}).map(([k, v]) => `${esc(k)}: <b>${v}</b>`).join(' · ')}</p>
      <p class="small">${Object.entries(r.coneixement || {}).filter(([, v]) => v).map(([k, v]) => `${esc(GD.areas[k] || k)}: <b>${v}</b>`).join(' · ') || '—'}</p>
      <h4>📜 Decisions clau</h4>
      <ul class="history">${(r.decisions || []).map(t => `<li class="key">${esc(t)}</li>`).join('') || '<li>—</li>'}</ul>
      <div class="row-btns"><button class="btn primary" id="close">Tancar</button></div></div>`;
    document.body.appendChild(d);
    d.querySelector('#close').onclick = () => d.remove();
    d.onclick = (e) => { if (e.target === d) d.remove(); };
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
    $('#msg').innerHTML = 'Carregant…';
    try {
      const { results } = await api({ action: 'list', password: pw, classe });
      try { sessionStorage.setItem(PKEY, JSON.stringify({ pw, classe })); } catch (e) { }
      [...rows.keys()].forEach(k => { if (rows.get(k)._font === 'servidor') rows.delete(k); });
      add(results, 'servidor');
      $('#msg').innerHTML = `<span class="pos">✔ ${results.length} alumne${results.length === 1 ? '' : 's'} ${classe ? 'a la classe ' + esc(classe) : 'en total'}.</span>`;
    } catch (e) { $('#msg').innerHTML = `<span class="err">${esc(e.message)}</span>`; }
  }

  // CSV per a Excel: separador «;», BOM UTF-8 i una columna per lliçó
  function exportCsv() {
    const list = [...rows.values()].sort((a, b) => (a.classe || '').localeCompare(b.classe || '') || fullName(a).localeCompare(fullName(b)));
    const head = ['Classe', 'Nom', 'Cognom', 'Agència', 'Perfil', 'Nivell', 'Etapa actual', 'Etapes completades', 'Capítols completats', 'Capítols totals', 'Capítol en curs',
      'Lliçons superades', 'Lliçons totals', 'Mitjana 1r intent (%)', 'Mitjana millor (%)', 'Reputació', 'Liquiditat (€)', 'Clients', 'Equip', 'Camí', 'Final',
      'Campanyes bones', 'Campanyes', 'Encàrrecs', 'Setmana de joc', 'Iniciat', 'Darrera actualització', 'Decisions clau',
      ...LESSONS.flatMap(id => [`${GD.lessons[id].title} · 1r intent`, `${GD.lessons[id].title} · millor`])];
    const cell = (v) => { const s = v == null ? '' : String(v); return /[;"\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const lines = [head.map(cell).join(';')];
    list.forEach(r => {
      const ll = r.llicons || {};
      lines.push([r.classe, r.nom, r.cognom, r.agencia, r.perfil, r.nivell, r.etapaActual, r.etapesCompletades, r.capitolsCompletats, r.capitolsTotal, r.capitolActual,
        r.llicionsSuperades, r.llicionsTotal, r.mitjanaPrimerIntent, r.mitjanaMillor, r.reputacio, r.liquiditat, r.clients, r.equip, r.cami, r.final,
        r.campanyesBones, r.campanyes, r.encarrecs, r.setmana, dateTxt(r.iniciat), dateTxt(r.actualitzat), (r.decisions || []).join(' | '),
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
      catch (err) { toast(`El fitxer ${esc(f.name)} no és un fitxer de resultats vàlid`, 'bad'); }
    }
    const n = add(list, 'fitxer');
    if (n) toast(`${n} alumne${n === 1 ? '' : 's'} afegit${n === 1 ? '' : 's'} des de fitxer`, 'good');
    e.target.value = '';
  };
  document.addEventListener('click', async (e) => {
    const th = e.target.closest('th[data-sort]');
    if (th) { if (sortKey === th.dataset.sort) sortDir *= -1; else { sortKey = th.dataset.sort; sortDir = 1; } render(); return; }
    const det = e.target.closest('[data-detail]'); if (det) { detail(det.dataset.detail); return; }
    const del = e.target.closest('[data-del]');
    if (del) {
      const r = rows.get(del.dataset.del);
      if (!r || !confirm(`Vols esborrar els resultats de ${fullName(r)}? No es pot desfer.`)) return;
      try { await api({ action: 'delete', password: $('#pw').value, classe: r.classe, id: r.id }); rows.delete(del.dataset.del); render(); toast('Resultats esborrats'); }
      catch (err) { toast(esc(err.message), 'bad'); }
    }
  });

  try { const s = JSON.parse(sessionStorage.getItem(PKEY) || 'null'); if (s) { $('#pw').value = s.pw; $('#cls').value = s.classe || ''; load(); } } catch (e) { }
  render();
})();
