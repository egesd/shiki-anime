import { writable } from 'svelte/store';
import axios from 'axios';

export const animeData = writable([]);
export const loading = writable(false);
export const error = writable(null);
let offset = 0; // Keep track of the current offset

export async function fetchAnimeData(season, year, reset = false) {
  loading.set(true);
  error.set(null);

  if (reset) {
    animeData.set([]);
    offset = 0;
  }

  try {
    const response = await axios.get(`http://localhost:5000/api/anime/${year}/${season}`, {
      params: { offset },
    });

    offset += 10;
    animeData.update(currentData => reset ? response.data : [...currentData, ...response.data]);
  } catch (err) {
    error.set(err.response?.data?.error || 'Failed to fetch anime data. Please try again later.');
    console.error(err);
  } finally {
    loading.set(false);
  }
}
