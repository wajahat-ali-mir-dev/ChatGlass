import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.zip'],
  build: {
    outDir: 'dist',
  },
  plugins: [react()],
  server: {
    open: true,
    port: 8000,
  },
});
