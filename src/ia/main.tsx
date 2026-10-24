import React from 'react';
import ReactDOM from 'react-dom/client';
import AiPage from './AiPage';
import '../index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const app = (
  <React.StrictMode>
    <AiPage />
  </React.StrictMode>
);

// Prerendered at build time (scripts/prerender.mjs): React takes over that HTML instead of rebuilding it.
if (rootElement.dataset.prerendered) ReactDOM.hydrateRoot(rootElement, app);
else ReactDOM.createRoot(rootElement).render(app);
