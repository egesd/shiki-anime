import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: 'dist', // Ensure this matches "distDir" in vercel.json
    assetsDir: 'assets', // Default assets directory
    sourcemap: true
  },
  base: './', // Use relative paths for assets
});
