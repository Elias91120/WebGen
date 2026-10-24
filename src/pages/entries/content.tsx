import { mountContent } from '../pages';

// Every content page (src/content/pages.ts) shares this entry: its address is in data-page.
mountContent(document.getElementById('root')?.dataset.page ?? '');
