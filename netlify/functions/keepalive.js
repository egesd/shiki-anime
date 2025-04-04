const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Load environment variables from project root
require('dotenv').config({ 
  path: path.resolve(__dirname, '../../.env') 
});

// Debug logs for environment variables
console.log('Environment variables loaded:', {
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  hasSupabaseKey: !!process.env.VITE_SUPABASE_KEY,
  currentDir: __dirname
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);

exports.handler = async function(event, context) {
  try {
    // Log request details
    console.log('Keepalive function triggered', {
      timestamp: new Date().toISOString(),
      supabaseUrl: process.env.VITE_SUPABASE_URL
    });

    const { data, error } = await supabase
      .from('anime')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    console.log('Query successful:', { dataLength: data?.length });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Keepalive successful',
        timestamp: new Date().toISOString(),
        data
      })
    };
  } catch (error) {
    console.error('Keepalive failed:', {
      error: error.message,
      stack: error.stack
    });

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Keepalive failed'
      })
    };
  }
};