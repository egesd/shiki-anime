<script>
  import { animeData, loading, error, fetchAnimeData } from './animeStore.js';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import {
    faSearch,
    faStar,
    faTv,
    faFilm,
    faCalendarAlt,
    faFilter,
  } from '@fortawesome/free-solid-svg-icons';
  import { genreIcons } from './genreIcons';
  import { onMount } from 'svelte';
  import Header from './Header.svelte';

  let season = 'spring';
  let year = 2023;
  let mediaFilter = 'tv';
  let searchQuery = '';
  let hoverAnime = null;

  // Load initial anime data
  fetchAnimeData(season, year, true);

  // Filter anime based on type and search query
  $: filteredAnime = $animeData
    .filter((anime) => anime.node.media_type === mediaFilter)
    .filter((anime) =>
      anime.node.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  function handleMouseEnter(anime) {
    hoverAnime = anime;
  }

  function handleMouseLeave() {
    hoverAnime = null;
  }

  // Infinite scroll handler
  function handleScroll() {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 500
    ) {
      fetchAnimeData(season, year);
    }
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<Header />

<main class="p-4 bg-primary min-h-screen text-secondary flex justify-center">
  <div class="w-full max-w-screen-lg">
    <!-- Media Filter Toggle -->
    <div class="mb-4 flex items-center justify-center gap-4">
      <button
        class="p-2 rounded-lg bg-accent2 text-primary"
        on:click={() => (mediaFilter = 'tv')}
      >
        <FontAwesomeIcon icon={faTv} class="mr-2" /> Series
      </button>
      <button
        class="p-2 rounded-lg bg-accent2 text-primary"
        on:click={() => (mediaFilter = 'movie')}
      >
        <FontAwesomeIcon icon={faFilm} class="mr-2" /> Movies
      </button>
    </div>

    <!-- Search Input -->
    <div class="mb-4 flex items-center justify-center gap-4">
      <label for="search" class="text-accent2">
        <FontAwesomeIcon icon={faSearch} class="mr-1" />
        Search:
      </label>
      <input
        id="search"
        type="text"
        placeholder="Search anime by title..."
        bind:value={searchQuery}
        class="p-2 rounded bg-secondary text-white placeholder-white w-64"
      />
    </div>

    <!-- Season and Year Selectors -->
    <div class="mb-4 flex items-center justify-center gap-4">
      <label for="season" class="text-accent2">
        <FontAwesomeIcon icon={faFilter} class="mr-1" />
        Season:
      </label>
      <select
        id="season"
        bind:value={season}
        on:change={() => fetchAnimeData(season, year, true)}
        class="p-2 rounded bg-secondary text-white placeholder-white"
      >
        <option value="winter">Winter</option>
        <option value="spring">Spring</option>
        <option value="summer">Summer</option>
        <option value="fall">Fall</option>
      </select>

      <label for="year" class="text-accent2">
        <FontAwesomeIcon icon={faCalendarAlt} class="mr-1" />
        Year:
      </label>
      <select
        id="year"
        bind:value={year}
        on:change={() => fetchAnimeData(season, year, true)}
        class="p-2 rounded bg-secondary text-white placeholder-white"
      >
        {#each Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i) as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>

    <!-- Display Anime Cards -->
    {#if $loading && !$animeData.length}
      <p class="text-center text-accent2">Loading anime...</p>
    {/if}

    {#if $error}
      <p class="text-center text-accent1">{$error}</p>
    {/if}

    {#if filteredAnime && filteredAnime.length}
      <!-- 4-Column Grid Layout on Large Screens -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {#each filteredAnime as anime}
          <div
            role="tooltip"
            class="relative bg-secondary rounded-lg overflow-hidden shadow-lg flex flex-col text-primary"
            on:mouseenter={() => handleMouseEnter(anime)}
            on:mouseleave={handleMouseLeave}
          >
            <!-- Image wrapper with fixed aspect ratio -->
            <div class="relative w-full" style="padding-bottom: 150%;">
              <img
                src={anime.node.main_picture.large ||
                  anime.node.main_picture.medium}
                alt={anime.node.title}
                class="absolute top-0 left-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <!-- Title and Score Section -->
            <div class="p-3 flex justify-between items-center">
              <h2
                class="text-lg font-semibold text-white truncate"
                title={anime.node.title}
              >
                {anime.node.title}
              </h2>
              {#if anime.node.mean !== undefined}
                <p class="text-sm text-accent2 flex items-center">
                  <FontAwesomeIcon icon={faStar} class="mr-1" />
                  {anime.node.mean.toFixed(1)}
                </p>
              {/if}
            </div>

            <!-- Hover Modal for Anime Details -->
            {#if hoverAnime === anime}
              <div
                class="absolute inset-0 bg-secondary bg-opacity-100 p-4 rounded-lg text-white z-10"
              >
                <h2 class="text-xl font-bold mb-2 font-yoruka">
                  {anime.node.title}
                </h2>
                <p class="mb-2">
                  <strong>Episodes:</strong>
                  {anime.node.num_episodes || 'N/A'}
                </p>
                <p class="mb-2">
                  <strong>Studio:</strong>
                  {anime.node.studios?.[0]?.name || 'Unknown'}
                </p>
                <div class="mb-2">
                  <strong>Genres:</strong>
                  <div class="flex gap-2 mt-1 flex-wrap">
                    {#each anime.node.genres as genre}
                      <div class="flex items-center gap-1">
                        {#if genreIcons[genre.name]}
                          <FontAwesomeIcon icon={genreIcons[genre.name]} />
                        {/if}
                        <span>{genre.name}</span>
                      </div>
                    {/each}
                    <!-- Broadcast Data -->
                  </div>
                </div>
                {#if anime.node.broadcast}
                  <div class="mt-2 flex flex-col items-center text-center">
                    <strong>Broadcast:</strong>
                    <p class="mt-1">
                      {anime.node.broadcast.day_of_the_week || 'Unknown'} at
                      {anime.node.broadcast.start_time || 'Unknown'}
                    </p>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {:else}
      <h2 class="text-center text-accent2">No anime found.</h2>
    {/if}

    <!-- Infinite Scroll Loading Indicator -->
    {#if $loading && $animeData.length}
      <p class="text-center text-accent2 mt-4">Loading more...</p>
    {/if}
  </div>
</main>
