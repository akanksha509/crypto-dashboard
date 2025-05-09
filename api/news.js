// api/news.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const NEWS_KEY = process.env.VITE_NEWS_API_KEY;
    const { data } = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        apiKey:   NEWS_KEY,
        q:        'crypto',
        language: 'en',
        sortBy:   'publishedAt',
        pageSize: 20
      }
    });
    res.status(200).json(data);
  } catch (err) {
    console.error('News API proxy error:', err);
    res.status(500).json({ error: 'Unable to fetch news' });
  }
}
