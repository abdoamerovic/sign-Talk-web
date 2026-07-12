import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  optimizeDeps: {
    include: ['@mediapipe/hands', '@mediapipe/camera_utils'],
  },

  base: '/',

  // By default Vite only exposes env vars prefixed with VITE_ to client code.
  // This adds GEMINI_ to that allow-list so GEMINI_API_KEY in your .env
  // becomes available as import.meta.env.GEMINI_API_KEY.
  envPrefix: ['VITE_', 'GEMINI_'],
})
