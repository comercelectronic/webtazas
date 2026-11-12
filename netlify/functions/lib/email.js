// Enviament de correus amb Resend (https://resend.com).
//
// Variables d'entorn necessàries a Netlify:
//   RESEND_API_KEY   clau de l'API de Resend
//   NEWSLETTER_FROM  remitent verificat, p. ex. "Tassa de Mots <hola@tassademots.cat>"
//
// Si falten, les funcions ho diuen clarament i no simulen cap enviament.

const { site } = require('./catalog');

function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.NEWSLETTER_FROM);
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function layout({ preheader = '', bodyHtml, footerHtml }) {
  return `<!doctype html>
<html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(site.brand)}</title></head>
<body style="margin:0;padding:0;background:#f7f2ea;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f2ea;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #ece4d8;">
<tr><td style="padding:28px 32px 8px;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#1b2633;">
${esc(site.brand)}
<div style="height:2px;width:48px;background:#b4442a;margin-top:12px;"></div>
</td></tr>
<tr><td style="padding:16px 32px 28px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#1b2633;">
${bodyHtml}
</td></tr>
<tr><td style="padding:18px 32px 26px;background:#fbf8f3;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#6b7280;border-top:1px solid #ece4d8;">
${footerHtml}
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function button(label, url) {
  return `<p style="margin:26px 0;"><a href="${esc(url)}" style="display:inline-block;background:#1b2633;color:#ffffff;text-decoration:none;padding:13px 24px;border-radius:999px;font-weight:bold;">${esc(label)}</a></p>`;
}

function confirmationEmail({ confirmUrl }) {
  const bodyHtml = `
<p style="margin:0 0 14px;">Hola!</p>
<p style="margin:0 0 14px;">Algú (esperem que tu) ha demanat rebre la newsletter de ${esc(site.brand)} amb aquesta adreça.</p>
<p style="margin:0 0 14px;">Per confirmar-ho, prem el botó. Si no ho confirmes, no t'enviarem res i esborrarem la sol·licitud d'aquí a uns dies.</p>
${button('Confirmo la subscripció', confirmUrl)}
<p style="margin:0;font-size:13px;color:#6b7280;">Si el botó no funciona, copia aquest enllaç al navegador:<br>${esc(confirmUrl)}</p>`;
  const footerHtml = `Has rebut aquest correu perquè s'ha demanat una subscripció a ${esc(site.siteUrl)}. Si no l'has demanada tu, ignora'l.`;
  return {
    subject: `Confirma la teva subscripció a ${site.brand}`,
    html: layout({ preheader: 'Només et falta un clic per confirmar-ho.', bodyHtml, footerHtml }),
    text: `Per confirmar la teva subscripció a la newsletter de ${site.brand}, obre aquest enllaç:\n${confirmUrl}\n\nSi no l'has demanada tu, ignora aquest correu.`,
  };
}

// Converteix el text de la campanya (paràgrafs separats per línies en blanc)
// en HTML segur. No s'accepta HTML de l'administrador per evitar errors.
function campaignEmail({ subject, preheader, body, ctaLabel, ctaUrl, unsubscribeUrl }) {
  const paragraphs = String(body || '').trim().split(/\n\s*\n/).map((p) =>
    `<p style="margin:0 0 14px;">${esc(p).replace(/\n/g, '<br>')}</p>`).join('\n');
  const cta = ctaLabel && ctaUrl ? button(ctaLabel, ctaUrl) : '';
  const footerHtml = `Reps aquest correu perquè et vas subscriure a la newsletter de ${esc(site.brand)}.<br>
<a href="${esc(unsubscribeUrl)}" style="color:#6b7280;">Donar-me de baixa</a>`;
  return {
    subject,
    html: layout({ preheader, bodyHtml: paragraphs + cta, footerHtml }),
    text: `${String(body || '').trim()}${ctaLabel && ctaUrl ? `\n\n${ctaLabel}: ${ctaUrl}` : ''}\n\n—\nPer donar-te de baixa: ${unsubscribeUrl}`,
  };
}

function unsubscribeHeaders(oneClickUrl) {
  return {
    'List-Unsubscribe': `<${oneClickUrl}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}

async function resendRequest(path, payload) {
  const res = await fetch(`https://api.resend.com${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 300)}`);
  }
  return res.json();
}

function sendEmail({ to, subject, html, text, headers }) {
  return resendRequest('/emails', { from: process.env.NEWSLETTER_FROM, to: [to], subject, html, text, headers });
}

// Fins a 100 correus per crida a l'API de lots de Resend.
function sendBatch(messages) {
  return resendRequest('/emails/batch', messages.map((m) => ({ from: process.env.NEWSLETTER_FROM, to: [m.to], subject: m.subject, html: m.html, text: m.text, headers: m.headers })));
}

module.exports = { emailConfigured, confirmationEmail, campaignEmail, unsubscribeHeaders, sendEmail, sendBatch };
