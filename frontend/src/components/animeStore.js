import { writable } from 'svelte/store';
import axios from 'axios';

export const animeData = writable([]);
export const loading = writable(false);
export const error = writable(null);
let offset = 0; // Track the current offset
let noMoreData = false; // Flag to indicate when no more data is available

export async function fetchAnimeData(season, year, reset = false) {
  loading.set(true);
  error.set(null);

  if (reset) {
    animeData.set([]);
    offset = 0;
    noMoreData = false;
  }

  if (noMoreData) {
    loading.set(false);
    return;
  }

  try {
    const response = await axios.get(`http://localhost:5000/api/anime/${year}/${season}`, {
      params: { offset }, // Pass offset to server
    });

    if (response.data.length === 0) {
      noMoreData = true;
    } else {
      animeData.update(currentData => reset ? response.data : [...currentData, ...response.data]);
      offset += 10; // Increment offset for next request
    }
  } catch (err) {
    error.set(err.response?.data?.error || 'Failed to fetch anime data. Please try again later.');
    console.error(err);
  } finally {
    loading.set(false);
  }
}