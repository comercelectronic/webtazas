// Comprovacions automàtiques dels textos que envien els usuaris.
//
// - "block": es rebutja directament (publicitat, enllaços, dades de contacte).
// - "flags": no es rebutja, però s'avisa la persona que modera.
//
// Cap valoració es publica sense que algú l'aprovi a /admin/, així que
// aquestes regles només són una primera criba.

const LINK_RE = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|es|cat|io|ru|info|biz|xyz|shop|online)\b)/i;
const EMAIL_RE = /[^\s@]+@[^\s@]+\.[a-z]{2,}/i;
const PHONE_RE = /(\+?\d[\s.-]?){9,}/;
const SPAM_WORDS = [
  'viagra', 'casino', 'bitcoin', 'crypto', 'cripto', 'forex', 'préstamo', 'prestamo', 'préstec',
  'seo services', 'backlink', 'onlyfans', 'porn', 'xxx', 'loan', 'telegram', 'whatsapp',
];
// Paraules ofensives greus (no els insults humorístics de les tasses):
// marquen la valoració perquè la persona moderadora hi pari atenció.
const OFFENSIVE_WORDS = [
  'nazi', 'puta', 'puto', 'maricón', 'maricon', 'marica', 'subnormal', 'retrasado', 'negrata',
  'moro de merda', 'sudaca', 'fag', 'nigger', 'retard', 'kill yourself', 'mátate', 'mata\'t',
];

function normalize(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function check(text) {
  const t = String(text || '');
  const n = normalize(t);
  if (LINK_RE.test(t)) return { block: "No s'hi poden incloure enllaços ni adreces web." };
  if (EMAIL_RE.test(t) || PHONE_RE.test(t)) return { block: "No s'hi poden incloure dades de contacte." };
  if (SPAM_WORDS.some((w) => n.includes(normalize(w)))) return { block: 'El text sembla publicitat.' };

  const flags = [];
  if (OFFENSIVE_WORDS.some((w) => n.includes(normalize(w)))) flags.push('possible contingut ofensiu');
  if (/(.)\1{6,}/.test(n)) flags.push('caràcters repetits');
  const letters = t.replace(/[^A-Za-zÀ-ÿ]/g, '');
  if (letters.length > 20 && letters === letters.toUpperCase()) flags.push('tot en majúscules');
  return { flags };
}

module.exports = { check };
