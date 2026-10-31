import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Нужно для проброса порта из Docker
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://backend:8080', // Тут уже имя сервиса внутри сети Docker!
        changeOrigin: true,
      },
    },
  },
})
