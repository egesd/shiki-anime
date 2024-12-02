<!-- frontend/src/components/SearchBar.svelte -->
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
</script>

<div class="flex flex-row items-center gap-4">
  <div class="flex items-center justify-center gap-4 sm:flex-row flex-col">
    <label for="search" class="text-accent2">
      <FontAwesomeIcon icon={faSearch} class="mr-1" /> Search:
    </label>
    <input
      id="search"
      type="text"
      placeholder="Search anime by title..."
      bind:value={searchQuery}
      class="p-2 rounded bg-secondary text-white placeholder-black w-64"
    />
  </div>

  <div class="flex items-center justify-center gap-4 sm:flex-row flex-col">
    <label for="genre" class="text-accent2"> Genre: </label>
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
