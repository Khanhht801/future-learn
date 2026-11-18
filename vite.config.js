import { defineConfig } from 'vite';
import { cpSync, mkdirSync } from 'node:fs';

export default defineConfig({
  publicDir: false,
  plugins: [{
    name: 'copy-existing-site',
    closeBundle() {
      mkdirSync('dist', { recursive: true });
      for (const path of ['public-home', 'dashboard', 'logo.png', 'favicon.png', 'CNAME']) {
        cpSync(path, `dist/${path}`, { recursive: true });
      }
    },
  }],
});
