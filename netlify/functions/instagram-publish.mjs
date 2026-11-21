// Funció programada: cada 15 minuts publica a Instagram la següent publicació
// aprovada de data/instagram.json quan arriba la seva hora.
//
// Només cal la variable IG_ACCESS_TOKEN a Netlify (IG_USER_ID és opcional).
// Sense token no fa res, i només publica les entrades amb "approved": true,
// com a màxim una per execució. Es pot provar des de Netlify: Functions →
// instagram-publish → «Run now», i el registre diu amb quin compte connecta.
import queue from '../../data/instagram.json' with { type: 'json' };
import site from '../../data/site.json' with { type: 'json' };
import { getStore } from '@netlify/blobs';
import ig from './lib/instagram.js';

export default async function handler() {
  if (queue.paused === true || process.env.IG_PAUSED === 'true') {
    console.log('Instagram: publicació automàtica en pausa; no es publica res.');
    return new Response('paused');
  }
  if (!ig.envToken()) {
    console.log('Instagram: falta IG_ACCESS_TOKEN; no es publica res.');
    return new Response('not configured');
  }
  return run(getStore({ name: 'instagram', consistency: 'strong' }));
}

/** Feina de cada execució; `db` és el magatzem de Blobs (substituïble a les proves). */
export async function run(db) {
  const published = (await db.get('published', { type: 'json' })) || {};
  const { due, late } = ig.pickDue(queue.posts || [], published);
  if (late.length) console.warn(`Instagram: publicacions aprovades massa endarrerides (canvia'ls la data): ${late.join(', ')}`);

  try {
    const token = await ig.currentToken(db);
    const configuredId = process.env.IG_USER_ID || queue.igUserId;
    const account = await ig.whoAmI(token, configuredId);
    const userId = configuredId || account.user_id;
    const pending = (queue.posts || []).filter((p) => p.approved === true && !published[p.id]).length;
    console.log(`Instagram: connectat com @${account.username}. Aprovades pendents: ${pending}.`);
    if (!due) return new Response('nothing due');

    // Mai dues vegades la mateixa publicació:
    // 1) si ja és al compte (mateix text), només l'anotem;
    // 2) abans de publicar, anotem «publicant» a Blobs; si no es pot anotar, no es publica;
    // 3) una publicació que s'havia quedat a mig fer no es repeteix (cal revisar-la a mà).
    const already = await ig.findPublished(userId, token, due.caption);
    if (already) {
      published[due.id] = { mediaId: already, at: new Date().toISOString(), found: true };
      await db.setJSON('published', published);
      console.log(`Instagram: «${due.id}» ja era al compte (${already}); no es torna a publicar.`);
      return new Response(`already ${due.id}`);
    }
    published[due.id] = { status: 'publishing', at: new Date().toISOString() };
    await db.setJSON('published', published);

    const origin = (process.env.SITE_URL || site.siteUrl).replace(/\/$/, '');
    const mediaId = await ig.publish({
      userId,
      token,
      images: due.images.map((i) => origin + i),
      caption: due.caption,
    });
    published[due.id] = { mediaId, at: new Date().toISOString() };
    await db.setJSON('published', published);
    console.log(`Instagram: publicada «${due.id}» (${mediaId}).`);
    return new Response(`published ${due.id}`);
  } catch (err) {
    console.error(`Instagram: error${due ? ` publicant «${due.id}»` : ''}:`, err.message);
    if (due) console.error(`Instagram: «${due.id}» queda marcada i no es tornarà a intentar sola. Comprova el compte.`);
    if (/access token/i.test(err.message)) console.error(`Instagram: revisa IG_ACCESS_TOKEN a Netlify (${ig.describeToken(ig.envToken())}).`);
    return new Response('error', { status: 500 });
  }
}

// Cada 15 minuts, perquè les publicacions surtin a l'hora prevista (p. ex. 08:30).
export const config = { schedule: '*/15 * * * *' };
