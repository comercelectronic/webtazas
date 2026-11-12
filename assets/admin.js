/* Panell d'administració: valoracions, newsletter i estoc.
   La contrasenya es guarda només en aquesta pestanya (sessionStorage) i
   s'envia a cada petició; el servidor la comprova sempre. */
(function () {
  'use strict';
  var CAT = window.TDM_CATALOG;
  var API = '/.netlify/functions/';
  var KEY = 'tdm-admin';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var fmt = function (iso) { return iso ? new Date(iso).toLocaleString('ca-ES') : '—'; };
  var password = sessionStorage.getItem(KEY) || '';

  var login = $('[data-admin-login]');
  var app = $('[data-admin]');
  if (!login || !app) return;

  function api(fn, body) {
    var opts = { headers: { 'X-Admin-Password': password } };
    if (body) { opts.method = 'POST'; opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
    return fetch(API + fn, opts).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (res.status === 401) logout();
        if (!res.ok) throw new Error(data.error || 'Error ' + res.status);
        return data;
      });
    });
  }

  function logout() { password = ''; sessionStorage.removeItem(KEY); app.hidden = true; login.hidden = false; }

  login.addEventListener('submit', function (e) {
    e.preventDefault();
    password = $('#admin-pass').value;
    var status = $('[data-form-status]', login);
    status.textContent = 'Comprovant…';
    api('admin-reviews').then(function (data) {
      sessionStorage.setItem(KEY, password);
      status.textContent = '';
      login.hidden = true; app.hidden = false;
      renderReviews(data);
    }).catch(function (err) { status.textContent = err.message; });
  });
  $('[data-admin-logout]').addEventListener('click', logout);

  $$('[data-tab]').forEach(function (tab) {
    tab.addEventListener('click', function () {
      $$('[data-tab]').forEach(function (t) { t.setAttribute('aria-selected', String(t === tab)); });
      $$('[data-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== tab.getAttribute('data-tab'); });
      loaders[tab.getAttribute('data-tab')]();
    });
  });

  function panel(name) { return $('[data-panel="' + name + '"]'); }
  function fail(name, err) { panel(name).innerHTML = '<p class="notice">' + esc(err.message) + '</p>'; }
  var stars = function (n) { return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n); };

  // ---------- Valoracions ----------
  function renderReviews(data) {
    var p = panel('reviews');
    $('[data-pending-count]').textContent = data.pending.length || '';
    p.innerHTML =
      '<h2 class="h3">Pendents de revisar (' + data.pending.length + ')</h2>' +
      (data.pending.length ? data.pending.map(function (r) {
        return '<div class="admin-item"><p><strong>' + esc(r.productName) + '</strong> · ' + stars(r.rating) + ' · ' + esc(r.name) + ' · ' + fmt(r.createdAt) + '</p>' +
          (r.flags.length ? '<p>' + r.flags.map(function (f) { return '<span class="flag">' + esc(f) + '</span>'; }).join('') + '</p>' : '') +
          '<p class="review__text">' + esc(r.comment) + '</p>' +
          '<div class="admin-item__actions"><button class="btn btn--small" data-review-act="approve" data-id="' + r.id + '">Publica</button>' +
          '<button class="btn btn--small btn--ghost" data-review-act="reject" data-id="' + r.id + '">Rebutja i esborra</button></div></div>';
      }).join('') : '<p class="empty-note">No hi ha cap valoració pendent.</p>') +
      '<h2 class="h3" style="margin-top:32px">Publicades (' + data.approved.length + ')</h2>' +
      (data.approved.length ? data.approved.map(function (r) {
        return '<div class="admin-item"><p><strong>' + esc(r.productName) + '</strong> · ' + stars(r.rating) + ' · ' + esc(r.name) + ' · ' + esc(r.date) + '</p><p class="review__text">' + esc(r.comment) + '</p>' +
          '<div class="admin-item__actions"><button class="btn btn--small btn--ghost" data-review-act="delete" data-id="' + r.id + '" data-slug="' + r.slug + '">Retira-la</button></div></div>';
      }).join('') : '<p class="empty-note">Encara no n\'hi ha cap de publicada.</p>');
  }
  function loadReviews() { api('admin-reviews').then(renderReviews).catch(function (e) { fail('reviews', e); }); }
  panel('reviews').addEventListener('click', function (e) {
    var b = e.target.closest('[data-review-act]');
    if (!b) return;
    var act = b.getAttribute('data-review-act');
    if (act !== 'approve' && !confirm(act === 'reject' ? 'Rebutjar i esborrar aquesta valoració?' : 'Retirar aquesta valoració publicada?')) return;
    b.disabled = true;
    api('admin-reviews', { action: act, id: b.getAttribute('data-id'), slug: b.getAttribute('data-slug') })
      .then(loadReviews).catch(function (err) { alert(err.message); b.disabled = false; });
  });

  // ---------- Newsletter ----------
  var lastSubscribers = [];
  function renderNewsletter(data) {
    lastSubscribers = data.subscribers;
    var confirmed = data.subscribers.filter(function (s) { return s.status === 'confirmed'; });
    var p = panel('newsletter');
    p.innerHTML =
      (data.emailConfigured ? '' : '<p class="notice">L\'enviament de correus no està configurat: falten RESEND_API_KEY i NEWSLETTER_FROM a Netlify. Mentrestant, el formulari de subscripció mostra un missatge d\'error i no desa res.</p>') +
      '<div class="card-panel"><h2 class="h3">Enviar un correu</h2>' +
      '<form class="form" data-campaign>' +
      '<div class="field"><label for="cp-subject">Assumpte</label><input class="input" id="cp-subject" name="subject" required maxlength="150"></div>' +
      '<div class="field"><label for="cp-pre">Text de previsualització (opcional)</label><input class="input" id="cp-pre" name="preheader" maxlength="150"></div>' +
      '<div class="field"><label for="cp-body">Text (separa els paràgrafs amb una línia en blanc)</label><textarea class="input" id="cp-body" name="body" rows="8" required></textarea></div>' +
      '<div class="admin-grid"><div class="field"><label for="cp-cta">Text del botó (opcional)</label><input class="input" id="cp-cta" name="ctaLabel" maxlength="60"></div>' +
      '<div class="field"><label for="cp-url">Enllaç del botó (https://…)</label><input class="input" id="cp-url" name="ctaUrl" type="url"></div></div>' +
      '<div class="admin-grid"><div class="field"><label for="cp-test">Adreça per a la prova</label><input class="input" id="cp-test" name="testEmail" type="email"></div></div>' +
      '<div class="admin-item__actions"><button type="button" class="btn btn--ghost" data-send="test">Envia una prova</button>' +
      '<button type="button" class="btn btn--primary" data-send="all">Envia a ' + confirmed.length + ' persones confirmades</button></div>' +
      '<p class="form-status" role="status" data-form-status></p>' +
      '<p class="form-note">Cada correu inclou automàticament l\'enllaç de baixa. No incloguis ofertes o descomptes que no existeixin a la botiga.</p></form></div>' +
      '<h2 class="h3">Persones subscrites</h2>' +
      '<p>' + confirmed.length + ' confirmades · ' + (data.subscribers.length - confirmed.length) + ' pendents de confirmar · ' + data.unsubscribedCount + ' baixes. <button type="button" class="link-btn" data-export>Exporta CSV</button></p>' +
      '<div class="table-wrap"><table><thead><tr><th>Correu</th><th>Estat</th><th>Consentiment</th><th>Origen</th><th>Confirmació</th><th></th></tr></thead><tbody>' +
      data.subscribers.map(function (s) {
        return '<tr><td>' + esc(s.email) + '</td><td>' + (s.status === 'confirmed' ? 'Confirmada' : 'Pendent') + '</td><td>' + fmt(s.consentAt) + '</td><td>' + esc(s.source) + '</td><td>' + fmt(s.confirmedAt) + '</td>' +
          '<td><button class="btn btn--small btn--ghost" data-del-sub="' + s.id + '">Esborra</button></td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  function loadNewsletter() { api('admin-newsletter').then(renderNewsletter).catch(function (e) { fail('newsletter', e); }); }
  panel('newsletter').addEventListener('click', function (e) {
    var del = e.target.closest('[data-del-sub]');
    if (del && confirm('Esborrar totes les dades d\'aquesta persona?')) {
      api('admin-newsletter', { action: 'delete', id: del.getAttribute('data-del-sub') }).then(loadNewsletter).catch(function (err) { alert(err.message); });
      return;
    }
    if (e.target.closest('[data-export]')) {
      var rows = [['correu', 'estat', 'consentiment', 'origen', 'versio_text', 'confirmacio']].concat(lastSubscribers.map(function (s) { return [s.email, s.status, s.consentAt, s.source, s.consentVersion, s.confirmedAt || '']; }));
      var csv = rows.map(function (r) { return r.map(function (v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      a.download = 'subscriptors.csv';
      a.click();
      return;
    }
    var send = e.target.closest('[data-send]');
    if (!send) return;
    var form = $('[data-campaign]');
    var status = $('[data-form-status]', form);
    var fd = new FormData(form);
    var payload = { action: 'send', subject: fd.get('subject'), preheader: fd.get('preheader'), body: fd.get('body'), ctaLabel: fd.get('ctaLabel'), ctaUrl: fd.get('ctaUrl') };
    if (send.getAttribute('data-send') === 'test') {
      if (!fd.get('testEmail')) { status.textContent = 'Escriu una adreça per a la prova.'; return; }
      payload.testEmail = fd.get('testEmail');
    } else if (!confirm('Enviar aquest correu a totes les persones confirmades? No es pot desfer.')) return;
    send.disabled = true;
    status.textContent = 'Enviant…';
    api('admin-newsletter', payload)
      .then(function (r) { status.textContent = 'Enviats: ' + r.sent + (r.failed ? ' · Errors: ' + r.failed : ''); })
      .catch(function (err) { status.textContent = err.message; })
      .then(function () { send.disabled = false; });
  });

  // ---------- Estoc i vendes ----------
  function renderStock(data) {
    panel('stock').innerHTML =
      '<p>Deixa el camp buit perquè una tassa es vengui sense límit. Amb un número, deixa de vendre\'s quan arriba a 0. L\'estoc baixa sol quan es confirma un pagament.</p>' +
      '<div class="table-wrap"><table><thead><tr><th>Tassa</th><th>Estoc</th><th>Unitats venudes</th><th></th></tr></thead><tbody>' +
      Object.keys(CAT.products).map(function (slug) {
        var v = data.stock[slug];
        return '<tr><td>' + esc(CAT.products[slug].name) + '</td>' +
          '<td><input class="input" style="max-width:110px" type="number" min="0" data-stock-input="' + slug + '" value="' + (v === null || v === undefined ? '' : v) + '" placeholder="sense límit"></td>' +
          '<td>' + (data.sales[slug] || 0) + '</td>' +
          '<td><button class="btn btn--small" data-stock-save="' + slug + '">Desa</button></td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  function loadStock() { api('admin-stock').then(renderStock).catch(function (e) { fail('stock', e); }); }
  panel('stock').addEventListener('click', function (e) {
    var b = e.target.closest('[data-stock-save]');
    if (!b) return;
    var slug = b.getAttribute('data-stock-save');
    var raw = $('[data-stock-input="' + slug + '"]').value.trim();
    b.disabled = true;
    api('admin-stock', { slug: slug, stock: raw === '' ? null : Number(raw) })
      .then(function (d) { renderStock(d); }).catch(function (err) { alert(err.message); b.disabled = false; });
  });

  var loaders = { reviews: loadReviews, newsletter: loadNewsletter, stock: loadStock };

  if (password) {
    api('admin-reviews').then(function (d) { login.hidden = true; app.hidden = false; renderReviews(d); }).catch(function () { logout(); });
  }
})();
