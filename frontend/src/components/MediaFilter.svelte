<script>
  import { createEventDispatcher } from 'svelte';
  import Button from './Button.svelte'; // Adjust the path if necessary
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faTv, faFilm } from '@fortawesome/free-solid-svg-icons';

  export let mediaFilter;

  const dispatch = createEventDispatcher();

  function handleFilterChange(filter) {
    dispatch('filterChange', filter); // Emit custom event with the selected filter
  }
</script>


<div class="mb-4 flex items-center justify-center gap-4">
  <Button
    variant={mediaFilter === 'tv' ? 'secondary' : 'primary'}
    on:click={() => handleFilterChange('tv')}
    className="text-xl"
  >
    <FontAwesomeIcon icon={faTv} class="mr-2" /> Series
  </Button>

  <Button
    variant={mediaFilter === 'movie' ? 'secondary' : 'primary'}
    on:click={() => handleFilterChange('movie')}
    className="text-xl"
  >
    <FontAwesomeIcon icon={faFilm} class="mr-2" /> Movies
  </Button>
</div>