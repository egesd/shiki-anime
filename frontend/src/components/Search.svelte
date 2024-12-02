<!-- frontend/src/components/Search.svelte -->
<script>
  import MediaFilter from './MediaFilter.svelte';
  import SearchBar from './SearchBar.svelte';
  import SeasonYearSelector from './SeasonYearSelector.svelte';
  import { createEventDispatcher } from 'svelte';

  export let mediaFilter;
  export let searchQuery;
  export let season;
  export let year;

  const dispatch = createEventDispatcher();

  let isPinned = false;
  let sentinel; // Reference to the sentinel element

  // Forward events from MediaFilter
  function handleFilterChange(newFilter) {
    dispatch('filterChange', newFilter);
  }

  // Forward events from SearchBar
  function handleSearchQueryChange(newSearchQuery) {
    dispatch('searchQueryChange', newSearchQuery);
  }

  function handleGenreChange(event) {
    const newGenre = event.detail;
    console.log('Search received genreChange with:', newGenre);
    dispatch('genreChange', newGenre);
  }

  // Forward events from SeasonYearSelector
  function handleSeasonChange(newSeason) {
    dispatch('seasonChange', newSeason);
  }

  function handleYearChange(newYear) {
    dispatch('yearChange', newYear);
  }
</script>

<div bind:this={sentinel} class="h-[1px] pointer-events-none"></div>
<div
  id="search"
  class={`
    bg-primary p-4 z-20 transition-all duration-300 max-sm:relative
    ${isPinned ? 'fixed top-0 left-0 right-0' : ''}
  `}
>
  <div
    class={`flex ${isPinned ? 'flex-row' : 'flex-col'} max-sm:flex-col sm:items-center sm:justify-center gap-4`}
  >
    <!-- Media Filter -->
    <MediaFilter
      {mediaFilter}
      on:filterChange={handleFilterChange}
      {isPinned}
    />

    <!-- Search Bar -->
    {#if !isPinned}
      <SearchBar
        bind:searchQuery
        on:genreChange={handleGenreChange}
        on:searchQueryChange={handleSearchQueryChange}
      />
    {/if}

    <!-- Season and Year Selector -->
    <SeasonYearSelector
      {season}
      {year}
      on:seasonChange={handleSeasonChange}
      on:yearChange={handleYearChange}
      {isPinned}
    />
  </div>
</div>
