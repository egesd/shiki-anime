<script>
  import { animeData, loading, error, fetchAnimeData } from './animeStore.js';

  let season = 'summer'; // Default season
  let year = 2023;       // Default year

  // Fetch anime data based on current season and year
  function updateAnimeData() {
    fetchAnimeData(season, year);
  }

  // Fetch initial data
  updateAnimeData();
</script>

<main class="p-4">
  <!-- Season and Year Selectors -->
  <div class="mb-4">
    <label for="season">Season:</label>
    <select id="season" bind:value={season} on:change={updateAnimeData} class="ml-2 p-1">
      <option value="winter">Winter</option>
      <option value="spring">Spring</option>
      <option value="summer">Summer</option>
      <option value="fall">Fall</option>
    </select>

    <label for="year" class="ml-4">Year:</label>
    <select id="year" bind:value={year} on:change={updateAnimeData} class="ml-2 p-1">
      {#each Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i) as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
  </div>

  {#if $loading}
    <p class="text-center text-gray-500">Loading anime...</p>
  {/if}

  {#if $error}
    <p class="text-center text-red-500">{$error}</p>
  {/if}

  <!-- Anime Display -->
  {#if $animeData && $animeData.length}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {#each $animeData as anime}
        <div class="border rounded-lg p-4 shadow-lg">
          <h2 class="text-lg font-bold mb-2">{anime.node.title}</h2>
          {#if anime.node.main_picture}
            <img src={anime.node.main_picture.medium} alt="{anime.node.title}" class="w-full h-auto mb-2 rounded" />
          {/if}
          {#if anime.node.mean !== undefined}
            <p>Score: {anime.node.mean}</p>
          {:else}
            <p>Score: Not available</p>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</main>
