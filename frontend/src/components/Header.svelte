<script>
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faBowlRice } from '@fortawesome/free-solid-svg-icons';

  const logoIcon = faBowlRice;
</script>

<!-- Header.svelte -->
<header class="bg-secondary  p-4 shadow-md">
  <div class="container mx-auto flex justify-between items-center max-sm:flex-col max-sm:gap-3">
    <!-- App Title -->
    <div class="flex justify-between gap-3 items-center">
      <FontAwesomeIcon icon={logoIcon} class="text-3xl text-black" />
      <!-- Logo icon -->
      <h1 class="text-3xl font-bold text-accent2 font-yoruka">Anime Viewer</h1>
    </div>

    <!-- App Description -->
    <h2 class="text-h3 text-accent2 font-yoruka">
      Explore top-rated anime by season and year
    </h2>

    <!-- Navigation Links -->
    <nav class="space-x-4">
      <a
        href="https://myanimelist.net/"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-accent1 transition-colors duration-200 text-black"
      >
        MyAnimeList
      </a>
      <a
        href="https://github.com/egesd/anime-viewer"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-accent1 transition-colors duration-200 text-black"
      >
        GitHub
      </a>
    </nav>
  </div>
</header>
