// Gestió de la newsletter (contrasenya ADMIN_PASSWORD).
//   GET  → llistat de persones subscrites (i neteja de pendents caducades)
//   POST {action:'delete', id}                       esborra totes les dades d'una persona
//   POST {action:'send', subject, preheader, body, ctaLabel, ctaUrl, testEmail?}
//        Amb testEmail: envia només una prova a aquesta adreça.
//        Sense testEmail: envia a totes les persones confirmades.
const { site } = require('./lib/catalog');
const { json, parseJson, store, requireAdmin, siteOrigin, cleanupRateLimits } = require('./lib/http');
const { emailConfigured, campaignEmail, unsubscribeHeaders, sendEmail, sendBatch } = require('./lib/email');

const PENDING_DAYS = 7;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

async function allSubscribers(st) {
  const { blobs } = await st.list({ prefix: 'sub/' });
  const out = [];
  for (const b of blobs) {
    const rec = await st.get(b.key, { type: 'json' });
    if (!rec) continue;
    const id = b.key.slice(4);
    // Les sol·licituds no confirmades s'esborren passats 7 dies.
    if (rec.status === 'pending' && Date.now() - new Date(rec.createdAt).getTime() > PENDING_DAYS * 86400000) {
      await st.delete(b.key);
      continue;
    }
    out.push({ id, ...rec });
  }
  return out;
}

function buildMessage(origin, sub, campaign) {
  const unsubscribeUrl = `${origin}/newsletter/baixa/?id=${sub.id}&t=${sub.unsubToken}`;
  const oneClick = `${origin}/.netlify/functions/newsletter?action=unsubscribe&id=${sub.id}&t=${sub.unsubToken}`;
  return { to: sub.email, ...campaignEmail({ ...campaign, unsubscribeUrl }), headers: unsubscribeHeaders(oneClick) };
}

exports.handler = async function (event) {
  const denied = await requireAdmin(event);
  if (denied) return denied;
  const st = store(event, 'newsletter');

  try {
    if (event.httpMethod === 'GET') {
      await cleanupRateLimits(st);
      const subs = await allSubscribers(st);
      return json(200, {
        emailConfigured: emailConfigured(),
        subscribers: subs.filter((s) => s.status !== 'unsubscribed').map((s) => ({
          id: s.id, email: s.email, status: s.status, createdAt: s.createdAt, confirmedAt: s.confirmedAt || null,
          consentAt: s.consent && s.consent.at, source: s.consent && s.consent.source, consentVersion: s.consent && s.consent.version,
        })),
        unsubscribedCount: subs.filter((s) => s.status === 'unsubscribed').length,
      });
    }

    if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });
    const { body, error } = parseJson(event, 40 * 1024);
    if (error) return error;

    if (body.action === 'delete') {
      const id = String(body.id || '');
      if (!/^[a-f0-9]{64}$/.test(id)) return json(400, { error: 'Identificador no vàlid.' });
      await st.delete(`sub/${id}`);
      return json(200, { ok: true });
    }

    if (body.action === 'send') {
      if (!emailConfigured()) return json(503, { error: 'Falta configurar RESEND_API_KEY i NEWSLETTER_FROM a Netlify.' });
      const campaign = {
        subject: String(body.subject || '').trim().slice(0, 150),
        preheader: String(body.preheader || '').trim().slice(0, 150),
        body: String(body.body || '').trim().slice(0, 20000),
        ctaLabel: String(body.ctaLabel || '').trim().slice(0, 60),
        ctaUrl: String(body.ctaUrl || '').trim(),
      };
      if (!campaign.subject || campaign.body.length < 10) return json(400, { error: "Cal un assumpte i un text d'almenys 10 caràcters." });
      if (campaign.ctaUrl && !/^https:\/\//.test(campaign.ctaUrl)) return json(400, { error: "L'enllaç del botó ha de començar per https://" });

      const origin = siteOrigin(event, site);

      if (body.testEmail) {
        const to = String(body.testEmail).trim();
        if (!EMAIL_RE.test(to)) return json(400, { error: "L'adreça de prova no és vàlida." });
        const msg = buildMessage(origin, { id: '0'.repeat(64), email: to, unsubToken: 'prova' }, campaign);
        await sendEmail({ ...msg, subject: `[PROVA] ${msg.subject}` });
        return json(200, { ok: true, sent: 1, failed: 0 });
      }

      const confirmed = (await allSubscribers(st)).filter((s) => s.status === 'confirmed');
      let sent = 0;
      let failed = 0;
      for (let i = 0; i < confirmed.length; i += 100) {
        const chunk = confirmed.slice(i, i + 100);
        try {
          await sendBatch(chunk.map((s) => buildMessage(origin, s, campaign)));
          sent += chunk.length;
        } catch (err) {
          console.error('Error enviant un lot:', err.message);
          failed += chunk.length;
        }
      }
      return json(200, { ok: true, sent, failed });
    }

    return json(400, { error: 'Acció desconeguda.' });
  } catch (err) {
    console.error('Error a la gestió de la newsletter:', err);
    return json(500, { error: "S'ha produït un error: " + err.message });
  }
};
