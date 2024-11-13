import { writable } from 'svelte/store';
import axios from 'axios';

export const animeData = writable([]); // Initialize as an empty array
export const loading = writable(false);
export const error = writable(null);

export async function fetchAnimeData(season, year) {
  loading.set(true);
  error.set(null);

  try {
    const response = await axios.get(`http://localhost:5000/api/anime/${year}/${season}`);
    animeData.set(response.data); // Set the data directly to the store
  } catch (err) {
    error.set('Failed to fetch anime data');
    console.error(err);
  } finally {
    loading.set(false);
  }
}
