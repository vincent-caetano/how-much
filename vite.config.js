import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: '.',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
      },
      output: {
        entryFileNames: 'popup.js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'popup.html') {
            return 'popup.html'
          }
          if (assetInfo.name?.endsWith('.css')) {
            return 'popup.css'
          }
          return 'assets/[name].[ext]'
        }
      }
    },
    copyPublicDir: false,
    emptyOutDir: false,
    watch: null,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  publicDir: 'public',
  server: {
    port: 5173,
  },
})

