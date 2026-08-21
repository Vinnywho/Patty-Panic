import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Relative asset paths for GitHub Pages
  build: {
    outDir: 'docs', // Generates files in /docs so GitHub Pages can serve directly from /docs
  },
})
