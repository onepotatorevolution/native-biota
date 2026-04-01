import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    // This forces all packages to use the exact same copy of React
    dedupe: ['react', 'react-dom'], 
  },
  optimizeDeps: {
    // Forces Vite to pre-bundle the icons with the correct React context
    include: ['lucide-react'] 
  }
})
