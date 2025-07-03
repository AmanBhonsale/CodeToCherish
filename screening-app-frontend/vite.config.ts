import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Default backend port from our setup
        changeOrigin: true,
        // secure: false, // If your backend is not https
        // rewrite: (path) => path.replace(/^\/api/, '') // Uncomment if backend doesn't expect /api
      },
    },
  },
})
