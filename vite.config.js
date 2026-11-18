import { defineConfig } from 'vite';
import { cpSync, mkdirSync, readdirSync } from 'node:fs';

export default defineConfig({
  base: './',
  publicDir: false,
  build: {
    rollupOptions: {
      input: ['index.html', ...readdirSync('dashboard', { recursive: true })
        .filter(path => path.endsWith('index.html'))
        .map(path => `dashboard/${path.replaceAll('\\', '/')}`)],
    },
  },
  plugins: [{
    name: 'copy-existing-site',
    closeBundle() {
      mkdirSync('dist', { recursive: true });
      for (const path of ['public-home', 'logo.png', 'favicon.png', 'CNAME']) {
        cpSync(path, `dist/${path}`, { recursive: true });
      }
      // Vite owns dashboard HTML and scripts; copy only the original visual assets.
      cpSync('dashboard', 'dist/dashboard', {
        recursive: true,
        filter: path => !/\.(?:html|js)$/.test(path),
      });
    },
  }],
});
