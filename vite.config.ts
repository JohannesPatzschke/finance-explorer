import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@models': path.resolve(__dirname, './src/models'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
});
