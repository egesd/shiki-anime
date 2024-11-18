import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://anime-viewer-eta.vercel.app' // production URL
];


// Enable CORS dynamically based on origin
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  })
);

app.get('/api/anime/:year/:season', async (req, res) => {
  const { year, season } = req.params;
  const limit = parseInt(req.query.limit) || 100;
  const offset = parseInt(req.query.offset) || 0; // Use offset from frontend

  console.log(`Fetching data for season: ${season}, year: ${year}, offset: ${offset}, limit: ${limit}`);

  try {
    const response = await axios.get(
      `https://api.myanimelist.net/v2/anime/season/${year}/${season}`,
      {
        headers: {
          'X-MAL-CLIENT-ID': process.env.VITE_MYANIMELIST_API_KEY,
        },
        params: {
          limit,
          offset,
          fields: 'mean,main_picture,title,media_type,genres,studios,num_episodes,broadcast',
        },
      }
    );

    // Check if API returned any data; if not, stop further requests
    if (!response.data || !response.data.data || response.data.data.length === 0) {
      console.log('No more data available from the API');
      return res.json([]); // Return an empty array to signify no more data
    }

    const uniqueData = [];
    const existingIds = new Set();

    response.data.data.forEach((anime) => {
      const animeId = anime.node.id;
      if ((anime.node.mean ?? 0) >= 7 && !existingIds.has(animeId)) {
        existingIds.add(animeId);
        uniqueData.push(anime);
      }
    });

    uniqueData.sort((a, b) => (b.node.mean ?? 0) - (a.node.mean ?? 0));

    res.json(uniqueData);
  } catch (error) {
    console.error('Error fetching data from MyAnimeList:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Error fetching data from MyAnimeList',
      details: error.response?.data || error.message,
    });
  }
});

app.use((req, res) => {
  console.log(`Fallback route hit: ${req.originalUrl}`);
  res.status(404).json({ error: 'NOT_FOUND', route: req.originalUrl });
});

// Export the Express app as a serverless function for Vercel
export default app;

// Start the server locally if not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}