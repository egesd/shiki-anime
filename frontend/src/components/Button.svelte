<!-- frontend/src/components/Button.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';

  // Define the props you want to explicitly handle
  export let disabled = false;         // Disabled state
  export let variant = 'primary';      // Variants: primary, secondary
  export let fullWidth = false;        // Full width button
  export let className = '';           // Additional custom classes

  const dispatch = createEventDispatcher();

  // Handle click events, preventing action if disabled
  function handleClick(event) {
    if (!disabled) {
      dispatch('click', event);
    }
  }
</script>

<!--
  Apply Tailwind CSS classes based on props.
  Use `$$restProps` to pass any additional attributes to the button element.
-->
<button
  type="button"
  disabled={disabled}
  class={`
    px-4 py-2 rounded-lg font-semibold transition-transform transition-colors duration-200 focus:outline-none
    ${
      variant === 'primary'
        ? 'bg-secondary text-white hover:bg-accent1'
        : 'bg-accent1 text-white hover:bg-accent2'
    }
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `}
  on:click={handleClick}
  {...$$restProps}>
  <slot></slot>
</button>