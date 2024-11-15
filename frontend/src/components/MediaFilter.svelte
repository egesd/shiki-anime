<script>
  import { createEventDispatcher } from 'svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faTv, faFilm } from '@fortawesome/free-solid-svg-icons';

  export let mediaFilter;

  const dispatch = createEventDispatcher();

  function handleFilterChange(filter) {
    dispatch('filterChange', filter); // Emit custom event with the selected filter
  }
</script>

<div class="mb-4 flex items-center justify-center gap-4">
  <button
    class="p-2 rounded-lg text-white text-xl transition-all"
    class:bg-accent2={mediaFilter === 'tv'}
    class:bg-secondary={mediaFilter !== 'tv'}
    on:click={() => handleFilterChange('tv')}
  >
    <FontAwesomeIcon icon={faTv} class="mr-2" /> Series
  </button>

  <button
    class="p-2 rounded-lg text-white text-xl transition-all"
    class:bg-accent2={mediaFilter === 'movie'}
    class:bg-secondary={mediaFilter !== 'movie'}
    on:click={() => handleFilterChange('movie')}
  >
    <FontAwesomeIcon icon={faFilm} class="mr-2" /> Movies
  </button>
</div>
