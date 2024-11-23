<script>
  import MediaFilter from './MediaFilter.svelte';
  import SearchBar from './SearchBar.svelte';
  import SeasonYearSelector from './SeasonYearSelector.svelte';
  import { createEventDispatcher, onMount } from 'svelte';

  export let mediaFilter;
  export let searchQuery;
  export let season;
  export let year;

  const dispatch = createEventDispatcher();

  let isPinned = false;
  let sentinel; // Reference to the sentinel element

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

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isPinned = !entry.isIntersecting;
      },
      {
        threshold: [0],
        rootMargin: '-1px 0px 0px 0px',
      }
    );

    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.unobserve(sentinel);
  });
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
    class={`flex ${isPinned ? 'flex-row ' : 'flex-col'} max-sm:flex-col sm:items-center sm:justify-between gap-4`}
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
      on:searchQueryChange={handleSearchQueryChange}
      {isPinned}
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
