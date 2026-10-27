import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const description = 'Καταγραφή σκορ για το παιχνίδι καρτών Wizard'
const themeColor = '#353E4B' // --color-bg in index.css

export default defineConfig({
  // Served by GitHub Pages from https://ven3num.github.io/wizard_tracker/
  base: '/wizard_tracker/',
  plugins: [
    react(),
    // Installable app that works offline once loaded
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon.svg', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'Wizard Tracker',
        short_name: 'Wizard',
        description,
        lang: 'el',
        display: 'standalone',
        theme_color: themeColor,
        background_color: themeColor,
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,svg,png,ico}'],
      },
    }),
  ],
  // Unit tests only, e2e/ belongs to Playwright
  test: {
    include: ['src/**/*.test.js'],
  },
})
