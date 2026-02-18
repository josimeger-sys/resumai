import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Remove fixed port to allow dynamic allocation if busy
    // port: 5173, 
    // strictPort: true, 
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
      },
      // Add proxy for DeepSeek/OpenAI to avoid CORS issues if needed
      '/ai-api': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai-api/, ''),
        secure: false
      }
    }
  },
  preview: {
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
      },
      '/ai-api': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai-api/, ''),
        secure: false
      }
    }
  }
})

