import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

dotenv.config(); // Load environment variables

const app = express();
const PORT = 5000;

app.use(cors()); // Enable CORS for all routes

// Route to fetch anime data for a given season and year
let offset = 0; // Initialize server-side offset

app.get('/api/anime/:year/:season', async (req, res) => {
  const { year, season } = req.params;
  const reset = req.query.reset === 'true'; // Check if this is a reset request
  const limit = parseInt(req.query.limit) || 100;

  // Reset offset if a new season/year is requested
  if (reset) {
    offset = 0;
  }

  try {
    const response = await axios.get(
      `https://api.myanimelist.net/v2/anime/season/${year}/${season}`,
      {
        headers: {
          'X-MAL-CLIENT-ID': process.env.VITE_MYANIMELIST_API_KEY,
        },
        params: {
          limit: limit,
          offset: offset,
          fields:
            'mean,main_picture,title,media_type,genres,studios,num_episodes,broadcast',
        },
      }
    );

    const uniqueData = [];
    const existingIds = new Set(); // Track unique anime IDs

    // Filter out duplicates and low scores
    response.data.data.forEach((anime) => {
      const animeId = anime.node.id;
      // Only add if score >= 7 and not already added
      if (anime.node.mean >= 7 && !existingIds.has(animeId)) {
        existingIds.add(animeId);
        uniqueData.push(anime);
      }
    });

    // Sort by score in descending order
    uniqueData.sort((a, b) => (b.node.mean ?? 0) - (a.node.mean ?? 0));

    offset += limit; // Increment the offset for the next request

    res.json(uniqueData);
  } catch (error) {
    console.error(
      'Error fetching data from MyAnimeList:',
      error.response?.data || error.message
    );
    res.status(500).json({
      error: 'Error fetching data from MyAnimeList',
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
