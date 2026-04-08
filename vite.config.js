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

  // 🔥 ده أهم سطر (انسخه زي ما هو)
  base: '/signtalk/sign-talk-web/',
})
