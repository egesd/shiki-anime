<script>
  import { animeData, loading, error, fetchAnimeData } from './animeStore.js';
  import { onMount } from 'svelte';
  import Header from './Header.svelte';

  let season = 'spring';
  let year = 2023;
  let searchQuery = ''; // New reactive variable for the search term

  // Load initial anime data
  fetchAnimeData(season, year, true);

  // Infinite scroll handler
  function handleScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
      fetchAnimeData(season, year);
    }
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  // Reactive statement to filter anime based on the search query
  $: filteredAnime = $animeData.filter(anime =>
    anime.node.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
</script>

<Header />

<main class="p-4">
  <!-- Search Input -->
  <div class="mb-4 flex items-center justify-center gap-4">
    <label for="search" class="text-accent3">Search:</label>
    <input
      id="search"
      type="text"
      placeholder="Search anime by title..."
      bind:value={searchQuery}
      class="p-2 rounded bg-secondary text-white w-64"
    />
  </div>

  <!-- Season and Year Selectors -->
  <div class="mb-4 flex items-center justify-center gap-4">
    <label for="season" class="text-accent3">Season:</label>
    <select id="season" bind:value={season} on:change={() => fetchAnimeData(season, year, true)} class="p-2 rounded bg-secondary text-white">
      <option value="winter">Winter</option>
      <option value="spring">Spring</option>
      <option value="summer">Summer</option>
      <option value="fall">Fall</option>
    </select>

    <label for="year" class="text-accent3">Year:</label>
    <select id="year" bind:value={year} on:change={() => fetchAnimeData(season, year, true)} class="p-2 rounded bg-secondary text-white">
      {#each Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i) as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
  </div>

  <!-- Display Anime Cards -->
  {#if $loading && !$animeData.length}
    <p class="text-center text-accent3">Loading anime...</p>
  {/if}

  {#if $error}
    <p class="text-center text-accent2">{$error}</p>
  {/if}

  {#if filteredAnime && filteredAnime.length}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {#each filteredAnime as anime}
        <div class="border rounded-lg p-4 shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl flex flex-col bg-secondary text-white">
          <h2 class="text-lg font-bold mb-2 truncate" title={anime.node.title}>{anime.node.title}</h2>
          <div class="h-48 w-full overflow-hidden rounded-md mb-2 flex-shrink-0">
            <img src={anime.node.main_picture.medium} alt="{anime.node.title}" class="w-full h-full object-cover" />
          </div>
          {#if anime.node.mean !== undefined}
            <p class="text-center text-xl font-semibold text-accent3 mt-2">⭐ {anime.node.mean.toFixed(1)}</p>
          {:else}
            <p class="text-center text-accent1 mt-2">Score: Not available</p>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <!-- Infinite Scroll Loading Indicator -->
  {#if $loading && $animeData.length}
    <p class="text-center text-accent3 mt-4">Loading more...</p>
  {/if}
</main>
