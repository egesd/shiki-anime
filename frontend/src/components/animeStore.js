// frontend/src/components/animeStore.js
import { writable } from 'svelte/store';
import { supabase } from './supabaseClient';

export const animeData = writable([]);
export const loading = writable(false);
export const error = writable(null);

export async function fetchAnimeDataFromSupabase(season, year, reset = false) {
  loading.set(true);
  error.set(null);

  if (reset) {
    animeData.set([]);
  }

  try {
    const { data, error } = await supabase
      .from('anime')
      .select('*')
      .eq('season', season)
      .eq('year', year)
      .order('mean', { ascending: false });

    if (error) throw error;

    animeData.set(data);
  } catch (err) {
    error.set(err.message || 'Failed to fetch anime data. Please try again later.');
    console.error(err);
  } finally {
    loading.set(false);
  }
}