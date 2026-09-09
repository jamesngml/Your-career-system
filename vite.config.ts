/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { manifest } from './src/config/manifest';

// https://vitejs.dev/config/
export default defineConfig({
  // Relative base keeps the build portable across Vercel / Netlify / Cloudflare
  // Pages / GitHub Pages project sites. Override with VITE_BASE if you deploy to
  // a sub-path (e.g. "/career-system/").
  base: process.env.VITE_BASE ?? '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: null, // we register manually in src/pwa/registerSW.ts
      manifest,
      includeAssets: ['favicon.svg', 'favicon-32x32.png', 'favicon-16x16.png', 'apple-touch-icon.png', 'robots.txt'],
      workbox: {
        // App shell + all build output, including the bundled career-system data.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2,json,txt,webmanifest}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: false,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts',
              expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      devOptions: {
        enabled: false, // set true to debug the service worker in `vite dev`
        type: 'module',
      },
    }),
  ],
  build: {
    target: 'es2020',
    sourcemap: true,
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    css: true,
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
  },
});
