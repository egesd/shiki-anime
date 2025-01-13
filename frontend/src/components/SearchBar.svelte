<script>
  import { createEventDispatcher } from 'svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faSearch } from '@fortawesome/free-solid-svg-icons';
  import { genreNameToIdMap } from '../config/genreMapping.js'; // Import the mapping

  export let searchQuery;

  const dispatch = createEventDispatcher();

  // Extract genre names from the mapping for the dropdown
  const genreOptions = Object.keys(genreNameToIdMap);

  let selectedGenre = 'All Genres';

  function handleGenreChange(event) {
    const selected = event.target.value;
    dispatch('genreChange', selected);
  }

  function handleSearchChange(event) {
    dispatch('searchQueryChange', event.target.value);
  }
</script>

<div class="flex sm:flex-row flex-col items-center gap-4">
  <div class="flex items-center justify-center gap-4 sm:flex-row flex-col">
    <input
      id="search"
      type="text"
      placeholder="Search anime by title..."
      bind:value={searchQuery}
      on:input={handleSearchChange}
      class="p-2 rounded bg-secondary text-white placeholder-black w-64"
    />
  </div>

  <div class="flex items-center justify-center gap-4 sm:flex-row flex-col">
    <select
      id="genre"
      bind:value={selectedGenre}
      on:change={handleGenreChange}
      class="p-2 rounded bg-secondary text-black border-r-4 border-transparent"
    >
      {#each genreOptions as genre}
        <option value={genre}>{genre}</option>
      {/each}
    </select>
  </div>
</div>

<style>
  .search-bar {
    display: flex;
    align-items: center;
    justify-items: center;
    gap: 1rem;
  }

  .search-input {
    flex: 1;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
</style>
