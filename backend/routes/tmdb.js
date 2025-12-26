const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Search movies and TV shows
router.get('/search', auth, async (req, res) => {
  try {
    const { query, type } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'TMDB API key not configured' });
    }

    const searchType = type === 'tv' ? 'tv' : type === 'movie' ? 'movie' : 'multi';
    const response = await axios.get(`${TMDB_BASE_URL}/search/${searchType}`, {
      params: {
        api_key: apiKey,
        query,
        page: 1
      }
    });

    const results = response.data.results.slice(0, 10).map(item => ({
      id: item.id,
      title: item.title || item.name,
      type: item.media_type || (item.first_air_date ? 'tv' : 'movie'),
      year: (item.release_date || item.first_air_date || '').substring(0, 4),
      posterPath: item.poster_path,
      posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
      description: item.overview
    }));

    res.json(results);
  } catch (error) {
    console.error('TMDB search error:', error.message);
    res.status(500).json({ error: 'Failed to search TMDB' });
  }
});

// Get settings (check if API key is configured)
router.get('/settings', auth, async (req, res) => {
  const apiKey = process.env.TMDB_API_KEY;
  res.json({
    tmdbConfigured: !!apiKey,
    tmdbKeyPreview: apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : null
  });
});

module.exports = router;
