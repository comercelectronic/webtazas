// Estructura del magatzem "reviews" (Netlify Blobs):
//   pending/<id>        valoració pendent de moderar (amb el hash de la IP)
//   approved/<slug>     llista de valoracions publicades d'una tassa
//   guard/<slug>/<ip>   marca que aquell visitant ja ha valorat aquella tassa
//   rl/...              límit diari d'enviaments per visitant

const publicReview = (r) => ({ id: r.id, name: r.name, rating: r.rating, comment: r.comment, date: r.createdAt.slice(0, 10) });

function summarize(list) {
  const count = list.length;
  if (!count) return { count: 0, average: null };
  const sum = list.reduce((s, r) => s + r.rating, 0);
  return { count, average: Math.round((sum / count) * 10) / 10 };
}

async function approvedFor(st, slug) {
  return (await st.get(`approved/${slug}`, { type: 'json' })) || [];
}

module.exports = { publicReview, summarize, approvedFor };
