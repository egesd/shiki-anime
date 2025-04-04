const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);

exports.handler = async function() {
  try {
    // Get currently airing anime
    const { data: airingAnime } = await supabase
      .from('anime')
      .select('id')
      .eq('status', 'currently_airing');

    for (const anime of airingAnime) {
      try {
        const response = await axios.get(
          `https://api.myanimelist.net/v2/anime/${anime.id}`,
          {
            headers: {
              'X-MAL-CLIENT-ID': process.env.VITE_MYANIMELIST_API_KEY
            },
            params: {
              fields: 'mean,status'
            }
          }
        );

        await supabase
          .from('anime')
          .update({
            mean: response.data.mean,
            status: response.data.status
          })
          .eq('id', anime.id);

        // Prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to update anime ${anime.id}:`, error);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Scores updated successfully' })
    };
  } catch (error) {
    console.error('Score update failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Score update failed' })
    };
  }
};