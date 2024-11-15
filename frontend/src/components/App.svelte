<script>
  import { animeData, loading, error, fetchAnimeData } from './animeStore.js';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import {
    faSnowflake,
    faSeedling,
    faSun,
    faLeaf,
  } from '@fortawesome/free-solid-svg-icons';
  import {
    faSearch,
    faStar,
    faTv,
    faFilm,
    faCalendarAlt,
    faFilter,
  } from '@fortawesome/free-solid-svg-icons';
  import { genreIcons } from '../config/genreIcons';
  import { onMount } from 'svelte';
  import Header from './Header.svelte';
  import SlideIn from './SlideIn.svelte';

  function getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 0 && month <= 2) return 'winter';
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    return 'fall';
  }

  let season = getCurrentSeason();
  let year = new Date().getFullYear();
  let mediaFilter = 'tv';
  let searchQuery = '';
  let hoverAnime = null;

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

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

  // Infinite scroll handler with loading check
  function handleScroll() {
    if ($loading) return; // Stop if data is already loading
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 500
    ) {
      fetchAnimeData(season, year);
    }
  }

  const debouncedHandleScroll = debounce(handleScroll, 200);

  onMount(() => {
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  });
</script>

<Header />

<main class="p-4 bg-primary min-h-screen text-secondary flex justify-center">
  <div class="w-full max-w-screen-xl">
    <!-- Media Filter Toggle -->
    <div class="mb-4 flex items-center justify-center gap-4">
      <button
        class="p-2 rounded-lg bg-accent2 text-primary text-xl"
        on:click={() => (mediaFilter = 'tv')}
      >
        <FontAwesomeIcon icon={faTv} class="mr-2" /> Series
      </button>
      <button
        class="p-2 rounded-lg bg-accent2 text-primary text-xl"
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
      <div class="flex items-center justify-center gap-4">
        <div class="flex gap-2 items-center">
          <p aria-roledescription="label" class="text-accent2 mr-2">Season:</p>
          <button
            class="p-2 rounded-lg bg-secondary text-white hover:bg-accent1 transition-all"
            class:bg-accent2={season === 'winter'}
            on:click={() => {
              season = 'winter';
              fetchAnimeData(season, year, true);
            }}
          >
            <FontAwesomeIcon icon={faSnowflake} class="mr-1" /> Winter
          </button>
          <button
            class="p-2 rounded-lg bg-secondary text-white hover:bg-accent1 transition-all"
            class:bg-accent2={season === 'spring'}
            on:click={() => {
              season = 'spring';
              fetchAnimeData(season, year, true);
            }}
          >
            <FontAwesomeIcon icon={faSeedling} class="mr-1" /> Spring
          </button>
          <button
            class="p-2 rounded-lg bg-secondary text-white hover:bg-accent1 transition-all"
            class:bg-accent2={season === 'summer'}
            on:click={() => {
              season = 'summer';
              fetchAnimeData(season, year, true);
            }}
          >
            <FontAwesomeIcon icon={faSun} class="mr-1" /> Summer
          </button>
          <button
            class="p-2 rounded-lg bg-secondary text-white hover:bg-accent1 transition-all"
            class:bg-accent2={season === 'fall'}
            on:click={() => {
              season = 'fall';
              fetchAnimeData(season, year, true);
            }}
          >
            <FontAwesomeIcon icon={faLeaf} class="mr-1" /> Fall
          </button>
        </div>
      </div>

      <div class="flex gap-2 items-center">
        <label for="year" class="text-accent2 mr-1">
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
          <SlideIn distance={30} duration={500}>
            <div
              role="button"
              tabindex="0"
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
                {#if anime.node.mean !== undefined}
                  <!-- Score in top-right corner of image -->
                  <p
                    class="absolute top-2 right-2 bg-secondary bg-opacity-90 text-white text-sm px-2 py-1 rounded"
                  >
                    <FontAwesomeIcon icon={faStar} class="mr-1" />
                    {anime.node.mean.toFixed(1)}
                  </p>
                {/if}
              </div>

              <!-- Title Section -->
              <div class="p-3 h-20 flex items-center justify-center">
                <h2
                  class="text-md font-semibold text-white font-bruce text-center"
                  title={anime.node.title}
                >
                  {anime.node.title.length > 35
                    ? anime.node.title.slice(0, 35) + '...'
                    : anime.node.title}
                </h2>
              </div>

              <!-- Hover Modal for Anime Details -->
              <!-- {#if hoverAnime === anime} -->
              <div
                class="absolute inset-0 bg-secondary bg-opacity-100 p-4 rounded-lg text-white z-10 flex flex-col justify-center items-center gap-2"
              >
                <!-- Score in top-right corner of modal -->
                {#if anime.node.mean !== undefined}
                  <p
                    class="absolute top-2 right-2 bg-accent1 text-white text-sm px-2 py-1 rounded flex items-center"
                  >
                    <FontAwesomeIcon icon={faStar} class="mr-1" />
                    {anime.node.mean.toFixed(1)}
                  </p>
                {/if}

                <h2 class="text-xl font-bold mb-2 font-bruce text-center">
                  {anime.node.title}
                </h2>
                <p>
                  <strong>Episodes:</strong>
                  {anime.node.num_episodes || 'N/A'}
                </p>
                <p>
                  <strong>Studio:</strong>
                  {anime.node.studios?.[0]?.name || 'Unknown'}
                </p>
                <div>
                  <strong>Genres:</strong>
                  <div class="flex gap-2 mt-1 flex-wrap justify-center">
                    {#each anime.node.genres as genre}
                      <div class="flex items-center gap-1">
                        {#if genreIcons[genre.name]}
                          <FontAwesomeIcon icon={genreIcons[genre.name]} />
                        {/if}
                        <span>{genre.name}</span>
                      </div>
                    {/each}
                  </div>
                </div>
                {#if anime.node.broadcast}
                  <div class="mt-2 flex flex-col items-center text-center">
                    <strong>Broadcast:</strong>
                    <p class="mt-1">
                      <span class="capitalize">
                        {anime.node.broadcast.day_of_the_week || 'Unknown'}
                      </span>
                      at {anime.node.broadcast.start_time || 'Unknown'}
                    </p>
                  </div>
                {/if}
              </div>
              <!--  {/if} -->
            </div>
          </SlideIn>
        {/each}
      </div>
    {:else if !$loading && !filteredAnime.length}
      <h2 class="text-center text-accent2">No anime found.</h2>
    {/if}

    <!-- Infinite Scroll Loading Indicator -->
    {#if $loading && $animeData.length}
      <p class="text-center text-accent2 mt-4">Loading more...</p>
    {/if}
  </div>
</main>
