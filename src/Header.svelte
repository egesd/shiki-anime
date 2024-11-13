<script>
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faBowlRice } from '@fortawesome/free-solid-svg-icons';

  const logoIcon = faBowlRice;
</script>

<!-- Header.svelte -->
<header class="bg-primary text-accent3 p-4 shadow-md">
  <div class="container mx-auto flex justify-between items-center">
    <!-- App Title -->
    <div class="flex justify-between gap-3">
      <FontAwesomeIcon icon={logoIcon} class="text-3xl text-accent3" />
      <!-- Logo icon -->
      <h1 class="text-3xl font-bold text-accent3">Anime Viewer</h1>
    </div>
    <!-- App Description -->
    <p class="text-sm italic text-accent2">
      Explore top-rated anime by season and year
    </p>

    <!-- Navigation Links -->
    <nav class="space-x-4">
      <a
        href="https://myanimelist.net/"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-accent1 transition-colors duration-200"
      >
        MyAnimeList
      </a>
      <a
        href="https://github.com/your-username/anime-viewer"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-accent1 transition-colors duration-200"
      >
        GitHub
      </a>
    </nav>
  </div>
</header>
