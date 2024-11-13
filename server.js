import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

dotenv.config(); // Load environment variables

const app = express();
const PORT = 5000;

app.use(cors()); // Enable CORS for all routes

// Route to fetch anime data for a given season and year
app.get('/api/anime/:year/:season', async (req, res) => {
  const { year, season } = req.params;
  const offset = req.query.offset || 0;

  try {
    const response = await axios.get(`https://api.myanimelist.net/v2/anime/season/${year}/${season}`, {
      headers: {
        'X-MAL-CLIENT-ID': process.env.VITE_MYANIMELIST_API_KEY,
      },
      params: {
        limit: 10,
        offset: offset,
        fields: 'mean,main_picture,title,media_type',
        sort: 'anime_score',
      },
    });

    // Filter by media_type 'tv' and mean score >= 7, then sort by descending score
    const filteredAndSortedData = response.data.data
      .filter(anime => anime.node.mean >= 7 && anime.node.media_type === 'tv')
      .sort((a, b) => (b.node.mean ?? 0) - (a.node.mean ?? 0));

    res.json(filteredAndSortedData); // Send the filtered and sorted data to the client
  } catch (error) {
    console.error('Error fetching data from MyAnimeList:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error fetching data from MyAnimeList', details: error.response?.data || error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
