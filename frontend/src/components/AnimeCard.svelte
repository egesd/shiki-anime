<script>
  import { createEventDispatcher } from 'svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faStar } from '@fortawesome/free-solid-svg-icons';
  import { genreIcons } from '../config/genreIcons';

  export let anime;

  const dispatch = createEventDispatcher();
  let isHovered = false; // Track hover state

  function handleMouseEnter() {
    isHovered = true;
    dispatch('hoverEnter', anime); // Emit custom event with anime data
  }

  function handleMouseLeave() {
    isHovered = false;
    dispatch('hoverLeave'); // Emit custom event without data
  }
</script>

<div
  role="button"
  tabindex="0"
  class="relative bg-secondary rounded-lg overflow-hidden shadow-lg flex flex-col text-primary"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  <!-- Main Card Content -->
  <div class="relative w-full" style="padding-bottom: 150%;">
    <img
      src={anime.node.main_picture.large || anime.node.main_picture.medium}
      alt={anime.node.title}
      class="absolute top-0 left-0 w-full h-full object-cover"
      loading="lazy"
    />
    {#if anime.node.mean !== undefined}
      <p
        class="absolute top-2 right-2 bg-secondary bg-opacity-90 text-white text-sm px-2 py-1 rounded"
      >
        <FontAwesomeIcon icon={faStar} class="mr-1" />
        {anime.node.mean.toFixed(1)}
      </p>
    {/if}
  </div>

  <div class="p-3 h-20 flex items-center justify-center">
    <h2
      class="text-md font-semibold text-white font-bruce text-center"
      title={anime.node.title}
    >
      {anime.node.title.length > 35
        ? anime.node.title.slice(0, 35) + '...'
        : anime.node.title}
    </h2>
  </div>

  <!-- Hover Modal for Additional Details -->
  {#if isHovered}
    <div
      class="absolute inset-0 bg-secondary bg-opacity-100 p-4 rounded-lg text-white z-10 flex flex-col justify-center items-center gap-2"
    >
      {#if anime.node.mean !== undefined}
        <p
          class="absolute top-2 right-2 bg-accent1 text-white text-sm px-2 py-1 rounded flex items-center"
        >
          <FontAwesomeIcon icon={faStar} class="mr-1" />
          {anime.node.mean.toFixed(1)}
        </p>
      {/if}

      <h2 class="text-xl font-bold mb-2 font-bruce text-center">
        {anime.node.title}
      </h2>
      <p><strong>Episodes:</strong> {anime.node.num_episodes || 'N/A'}</p>
      <p>
        <strong>Studio:</strong>
        {anime.node.studios?.[0]?.name || 'Unknown'}
      </p>
      <div>
        <strong>Genres:</strong>
        <div class="flex gap-2 mt-1 flex-wrap justify-center">
          {#each anime.node.genres as genre}
            <div class="flex items-center gap-1">
              {#if genreIcons[genre.name]}
                <FontAwesomeIcon icon={genreIcons[genre.name]} />
              {/if}
              <span>{genre.name}</span>
            </div>
          {/each}
        </div>
      </div>
      {#if anime.node.broadcast}
        <div class="mt-2 flex flex-col items-center text-center">
          <strong>Broadcast:</strong>
          <p class="mt-1">
            <span class="capitalize">
              {anime.node.broadcast.day_of_the_week || 'Unknown'}
            </span>
            at {anime.node.broadcast.start_time || 'Unknown'}
          </p>
        </div>
      {/if}
    </div>
  {/if}
</div>
