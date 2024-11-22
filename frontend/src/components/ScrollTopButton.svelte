<script>
  import { onMount, onDestroy } from 'svelte';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
  import Button from './Button.svelte';

  let isVisible = false;

  // Function to check scroll position
  function checkScroll() {
    isVisible = window.scrollY > 300; // Show button after scrolling down 300px
  }

  // Function to scroll to top
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Add scroll event listener on mount
  onMount(() => {
    window.addEventListener('scroll', checkScroll);
  });

  // Remove scroll event listener on destroy
  onDestroy(() => {
    window.removeEventListener('scroll', checkScroll);
  });
</script>

{#if isVisible}
  <div class="fixed bottom-6 right-6 sm:bottom-4 sm:right-4 z-50">
    <Button
      variant="primary"
      on:click={scrollToTop}
      aria-label="Scroll to top"
      className="p-3 rounded-full shadow-lg hover:bg-accent1 transition-colors duration-200"
    >
      <FontAwesomeIcon icon={faArrowUp} class="text-white text-3xl" />
    </Button>
  </div>
{/if}

<style>
  /* Optional: Add any additional styles if needed */
</style>