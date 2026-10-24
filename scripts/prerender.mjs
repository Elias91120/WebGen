// Prerenders each page into its built HTML (dist/<page>/index.html), after `vite build` and the
// SSR build of src/prerender.tsx (dist-ssr/). Pages are rendered in French; the browser then
// hydrates them and switches to the visitor's language if needed.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { render } = await import(pathToFileURL(join(root, 'dist-ssr', 'prerender.js')).href);

const ENTRIES = {
  'index.html': 'home',
  'offres/index.html': 'offers',
  'realisations/index.html': 'work',
  'equipe/index.html': 'team',
  '17-octobre/index.html': 'game',
  'ia/index.html': 'ia',
};

const EMPTY_ROOT = '<div id="root"></div>';

for (const [file, page] of Object.entries(ENTRIES)) {
  const path = join(root, 'dist', file);
  const html = readFileSync(path, 'utf8');
  if (!html.includes(EMPTY_ROOT)) throw new Error(`${file}: <div id="root"></div> not found`);
  const body = render(page);
  writeFileSync(path, html.replace(EMPTY_ROOT, `<div id="root" data-prerendered="true">${body}</div>`));
  console.log(`prerendered ${file} (${Math.round(body.length / 1024)} KB)`);
}
