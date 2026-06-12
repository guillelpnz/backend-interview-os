import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/backend-interview-os/',
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: (chunkInfo) => (chunkInfo.name === 'pyodide' ? 'assets/pyodide.js' : 'assets/[name]-[hash].js'),
      },
    },
  },
  plugins: [react()],
})
