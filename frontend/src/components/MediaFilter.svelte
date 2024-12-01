<script>
  import { createEventDispatcher } from 'svelte';
  import Button from './Button.svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import {
    faTv,
    faFilm,
    faMicrophone,
    faPlay,
    faQuestion,
  } from '@fortawesome/free-solid-svg-icons';

  export let isPinned = false;
  export let mediaFilter;

  const allMediaTypes = [
    { id: 'tv', label: 'TV', icon: faTv },
    { id: 'movie', label: 'Movie', icon: faFilm },
    { id: 'ova', label: 'OVA', icon: faPlay },
    { id: 'ona', label: 'ONA', icon: faPlay },
    { id: 'special', label: 'Special', icon: faMicrophone },
    { id: 'unknown', label: 'Other', icon: faQuestion },
  ];

  $: mediaTypes = isPinned
    ? allMediaTypes.filter((type) => ['tv', 'movie'].includes(type.id))
    : allMediaTypes;

  const dispatch = createEventDispatcher();

  function handleFilterChange(filter) {
    dispatch('filterChange', filter);
  }
</script>

<div class="flex items-center justify-center gap-2 flex-wrap">
  {#each mediaTypes as type}
    <Button
      variant={mediaFilter === type.id ? 'secondary' : 'primary'}
      on:click={() => handleFilterChange(type.id)}
      className="text-lg"
    >
      <FontAwesomeIcon icon={type.icon} class="mr-2" />
      {type.label}
    </Button>
  {/each}
</div>
