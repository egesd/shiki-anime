import { writable } from 'svelte/store';
import axios from 'axios';

export const animeData = writable([]);
export const loading = writable(false);
export const error = writable(null);
let offset = 0; // Track the current offset
let noMoreData = false; // Flag to indicate when no more data is available
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');


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
    const response = await axios.get(`${API_URL}/api/anime/${year}/${season}`, {
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