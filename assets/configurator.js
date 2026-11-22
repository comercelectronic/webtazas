/* El Glopet — configurador «Crea la teva tassa».
   Les dades arriben a #maker-data (generades des de data/configurator.json).
   El servidor torna a validar el disseny abans de cobrar-lo. */
(function () {
  'use strict';

  var root = document.querySelector('[data-maker]');
  var dataEl = document.getElementById('maker-data');
  if (!root || !dataEl) return;
  var DATA = JSON.parse(dataEl.textContent);

  var $ = function (sel, r) { return (r || root).querySelector(sel); };
  var $$ = function (sel, r) { return Array.prototype.slice.call((r || root).querySelectorAll(sel)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var norm = function (s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };

  var STRUCT = {};
  DATA.structures.forEach(function (s) { STRUCT[s.id] = s; });
  var COLOR = {};
  DATA.colors.forEach(function (c) { COLOR[c.id] = c; });
  var ALL_WORDS = [];
  Object.keys(DATA.lists).forEach(function (k) {
    DATA.lists[k].words.forEach(function (w) { ALL_WORDS.push({ w: w.w, g: w.g, d: w.d, list: k }); });
  });

  var form = $('[data-maker-form]');
  var f = {
    intro: $('#mk-intro'), word: $('#mk-word'), sub: $('#mk-sub'), def1: $('#mk-def1'), def2: $('#mk-def2'),
    search: $('[data-word-search]'), qty: $('[data-mk-qty]'),
  };
  var ui = {
    introField: $('[data-intro-field]'), subField: $('[data-sub-field]'), wordsWrap: $('[data-words-wrap]'),
    wordList: $('[data-word-list]'), wordLabel: $('[data-word-label]'), wordCount: $('[data-word-count]'),
    genderGroup: $('[data-gender-group]'), status: $('[data-maker-status]'),
  };
  var mug = {
    photo: $('[data-mug-photo]'), box: $('[data-mug]'), drawing: $('[data-mug-drawing]'),
    intro: $('[data-mug-intro] textPath'), word: $('[data-mug-word] textPath'), sub: $('[data-mug-sub] textPath'),
    arcs: { intro: $('[data-arc="intro"]'), word: $('[data-arc="word"]'), sub: $('[data-arc="sub"]') },
    front: $('[data-mug-front]'), back: $('[data-mug-back]'), bword: $('[data-mug-back-word] textPath'),
    barc: $('[data-arc="bword"]'), brule: $('[data-mug-back-rule]'), blines: $('[data-mug-back-lines]'),
    emoji: $('[data-mug-emoji]'), bdrawing: $('[data-mug-bdrawing]'), bemoji: $('[data-mug-bemoji]'),
    title: $('[data-mug-title]'),
  };
  var EMOJIS = DATA.emojis || [];
  var isEmoji = function (v) { return EMOJIS.indexOf(v) > -1; };
  var SVGNS = 'http://www.w3.org/2000/svg';

  var state = { gender: 'm', autoDef: true };

  function checked(name) {
    var el = $('input[name="' + name + '"]:checked');
    return el ? el.value : '';
  }
  function structure() { return STRUCT[checked('structure')] || DATA.structures[0]; }

  function introText() {
    var s = structure();
    if (s.id === 'lliure') return f.intro.value.trim();
    return state.gender === 'f' ? s.introF : s.introM;
  }

  // ---------- Llista de paraules ----------
  var lastWordsHtml = null;
  function renderWords() {
    var s = structure();
    var q = norm(f.search.value.trim());
    var words = q
      ? ALL_WORDS.filter(function (w) { return norm(w.w).indexOf(q) > -1 || norm(w.d).indexOf(q) > -1; })
      : ALL_WORDS.filter(function (w) { return w.list === s.list; });
    var current = norm(f.word.value.trim());
    var html = words.length ? words.map(function (w) {
      var on = norm(w.w) === current;
      return '<button type="button" class="wordchip' + (on ? ' is-on' : '') + '" role="option" aria-selected="' + on + '" data-w="' + esc(w.w) + '" title="' + esc(w.d) + '">' + esc(w.w) + '</button>';
    }).join('') : '<p class="maker__empty">Cap paraula coincideix. Pots escriure-la tu directament a dalt.</p>';
    // Només es torna a pintar si canvia: si no, un clic que arriba just després
    // que la cerca perdi el focus es perdria (el botó ja no existiria).
    if (html !== lastWordsHtml) { ui.wordList.innerHTML = html; lastWordsHtml = html; }
  }

  function pickWord(text) {
    var w = ALL_WORDS.find(function (x) { return x.w === text; });
    if (!w) return;
    f.word.value = w.w;
    if (w.g === 'm' || w.g === 'f') setGender(w.g);
    if (state.autoDef || !f.def1.value.trim()) { f.def1.value = w.d; state.autoDef = true; }
    update();
  }

  function setGender(g) {
    state.gender = g;
    $$('[data-gender]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-gender') === g)); });
  }

  // ---------- Vista prèvia ----------
  // Zona d'impressió (unitats de la foto de 760 px). Davant: cos de la tassa de x=40 a x=518.
  // Darrere: la foto és la mateixa girada, així que el cos va de x=242 a x=720.
  var BODY_CX = 279;
  var BACK_CX = 481;
  var HALF = 190;
  var PRINT_W = 310;
  // La tassa és un cilindre vist una mica des de dalt: les línies fan un somriure
  // i com més avall són, més es corben.
  // Cada línia és un tros d'el·lipse: la secció d'un cilindre de radi R vista en perspectiva
  // (plana al mig i més corbada cap als costats).
  var R = 239;
  function sag(y) { return Math.max(5, Math.min(18, 7 + (y - 300) * 0.04)); }
  function arcD(cx, y, half) {
    half = half || HALF;
    var k = Math.sqrt(1 - Math.pow(half / R, 2));
    var ry = sag(y) / (1 - k);
    return 'M' + (cx - half) + ' ' + y + ' A' + R + ' ' + ry.toFixed(1) + ' 0 0 0 ' + (cx + half) + ' ' + y;
  }
  function setArc(path, y) { path.setAttribute('d', arcD(BODY_CX, y)); }
  function fitText(el, base, min, maxWidth) {
    var size = base;
    el.style.fontSize = size + 'px';
    try {
      while (size > min && el.getComputedTextLength() > maxWidth) { size -= 2; el.style.fontSize = size + 'px'; }
    } catch (e) { /* el navegador encara no l'ha pintat */ }
  }
  function wrap(text, max) {
    var words = String(text).split(/\s+/);
    var lines = [];
    var line = '';
    words.forEach(function (w) {
      if ((line + ' ' + w).trim().length > max) { if (line) lines.push(line); line = w; } else line = (line + ' ' + w).trim();
    });
    if (line) lines.push(line);
    return lines;
  }

  function update() {
    var s = structure();
    var hasList = !!s.list;
    ui.introField.hidden = s.id !== 'lliure';
    ui.subField.hidden = !s.sub;
    ui.wordsWrap.hidden = !hasList && !f.search.value;
    ui.genderGroup.hidden = !(s.id === 'tendra' || s.id === 'caracter' || s.id === 'ets');
    ui.wordLabel.textContent = s.id === 'coses' ? 'Coses que…' : s.id === 'lliure' ? 'Frase gran' : 'Paraula';
    f.word.placeholder = s.id === 'coses' ? 'p. ex. perden el fil' : s.id === 'lliure' ? 'p. ex. Bon dia, amor' : 'p. ex. aixopluc';
    ui.wordCount.textContent = String(f.word.value.length);

    var intro = introText();
    var word = f.word.value.trim() || '…';
    var sub = s.sub ? f.sub.value.trim() : '';
    var drawing = checked('drawing');
    var color = COLOR[checked('color')] || DATA.colors[0];

    var src = '/images/tassa-en-blanc/' + color.id + '.jpg';
    if (mug.photo.getAttribute('src') !== src) mug.photo.setAttribute('src', src);
    var emoji = isEmoji(drawing);
    if (drawing && !emoji) {
      mug.drawing.setAttribute('href', '/assets/drawings.svg#d-' + drawing);
      mug.bdrawing.setAttribute('href', '/assets/drawings.svg#d-' + drawing);
    }
    mug.drawing.style.display = drawing && !emoji ? '' : 'none';
    mug.bdrawing.style.display = drawing && !emoji ? '' : 'none';
    mug.emoji.style.display = emoji ? '' : 'none';
    mug.bemoji.style.display = emoji ? '' : 'none';
    mug.emoji.textContent = emoji ? drawing : '';
    mug.bemoji.textContent = emoji ? drawing : '';
    mug.emoji.setAttribute('font-size', '88');

    var top = drawing ? 0 : -80;
    mug.emoji.setAttribute('y', '338');
    // La tassa és un cilindre: el text segueix una corba suau i es queda dins la zona d'impressió.
    setArc(mug.arcs.intro, 432 + top);
    setArc(mug.arcs.word, 498 + top);
    setArc(mug.arcs.sub, 540 + top);
    mug.intro.textContent = intro;
    mug.word.textContent = word;
    mug.sub.textContent = sub;
    fitText(mug.word, 64, 20, PRINT_W);
    fitText(mug.intro, 30, 14, PRINT_W);
    fitText(mug.sub, 23, 12, PRINT_W);

    // Darrere: com les tasses de la botiga, amb la paraula, una ratlla i les definicions,
    // tot seguint la corba de la tassa.
    var plainWord = f.word.value.trim();
    var bTop = drawing ? 0 : -40;
    var wordY = 372 + bTop;
    var left = BACK_CX - HALF;
    mug.barc.setAttribute('d', arcD(BACK_CX, wordY));
    mug.bword.textContent = s.id === 'coses' ? 'coses que ' + plainWord : plainWord.toLowerCase();
    fitText(mug.bword, 44, 18, 330);
    mug.brule.setAttribute('d', arcD(BACK_CX, wordY + 18, HALF - 12));
    while (mug.blines.firstChild) mug.blines.removeChild(mug.blines.firstChild);
    var defs = [f.def1.value.trim(), f.def2.value.trim()];
    var rows = [];
    defs.forEach(function (d, i) {
      if (!d) return;
      wrap(d, 48).forEach(function (l, j) { rows.push({ num: j === 0 ? (i + 1) + '. ' : '', text: l, indent: j > 0 }); });
    });
    if (!rows.length) rows.push({ num: '', text: 'Sense definició al darrere', muted: true });
    rows.forEach(function (r, i) {
      var y = wordY + 46 + i * 24;
      var id = 'arc-bline-' + i;
      var path = document.createElementNS(SVGNS, 'path');
      path.setAttribute('id', id);
      path.setAttribute('d', arcD(BACK_CX, y, HALF - 8));
      path.setAttribute('fill', 'none');
      var text = document.createElementNS(SVGNS, 'text');
      text.setAttribute('class', 'mug-svg__defs' + (r.muted ? ' mug-svg__muted' : ''));
      var tp = document.createElementNS(SVGNS, 'textPath');
      tp.setAttribute('href', '#' + id);
      tp.setAttribute('startOffset', r.indent ? '7%' : '3%');
      if (r.num) {
        var n = document.createElementNS(SVGNS, 'tspan');
        n.setAttribute('class', 'mug-svg__num');
        n.textContent = r.num;
        tp.appendChild(n);
      }
      tp.appendChild(document.createTextNode(r.text));
      text.appendChild(tp);
      mug.blines.appendChild(path);
      mug.blines.appendChild(text);
    });
    mug.bdrawing.setAttribute('y', String(262 + bTop));
    mug.bemoji.setAttribute('y', String(306 + bTop));

    mug.title.textContent = 'Vista prèvia: «' + [intro, word].filter(Boolean).join(' ') + '»' + (sub ? ', ' + sub : '') + ', interior ' + color.name.toLowerCase();
    renderWords();
  }

  // ---------- Emoticones dins del text ----------
  var lastField = null;
  [f.intro, f.word, f.sub, f.def1, f.def2].forEach(function (el) {
    if (el) el.addEventListener('focus', function () { lastField = el; });
  });
  function insertEmoji(e) {
    var picked = lastField && !lastField.closest('[hidden]');
    var el = picked ? lastField : f.word;
    var max = parseInt(el.getAttribute('maxlength'), 10) || 200;
    if (el.value.length + e.length > max) { el.focus(); return; }
    // Si encara no s'ha triat cap camp, l'emoticona va al final de la paraula.
    var start = picked && typeof el.selectionStart === 'number' ? el.selectionStart : el.value.length;
    var end = picked && typeof el.selectionEnd === 'number' ? el.selectionEnd : start;
    el.value = el.value.slice(0, start) + e + el.value.slice(end);
    el.focus();
    try { el.setSelectionRange(start + e.length, start + e.length); } catch (err) { /* res */ }
    if (el === f.def1) state.autoDef = false;
    update();
  }

  // ---------- Esdeveniments ----------
  form.addEventListener('change', function (e) {
    if (e.target.name === 'structure') {
      var s = structure();
      f.search.value = '';
      if (s.example) pickWord(s.example);
      else { f.word.value = ''; f.def1.value = ''; state.autoDef = true; }
      if (s.id === 'lliure' && !f.intro.value) f.intro.value = 'Bon dia,';
    }
    update();
  });
  form.addEventListener('input', function (e) {
    if (e.target === f.def1) state.autoDef = false;
    if (e.target === f.word) {
      var match = ALL_WORDS.find(function (x) { return norm(x.w) === norm(f.word.value.trim()); });
      if (match && state.autoDef) f.def1.value = match.d;
      if (!match && state.autoDef) f.def1.value = '';
    }
    update();
  });
  root.addEventListener('click', function (e) {
    var em = e.target.closest('[data-emoji]');
    if (em) { insertEmoji(em.getAttribute('data-emoji')); return; }
    var chip = e.target.closest('.wordchip');
    if (chip) { pickWord(chip.getAttribute('data-w')); return; }
    var g = e.target.closest('[data-gender]');
    if (g) { setGender(g.getAttribute('data-gender')); update(); return; }
    var v = e.target.closest('[data-mug-view]');
    if (v) {
      var back = v.getAttribute('data-mug-view') === 'back';
      mug.front.style.display = back ? 'none' : '';
      mug.back.style.display = back ? '' : 'none';
      mug.box.classList.toggle('is-back', back);
      $$('[data-mug-view]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === v)); });
      return;
    }
    var st = e.target.closest('[data-mk-step]');
    if (st) {
      f.qty.value = Math.max(1, Math.min(20, (parseInt(f.qty.value, 10) || 1) + parseInt(st.getAttribute('data-mk-step'), 10)));
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var s = structure();
    var design = {
      structure: s.id,
      intro: introText(),
      word: f.word.value.trim(),
      sub: s.sub ? f.sub.value.trim() : '',
      def1: f.def1.value.trim(),
      def2: f.def2.value.trim(),
      drawing: checked('drawing'),
      color: checked('color'),
    };
    if (!design.word) {
      ui.status.textContent = 'Escriu la paraula o la frase principal de la tassa.';
      ui.status.className = 'form-status is-error';
      f.word.focus();
      return;
    }
    var igBtn = form.querySelector('[data-ig-submit]');
    if (igBtn) {
      var colorName = (COLOR[design.color] || {}).name || design.color;
      var drawingName = isEmoji(design.drawing) ? 'Emoticona ' + design.drawing
        : (DATA.drawings.find(function (d) { return d.id === design.drawing; }) || {}).label;
      var lines = ['Hola! M\'agradaria aquesta tassa personalitzada:',
        'Davant: «' + [design.intro, design.word].filter(Boolean).join(' ') + '»' + (design.sub ? ' / «' + design.sub + '»' : ''),
        drawingName ? 'Dibuix: ' + drawingName.toLowerCase() : 'Sense dibuix',
        'Color de l\'interior i la nansa: ' + colorName.toLowerCase()];
      if (design.def1 || design.def2) lines.push('Darrere: 1. ' + (design.def1 || '-') + (design.def2 ? ' 2. ' + design.def2 : ''));
      var text = lines.join('\n');
      // window.open amb «noopener» sempre retorna null: es talla l'opener a mà.
      var win = window.open(igBtn.getAttribute('data-ig-submit'), '_blank');
      if (win) win.opener = null;
      var done = function (ok) {
        ui.status.textContent = ok ? 'Hem copiat el disseny: enganxa\'l al xat d\'Instagram.' : 'Copia el disseny al xat d\'Instagram: ' + lines.join(' · ');
        ui.status.className = 'form-status is-ok';
      };
      try { navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); }); } catch (err) { done(false); }
      if (!win) window.location.href = igBtn.getAttribute('data-ig-submit');
      return;
    }
    var cartApi = window.ElGlopetCart;
    if (!cartApi) return;
    cartApi.addCustom(design, parseInt(f.qty.value, 10) || 1);
    ui.status.textContent = 'La teva tassa és a la cistella.';
    ui.status.className = 'form-status is-ok';
    cartApi.toast('La teva tassa personalitzada és a la cistella', true);
  });

  // Estat inicial
  if (f.word.value) {
    var first = ALL_WORDS.find(function (x) { return x.w === f.word.value; });
    if (first) f.def1.value = first.d;
  }
  mug.back.style.display = 'none';
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
  update();
})();
