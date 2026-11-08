/* Agència Digital — idiomes (català, castellà, anglès)
 * El text original és en català. T('text català', [arguments]) retorna la traducció de l'idioma actiu,
 * buscant-la pel hash del text català als diccionaris i18n-es.js / i18n-en.js.
 * Si una traducció no existeix, es mostra el text català. */
(function () {
  'use strict';
  const KEY = 'agencia-digital-lang';
  const SUPPORTED = ['ca', 'es', 'en'];
  let lang = null;
  try { lang = localStorage.getItem(KEY); } catch (e) { }
  if (!SUPPORTED.includes(lang)) {
    const n = (navigator.language || 'ca').slice(0, 2).toLowerCase();
    lang = n === 'es' ? 'es' : n === 'en' ? 'en' : 'ca';
  }
  window.LANG = lang;
  window.LOCALE = { ca: 'ca-ES', es: 'es-ES', en: 'en-GB' }[lang];
  window.DEC = lang === 'en' ? '.' : ',';
  window.LANGS = [['ca', 'Català'], ['es', 'Castellano'], ['en', 'English']];
  window.I18N = {};

  function hash(s) {
    let x = 5381;
    for (let i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) | 0;
    return (x >>> 0).toString(36);
  }
  window.T = function (ca, args) {
    let s = lang === 'ca' ? null : I18N[hash(ca)];
    if (s == null) s = ca;
    if (args) s = s.replace(/\{(\d+)\}/g, (m, i) => args[i]);
    return s;
  };
  window.T.hash = hash;
  window.setLang = function (l) {
    try { localStorage.setItem(KEY, l); } catch (e) { }
    location.reload();
  };
  // Tradueix els elements HTML estàtics marcats amb data-t
  window.translateDom = function (root) {
    (root || document).querySelectorAll('[data-t]').forEach(el => { el.innerHTML = T(el.innerHTML.trim()); });
    (root || document).querySelectorAll('[data-t-ph]').forEach(el => { el.placeholder = T(el.placeholder); });
  };
  document.documentElement.lang = lang;
  if (lang !== 'ca') {
    const base = document.currentScript ? document.currentScript.src.replace(/i18n\.js.*$/, '') : 'js/';
    document.write('<script src="' + base + 'i18n-' + lang + '.js"><\/script>');
  }
})();
