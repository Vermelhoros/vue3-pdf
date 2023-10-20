import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader({})],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'PdfViewer',
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue']
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
