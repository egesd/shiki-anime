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

  try {
    const response = await axios.get(
      `https://api.myanimelist.net/v2/anime/season/${year}/${season}`,
      {
        headers: {
          'X-MAL-CLIENT-ID': process.env.VITE_MYANIMELIST_API_KEY,
        },
        params: {
          limit: 10,
          fields: 'mean,main_picture,title', // Specify any additional fields needed
          sort: 'anime_score', // Sort by anime score
        },
      }
    );

    // Sort by mean score in descending order on the server side
    const sortedData = response.data.data.sort((a, b) => {
      const scoreA = a.node.mean ?? 0;
      const scoreB = b.node.mean ?? 0;
      return scoreB - scoreA;
    });

    res.json(sortedData);
  } catch (error) {
    console.error(
      'Error fetching data from MyAnimeList:',
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({
        error: 'Error fetching data from MyAnimeList',
        details: error.response?.data || error.message,
      });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
