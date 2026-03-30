import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Improves crawlability — keeps chunk names predictable
    rollupOptions: {
      output: {
        manualChunks: {
          react:  ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// NEW scripts/prerender.js — generates static HTML for every route
// Run: node scripts/prerender.js  (after npm run build)
// Update netlify.toml build command to run this AFTER the build
// ─────────────────────────────────────────────────────────────────────────────
