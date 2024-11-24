<script>
  import { createEventDispatcher } from 'svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faStar } from '@fortawesome/free-solid-svg-icons';
  import { genreIcons } from '../config/genreIcons';
  import { convertJSTToFinnish } from '../utils/timezone';

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

  // Convert broadcast time to Finnish time
  let convertedBroadcast = { day: 'Unknown', time: 'Unknown' };

  if (anime.broadcast_day && anime.broadcast_time) {
    convertedBroadcast = convertJSTToFinnish(
      anime.broadcast_day,
      anime.broadcast_time
    );
  }
</script>

<div
  role="button"
  tabindex="0"
  class="relative bg-secondary rounded-lg overflow-hidden flex flex-col text-primary"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  <!-- Main Card Content -->
  <div class="relative w-full" style="padding-bottom: 150%;">
    {#if anime?.main_picture}
      <img
        src={anime.main_picture.large || anime.main_picture.medium}
        alt={anime.title}
        class="absolute top-0 left-0 w-full h-full object-cover"
        loading="lazy"
      />
    {/if}
    {#if anime?.mean !== undefined}
      <p
        class="absolute top-2 right-2 bg-secondary bg-opacity-90 text-white text-sm px-2 py-1 rounded md:text-base text-2xl"
      >
        <FontAwesomeIcon icon={faStar} class="mr-1" />
        {anime.mean.toFixed(1)}
      </p>
    {/if}
  </div>

  <div class="p-3 h-20 flex items-center justify-center">
    <h2
      class="text-md font-semibold text-white font-bruce text-center"
      title={anime?.title}
    >
      {anime?.title?.length > 35
        ? anime.title.slice(0, 35) + '...'
        : anime.title}
    </h2>
  </div>

  <!-- Hover Modal for Additional Details -->
  {#if isHovered}
    <div
      class="absolute inset-0 bg-secondary bg-opacity-100  p-4 rounded-lg text-white z-10 flex flex-col justify-center items-center gap-4 md:gap-2 text-2xl md:text-sm"
    >
      {#if anime?.mean !== undefined}
        <p
          class="absolute top-2 right-2 bg-accent1 text-white text-sm px-2 py-1 rounded flex items-center md:text-base text-2xl"
        >
          <FontAwesomeIcon icon={faStar} class="mr-2" />
          {anime.mean.toFixed(1)}
        </p>
      {/if}

      <h2 class="text-3xl md:text-xl font-bold mb-2 font-bruce text-center">
        {anime?.title}
      </h2>
      <p><strong>Episodes:</strong> {anime?.num_episodes || 'N/A'}</p>
      <p>
        <strong>Studio:</strong>
        {anime?.studios?.[0]?.name || 'Unknown'}
      </p>
      <div>
        <strong>Genres:</strong>
        <div class="flex gap-2 mt-1 flex-wrap justify-center">
          {#each anime?.genres as genre}
            <div class="flex items-center gap-2">
              {#if genreIcons[genre.name]}
                <FontAwesomeIcon icon={genreIcons[genre.name]} />
              {/if}
              <span>{genre.name}</span>
            </div>
          {/each}
        </div>
      </div>
      {#if convertedBroadcast.day !== 'Unknown' && convertedBroadcast.time !== 'Unknown'}
        <div class="mt-2 flex flex-col items-center text-center">
          <strong>Broadcast:</strong>
          <p class="mt-1">
            <span class="capitalize">
              {convertedBroadcast.day}
            </span>
            at {convertedBroadcast.time}
          </p>
        </div>
      {:else}
        <p class="mt-2 text-center">Broadcast information not available.</p>
      {/if}
    </div>
  {/if}
</div>
