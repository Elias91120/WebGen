import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import { createChatHandler } from './server/chat.mjs';
import { contentPageHtml } from './src/content/html';
import { CONTENT_PAGES } from './src/content/pages';

// Content pages (src/content/pages.ts): their HTML entry is generated here, before dev and build,
// into <path>/index.html (git-ignored), then built and prerendered like the other pages.
function writeContentPages(): Record<string, string> {
  const inputs: Record<string, string> = {};
  for (const page of CONTENT_PAGES) {
    const file = path.resolve(__dirname, page.path.slice(1), 'index.html');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const html = contentPageHtml(page);
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== html) fs.writeFileSync(file, html);
    inputs[`content:${page.path}`] = file;
  }
  return inputs;
}

// Serves the assistant API in dev, like nginx + server/index.mjs do in production.
// The key stays server-side: it comes from .env and never reaches the browser bundle.
function assistantApi(env: Record<string, string>): Plugin {
  return {
    name: '3geeks-assistant-api',
    configureServer(server) {
      const handleChat = createChatHandler({
        apiKey: env.THREEGEEKS_API_KEY || env['3gks_api'] || '',
        baseUrl: env.THREEGEEKS_API_BASE_URL || undefined,
        model: env.THREEGEEKS_MODEL || undefined,
        mistralKey: env.MISTRAL_API_KEY || '',
        mistralModels: env.MISTRAL_MODELS ? env.MISTRAL_MODELS.split(',').map((m) => m.trim()).filter(Boolean) : undefined,
      });
      server.middlewares.use('/api/chat', (req, res) => {
        handleChat(req, res);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss(), assistantApi(env)],
      build: {
        rollupOptions: {
          // One HTML entry per page (dist/<page>/index.html, routed by nginx.conf).
          input: {
            main: path.resolve(__dirname, 'index.html'),
            offres: path.resolve(__dirname, 'offres/index.html'),
            realisations: path.resolve(__dirname, 'realisations/index.html'),
            equipe: path.resolve(__dirname, 'equipe/index.html'),
            ia: path.resolve(__dirname, 'ia/index.html'),
            game: path.resolve(__dirname, '17-octobre/index.html'),
            ...writeContentPages(),
          },
          output: {
            // Stable vendor chunks: better long-term caching, app code changes don't bust them.
            manualChunks(id: string) {
              if (!id.includes('node_modules')) return undefined;
              if (/node_modules[\/](react|react-dom|scheduler)[\/]/.test(id)) return 'vendor-react';
              if (/node_modules[\/](gsap|@gsap)[\/]/.test(id)) return 'vendor-gsap';
              if (/node_modules[\/](motion|framer-motion|motion-dom|motion-utils)[\/]/.test(id)) return 'vendor-motion';
              return undefined;
            },
          },
        },
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});
