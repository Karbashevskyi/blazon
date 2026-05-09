import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: '/blazon/game/',
  resolve: {
    alias: {
      '@blazon/types': resolve(__dirname, '../../packages/types/src/index.ts'),
      '@blazon/core': resolve(__dirname, '../../packages/core/src/index.ts'),
      '@blazon/poland': resolve(__dirname, '../../packages/poland/src/index.ts'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
  },
  server: {
    port: 4201,
    open: true,
  },
});
