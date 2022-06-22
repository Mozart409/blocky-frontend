/**
 * @type {import('vite').UserConfig}
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { dependencies } from './package.json'

// Packages we want in the vendor aka the deps needed in the entire app.
const globalVendorPackages = ['react', 'react-dom']

function renderChunks(deps: Record<string, string>) {
  let chunks = {}
  Object.keys(deps).forEach((key) => {
    if (globalVendorPackages.includes(key)) return
    chunks[key] = [key]
  })
  return chunks
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: globalVendorPackages,
          ...renderChunks(dependencies),
        },
      },
    },
  },
})
