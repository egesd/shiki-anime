<script>
  import {
    animeData,
    loading,
    error,
    fetchAnimeDataFromSupabase,
    hasMoreData,
  } from './animeStore.js';
  import { onMount } from 'svelte';
  import { getCurrentSeason, isCurrentSeason, getSeasonFromDate } from '../utils/seasonUtils';
  import Header from './Header.svelte';
  import AnimeCard from './AnimeCard.svelte';
  import InfiniteScrollIndicator from './InfiniteScrollIndicator.svelte';
  import SlideIn from './SlideIn.svelte';
  import Search from './Search.svelte';
  import ScrollTopButton from './ScrollTopButton.svelte';

  let season = getCurrentSeason();
  let year = new Date().getFullYear();
  let mediaFilter = 'tv';
  let searchQuery = '';
  let selectedGenre = 'All Genres';
  let hoverAnime = null;

  // Debounce function remains unchanged
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Reactive statement to filter anime based on toggle
  $: filteredAnime;
  $: filteredAnime = $animeData
    .filter((anime) => {
      return anime.year === year;
    })
    .filter((anime) => {
      return mediaFilter === 'all' || anime.media_type === mediaFilter;
    })
    .filter((anime) => {
      return anime.title.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .filter((anime) => {
      return selectedGenre === 'All Genres'
        ? true
        : anime.genres.some((genre) => genre.name === selectedGenre);
    });

  const currentSeason = getCurrentSeason();

  // Separate into New Animes and Continuing
  $: newAnimes = filteredAnime.filter((anime) => {
    if (!anime.start_date) return false;
    const animeYear = new Date(anime.start_date).getFullYear();
    const animeSeason = getSeasonFromDate(anime.start_date);
    return animeYear === year && animeSeason === season;
  });

  $: continuingAnimes = filteredAnime.filter((anime) => {
    if (!anime.start_date) return false;
    const animeStartDate = new Date(anime.start_date);
    const currentDate = new Date();
    const animeYear = animeStartDate.getFullYear();
    const animeSeason = getSeasonFromDate(anime.start_date);
    
    // Show as continuing if:
    // 1. Started before current season/year
    // 2. Is still airing (status check)
    return (animeYear < year || (animeYear === year && animeSeason !== season)) && 
           anime.status === 'currently_airing';
  });

  function handleMouseEnter(anime) {
    hoverAnime = anime;
  }

  function handleMouseLeave() {
    hoverAnime = null;
  }

  // Infinite scroll handler with loading, hasMoreData, and genre check
  function handleScroll() {
    if ($loading || !$hasMoreData) return; // Stop if loading or no more data
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 500
    ) {
      fetchAnimeDataFromSupabase(season, year, selectedGenre);
    }
  }

  const debouncedHandleScroll = debounce(handleScroll, 200);

  onMount(() => {
    fetchAnimeDataFromSupabase(season, year, selectedGenre, true);
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  });

  // Handle genre change event from SearchBar
  function handleGenreChange(newGenre) {
    selectedGenre = newGenre;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchAnimeDataFromSupabase(season, year, selectedGenre, true);
  }

  function handleSeasonChange(newSeason) {
    season = newSeason;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchAnimeDataFromSupabase(season, year, selectedGenre, true);
  }

  function handleYearChange(newYear) {
    year = newYear;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchAnimeDataFromSupabase(season, year, selectedGenre, true);
  }
</script>

<Header />

<main
  class="pb-4 px-4 bg-primary min-h-screen text-secondary flex justify-center items-center"
>
  <div class="w-full max-w-screen-4k flex flex-col">
    <!-- Media Filter and Search Components -->
    <Search
      {mediaFilter}
      {searchQuery}
      {season}
      {year}
      {selectedGenre}
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
          true
        );
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

    <!-- New Animes Section -->
    {#if newAnimes.length > 0}
      <section class="flex flex-col">
        <h2 class="text-2xl font-bold mb-4 text-accent2">New Animes</h2>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2k:grid-cols-6 4k:grid-cols-8 gap-4 w-4/5 self-center"
        >
          {#each newAnimes as anime}
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
      </section>
    {/if}

    <!-- Continuing Animes Section -->
    {#if continuingAnimes.length > 0}
      <section class="mt-8 flex flex-col">
        <h2 class="text-2xl font-bold mb-4 text-accent2">Continuing</h2>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2k:grid-cols-6 4k:grid-cols-8 gap-4 w-4/5 self-center"
        >
          {#each continuingAnimes as anime}
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
      </section>
    {/if}

    <!-- Optionally, indicate no more data -->
    {#if !$hasMoreData && $animeData.length > 0}
      <p class="text-center text-xl mt-4 text-black">No more anime to load.</p>
    {/if}
  </div>
</main>

<ScrollTopButton />
