<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  export let threshold = 0.1; // Controls when the animation triggers
  export let duration = 400; // Duration of the animation
  export let distance = 30; // Distance to slide in from the bottom

  let visible = false; // Tracks if the element is visible

  let element; // Bind element to use in the observer

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible = true;
            observer.unobserve(entry.target); // Stop observing after animation
          }
        });
      },
      { threshold }
    );

    if (element) observer.observe(element);
  });
</script>

<!-- Slide-in wrapper with `fly` transition applied when element is visible -->
<div
  bind:this={element}
  in:fly={{ y: distance, duration }}
  class="opacity-0"
  class:opacity-100={visible}
>
  <slot></slot>
</div>

<style>
  /* Styles for smooth opacity transition */
  .opacity-0 {
    opacity: 0;
  }
  .opacity-100 {
    opacity: 1;
    transition: opacity 0.3s ease;
  }
</style>
