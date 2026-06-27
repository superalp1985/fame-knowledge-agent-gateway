import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: true,
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('/three/') || id.includes('\\three\\')) {
            if (id.includes('/three/src/renderers/') || id.includes('\\three\\src\\renderers\\')) return 'vendor-three-renderer'
            if (id.includes('/three/src/materials/') || id.includes('\\three\\src\\materials\\')) return 'vendor-three-materials'
            if (
              id.includes('/three/src/geometries/') ||
              id.includes('\\three\\src\\geometries\\') ||
              id.includes('/three/src/math/') ||
              id.includes('\\three\\src\\math\\')
            ) {
              return 'vendor-three-geometry'
            }
            return 'vendor-three-core'
          }
          if (id.includes('/@xyflow/') || id.includes('\\@xyflow\\')) return 'vendor-flow'
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('\\react\\') || id.includes('\\react-dom\\')) {
            return 'vendor-react'
          }
          return 'vendor'
        },
      },
    },
  },
})
