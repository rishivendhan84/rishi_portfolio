import { defineConfig } from 'vite';

export default defineConfig({
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
