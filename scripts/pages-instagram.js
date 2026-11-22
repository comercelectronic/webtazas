// Pàgina interna /instagram/: la cua de publicacions per revisar-les abans
// d'aprovar-les. No s'indexa (noindex, robots.txt i capçalera X-Robots-Tag).
const { site, esc } = require('./lib');
const queue = require('../data/instagram.json');

const fmt = new Intl.DateTimeFormat('ca-ES', {
  weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: queue.timezone || 'Europe/Madrid',
});

function post(p) {
  const status = p.approved === true
    ? '<span class="ig-status ig-status--ok">Aprovada · es publicarà sola</span>'
    : '<span class="ig-status">Pendent de revisar</span>';
  return `<article class="ig-post" id="${esc(p.id)}">
  <header class="ig-post__head">
    <h2>${esc(p.title)}</h2>
    <p><time datetime="${esc(p.publishAt)}">${esc(fmt.format(new Date(p.publishAt)))}</time> · ${status}</p>
  </header>
  <div class="ig-post__imgs">
    ${p.images.map((src, i) => `<a href="${esc(src)}" target="_blank" rel="noopener"><img src="${esc(src)}" alt="${esc(p.title)}, imatge ${i + 1} de ${p.images.length}" width="1080" height="1350" loading="lazy"></a>`).join('\n    ')}
  </div>
  <pre class="ig-post__caption">${esc(p.caption)}</pre>
  ${p.note ? `<p class="ig-post__note"><strong>Nota:</strong> ${esc(p.note)}</p>` : ''}
  <p class="ig-post__id">Identificador: <code>${esc(p.id)}</code></p>
</article>`;
}

function instagramReview() {
  const posts = [...(queue.posts || [])].sort((a, b) => new Date(a.publishAt) - new Date(b.publishAt));
  const extras = (queue.extras || []);
  return {
    path: '/instagram/',
    title: `Instagram · revisió · ${site.brand}`,
    description: 'Cua interna de publicacions d\'Instagram pendents de revisar.',
    noindex: true,
    main: `<style>
.ig-wrap{max-width:980px;margin:0 auto;padding:32px 16px 64px}
.ig-help{background:var(--paper-2,#f6f1e7);border-radius:12px;padding:16px 20px;margin:16px 0 32px}
.ig-help code{font-size:.9em}
.ig-post{border-top:1px solid rgba(0,0,0,.12);padding:28px 0}
.ig-post__head h2{margin:0 0 4px}
.ig-post__head p{margin:0;color:inherit;opacity:.8}
.ig-status{display:inline-block;padding:2px 10px;border-radius:99px;background:#fde7c7;color:#6a3d00;font-size:.85em;font-weight:600}
.ig-status--ok{background:#d6f2d9;color:#185c22}
.ig-post__imgs{display:flex;gap:10px;overflow-x:auto;margin:16px 0;padding-bottom:6px}
.ig-post__imgs img{width:240px;height:auto;border-radius:8px;display:block}
.ig-post__caption{white-space:pre-wrap;font-family:inherit;background:#fff;border:1px solid rgba(0,0,0,.1);border-radius:8px;padding:14px 16px;max-width:620px;margin:0}
.ig-post__note{max-width:620px;opacity:.85}
.ig-post__id{font-size:.85em;opacity:.7}
.ig-extras{display:flex;gap:10px;flex-wrap:wrap}
.ig-extras img{width:120px;height:auto;border-radius:8px}
.ig-reel{margin:20px 0 28px}
.ig-reel video{display:block;border-radius:12px;background:#000;margin:10px 0;max-width:100%;height:auto}
</style>
<div class="ig-wrap">
  <h1>Instagram: cua de publicacions</h1>
  <div class="ig-help">
    <p><strong>Com funciona.</strong> Res no es publica fins que no ho aproves. Per aprovar una publicació, a <code>data/instagram.json</code> canvia <code>"approved": false</code> per <code>"approved": true</code> (també pots canviar el text, la data o l'ordre de les imatges) i desa el canvi a GitHub.</p>
    <p>Un cop a Netlify hi ha la variable <code>IG_ACCESS_TOKEN</code> (token «IG…» o, amb l'inici de sessió unificat, «EA…»), cada 15 minuts es comprova si hi ha alguna publicació aprovada que toqui i se'n publica una. Si una publicació aprovada fa més de 48 hores que havia de sortir, no es publica: posa-li una data nova.</p>
    <p>${posts.filter((p) => p.approved === true).length} de ${posts.length} publicacions aprovades.</p>
  </div>
  ${posts.map(post).join('\n')}
  ${(queue.reels || []).length ? `<section class="ig-post"><h2>Reels (per pujar des de l'app, amb música)</h2>
    <p>Els reels es pugen a mà perquè l'àudio en tendència només es pot afegir des de l'app: <em>+ → Reel → tria el vídeo → Àudio</em>. Copia el text de cada un i tria'n la portada.</p>
    ${queue.reels.map((r) => `<article class="ig-reel">
      <h3>${esc(r.title)}</h3>
      <p>Suggerit: ${esc(r.suggested || '')} · <a href="${esc(r.video)}" download>Descarrega el vídeo</a> · <a href="${esc(r.cover)}" download>Portada</a></p>
      <video src="${esc(r.video)}" poster="${esc(r.cover)}" controls muted playsinline preload="none" width="270" height="480"></video>
      <pre class="ig-post__caption">${esc(r.caption)}</pre>
    </article>`).join('')}
  </section>` : ''}
  ${extras.length ? `<section class="ig-post"><h2>Per pujar a mà</h2><p>Les històries destacades i la foto de perfil no es poden publicar amb l'API: puja-les des de l'app.</p><div class="ig-extras">${extras.map((e) => `<a href="${esc(e.src)}" download><img src="${esc(e.src)}" alt="${esc(e.label)}" loading="lazy"></a>`).join('')}</div></section>` : ''}
</div>`,
  };
}

module.exports = { instagramReview };
