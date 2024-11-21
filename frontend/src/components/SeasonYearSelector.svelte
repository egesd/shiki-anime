<script>
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faSnowflake, faSeedling, faSun, faLeaf, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
  import { createEventDispatcher } from 'svelte';

  export let season;
  export let year;

  const dispatch = createEventDispatcher();

  function handleSeasonChange(selectedSeason) {
    dispatch('seasonChange', selectedSeason); // Emit a custom event for season
  }

  function handleYearChange(event) {
    const selectedYear = event.target.value; // Direct access without type casting
    dispatch('yearChange', selectedYear); // Emit a custom event for year
  }
</script>

<div class="mb-4 flex sm:flex-row flex-col items-center justify-center gap-4">
  <div class="flex sm:flex-row flex-col gap-2 items-center max-sm:w-full">
    <p class="text-accent2 mr-2">Season:</p>
    {#each [{ name: 'winter', icon: faSnowflake }, { name: 'spring', icon: faSeedling }, { name: 'summer', icon: faSun }, { name: 'fall', icon: faLeaf }] as { name, icon }}
      <button
        class="p-2 rounded-lg text-white transition-all w-full"
        class:bg-accent2={season === name}
        class:bg-secondary={season !== name}
        on:click={() => handleSeasonChange(name)}
      >
        <FontAwesomeIcon {icon} class="mr-1" />
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </button>
    {/each}
  </div>

  <div class="flex gap-2 items-center">
    <label for="year" class="text-accent2 mr-1">
      <FontAwesomeIcon icon={faCalendarAlt} class="mr-1" /> Year:
    </label>
    <select
      id="year"
      bind:value={year}
      on:change={handleYearChange}
      class="p-2 rounded bg-secondary text-white placeholder-white"
    >
      {#each Array.from({ length: 45 }, (_, i) => new Date().getFullYear() - i) as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
  </div>
</div>
