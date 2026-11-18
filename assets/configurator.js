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
    intro: $('[data-mug-intro]'), word: $('[data-mug-word]'), sub: $('[data-mug-sub]'),
    front: $('[data-mug-front]'), back: $('[data-mug-back]'), bword: $('[data-mug-back-word]'),
    bdefs: $('[data-mug-back-defs]'), title: $('[data-mug-title]'),
  };

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
  function renderWords() {
    var s = structure();
    var q = norm(f.search.value.trim());
    var words = q
      ? ALL_WORDS.filter(function (w) { return norm(w.w).indexOf(q) > -1 || norm(w.d).indexOf(q) > -1; })
      : ALL_WORDS.filter(function (w) { return w.list === s.list; });
    var current = norm(f.word.value.trim());
    ui.wordList.innerHTML = words.length ? words.map(function (w) {
      var on = norm(w.w) === current;
      return '<button type="button" class="wordchip' + (on ? ' is-on' : '') + '" role="option" aria-selected="' + on + '" data-w="' + esc(w.w) + '" title="' + esc(w.d) + '">' + esc(w.w) + '</button>';
    }).join('') : '<p class="maker__empty">Cap paraula coincideix. Pots escriure-la tu directament a dalt.</p>';
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
    if (drawing) { mug.drawing.setAttribute('href', '/assets/drawings.svg#d-' + drawing); mug.drawing.style.display = ''; }
    else mug.drawing.style.display = 'none';

    var top = drawing ? 0 : -80;
    mug.intro.setAttribute('y', 430 + top);
    mug.word.setAttribute('y', 500 + top);
    mug.sub.setAttribute('y', 544 + top);
    mug.intro.textContent = intro;
    mug.word.textContent = word;
    mug.sub.textContent = sub;
    fitText(mug.word, 70, 22, 400);
    fitText(mug.intro, 32, 16, 400);
    fitText(mug.sub, 25, 14, 400);

    var plainWord = f.word.value.trim();
    mug.bword.textContent = s.id === 'coses' ? 'coses que ' + plainWord : plainWord.toLowerCase();
    fitText(mug.bword, 46, 20, 380);
    var defs = [f.def1.value.trim(), f.def2.value.trim()];
    var lines = [];
    defs.forEach(function (d, i) {
      if (!d) return;
      wrap((i + 1) + '. ' + d, 38).forEach(function (l) { lines.push(l); });
    });
    mug.bdefs.innerHTML = lines.length ? lines.map(function (l, i) { return '<tspan x="296" dy="' + (i ? 27 : 0) + '">' + esc(l) + '</tspan>'; }).join('')
      : '<tspan x="296" class="mug-svg__muted">Sense definició al darrere</tspan>';

    mug.title.textContent = 'Vista prèvia: «' + [intro, word].filter(Boolean).join(' ') + '»' + (sub ? ', ' + sub : '') + ', interior ' + color.name.toLowerCase();
    renderWords();
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
