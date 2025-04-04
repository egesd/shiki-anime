const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);

// Constants for batch processing and timeouts
const BATCH_SIZE = 5;
const TIMEOUT = 25000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Helper function for delays
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function updateAnimeWithRetry(anime, attempt = 1) {
  try {
    const response = await axios.get(
      `https://api.myanimelist.net/v2/anime/${anime.id}`,
      {
        headers: {
          'X-MAL-CLIENT-ID': process.env.VITE_MYANIMELIST_API_KEY,
        },
        params: { fields: 'mean,status' },
        timeout: 5000,
      }
    );

    await supabase
      .from('anime')
      .update({
        mean: response.data.mean,
        status: response.data.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', anime.id);

    console.log(`Updated anime ${anime.id}`);
    return true;
  } catch (error) {
    if (attempt < MAX_RETRIES) {
      console.log(`Retry ${attempt} for anime ${anime.id}`);
      await delay(RETRY_DELAY * attempt); // Exponential backoff
      return updateAnimeWithRetry(anime, attempt + 1);
    }
    console.error(`Failed to update anime ${anime.id} after ${MAX_RETRIES} attempts`);
    return false;
  }
}

exports.handler = async function () {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Function timed out')), TIMEOUT)
  );

  const updateProcess = async () => {
    try {
      console.log('Starting score update process');
      const { data: airingAnime, error } = await supabase
        .from('anime')
        .select('id')
        .eq('status', 'currently_airing')
        .limit(50);

      if (error) throw error;
      console.log(`Processing ${airingAnime.length} airing anime`);

      const results = [];
      for (let i = 0; i < airingAnime.length; i += BATCH_SIZE) {
        const batch = airingAnime.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(
          batch.map(anime => updateAnimeWithRetry(anime))
        );
        results.push(...batchResults);
        await delay(1000); // Delay between batches
      }

      const successCount = results.filter(Boolean).length;
      const failureCount = results.length - successCount;

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Score update completed',
          timestamp: new Date().toISOString(),
          stats: {
            total: results.length,
            success: successCount,
            failed: failureCount
          }
        })
      };
    } catch (error) {
      throw error;
    }
  };

  try {
    return await Promise.race([updateProcess(), timeoutPromise]);
  } catch (error) {
    console.error('Score update failed:', error.message);
    return {
      statusCode: error.message === 'Function timed out' ? 504 : 500,
      body: JSON.stringify({
        error: 'Score update failed',
        details: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
