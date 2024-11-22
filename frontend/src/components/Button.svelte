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

<button
  type="button"
  disabled={disabled}
  class={`
    px-4 py-2 rounded-lg font-semibold transition-transform transition-colors duration-200
    ${
      variant === 'primary'
        ? 'bg-secondary text-white hover:bg-accent1 focus:ring-2 focus:ring-accent2 focus:ring-offset-2'
        : 'bg-accent1 text-white hover:bg-accent2 focus:ring-2 focus:ring-secondary focus:ring-offset-2'
    }
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `}
  on:click={handleClick}
  {...$$restProps}>
  <slot></slot>
</button>