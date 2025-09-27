// api/news.js — Vercel Serverless Function
export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'NEWS_API_KEY missing' });

    const q = req.query.q || 'pertanian OR pangan OR hidroponik OR urban farming';
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 10);

    const endpoint = new URL('https://newsapi.org/v2/top-headlines');
    endpoint.searchParams.set('country', 'id');
    endpoint.searchParams.set('q', q);
    endpoint.searchParams.set('page', page);
    endpoint.searchParams.set('pageSize', pageSize);
    endpoint.searchParams.set('apiKey', apiKey);

    const r = await fetch(endpoint);
    if (!r.ok) {
      const detail = await r.text();
      return res.status(r.status).json({ error: 'fetch failed', detail });
    }
    const data = await r.json();

    const items = (data.articles || []).map((a, idx) => ({
      id: `${Date.now()}_${page}_${idx}`,
      t: a.title || '(Tanpa judul)',
      d: a.description || '',
      date: a.publishedAt ? new Date(a.publishedAt).toLocaleString('id-ID') : '',
      author: a.source?.name || a.author || '',
      img: a.urlToImage || '',
      url: a.url || '#',
      content: a.content ? [a.content] : (a.description ? [a.description] : [])
    }));

    return res.status(200).json({ items, total: data.totalResults || 0, page });
  } catch {
    return res.status(500).json({ error: 'server error' });
  }
}
