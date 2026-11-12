// Valoracions de les tasses.
//   GET  ?slug=aixopluc   → valoracions aprovades i mitjana real
//   POST {slug, name, rating, comment, website, startedAt}
//        → es desa com a pendent; no es publica fins que s'aprova a /admin/.
const crypto = require('crypto');
const { PRODUCTS } = require('./lib/catalog');
const { json, parseJson, store, ipHash, rateLimit } = require('./lib/http');
const { check } = require('./lib/moderation');
const { publicReview, summarize, approvedFor } = require('./lib/reviews');

const RECEIVED = "Gràcies! Hem rebut la teva valoració. La revisarem i, si compleix les normes, la publicarem en uns dies.";

exports.handler = async function (event) {
  try {
    if (event.httpMethod === 'GET') {
      const slug = (event.queryStringParameters || {}).slug;
      if (!PRODUCTS[slug]) return json(404, { error: 'Producte desconegut.' });
      const list = await approvedFor(store(event, 'reviews'), slug);
      return json(200, { ...summarize(list), reviews: list.slice().reverse().map(publicReview) });
    }

    if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });

    const { body, error } = parseJson(event, 6000);
    if (error) return error;

    const elapsed = Date.now() - Number(body.startedAt || 0);
    if (body.website || !Number.isFinite(elapsed) || elapsed < 4000) return json(202, { ok: true, message: RECEIVED });

    const slug = String(body.slug || '');
    const name = String(body.name || '').trim().replace(/\s+/g, ' ');
    const comment = String(body.comment || '').trim();
    const rating = Number(body.rating);

    if (!PRODUCTS[slug]) return json(400, { error: 'Producte desconegut.' });
    if (name.length < 2 || name.length > 40) return json(400, { error: 'El nom o pseudònim ha de tenir entre 2 i 40 caràcters.' });
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return json(400, { error: 'Tria una puntuació d\'1 a 5 estrelles.' });
    if (comment.length < 10 || comment.length > 1000) return json(400, { error: 'El comentari ha de tenir entre 10 i 1.000 caràcters.' });

    const verdict = check(`${name}\n${comment}`);
    if (verdict.block) return json(400, { error: verdict.block });

    const st = store(event, 'reviews');
    const ih = ipHash(event);
    const guardKey = `guard/${slug}/${ih}`;
    if (await st.get(guardKey)) return json(409, { error: 'Ja has enviat una valoració per a aquesta tassa. Gràcies!' });
    if (!(await rateLimit(st, `review/${ih}`, 5))) return json(429, { error: 'Has enviat massa valoracions avui. Torna-ho a provar demà.' });

    const id = crypto.randomBytes(8).toString('hex');
    await st.setJSON(`pending/${id}`, {
      id, slug, name, rating, comment,
      createdAt: new Date().toISOString(),
      ipHash: ih,
      flags: verdict.flags,
    });
    await st.set(guardKey, new Date().toISOString());
    return json(202, { ok: true, message: RECEIVED });
  } catch (err) {
    console.error('Error a les valoracions:', err);
    return json(500, { error: "S'ha produït un error. Torna-ho a provar." });
  }
};
