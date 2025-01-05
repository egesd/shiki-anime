<script>
  import Button from './Button.svelte';

  export let showUpcoming;
  export let toggleUpcoming;
</script>

<Button on:click={toggleUpcoming} variant="primary" className="self-center">
  {#if showUpcoming}
    Show Current Anime
  {:else}
    Show Upcoming Anime
  {/if}
</Button>