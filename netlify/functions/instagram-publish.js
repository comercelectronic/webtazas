// Funció programada (cada hora, vegeu netlify.toml): publica a Instagram la
// següent publicació aprovada de data/instagram.json quan arriba la seva hora.
//
// No fa res fins que hi ha IG_USER_ID i IG_ACCESS_TOKEN a Netlify, i només
// publica les entrades amb "approved": true. Com a màxim una per hora.
const queue = require('../../data/instagram.json');
const site = require('../../data/site.json');
const { store } = require('./lib/http');
const { publish, currentToken, pickDue } = require('./lib/instagram');

exports.handler = async function (event) {
  const userId = process.env.IG_USER_ID;
  if (!userId || !process.env.IG_ACCESS_TOKEN) {
    console.log('Instagram: falten IG_USER_ID o IG_ACCESS_TOKEN; no es publica res.');
    return { statusCode: 200, body: 'not configured' };
  }

  const db = store(event, 'instagram');
  const published = (await db.get('published', { type: 'json' })) || {};
  const { due, late } = pickDue(queue.posts || [], published);
  if (late.length) console.warn(`Instagram: publicacions aprovades massa endarrerides (canvia'ls la data): ${late.join(', ')}`);
  if (!due) return { statusCode: 200, body: 'nothing due' };

  const origin = (process.env.SITE_URL || process.env.URL || site.siteUrl).replace(/\/$/, '');
  try {
    const token = await currentToken(db);
    const mediaId = await publish({
      userId,
      token,
      images: due.images.map((i) => origin + i),
      caption: due.caption,
    });
    published[due.id] = { mediaId, at: new Date().toISOString() };
    await db.setJSON('published', published);
    console.log(`Instagram: publicada «${due.id}» (${mediaId}).`);
    return { statusCode: 200, body: `published ${due.id}` };
  } catch (err) {
    console.error(`Instagram: error publicant «${due.id}»:`, err.message);
    return { statusCode: 500, body: 'error' };
  }
};
