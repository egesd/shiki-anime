<style>
  /* Centered Spinner */
  .loader-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .loader {
    width: 120px;
    aspect-ratio: 1;
    clip-path: polygon(
      100% 50%,
      64.14% 64.14%,
      50% 100%,
      35.86% 64.14%,
      0% 50%,
      35.86% 35.86%,
      50% 0%,
      64.14% 35.86%
    );
    -webkit-mask: radial-gradient(circle 5px, transparent 90%, #000);
    animation: spin 1.5s infinite linear;
  }

  /* Keyframes for rotation */
  @keyframes spin {
    100% {
      transform: rotate(1turn);
    }
  }
</style>

<div class="loader-container">
  <div class="loader bg-secondary"></div>
</div>
