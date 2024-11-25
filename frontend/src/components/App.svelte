<script>
  import {
    animeData,
    loading,
    error,
    fetchAnimeDataFromSupabase,
    hasMoreData,
  } from './animeStore.js';
  import { onMount } from 'svelte';
  import Header from './Header.svelte';
  import AnimeCard from './AnimeCard.svelte';
  import InfiniteScrollIndicator from './InfiniteScrollIndicator.svelte';
  import SlideIn from './SlideIn.svelte';
  import Search from './Search.svelte';
  import ScrollTopButton from './ScrollTopButton.svelte';

  function getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 0 && month <= 2) return 'winter';
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    return 'fall';
  }

  let season = getCurrentSeason();
  let year = new Date().getFullYear();
  let mediaFilter = 'all'; // Change default to 'all'
  let searchQuery = '';
  let hoverAnime = null;

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Filter anime based on type and search query
  $: filteredAnime = $animeData
    .filter(
      (anime) => mediaFilter === 'all' || anime.media_type === mediaFilter
    )
    .filter((anime) =>
      anime.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  function handleMouseEnter(anime) {
    hoverAnime = anime;
  }

  function handleMouseLeave() {
    hoverAnime = null;
  }

  // Infinite scroll handler with loading and hasMoreData check
  function handleScroll() {
    if ($loading || !$hasMoreData) return; // Stop if loading or no more data
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 500
    ) {
      fetchAnimeDataFromSupabase(season, year);
    }
  }

  const debouncedHandleScroll = debounce(handleScroll, 200);

  onMount(() => {
    fetchAnimeDataFromSupabase(season, year);
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  });
</script>

<Header />

<main class="p-4 bg-primary min-h-screen text-secondary flex justify-center">
  <div class="w-full max-w-screen-xl">
    <!-- Media Filter and Search Components -->
    <Search
      {mediaFilter}
      {searchQuery}
      {season}
      {year}
      on:filterChange={(e) => (mediaFilter = e.detail)}
      on:searchQueryChange={(e) => (searchQuery = e.detail)}
      on:seasonChange={(e) => {
        season = e.detail;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchAnimeDataFromSupabase(season, year, true);
      }}
      on:yearChange={(e) => {
        year = parseInt(e.detail, 10);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchAnimeDataFromSupabase(season, year, true);
      }}
    />

    <!-- Display Spinner when loading and no data is yet available -->
    {#if $loading && !$animeData.length}
      <div class="flex justify-center items-center">
        <InfiniteScrollIndicator />
      </div>
    {/if}

    <!-- Error Message -->
    {#if $error}
      <p class="text-center text-accent1">{$error}</p>
    {/if}

    <!-- Display Anime Cards -->
    {#if filteredAnime && filteredAnime.length}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each filteredAnime as anime}
          <SlideIn distance={30} duration={500}>
            <AnimeCard
              {anime}
              on:hoverEnter={handleMouseEnter}
              on:hoverLeave={handleMouseLeave}
            />
          </SlideIn>
        {/each}
      </div>
    {:else if !$loading && !filteredAnime.length}
      <p class="text-center text-accent1">
        No anime found for the selected criteria.
      </p>
    {/if}

    <!-- Optionally, indicate no more data -->
    {#if !$hasMoreData && $animeData.length > 0}
      <p class="text-center text-xl mt-4 text-black">No more anime to load.</p>
    {/if}
  </div>
</main>

<ScrollTopButton />