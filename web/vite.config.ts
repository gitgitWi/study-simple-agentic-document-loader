import path from 'node:path';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type PluginOption } from 'vite';

export default defineConfig({
  plugins: [preact(), tailwindcss() as PluginOption],

  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },

  build: {
    outDir: 'dist',
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
