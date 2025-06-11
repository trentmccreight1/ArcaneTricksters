import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Server configuration for development
  server: {
    headers: {
      // Security headers
      'X-Content-Type-Options': 'nosniff',
      'X-DNS-Prefetch-Control': 'on',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    }
  },
  
  // Build optimizations
  build: {
    // Enable source maps for debugging
    sourcemap: true,
    
    // Optimize bundle
    rollupOptions: {
      output: {
        // Better chunk splitting
        manualChunks: {
          vendor: ['react', 'react-dom'],
        }
      }
    }
  },
  
  // Asset handling
  assetsInclude: ['**/*.svg']
}) 