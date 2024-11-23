// frontend/src/components/animeStore.js
import { writable } from 'svelte/store';
import { supabase } from './supabaseClient';

export const animeData = writable([]);
export const loading = writable(false);
export const error = writable(null);
export const hasMoreData = writable(true); // New store to track if more data is available

export async function fetchAnimeDataFromSupabase(season, year, reset = false) {
  loading.set(true);
  error.set(null);

  if (reset) {
    animeData.set([]);
    hasMoreData.set(true); // Reset the flag when resetting data
  }

  try {
    let query = supabase.from('anime').select('*').eq('year', year).order('mean', { ascending: false });

    if (season !== 'all') {
      query = query.eq('season', season);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (data.length === 0) {
      hasMoreData.set(false); // No more data to fetch
    } else {
      animeData.update(existing => [...existing, ...data]);
      // If fetched data is less than expected (e.g., page size), assume no more data
      // Adjust the number based on your pagination strategy
      if (data.length < 100) { // Assuming 100 is your page size
        hasMoreData.set(false);
      }
    }
  } catch (err) {
    error.set(err.message || 'Failed to fetch anime data. Please try again later.');
    console.error(err);
  } finally {
    loading.set(false);
  }
}