import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/').pop();

export default defineConfig({
  base: process.env.GITHUB_ACTIONS && repositoryName ? '/' + repositoryName + '/' : '/',
  plugins: [react()],
  server: { port: 5173, open: true },
  build: { outDir: 'dist', assetsInlineLimit: 2048 },
});
