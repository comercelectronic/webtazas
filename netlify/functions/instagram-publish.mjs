// Funció programada: cada hora publica a Instagram la següent publicació
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
  if (!process.env.IG_ACCESS_TOKEN) {
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
    const account = await ig.whoAmI(token);
    const userId = process.env.IG_USER_ID || account.user_id;
    const pending = (queue.posts || []).filter((p) => p.approved === true && !published[p.id]).length;
    console.log(`Instagram: connectat com @${account.username}. Aprovades pendents: ${pending}.`);
    if (!due) return new Response('nothing due');

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
    return new Response('error', { status: 500 });
  }
}

export const config = { schedule: '@hourly' };
