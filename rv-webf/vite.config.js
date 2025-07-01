import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url';
import tailwindcss from '@tailwindcss/vite';

import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  resolve: {
      alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  }
})
