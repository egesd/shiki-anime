// netlify/functions/index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const serverless = require('serverless-http');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:5173',
  'http://localhost:8888',
  'https://shiki-anime.netlify.app', // Update with your production URL
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
    },
  })
);

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const seasons = ['winter', 'spring', 'summer', 'fall'];
const startYear = 1980; // Adjust as needed
const endYear = new Date().getFullYear();
const maxRetries = 5;
const initialDelay = 1000; // milliseconds
const requestDelay = 500; // milliseconds

/**
 * Utility function to delay execution for a given number of milliseconds.
 *
 * @param {number} ms - Milliseconds to delay.
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetches a resource with retry logic for handling rate limits.
 *
 * @param {string} url - The URL to fetch.
 * @param {object} options - Fetch options.
 * @param {number} retries - Number of retry attempts.
 * @param {number} backoff - Initial backoff delay in milliseconds.
 * @returns {Promise<Response>} - The fetch response.
 * @throws {Error} - If all retry attempts fail.
 */
async function fetchWithRetry(url, options, retries = 5, backoff = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.status !== 429) {
        return response;
      }

      // Calculate exponential backoff with jitter
      const jitter = Math.random() * 1000;
      const delayTime = backoff * 2 ** (attempt - 1) + jitter;
      console.warn(
        `Rate limited. Attempt ${attempt} of ${retries}. Retrying in ${Math.round(delayTime)}ms...`
      );

      await delay(delayTime);
    } catch (error) {
      console.error(`Fetch error on attempt ${attempt} for URL ${url}:`, error);

      if (attempt === retries) {
        throw new Error(`Failed to fetch ${url} after ${retries} attempts.`);
      }

      // Exponential backoff before next retry
      const delayTime = backoff * 2 ** (attempt - 1);
      await delay(delayTime);
    }
  }

  throw new Error(`Failed to fetch ${url} after ${retries} attempts.`);
}

/**
 * Fetches streaming services for a given anime ID from the Jikan API.
 *
 * @param {number} animeId - The ID of the anime.
 * @returns {Promise<Array<{ name: string, url: string }>>} - An array of streaming services.
 */
async function fetchStreamingServices(animeId) {
  const url = `https://api.jikan.moe/v4/anime/${animeId}/streaming`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  console.log(`Fetching streaming services for Anime ID: ${animeId}`);
  console.log(`URL: ${url}`);

  try {
    const response = await fetchWithRetry(url, options, 5, 1000);

    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    const data = await response.json();

    // Ensure the 'data' property exists and is an array
    if (!data.data || !Array.isArray(data.data)) {
      console.error(
        `Unexpected response structure for Anime ID ${animeId}:`,
        data
      );
      return [];
    }

    // Map each streaming service to an object containing 'name' and 'url'
    return (
      data.data.map((service) => ({
        name: service.name,
        url: service.url,
      })) || []
    );
  } catch (error) {
    console.error(
      `Error fetching streaming services for Anime ID ${animeId}:`,
      error
    );
    return [];
  }
}

// Fetch and store anime data for a specific year and season
async function fetchAndStoreAnimeData(year, season) {
  let offset = 0;
  const limit = 100;

  while (true) {
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
            fields:
              'mean,main_picture,title,media_type,genres,studios,num_episodes,broadcast,popularity,alternative_titles,start_date,end_date,synopsis,status,members',
          },
          timeout: 10000,
        }
      );

      if (
        !response.data ||
        !response.data.data ||
        response.data.data.length === 0
      ) {
        console.log(`No more data available for ${season} ${year}`);
        break;
      }

      const uniqueData = [];
      const existingIds = new Set();

      for (const anime of response.data.data) {
        const animeId = anime.node.id;
        if (!existingIds.has(animeId)) {
          existingIds.add(animeId);

          // Fetch streaming services with rate limiting and caching
          const streamingServices = await fetchStreamingServices(animeId);

          uniqueData.push({
            ...anime,
            streaming_service: streamingServices.map((service) => ({
              name: service.name,
              url: service.url,
            })),
          });
        }
      }
      uniqueData.sort((a, b) => (b.node.mean ?? 0) - (a.node.mean ?? 0));

      const { data, error } = await supabase.from('anime').upsert(
        uniqueData.map((anime) => ({
          id: anime.node.id,
          title: anime.node.title,
          mean: anime.node.mean,
          media_type: anime.node.media_type,
          genres: anime.node.genres,
          studios: anime.node.studios,
          num_episodes: anime.node.num_episodes,
          broadcast_day: anime.node.broadcast?.day_of_the_week,
          broadcast_time: anime.node.broadcast?.start_time,
          streaming_service: anime.streaming_service, // Store streaming_service
          main_picture: anime.node.main_picture,
          season,
          year,
          popularity: anime.node.popularity,
          alternative_titles: anime.node.alternative_titles,
          start_date: anime.node.start_date,
          end_date: anime.node.end_date,
          synopsis: anime.node.synopsis,
          status: anime.node.status,
          members: anime.node.members,
        })),
        { onConflict: ['id'] }
      );

      if (error) {
        console.error('Error inserting data into Supabase:', error);
        throw error; // Trigger retry logic
      }

      console.log(
        `Fetched and stored ${uniqueData.length} entries for ${season} ${year}`
      );

      offset += limit;
      await delay(requestDelay); // Delay to prevent rate limiting
    } catch (error) {
      console.error(
        `Error fetching data for ${season} ${year}:`,
        error.message
      );
      throw error; // Let the caller handle the retry
    }
  }
}

// Fetch all anime data with retry logic
async function fetchAllAnimeData() {
  for (let year = startYear; year <= endYear; year++) {
    for (const season of seasons) {
      let retries = 0;
      let delayBetweenRetries = initialDelay;

      while (retries < maxRetries) {
        try {
          console.log(
            `Fetching data for ${season} ${year} (Attempt ${retries + 1})`
          );
          await fetchAndStoreAnimeData(year, season);
          break; // Success, move to the next season/year
        } catch (error) {
          retries++;
          console.error(`Retry ${retries}/${maxRetries} for ${season} ${year}`);

          if (retries === maxRetries) {
            console.error(
              `Failed to fetch data for ${season} ${year} after ${maxRetries} attempts`
            );
          } else {
            console.log(
              `Waiting for ${delayBetweenRetries}ms before retrying...`
            );
            await delay(delayBetweenRetries);
            delayBetweenRetries *= 2; // Exponential backoff
          }
        }
      }
    }
  }
}

app.get('/api/populate/:year/:season', async (req, res) => {
  const { year, season } = req.params;
  try {
    await fetchAndStoreAnimeData(year, season);
    res.json({
      message: `Data fetched and stored successfully for ${season} ${year}`,
    });
  } catch (error) {
    console.error(`Error populating data for ${season} ${year}:`, error);
    res
      .status(500)
      .json({ error: `Error populating data for ${season} ${year}` });
  }
});

app.get('/api/populate', async (req, res) => {
  try {
    await fetchAllAnimeData();
    res.json({ message: 'Data fetched and stored successfully' });
  } catch (error) {
    console.error('Error populating data:', error);
    res.status(500).json({ error: 'Error populating data' });
  }
});

app.use((req, res) => {
  console.log(`Fallback route hit: ${req.originalUrl}`);
  res.status(404).json({ error: 'NOT_FOUND', route: req.originalUrl });
});

module.exports = {
  handler: serverless(app),
};

// Start the server locally only in development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
