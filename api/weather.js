// api/weather.js — Vercel Serverless Function
export default async function handler(req, res) {
  try {
    const { city = 'Palangkaraya,ID' } = req.query;
    const apiKey = process.env.OWM_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'OWM_API_KEY missing' });

    const api = 'https://api.openweathermap.org/data/2.5/weather';
    const url = `${api}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=id`;
    const r = await fetch(url);
    if (!r.ok) {
      const detail = await r.text();
      return res.status(r.status).json({ error: 'fetch failed', detail });
    }
    const data = await r.json();

    return res.status(200).json({
      temp: Math.round(data.main.temp),
      desc: data.weather?.[0]?.description || '',
      city: data.name
    });
  } catch {
    return res.status(500).json({ error: 'server error' });
  }
}
