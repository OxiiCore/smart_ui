import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { rewriteImports } from '@replit/vite-plugin-cartographer';
import runtimeErrorModal from '@replit/vite-plugin-runtime-error-modal';
import shadcnThemeJson from '@replit/vite-plugin-shadcn-theme-json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    rewriteImports,
    runtimeErrorModal(),
    shadcnThemeJson(),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'shared',
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  server: {
    port: 3005,
    strictPort: true,
    host: '0.0.0.0',
  },
  preview: {
    port: 3005,
    strictPort: true,
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});