<script>
  import {
    animeData,
    loading,
    error,
    fetchAnimeDataFromSupabase,
    hasMoreData,
  } from './animeStore.js';
  import { onMount } from 'svelte';
  import { getCurrentSeason, isCurrentSeason } from '../utils/seasonUtils';
  import Header from './Header.svelte';
  import AnimeCard from './AnimeCard.svelte';
  import InfiniteScrollIndicator from './InfiniteScrollIndicator.svelte';
  import SlideIn from './SlideIn.svelte';
  import Search from './Search.svelte';
  import ScrollTopButton from './ScrollTopButton.svelte';
  import Button from './Button.svelte';

  let season = getCurrentSeason();
  let year = new Date().getFullYear();
  let mediaFilter = 'tv';
  let searchQuery = '';
  let selectedGenre = 'All Genres';
  let hoverAnime = null;
  let showUpcoming = false; // New state variable for toggle

  // Debounce function remains unchanged
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Reactive statement to filter anime based on toggle
  $: filteredAnime = $animeData
    .filter((anime) => {
      if (showUpcoming) {
        return anime.year === 2025;
      }
      return anime.year === year;
    })
    .filter(
      (anime) => mediaFilter === 'all' || anime.media_type === mediaFilter
    )
    .filter((anime) =>
      anime.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((anime) =>
      selectedGenre === 'All Genres'
        ? true
        : anime.genres.some((genre) => genre.name === selectedGenre)
    );

  function handleMouseEnter(anime) {
    hoverAnime = anime;
  }

  function handleMouseLeave() {
    hoverAnime = null;
  }

  // Infinite scroll handler with loading, hasMoreData, and genre check
  function handleScroll() {
    if ($loading || !$hasMoreData || showUpcoming) return; // Stop if loading, no more data, or showing upcoming
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 500
    ) {
      fetchAnimeDataFromSupabase(season, year, selectedGenre);
    }
  }

  const debouncedHandleScroll = debounce(handleScroll, 200);

  onMount(() => {
    fetchAnimeDataFromSupabase(season, year, selectedGenre, showUpcoming);
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  });

  // Handle genre change event from SearchBar
  function handleGenreChange(newGenre) {
    selectedGenre = newGenre;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchAnimeDataFromSupabase(season, year, selectedGenre, showUpcoming, true);
  }

  // **New Function to Handle Upcoming Anime Toggle**
  function toggleUpcoming() {
    showUpcoming = !showUpcoming;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (showUpcoming) {
      season = 'all';
      mediaFilter = 'all';
      selectedGenre = 'All Genres';
      fetchAnimeDataFromSupabase('all', 2025, 'All Genres', showUpcoming, true);
    } else {
      // Reload current anime data when toggling back
      fetchAnimeDataFromSupabase(
        season,
        year,
        selectedGenre,
        showUpcoming,
        true
      );
    }
  }
</script>

<Header />

<main class="pb-4 px-4 bg-primary min-h-screen text-secondary flex justify-center">
  <div class="w-full max-w-screen-4k">
    <!-- Media Filter and Search Components -->
    <Search
      {mediaFilter}
      {searchQuery}
      {season}
      {year}
      on:filterChange={(e) => (mediaFilter = e.detail)}
      on:searchQueryChange={(e) => (searchQuery = e.detail)}
      on:genreChange={(e) => handleGenreChange(e.detail)}
      on:seasonChange={(e) => {
        season = e.detail;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchAnimeDataFromSupabase(
          season,
          year,
          selectedGenre,
          showUpcoming,
          true
        );
      }}
      on:yearChange={(e) => {
        year = parseInt(e.detail, 10);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchAnimeDataFromSupabase(
          season,
          year,
          selectedGenre,
          showUpcoming,
          true
        );
      }}
    />

    <!-- Button to Toggle Upcoming Anime -->
    <Button on:click={toggleUpcoming} variant="primary" className="mb-4">
      {#if showUpcoming}
        Show Current Anime
      {:else}
        Show Upcoming Anime
      {/if}
    </Button>

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
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2k:grid-cols-6 4k:grid-cols-8 gap-4"
      >
        {#each filteredAnime as anime}
          <SlideIn distance={30} duration={500}>
            <AnimeCard
              {anime}
              isCurrentlyAiring={isCurrentSeason(anime)}
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
    {#if !$hasMoreData && $animeData.length > 0 && !showUpcoming}
      <p class="text-center text-xl mt-4 text-black">No more anime to load.</p>
    {/if}
  </div>
</main>

<ScrollTopButton />
