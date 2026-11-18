/* El Glopet — comportament de la botiga.
   Les dades del catàleg (preu, noms, imatges) arriben de /assets/catalog.js,
   generat a partir de data/. El preu real sempre el calcula el servidor. */
(function () {
  'use strict';

  var CAT = window.TDM_CATALOG;
  var API = '/.netlify/functions/';
  var CART_KEY = 'tdm-cart';
  var CONSENT_KEY = 'tdm-consent';
  var CONSENT_VERSION = 1;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var euro = function (cents) { return (cents / 100).toFixed(2).replace('.', ',') + ' €'; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var icon = function (name, cls) { return '<svg class="icon ' + (cls || '') + '" aria-hidden="true"><use href="/assets/icons.svg#' + name + '"></use></svg>'; };
  var storage = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sense emmagatzematge */ } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { /* res */ } },
  };

  function postJSON(fn, body) {
    return fetch(API + fn, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) { var err = new Error(data.error || 'error'); err.status = res.status; throw err; }
          return data;
        });
      });
  }

  function setStatus(el, msg, ok) {
    if (!el) return;
    el.textContent = msg || '';
    el.classList.toggle('is-ok', !!ok && !!msg);
    el.classList.toggle('is-error', !ok && !!msg);
  }

  // ---------- Avís (toast) ----------
  var toastEl = $('[data-toast]');
  var toastTimer;
  function toast(message, withCartButton) {
    if (!toastEl) return;
    toastEl.innerHTML = '<span>' + esc(message) + '</span>' + (withCartButton ? '<button type="button" data-cart-open>Veure la cistella</button>' : '');
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 4200);
  }

  // ---------- Menú mòbil ----------
  var navToggle = $('[data-nav-toggle]');
  var nav = $('#site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) { nav.classList.remove('is-open'); navToggle.setAttribute('aria-expanded', 'false'); } });
  }

  // ---------- Cistella ----------
  // Cada línia és una tassa d'un color, un pack o una tassa personalitzada.
  var stock = {};
  var COLOR_BY_ID = {};
  (CAT.colors || []).forEach(function (c) { COLOR_BY_ID[c.id] = c; });

  function keyOf(i) {
    if (i.type === 'pack') return 'p|' + i.id;
    if (i.type === 'custom') return 'c|' + JSON.stringify(i.design);
    return 'm|' + i.id + '|' + (i.color || '');
  }
  function normalize(i) {
    if (!i || !(i.qty > 0)) return null;
    var type = i.type || 'mug';
    if (type === 'mug') {
      var p = CAT.products[i.id];
      if (!p) return null;
      var color = p.colors.length ? (p.colors.indexOf(i.color) > -1 ? i.color : p.defaultColor) : null;
      return { type: 'mug', id: i.id, color: color, qty: i.qty };
    }
    if (type === 'pack') return CAT.packs[i.id] ? { type: 'pack', id: i.id, qty: i.qty } : null;
    if (type === 'custom') return i.design && i.design.word ? { type: 'custom', design: i.design, qty: i.qty } : null;
    return null;
  }
  var cart = (storage.get(CART_KEY) || []).map(normalize).filter(Boolean);

  function unitPrice(i) {
    if (i.type === 'pack') return CAT.packs[i.id].priceCents;
    if (i.type === 'custom') return CAT.customPriceCents;
    return CAT.products[i.id].priceCents;
  }
  function unitsOf(slug) {
    return cart.reduce(function (n, i) {
      if (i.type === 'mug' && i.id === slug) return n + i.qty;
      if (i.type === 'pack' && CAT.packs[i.id].slugs.indexOf(slug) > -1) return n + i.qty;
      return n;
    }, 0);
  }
  function maxFor(slug) {
    var s = stock[slug];
    return typeof s === 'number' ? Math.min(CAT.maxQty, s) : CAT.maxQty;
  }
  function save() { storage.set(CART_KEY, cart); render(); }
  function mugsCount() {
    return cart.reduce(function (n, i) { return n + i.qty * (i.type === 'pack' ? CAT.packs[i.id].slugs.length : 1); }, 0);
  }
  function bump() {
    var btn = $('[data-cart-open].cart-btn');
    if (btn) { btn.classList.remove('is-bump'); void btn.offsetWidth; btn.classList.add('is-bump'); }
  }
  function findLine(item) {
    var k = keyOf(item);
    return cart.find(function (i) { return keyOf(i) === k; });
  }

  function add(slug, qty, color) {
    var product = CAT.products[slug];
    if (!product) return false;
    var allowed = Math.max(0, maxFor(slug) - unitsOf(slug));
    if (allowed <= 0) { toast(stock[slug] === 0 ? '«' + product.name + '» s\'ha exhaurit.' : 'Ja tens el màxim d\'unitats d\'aquesta tassa.'); return false; }
    var item = normalize({ type: 'mug', id: slug, color: color, qty: Math.min(qty || 1, allowed) });
    var line = findLine(item);
    if (line) line.qty += item.qty; else cart.push(item);
    save(); bump();
    return true;
  }
  function addPack(id) {
    var pack = CAT.packs[id];
    if (!pack) return false;
    var blocked = pack.slugs.filter(function (s) { return maxFor(s) - unitsOf(s) <= 0; });
    if (blocked.length) { toast('«' + CAT.products[blocked[0]].name + '» s\'ha exhaurit i el pack no està disponible.'); return false; }
    var line = findLine({ type: 'pack', id: id });
    if (line) line.qty = Math.min(CAT.maxQty, line.qty + 1); else cart.push({ type: 'pack', id: id, qty: 1 });
    save(); bump();
    return true;
  }
  function addCustom(design, qty) {
    var item = { type: 'custom', design: design, qty: Math.max(1, Math.min(CAT.maxQty, qty || 1)) };
    var line = findLine(item);
    if (line) line.qty = Math.min(CAT.maxQty, line.qty + item.qty); else cart.push(item);
    save(); bump();
    return true;
  }
  window.ElGlopetCart = { addCustom: addCustom, toast: toast, openCart: function () { openCart(); } };

  function setQtyAt(index, qty) {
    var i = cart[index];
    if (!i) return;
    if (i.type === 'mug') qty = Math.min(qty, maxFor(i.id) - unitsOf(i.id) + i.qty);
    i.qty = Math.min(CAT.maxQty, qty);
    cart = cart.filter(function (l) { return l.qty > 0; });
    save();
  }

  var drawer = $('[data-cart]');
  var backdrop = $('.drawer-backdrop');
  var lastFocus = null;

  function mugIcon(hex) {
    return '<svg class="line__img line__img--svg" viewBox="0 0 72 72" aria-hidden="true"><rect width="72" height="72" rx="10" fill="#FFFEFC"/>' +
      '<path d="M50 38h5a8 8 0 0 1 0 16h-5" fill="none" stroke="' + hex + '" stroke-width="5"/>' +
      '<rect x="16" y="30" width="36" height="38" rx="6" fill="#fff" stroke="#D6D0C5" stroke-width="2"/>' +
      '<ellipse cx="34" cy="31" rx="17" ry="4" fill="' + hex + '"/>' +
      '<path d="M27 47c3-4 11-4 14 0" fill="none" stroke="#B66F54" stroke-width="2.5" stroke-linecap="round"/></svg>';
  }
  function lineInfo(i) {
    if (i.type === 'pack') {
      var pk = CAT.packs[i.id];
      return {
        img: '<img class="line__img" src="' + CAT.products[pk.slugs[0]].image + '" alt="" width="72" height="72">',
        name: esc(pk.name), url: '/#packs',
        detail: pk.slugs.map(function (s) { return esc(CAT.products[s].name); }).join(' · '),
      };
    }
    if (i.type === 'custom') {
      var d = i.design;
      var c = COLOR_BY_ID[d.color] || { hex: '#999', name: '' };
      return {
        img: mugIcon(c.hex), name: 'Tassa personalitzada', url: '/crea-la-teva-tassa/',
        detail: '«' + esc([d.intro, d.word].filter(Boolean).join(' ')) + '» · ' + esc(c.name.toLowerCase()),
      };
    }
    var p = CAT.products[i.id];
    var col = COLOR_BY_ID[i.color];
    return {
      img: '<img class="line__img" src="' + (i.color ? '/images/tasses/' + i.id + '/' + i.color + '-front.jpg' : p.image) + '" alt="" width="72" height="72">',
      name: esc(p.name), url: p.url + (i.color ? '?color=' + i.color : ''),
      detail: col ? 'Interior i nansa: ' + esc(col.name.toLowerCase()) : '',
    };
  }

  function render() {
    var n = mugsCount();
    $$('[data-cart-count]').forEach(function (el) { el.textContent = n ? String(n) : ''; });
    $$('.cart-btn').forEach(function (b) { b.setAttribute('aria-label', 'Obre la cistella (' + n + ' ' + (n === 1 ? 'tassa' : 'tasses') + ')'); });
    if (!drawer) return;

    var body = $('[data-cart-items]', drawer);
    var foot = $('[data-cart-foot]', drawer);
    var upsell = $('[data-cart-upsell]', drawer);

    if (!cart.length) {
      body.innerHTML = '<div class="drawer__empty"><p>La cistella és buida.</p><a class="btn btn--primary" href="/tasses/">Veure les tasses</a></div>';
      foot.hidden = true; upsell.hidden = true;
      return;
    }

    body.innerHTML = cart.map(function (i, idx) {
      var info = lineInfo(i);
      var unit = unitPrice(i);
      var plain = info.name.replace(/<[^>]+>/g, '');
      return '<div class="line" data-line="' + idx + '" data-line-key="' + esc(keyOf(i)) + '">' + info.img +
        '<div><a class="line__name" href="' + info.url + '">' + info.name + '</a>' +
        (info.detail ? '<p class="line__detail">' + info.detail + '</p>' : '') +
        '<p class="line__unit">' + euro(unit) + ' / unitat</p>' +
        '<div class="qty"><button type="button" class="qty__btn" data-line-step="-1" aria-label="Una unitat menys de ' + plain + '">' + icon('minus') + '</button>' +
        '<span class="qty__input" aria-live="polite">' + i.qty + '</span>' +
        '<button type="button" class="qty__btn" data-line-step="1" aria-label="Una unitat més de ' + plain + '">' + icon('plus') + '</button></div></div>' +
        '<div><span class="line__total">' + euro(unit * i.qty) + '</span>' +
        '<button type="button" class="icon-btn line__remove" data-line-remove aria-label="Treu ' + plain + ' de la cistella">' + icon('trash') + '</button></div>' +
        '</div>';
    }).join('');

    var subtotal = cart.reduce(function (t, i) { return t + unitPrice(i) * i.qty; }, 0);
    $('[data-cart-subtotal]', drawer).textContent = euro(subtotal);
    $('[data-cart-shipping]', drawer).textContent = CAT.shippingCents ? euro(CAT.shippingCents) : 'Gratuït';
    $('[data-cart-total]', drawer).textContent = euro(subtotal + CAT.shippingCents);
    foot.hidden = false;

    // Venda creuada: tasses relacionades amb les que ja hi ha a la cistella.
    var inCart = cart.filter(function (i) { return i.type === 'mug'; }).map(function (i) { return i.id; });
    var suggestions = [];
    inCart.forEach(function (id) {
      (CAT.products[id].related || []).forEach(function (s) {
        if (CAT.products[s] && inCart.indexOf(s) === -1 && suggestions.indexOf(s) === -1 && stock[s] !== 0) suggestions.push(s);
      });
    });
    suggestions = suggestions.slice(0, 2);
    upsell.hidden = !suggestions.length;
    upsell.innerHTML = suggestions.length ? '<h3>Combina-la amb</h3>' + suggestions.map(function (s) {
      var p = CAT.products[s];
      return '<div class="upsell-item"><img src="' + p.image + '" alt="" width="48" height="48">' +
        '<div><a href="' + p.url + '">' + esc(p.name) + '</a><span>' + euro(p.priceCents) + '</span></div>' +
        '<button type="button" class="btn btn--small" data-add="' + s + '">Afegeix<span class="sr-only"> ' + esc(p.name) + '</span></button></div>';
    }).join('') : '';
  }

  function openCart() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    if (toastEl) toastEl.classList.remove('is-visible');
    render();
    backdrop.hidden = false;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    setTimeout(function () { var c = $('.drawer__head .icon-btn', drawer); if (c) c.focus(); }, 50);
  }
  function closeCart() {
    if (!drawer || !drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.hidden = true;
    document.body.classList.remove('is-locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('keydown', function (e) {
    if (!drawer || !drawer.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeCart();
    if (e.key === 'Tab') {
      var f = $$('a[href], button:not([disabled]), input', drawer).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  function selectedColor() {
    var checked = $('[data-color-input]:checked');
    return checked ? checked.value : null;
  }
  function productQty() {
    var input = $('[data-qty-input]');
    var v = input ? parseInt(input.value, 10) : 1;
    return Math.max(1, Math.min(CAT.maxQty, v || 1));
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('[data-cart-open]')) { e.preventDefault(); openCart(); return; }
    if (t.closest('[data-cart-close]')) { closeCart(); return; }

    var addBtn = t.closest('[data-add]');
    if (addBtn) {
      e.preventDefault();
      var slug = addBtn.getAttribute('data-add');
      var withQty = addBtn.hasAttribute('data-with-qty');
      var qty = withQty ? productQty() : 1;
      var color = withQty ? selectedColor() : null;
      if (add(slug, qty, color)) {
        var inDrawer = addBtn.closest('[data-cart]');
        var colorLabel = color && COLOR_BY_ID[color] ? ' (' + COLOR_BY_ID[color].name.toLowerCase() + ')' : '';
        if (!inDrawer) toast((qty > 1 ? qty + ' × ' : '') + '«' + CAT.products[slug].name + '»' + colorLabel + ' a la cistella', true);
        addBtn.classList.add('is-added');
        setTimeout(function () { addBtn.classList.remove('is-added'); }, 1200);
      }
      return;
    }

    var bothBtn = t.closest('[data-add-both]');
    if (bothBtn) {
      var pair = bothBtn.getAttribute('data-add-both').split(',');
      var ok = pair.filter(function (s, i) { return add(s, 1, i === 0 ? selectedColor() : null); });
      if (ok.length) toast(ok.length + ' tasses afegides a la cistella', true);
      return;
    }

    var packBtn = t.closest('[data-add-pack]');
    if (packBtn) {
      var packId = packBtn.getAttribute('data-add-pack');
      if (addPack(packId)) toast('«' + CAT.packs[packId].name + '» a la cistella', true);
      return;
    }

    var line = t.closest('[data-line]');
    if (line) {
      var idx = parseInt(line.getAttribute('data-line'), 10);
      var item = cart[idx];
      var step = t.closest('[data-line-step]');
      if (step && item) setQtyAt(idx, item.qty + parseInt(step.getAttribute('data-line-step'), 10));
      if (t.closest('[data-line-remove]')) setQtyAt(idx, 0);
      return;
    }

    var qtyStep = t.closest('[data-qty-step]');
    if (qtyStep) {
      var input = $('[data-qty-input]');
      input.value = Math.max(1, Math.min(CAT.maxQty, (parseInt(input.value, 10) || 1) + parseInt(qtyStep.getAttribute('data-qty-step'), 10)));
    }
  });

  var checkoutBtn = $('[data-checkout]');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
      if (!cart.length) return;
      checkoutBtn.disabled = true;
      var label = checkoutBtn.textContent;
      checkoutBtn.textContent = 'Obrint el pagament segur…';
      postJSON('create-checkout-session', { items: cart.map(function (i) { return { type: i.type, id: i.id, color: i.color, design: i.design, qty: i.qty }; }) })
        .then(function (data) { if (!data.url) throw new Error('no-url'); window.location.href = data.url; })
        .catch(function (err) {
          var msg = err.status ? err.message : "No hem pogut connectar amb el pagament. Comprova la connexió i torna-ho a provar.";
          toast(msg);
          checkoutBtn.disabled = false;
          checkoutBtn.textContent = label;
        });
    });
  }

  if ($('[data-order-complete]')) { cart = []; storage.del(CART_KEY); }
  storage.del('senseSucreCart');
  render();

  // ---------- Galeria de la fitxa (carrusel amb miniatures) ----------
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gallery = $('[data-gallery]');
  if (gallery) {
    var track = $('[data-gallery-track]', gallery);
    var thumbs = $$('.gallery__thumb', gallery);
    var setActive = function (i) {
      thumbs.forEach(function (b, j) { b.classList.toggle('is-active', i === j); b.setAttribute('aria-pressed', String(i === j)); });
    };
    thumbs.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        track.scrollTo({ left: track.clientWidth * i, behavior: reducedMotion ? 'auto' : 'smooth' });
        setActive(i);
      });
    });
    var scrollTimer;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () { setActive(Math.round(track.scrollLeft / track.clientWidth)); }, 80);
    }, { passive: true });
  }

  // ---------- Selector de color de la fitxa ----------
  var picker = $('[data-color-picker]');
  if (picker) {
    var colorName = $('[data-color-name]', picker);
    var applyColor = function (input) {
      colorName.textContent = input.getAttribute('data-name');
      var slides = $$('.gallery__img');
      var thumbs = $$('.gallery__thumb img');
      if (slides[0]) slides[0].src = input.getAttribute('data-front');
      if (slides[1] && input.getAttribute('data-back')) slides[1].src = input.getAttribute('data-back');
      if (thumbs[0]) thumbs[0].src = input.getAttribute('data-front');
      if (thumbs[1] && input.getAttribute('data-back')) thumbs[1].src = input.getAttribute('data-back');
    };
    $$('[data-color-input]', picker).forEach(function (input) {
      input.addEventListener('change', function () {
        applyColor(input);
        try { history.replaceState(null, '', '?color=' + input.value); } catch (err) { /* sense historial */ }
      });
    });
    var wanted = (location.search.match(/[?&]color=([a-z]+)/) || [])[1];
    var pre = wanted && $('[data-color-input][value="' + wanted + '"]', picker);
    if (pre) { pre.checked = true; applyColor(pre); }
  }

  // ---------- Recomanador de regals ----------
  var finder = $('#recomanador');
  if (finder) {
    var finderResults = $('[data-finder-results]', finder);
    var finderStatus = $('[data-finder-status]', finder);
    var finderMore = $('[data-finder-more]', finder);
    var finderShow = parseInt(finderResults.getAttribute('data-show'), 10) || 4;
    $$('[data-finder-option]', finder).forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('[data-finder-option]', finder).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        var slugs = btn.getAttribute('data-slugs').split(',').filter(Boolean);
        var frag = document.createDocumentFragment();
        slugs.slice(0, finderShow).forEach(function (s) {
          var tpl = $('template[data-card-template="' + s + '"]');
          if (tpl) frag.appendChild(tpl.content.cloneNode(true));
        });
        finderResults.replaceChildren(frag);
        finderStatus.textContent = slugs.length + ' tasses ' + btn.textContent.toLowerCase();
        if (finderMore) {
          finderMore.href = btn.getAttribute('data-href');
          finderMore.firstChild.textContent = 'Veure-les totes (' + slugs.length + ') ';
        }
      });
    });
  }

  // ---------- Hero: la paraula canvia sola (amb botó per aturar-la) ----------
  var heroStage = $('[data-hero-words]');
  if (heroStage) {
    var heroWords = $$('[data-hero-word]', heroStage);
    var heroPause = $('[data-hero-pause]', heroStage);
    var heroIdx = 0;
    var heroTimer = null;
    var showWord = function (i) {
      heroWords.forEach(function (w, j) { w.hidden = i !== j; w.classList.toggle('is-active', i === j); });
    };
    var heroStart = function () { heroTimer = setInterval(function () { heroIdx = (heroIdx + 1) % heroWords.length; showWord(heroIdx); }, 4500); };
    var heroStop = function () { clearInterval(heroTimer); heroTimer = null; };
    if (heroWords.length > 1 && !reducedMotion) {
      heroPause.hidden = false;
      heroStart();
      heroPause.addEventListener('click', function () {
        var paused = heroTimer === null;
        if (paused) heroStart(); else heroStop();
        heroPause.setAttribute('aria-pressed', String(!paused));
        heroPause.innerHTML = icon(paused ? 'pause' : 'play') + '<span class="sr-only">' + (paused ? 'Atura' : 'Reprèn') + ' el canvi de paraules</span>';
      });
      heroStage.addEventListener('focusin', function (e) { if (heroTimer && e.target !== heroPause) heroPause.click(); });
    }
  }

  // ---------- Tassa que gira (davant / darrere) ----------
  var flipFig = $('[data-flip]');
  if (flipFig) {
    var flipBtn = $('[data-flip-toggle]', flipFig);
    var flipLabel = $('[data-flip-label]', flipFig);
    var flipImgs = $$('.flip__img', flipFig);
    flipImgs[1].setAttribute('aria-hidden', 'true');
    flipBtn.addEventListener('click', function () {
      var on = flipFig.classList.toggle('is-flipped');
      flipBtn.setAttribute('aria-pressed', String(on));
      flipLabel.textContent = on ? 'Darrere: la definició' : 'Davant: el missatge';
      flipImgs[0].setAttribute('aria-hidden', String(on));
      flipImgs[1].setAttribute('aria-hidden', String(!on));
    });
  }

  // ---------- Barra de compra fixa (mòbil) ----------
  var sticky = $('[data-sticky-buy]');
  var mainActions = $('[data-main-actions]');
  if (sticky && mainActions && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      sticky.hidden = entries[0].isIntersecting || entries[0].boundingClientRect.top > 0;
    }).observe(mainActions);
  }

  // ---------- Valoracions: estrelles ----------
  function starsHtml(value) {
    var out = '<span class="stars" aria-hidden="true">';
    for (var i = 1; i <= 5; i++) out += icon('star', 'icon--fill' + (value >= i - 0.25 ? '' : ' is-empty'));
    return out + '</span>';
  }
  var avgText = function (r) { return String(r.average).replace('.', ',') + ' de 5 · ' + r.count + ' ' + (r.count === 1 ? 'valoració' : 'valoracions'); };
  function reviewHtml(r, withProduct) {
    return '<blockquote class="review"><div class="review__head"><span class="review__name">' + esc(r.name) + '</span>' +
      '<span>' + starsHtml(r.rating) + '<span class="sr-only">' + r.rating + ' de 5</span></span></div>' +
      '<p class="review__text">' + esc(r.comment) + '</p>' +
      '<p class="review__meta">' + esc(r.date) + '</p>' +
      (withProduct ? '<p class="review__product"><a href="/tasses/' + esc(r.slug) + '/">Tassa ' + esc(r.productName) + '</a></p>' : '') +
      '</blockquote>';
  }

  // ---------- Dades reals de la botiga: estoc, valoracions, més venuts ----------
  fetch(API + 'store-data').then(function (r) { return r.ok ? r.json() : null; }).then(function (data) {
    if (!data) return;
    stock = data.stock || {};
    var ratings = data.ratings || {};

    $$('[data-product]').forEach(function (card) {
      var slug = card.getAttribute('data-product');
      var rating = ratings[slug];
      var ratingEl = $('[data-rating]', card);
      if (rating && ratingEl) { ratingEl.innerHTML = starsHtml(rating.average) + '<span>' + avgText(rating) + '</span>'; ratingEl.hidden = false; }
      if (stock[slug] === 0) {
        var badge = $('[data-stock-badge]', card);
        if (badge) { badge.textContent = 'Exhaurida'; badge.hidden = false; }
        $$('[data-add]', card).forEach(function (b) { b.disabled = true; b.textContent = 'Exhaurida'; });
      }
    });

    var page = $('[data-product-page]');
    if (page) {
      var slug = page.getAttribute('data-product-page');
      var note = $('[data-stock-note]');
      if (stock[slug] === 0) {
        note.textContent = 'Aquesta tassa s\'ha exhaurit de moment.'; note.hidden = false;
        $$('[data-add="' + slug + '"]').forEach(function (b) { b.disabled = true; b.textContent = 'Exhaurida'; });
      } else if (typeof stock[slug] === 'number' && stock[slug] <= 3) {
        note.textContent = 'Només en queden ' + stock[slug] + '.'; note.hidden = false;
      }
    }

    var best = $('[data-bestsellers]');
    if (best && data.bestsellers && data.bestsellers.length) {
      var grid = $('[data-bestsellers-grid]', best);
      data.bestsellers.forEach(function (s) {
        var tpl = $('template[data-card-template="' + s + '"]');
        if (tpl) grid.appendChild(tpl.content.cloneNode(true));
      });
      best.hidden = false;
    }

    var latest = $('[data-latest-reviews]');
    if (latest && data.latest && data.latest.length) {
      latest.innerHTML = data.latest.slice(0, 3).map(function (r) { return reviewHtml(r, true); }).join('');
    }
    render();
  }).catch(function () { /* sense dades: la botiga funciona igualment, sense límits d'estoc */ });

  // ---------- Valoracions a la fitxa ----------
  var reviewForm = $('[data-review-form]');
  if (reviewForm) {
    var slug = reviewForm.getAttribute('data-slug');
    var startedAt = Date.now();
    fetch(API + 'reviews?slug=' + encodeURIComponent(slug)).then(function (r) { return r.ok ? r.json() : null; }).then(function (data) {
      if (!data || !data.count) return;
      $('[data-reviews-summary]').innerHTML = '<div class="review-summary"><span class="review-summary__avg">' + String(data.average).replace('.', ',') + '</span><div>' + starsHtml(data.average) + '<p class="review__meta">' + data.count + ' ' + (data.count === 1 ? 'valoració' : 'valoracions') + '</p></div></div>';
      $('[data-reviews-list]').innerHTML = data.reviews.map(function (r) { return reviewHtml(r, false); }).join('');
      var summary = $('[data-rating-summary]');
      if (summary) summary.innerHTML = starsHtml(data.average) + '<span>' + avgText(data) + '</span>';
    }).catch(function () {});

    reviewForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('[data-form-status]', reviewForm);
      var fd = new FormData(reviewForm);
      if (!fd.get('rating')) return setStatus(status, 'Tria una puntuació d\'1 a 5 estrelles.', false);
      if (!reviewForm.checkValidity()) { reviewForm.reportValidity(); return; }
      var btn = $('button[type="submit"]', reviewForm);
      btn.disabled = true;
      postJSON('reviews', { slug: slug, name: fd.get('name'), rating: Number(fd.get('rating')), comment: fd.get('comment'), website: fd.get('website'), startedAt: startedAt })
        .then(function (data) { setStatus(status, data.message, true); reviewForm.reset(); })
        .catch(function (err) { setStatus(status, err.status ? err.message : 'No s\'ha pogut enviar. Torna-ho a provar.', false); btn.disabled = false; });
    });
  }

  // ---------- Newsletter ----------
  $$('[data-newsletter-form]').forEach(function (form) {
    var startedAt = Date.now();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('[data-form-status]', form);
      var email = form.elements.email;
      var consent = form.elements.consent;
      email.setAttribute('aria-invalid', String(!email.validity.valid));
      if (!email.validity.valid) return setStatus(status, 'Escriu una adreça de correu vàlida.', false);
      if (!consent.checked) return setStatus(status, 'Marca la casella de consentiment per subscriure\'t.', false);
      var btn = $('button[type="submit"]', form);
      btn.disabled = true;
      postJSON('newsletter', { action: 'subscribe', email: email.value, consent: true, source: form.getAttribute('data-source'), website: form.elements.website.value, startedAt: startedAt })
        .then(function (data) { setStatus(status, data.message, true); form.reset(); })
        .catch(function (err) { setStatus(status, err.status ? err.message : 'No s\'ha pogut enviar. Torna-ho a provar.', false); })
        .then(function () { btn.disabled = false; });
    });
  });

  var nlAction = $('[data-nl-action]');
  if (nlAction) {
    var params = new URLSearchParams(location.search);
    var actionBtn = $('[data-nl-action-btn]', nlAction);
    var actionStatus = $('[data-form-status]', nlAction);
    if (!params.get('id') || !params.get('t')) {
      actionBtn.disabled = true;
      setStatus(actionStatus, "L'enllaç no és complet. Obre'l directament des del correu.", false);
    }
    actionBtn.addEventListener('click', function () {
      actionBtn.disabled = true;
      postJSON('newsletter', { action: nlAction.getAttribute('data-nl-action'), id: params.get('id'), t: params.get('t') })
        .then(function (data) { setStatus(actionStatus, data.message, true); actionBtn.hidden = true; })
        .catch(function (err) { setStatus(actionStatus, err.status ? err.message : 'No s\'ha pogut completar. Torna-ho a provar.', false); actionBtn.disabled = false; });
    });
  }

  // ---------- Contacte (Netlify Forms) ----------
  var contact = $('[data-contact-form]');
  if (contact) {
    contact.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('[data-form-status]', contact);
      if (!contact.checkValidity()) { contact.reportValidity(); return; }
      var btn = $('button[type="submit"]', contact);
      btn.disabled = true;
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(contact)).toString() })
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          setStatus(status, 'Gràcies! Hem rebut el teu missatge i et respondrem per correu.', true);
          contact.reset();
        })
        .catch(function () { setStatus(status, 'No s\'ha pogut enviar el missatge. Torna-ho a provar d\'aquí a una estona.', false); })
        .then(function () { btn.disabled = false; });
    });
  }

  // ---------- Consentiment de cookies ----------
  // Ara mateix només hi ha emmagatzematge tècnic necessari. Si s'afegeix
  // analítica o publicitat, cal carregar-la només dins de TDMConsent.onGrant().
  var grantHandlers = [];
  window.TDMConsent = {
    get: function () {
      var c = storage.get(CONSENT_KEY);
      var fresh = c && Date.now() - new Date(c.date).getTime() < 365 * 86400000;
      return c && c.version === CONSENT_VERSION && fresh ? c : null;
    },
    has: function (cat) { var c = this.get(); return !!(c && c[cat]); },
    onGrant: function (cat, fn) { grantHandlers.push({ cat: cat, fn: fn }); if (this.has(cat)) fn(); },
  };

  function saveConsent(analytics) {
    var record = { version: CONSENT_VERSION, necessary: true, analytics: !!analytics, date: new Date().toISOString() };
    storage.set(CONSENT_KEY, record);
    grantHandlers.forEach(function (h) { if (record[h.cat]) h.fn(); });
    closeConsent();
  }

  var consentEl;
  function closeConsent() { if (consentEl) { consentEl.remove(); consentEl = null; } }
  function showConsent(configure) {
    closeConsent();
    var current = window.TDMConsent.get();
    consentEl = document.createElement('section');
    consentEl.className = 'consent';
    consentEl.setAttribute('aria-label', 'Preferències de cookies');
    consentEl.innerHTML =
      '<h2>Cookies</h2>' +
      '<p>Fem servir només l\'emmagatzematge necessari perquè la botiga funcioni (per exemple, recordar la cistella). No fem servir cookies d\'analítica ni de publicitat. <a href="/cookies/">Més informació</a>.</p>' +
      (configure ? '<div class="consent__options">' +
        '<label class="consent__option"><strong>Necessàries</strong><span>Cistella i preferències de cookies. Sempre actives.</span><input type="checkbox" checked disabled></label>' +
        '<label class="consent__option"><strong>Analítiques i de màrqueting</strong><span>Ara mateix no en fem servir cap. Si n\'afegim, només s\'activaran si ho acceptes aquí.</span><input type="checkbox" data-consent-analytics' + (current && current.analytics ? ' checked' : '') + '></label>' +
        '</div>' : '') +
      '<div class="consent__actions">' +
      '<button type="button" class="btn btn--primary" data-consent="reject">Rebutja les opcionals</button>' +
      (configure ? '<button type="button" class="btn btn--ghost" data-consent="save">Desa la configuració</button>'
        : '<button type="button" class="btn btn--ghost" data-consent="configure">Configura</button>') +
      '<button type="button" class="btn btn--primary" data-consent="accept">Accepta-les totes</button>' +
      '</div>';
    document.body.appendChild(consentEl);
    consentEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-consent]');
      if (!b) return;
      var a = b.getAttribute('data-consent');
      if (a === 'accept') saveConsent(true);
      if (a === 'reject') saveConsent(false);
      if (a === 'configure') showConsent(true);
      if (a === 'save') saveConsent($('[data-consent-analytics]', consentEl).checked);
    });
  }

  document.addEventListener('click', function (e) { if (e.target.closest('[data-cookie-settings]')) showConsent(true); });
  if (!window.TDMConsent.get() && !document.body.classList.contains('page-admin')) showConsent(false);
})();
