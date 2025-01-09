// frontend/src/components/animeStore.js
import { writable } from 'svelte/store';
import { supabase } from './supabaseClient';
import { genreNameToIdMap } from '../config/genreMapping.js'; // Import the mapping

export const animeData = writable([]);
export const loading = writable(false);
export const error = writable(null);
export const hasMoreData = writable(true); // Track if more data is available

export async function fetchAnimeDataFromSupabase(season, year, genre, showUpcoming, reset = false) {
  loading.set(true);
  error.set(null);

  if (reset) {
    animeData.set([]);
    hasMoreData.set(true); // Reset the flag when resetting data
    console.log(animeData);
  }

  try {
    let query = supabase
      .from('anime')
      .select('*')
      .order('mean', { ascending: false, nullsFirst: false })
      .order('members', { ascending: false });;

    if (showUpcoming) {
      query = query.eq('year', 2025);
    } else {
      query = query.in('year', [year, 2025]);
    }

    if (season !== 'all') {
      query = query.eq('season', season);
    }

    if (genre && genre !== 'All Genres') {
      // Retrieve the genre ID from the mapping
      const genreId = genreNameToIdMap[genre];
      if (!genreId) {
        console.error(`Genre ID not found for genre: ${genre}`);
        throw new Error('Invalid genre selection');
      }

      const genresFilter = [{ name: genre, id: genreId }];
      const genresFilterString = JSON.stringify(genresFilter);

      query = query.contains('genres', genresFilterString);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (data.length === 0) {
      hasMoreData.set(false); // No more data to fetch
    } else {
      animeData.update(existing => {
        const existingIds = new Set(existing.map(anime => anime.id));
        const newData = data.filter(anime => !existingIds.has(anime.id));
        return [...existing, ...newData];
      });

      // If fetched data is less than expected (e.g., page size), assume no more data
      if (data.length < 100) { // Adjust based on your pagination strategy
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