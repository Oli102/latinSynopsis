import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// When deploying as a static site (file:// or GitHub Pages), set `base` to './'
// so that built asset references remain relative and dist/index.html can be
// opened directly in a browser.
export default defineConfig({
  base: './',
  plugins: [react()],
})
