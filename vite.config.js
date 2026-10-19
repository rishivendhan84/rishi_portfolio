import { defineConfig } from 'vite';

export default defineConfig({
  // Local dev: /api/chat is served by scripts/dev-api.mjs (npm run dev:api).
  server: { proxy: { '/api': 'http://localhost:8788' } },
  preview: { proxy: { '/api': 'http://localhost:8788' } },
  build: {
    target: 'es2019',
    assetsInlineLimit: 4096,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap', 'lenis'],
        },
      },
    },
  },
});
