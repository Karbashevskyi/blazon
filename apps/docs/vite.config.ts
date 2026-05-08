import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: '/blazon/',
  resolve: {
    alias: {
      '@blazon/types': resolve(__dirname, '../../packages/types/src/index.ts'),
      '@blazon/core': resolve(__dirname, '../../packages/core/src/index.ts'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
  },
  server: {
    port: 4200,
    open: true,
  },
});
