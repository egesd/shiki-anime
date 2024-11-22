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

  // Forward events from MediaFilter
  function handleFilterChange(event) {
    dispatch('filterChange', event.detail);
  }

  // Forward events from SearchBar
  function handleSearchQueryChange(event) {
    dispatch('searchQueryChange', event.detail);
  }

  // Forward events from SeasonYearSelector
  function handleSeasonChange(event) {
    dispatch('seasonChange', event.detail);
  }

  function handleYearChange(event) {
    dispatch('yearChange', event.detail);
  }
</script>

<search class="md:sticky md:top-0 bg-primary p-4 z-20">
  <div class="flex flex-col sm:items-center sm:justify-between gap-4">
    <!-- Media Filter -->
    <MediaFilter
      {mediaFilter}
      on:filterChange={handleFilterChange}
    />

    <!-- Search Bar -->
    <SearchBar
      bind:searchQuery
      on:searchQueryChange={handleSearchQueryChange}
    />

    <!-- Season and Year Selector -->
    <SeasonYearSelector
      {season}
      {year}
      on:seasonChange={handleSeasonChange}
      on:yearChange={handleYearChange}
    />
  </div>
</search>