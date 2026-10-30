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
const { getStore, connectLambda } = require('@netlify/blobs');

const MAX_BYTES = 60 * 1024;
const CLASS_RE = /^[A-Z0-9_-]{1,32}$/;
const ID_RE = /^[a-z0-9-]{8,40}$/;

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

  return json(400, { error: 'Acció desconeguda.' });
};
