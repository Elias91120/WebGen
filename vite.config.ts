import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import { createChatHandler } from './server/chat.mjs';

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
            mentionsLegales: path.resolve(__dirname, 'mentions-legales/index.html'),
            confidentialite: path.resolve(__dirname, 'confidentialite/index.html'),
            cgv: path.resolve(__dirname, 'cgv/index.html'),
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
