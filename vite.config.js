import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // Gzip compression for production builds
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // Only compress files > 10kb
      algorithm: 'gzip',
      ext: '.gz',
    }),

    // Bundle analyzer - generates stats.html
    visualizer({
      open: false, // Don't auto-open
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ],

  base: '/portfolio/',

  // Build optimizations
  build: {
    target: 'es2015', // Support modern browsers
    minify: 'terser', // Use Terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },

    // Code splitting and chunk optimization
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom'],

          // Three.js core (largest dependency)
          'three-core': ['three'],

          // React Three Fiber ecosystem
          'r3f-vendor': ['@react-three/fiber', '@react-three/drei'],

          // Your components can be split if needed
          // 'components': ['./src/components/...']
        },

        // Clean chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 1000, // 1000kb = 1MB

    // Asset inlining threshold
    assetsInlineLimit: 4096, // Inline assets < 4kb as base64

    // Source maps for debugging (optional, adds size)
    sourcemap: false, // Set to true for debugging production

    // Reduce CSS output
    cssCodeSplit: true,
  },

  // Dev server optimization
  server: {
    port: 2945,
    open: true,
  },

  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
    ],
    exclude: [], // Exclude problematic deps if needed
  },

  // Performance hints
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
})
