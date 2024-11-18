import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  root: './', // Set root to current directory if needed
  plugins: [svelte()],
  build: {
    outDir: 'dist', // Ensure output directory is named 'dist'
  },
});
