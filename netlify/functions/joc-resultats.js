// Resultats del joc «Agència Digital» per al professorat.
//
// - Els alumnes que han posat un codi de classe envien el resum de la seva
//   partida (action: 'submit'). No cal contrasenya: cada alumne té un
//   identificador aleatori i només pot sobreescriure el seu propi resum.
// - El professor consulta i esborra resultats des de joc/professor.html amb
//   la contrasenya de la variable d'entorn TEACHER_PASSWORD (si no existeix,
//   es fa servir ADMIN_PASSWORD, la mateixa de la pàgina d'estoc).
//
// Es desa a Netlify Blobs, al magatzem 'joc-resultats', amb la clau
// "<CLASSE>/<id de l'alumne>".
//
// Configuració de cada classe (magatzem 'joc-classes', clau "<CLASSE>"):
// - grants: diners que el professor dona a un alumne o a tota la classe. El joc de
//   l'alumne els aplica una sola vegada (recorda els identificadors que ja ha aplicat).
// - deadlines: data d'entrega de cada nivell del Taller web per a tota la classe.
// - extensions: pròrrogues d'un alumne concret per a un nivell.
// L'alumne la consulta amb action 'sync' (només amb el codi de classe i el seu id).
const { getStore, connectLambda } = require('@netlify/blobs');

const MAX_BYTES = 60 * 1024;
const CLASS_RE = /^[A-Z0-9_-]{1,32}$/;
const ID_RE = /^[a-z0-9-]{8,40}$/;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_GRANT = 100000;
const MAX_GRANTS = 300;

const emptyConfig = () => ({ grants: [], deadlines: {}, extensions: {} });
const validDate = (d) => DATE_RE.test(d) && !Number.isNaN(Date.parse(d + 'T12:00:00Z'));
const validLevel = (n) => /^\d{1,2}$/.test(String(n)) && +n >= 1 && +n <= 20;
const cleanText = (t, max) => String(t == null ? '' : t).replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
const randomId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

async function readConfig(store, classe) {
  return Object.assign(emptyConfig(), (await store.get(classe, { type: 'json' }).catch(() => null)) || {});
}

/** El que veu un alumne: els seus diners (i els de tota la classe) i les seves dates. */
function studentView(cfg, id) {
  return {
    grants: cfg.grants.filter((g) => g.to === '*' || g.to === id).map(({ gid, amount, reason, at }) => ({ gid, amount, reason, at })),
    deadlines: Object.assign({}, cfg.deadlines, cfg.extensions[id] || {}),
  };
}

const json = (statusCode, body) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

function teacherPassword() {
  return process.env.TEACHER_PASSWORD || process.env.ADMIN_PASSWORD || '';
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  if ((event.body || '').length > MAX_BYTES) return json(413, { error: 'Les dades són massa grans.' });

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return json(400, { error: 'Petició no vàlida.' });
  }

  connectLambda(event);
  const store = getStore('joc-resultats');
  const classes = getStore({ name: 'joc-classes', consistency: 'strong' });

  if (body.action === 'sync') {
    const classe = String(body.classe || '');
    const id = String(body.id || '');
    if (!CLASS_RE.test(classe) || !ID_RE.test(id)) return json(400, { error: 'Alumne no vàlid.' });
    return json(200, studentView(await readConfig(classes, classe), id));
  }

  if (body.action === 'submit') {
    const classe = String(body.classe || '');
    const id = String(body.id || '');
    if (!CLASS_RE.test(classe)) return json(400, { error: 'Codi de classe no vàlid.' });
    if (!ID_RE.test(id)) return json(400, { error: 'Identificador d\'alumne no vàlid.' });
    if (!body.data || typeof body.data !== 'object') return json(400, { error: 'Falten les dades.' });
    const data = Object.assign({}, body.data, { id, classe, rebut: new Date().toISOString() });
    await store.setJSON(`${classe}/${id}`, data);
    return json(200, { ok: true });
  }

  // A partir d'aquí, accions del professorat
  const password = teacherPassword();
  if (!password) {
    console.error('Falta la variable d\'entorn TEACHER_PASSWORD (o ADMIN_PASSWORD) a Netlify.');
    return json(500, { error: 'El panell del professorat no està configurat.' });
  }
  if (body.password !== password) return json(401, { error: 'Contrasenya incorrecta.' });

  if (body.action === 'list') {
    const classe = body.classe ? String(body.classe) : '';
    if (classe && !CLASS_RE.test(classe)) return json(400, { error: 'Codi de classe no vàlid.' });
    const { blobs } = await store.list(classe ? { prefix: `${classe}/` } : {});
    const results = (await Promise.all(blobs.map(b => store.get(b.key, { type: 'json' }).catch(() => null)))).filter(Boolean);
    return json(200, { results });
  }

  if (body.action === 'delete') {
    const key = `${body.classe}/${body.id}`;
    if (!CLASS_RE.test(String(body.classe || '')) || !ID_RE.test(String(body.id || ''))) return json(400, { error: 'Alumne no vàlid.' });
    await store.delete(key);
    return json(200, { ok: true });
  }

  // Configuració de la classe: diners i dates d'entrega
  if (['config', 'grant', 'grant-delete', 'deadlines', 'extension'].includes(body.action)) {
    const classe = String(body.classe || '');
    if (!CLASS_RE.test(classe)) return json(400, { error: 'Tria una classe (codi de classe) per fer-ho.' });
    const cfg = await readConfig(classes, classe);

    if (body.action === 'grant') {
      const amount = Math.round(Number(body.amount));
      const to = String(body.to || '');
      if (!Number.isFinite(amount) || amount < 1 || amount > MAX_GRANT) return json(400, { error: `La quantitat ha de ser entre 1 i ${MAX_GRANT} €.` });
      if (to !== '*' && !ID_RE.test(to)) return json(400, { error: 'Alumne no vàlid.' });
      if (cfg.grants.length >= MAX_GRANTS) return json(400, { error: 'Aquesta classe ja té massa ingressos. Esborra\'n algun d\'antic.' });
      cfg.grants.push({ gid: randomId(), to, toName: cleanText(body.toName, 80), amount, reason: cleanText(body.reason, 120), at: new Date().toISOString() });
    } else if (body.action === 'grant-delete') {
      cfg.grants = cfg.grants.filter((g) => g.gid !== String(body.gid || ''));
    } else if (body.action === 'deadlines') {
      const d = body.deadlines && typeof body.deadlines === 'object' ? body.deadlines : {};
      const next = {};
      for (const [n, date] of Object.entries(d)) {
        if (!validLevel(n)) return json(400, { error: 'Nivell no vàlid.' });
        if (date && !validDate(String(date))) return json(400, { error: 'Data no vàlida.' });
        if (date) next[String(+n)] = String(date);
      }
      cfg.deadlines = next;
    } else if (body.action === 'extension') {
      const id = String(body.id || '');
      const n = String(body.level || '');
      const date = String(body.date || '');
      if (!ID_RE.test(id) || !validLevel(n)) return json(400, { error: 'Alumne o nivell no vàlid.' });
      if (date && !validDate(date)) return json(400, { error: 'Data no vàlida.' });
      const ext = Object.assign({}, cfg.extensions[id] || {});
      if (date) ext[String(+n)] = date; else delete ext[String(+n)];
      if (Object.keys(ext).length) cfg.extensions[id] = ext; else delete cfg.extensions[id];
    }

    if (body.action !== 'config') await classes.setJSON(classe, cfg);
    return json(200, { config: cfg });
  }

  return json(400, { error: 'Acció desconeguda.' });
};
