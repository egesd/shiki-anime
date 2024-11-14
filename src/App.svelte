<script>
  import { animeData, loading, error, fetchAnimeData } from './animeStore.js';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faSearch, faStar, faTv, faFilm, faCalendarAlt, faFilter } from '@fortawesome/free-solid-svg-icons';
  import { onMount } from 'svelte';
  import Header from './Header.svelte';

  let season = 'spring';
  let year = 2023;
  let mediaFilter = 'tv';
  let searchQuery = '';

  // Load initial anime data
  fetchAnimeData(season, year, true);

  // Filter anime based on type and search query
  $: filteredAnime = $animeData
    .filter(anime => anime.node.media_type === mediaFilter)
    .filter(anime => anime.node.title.toLowerCase().includes(searchQuery.toLowerCase()));

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
</script>

<Header />

<main class="p-4 bg-primary min-h-screen text-white">
  <!-- Media Filter Toggle -->
  <div class="mb-4 flex items-center justify-center gap-4">
    <button class="p-2 rounded-lg bg-secondary text-primary hover:bg-accent2 transition" on:click={() => mediaFilter = 'tv'}>
      <FontAwesomeIcon icon={faTv} class="mr-2" /> Series
    </button>
    <button class="p-2 rounded-lg bg-secondary text-primary hover:bg-accent2 transition" on:click={() => mediaFilter = 'movie'}>
      <FontAwesomeIcon icon={faFilm} class="mr-2" /> Movies
    </button>
  </div>

  <!-- Search Input -->
  <div class="mb-4 flex items-center justify-center gap-4">
    <label for="search" class="text-accent3">
      <FontAwesomeIcon icon={faSearch} class="mr-1" />
      Search:
    </label>
    <input id="search" type="text" placeholder="Search anime by title..." bind:value={searchQuery} class="p-2 rounded bg-secondary text-white w-64" />
  </div>

  <!-- Season and Year Selectors -->
  <div class="mb-4 flex items-center justify-center gap-4">
    <label for="season" class="text-accent3">
      <FontAwesomeIcon icon={faFilter} class="mr-1" />
      Season:
    </label>
    <select id="season" bind:value={season} on:change={() => fetchAnimeData(season, year, true)} class="p-2 rounded bg-secondary text-white">
      <option value="winter">Winter</option>
      <option value="spring">Spring</option>
      <option value="summer">Summer</option>
      <option value="fall">Fall</option>
    </select>

    <label for="year" class="text-accent3">
      <FontAwesomeIcon icon={faCalendarAlt} class="mr-1" />
      Year:
    </label>
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
        <div class="border rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl flex flex-col bg-secondary text-white">
          <!-- Image Section -->
          <div class="w-full h-64 overflow-hidden flex-shrink-0">
            <img
              src={anime.node.main_picture.large || anime.node.main_picture.medium} 
              alt="{anime.node.title}" 
              class="w-full h-full object-cover" 
            />
          </div>

          <!-- Title and Score Section -->
          <div class="p-4">
            <h2 class="text-lg font-bold mb-2" title={anime.node.title}>{anime.node.title}</h2>

            {#if anime.node.mean !== undefined}
              <p class="text-center text-xl font-semibold text-accent3 mt-2">
                <FontAwesomeIcon icon={faStar} class="mr-1" />
                {anime.node.mean.toFixed(1)}
              </p>
            {:else}
              <p class="text-center text-accent1 mt-2">Score: Not available</p>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Infinite Scroll Loading Indicator -->
  {#if $loading && $animeData.length}
    <p class="text-center text-accent3 mt-4">Loading more...</p>
  {/if}
</main>
