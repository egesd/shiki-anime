<script>
  import Button from './Button.svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import {
    faSnowflake,
    faSeedling,
    faSun,
    faLeaf,
    faCalendarAlt,
    faInfinity,
    faGlobe,
  } from '@fortawesome/free-solid-svg-icons';
  import { createEventDispatcher } from 'svelte';

  export let season;
  export let year;

  const dispatch = createEventDispatcher();

  function handleSeasonChange(selectedSeason) {
    dispatch('seasonChange', selectedSeason); // Emit a custom event for season
  }

  function handleYearChange(event) {
    const selectedYear = event.target.value;
    dispatch('yearChange', selectedYear); // Emit a custom event for year
  }
</script>

<div class="mb-4 flex sm:flex-row flex-col items-center justify-center gap-4">
  <div class="flex sm:flex-row flex-col gap-2 items-center max-sm:w-full">
    <p class="text-accent2 mr-2 flex items-center">
      <FontAwesomeIcon icon={faGlobe} class="mr-1" />
      Season:
    </p>
    <!-- All Seasons Button -->
    <Button
      variant={season === 'all' ? 'secondary' : 'primary'}
      on:click={() => handleSeasonChange('all')}
      className="max-sm:w-full"
      aria-pressed={season === 'all'}
      aria-label="Show all seasons"
    >
      <FontAwesomeIcon icon={faInfinity} class="mr-1" />
      All
    </Button>

    {#each [{ name: 'winter', icon: faSnowflake }, { name: 'spring', icon: faSeedling }, { name: 'summer', icon: faSun }, { name: 'fall', icon: faLeaf }] as { name, icon }}
      <Button
        variant={season === name ? 'secondary' : 'primary'}
        on:click={() => handleSeasonChange(name)}
        className="max-sm:w-full"
        aria-pressed={season === name}
        aria-label={`Show ${name} season`}
      >
        <FontAwesomeIcon {icon} class="mr-1" />
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </Button>
    {/each}
  </div>

  <div class="flex gap-2 items-center">
    <label for="year" class="text-accent2 mr-1 flex items-center">
      <FontAwesomeIcon icon={faCalendarAlt} class="mr-1 mb-[2px]" /> Year:
    </label>
    <select
      id="year"
      bind:value={year}
      on:change={handleYearChange}
      class="p-2 rounded bg-secondary text-white focus:outline-none"
      aria-label="Select year"
    >
      {#each Array.from({ length: 45 }, (_, i) => new Date().getFullYear() - i) as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
  </div>
</div>
