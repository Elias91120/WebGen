/**
 * Free 30-min discovery call booked on Calendly.
 * The Calendly widget is only downloaded on the first click (nothing loads on page view).
 * If it cannot load, the booking page opens in a new tab instead.
 */
export const CALENDLY_URL = 'https://calendly.com/e-elloumi15/let-s-discuss-your-project';

type CalendlyApi = { initPopupWidget: (options: { url: string }) => void };

let widgetPromise: Promise<CalendlyApi> | null = null;

function loadWidget(): Promise<CalendlyApi> {
  const existing = (window as Window & { Calendly?: CalendlyApi }).Calendly;
  if (existing) return Promise.resolve(existing);
  if (!widgetPromise) {
    widgetPromise = new Promise((resolve, reject) => {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(css);

      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        const api = (window as Window & { Calendly?: CalendlyApi }).Calendly;
        if (api) resolve(api);
        else reject(new Error('Calendly unavailable'));
      };
      script.onerror = () => {
        widgetPromise = null;
        reject(new Error('Calendly failed to load'));
      };
      document.head.appendChild(script);
    });
  }
  return widgetPromise;
}

/** `source` tells which button was used (visible in Calendly as utm_content). */
export function openBooking(source: string) {
  const url = `${CALENDLY_URL}?utm_source=3geeks.fr&utm_medium=website&utm_content=${encodeURIComponent(source)}`;
  loadWidget()
    .then((calendly) => calendly.initPopupWidget({ url }))
    .catch(() => window.open(url, '_blank', 'noopener,noreferrer'));
}
