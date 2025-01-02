require('dotenv').config();
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const pLimit = require('p-limit');

// Initialize Supabase client
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_KEY);

// Utility function to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to fetch popularity from Jikan API
async function fetchPopularity(animeId) {
  const response = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}`);
  if (response.data && response.data.data && response.data.data.popularity) {
    return response.data.data.popularity; // Adjust based on actual API response
  }
  return null;
}

// Function with retry logic
const MAX_RETRIES = 5;

async function fetchPopularityWithRetry(animeId, retries = 0) {
  try {
    const popularity = await fetchPopularity(animeId);
    return popularity;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      const delayTime = Math.pow(2, retries) * 1000; // Exponential backoff
      console.warn(`Retrying Anime ID ${animeId} after ${delayTime}ms...`);
      await delay(delayTime);
      return fetchPopularityWithRetry(animeId, retries + 1);
    } else {
      console.error(`Max retries reached for Anime ID ${animeId}. Skipping.`);
      return null;
    }
  }
}

// Main function to update popularity
async function updatePopularityForExistingAnimes() {
  try {
    // Step 1: Fetch all existing animes from Supabase
    const { data: existingAnimes, error: fetchError } = await supabase
      .from('anime')
      .select('id, popularity');

    if (fetchError) {
      console.error('Error fetching existing animes:', fetchError);
      return;
    }

    console.log(`Fetched ${existingAnimes.length} animes from Supabase.`);

    // Step 2: Set up concurrency limit
    const CONCURRENCY_LIMIT = 10; // Adjust based on API rate limits
    const limit = pLimit(CONCURRENCY_LIMIT);

    // Step 3: Create an array of promises with controlled concurrency
    const updatePromises = existingAnimes.map((anime) =>
      limit(async () => {
        if (anime.popularity !== null && anime.popularity !== undefined) {
          // Skip if popularity is already set
          return;
        }

        console.log(`Fetching popularity for Anime ID: ${anime.id}`);

        const popularity = await fetchPopularityWithRetry(anime.id);

        if (popularity !== null) {
          // Update Supabase with the retrieved popularity
          const { error: updateError } = await supabase
            .from('anime')
            .update({ popularity })
            .eq('id', anime.id);

          if (updateError) {
            console.error(`Error updating popularity for Anime ID ${anime.id}:`, updateError);
          } else {
            console.log(`Updated popularity for Anime ID ${anime.id} to ${popularity}.`);
          }
        }

        // Optional: Additional delay if needed
        // await delay(100); // 100ms delay; adjust as needed
      })
    );

    // Step 4: Execute all update promises
    await Promise.all(updatePromises);

    console.log('Completed updating popularity for all animes.');
  } catch (error) {
    console.error('An unexpected error occurred:', error.message);
  }
}

// Execute the script
updatePopularityForExistingAnimes();