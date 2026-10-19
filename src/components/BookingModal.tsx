import { ArrowUpRight, X } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';

import { useModalFocus } from '../lib/useModalFocus';

import { bookingUrl, closeBooking, getBookingState, prepareBooking, subscribeBooking } from '../lib/booking';

const COPY = {
  fr: {
    title: 'Réserver un appel découverte gratuit',
    loading: 'Chargement des créneaux…',
    details: 'Appel découverte gratuit · 30 min',
    slow: 'Le calendrier met du temps à s’afficher.',
    newTab: 'L’ouvrir dans un nouvel onglet',
    close: 'Fermer le calendrier',
  },
  en: {
    title: 'Book a free discovery call',
    loading: 'Loading available slots…',
    details: 'Free discovery call · 30 min',
    slow: 'The calendar is taking a while.',
    newTab: 'Open it in a new tab',
    close: 'Close the calendar',
  },
};

// Calendly posts this once the scheduling page is rendered.
const READY_EVENTS = new Set(['calendly.event_type_viewed', 'calendly.profile_page_viewed']);

/**
 * Calendly calendar in our own overlay: it opens instantly with a branded loader, the iframe
 * is created on the first sign of intent, and it stays mounted (hidden) once closed.
 */
const BookingModal: React.FC<{ lang: 'fr' | 'en' }> = ({ lang }) => {
  const copy = COPY[lang];
  // Third argument: the snapshot used by the build-time prerender and during hydration (closed).
  const { open, source } = useSyncExternalStore(subscribeBooking, getBookingState, getBookingState);
  const url = useMemo(() => (source ? bookingUrl(source) : ''), [source]);
  const [ready, setReady] = useState(false);
  const [slow, setSlow] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useModalFocus(open, dialogRef);

  // Intent: hovering, touching or focusing any booking button starts loading the calendar.
  useEffect(() => {
    const onIntent = (e: Event) => {
      const button = e.target instanceof Element ? e.target.closest('[data-booking]') : null;
      if (button) prepareBooking(button.getAttribute('data-booking') || 'site');
    };
    document.addEventListener('pointerover', onIntent, { passive: true });
    document.addEventListener('focusin', onIntent);
    return () => {
      document.removeEventListener('pointerover', onIntent);
      document.removeEventListener('focusin', onIntent);
    };
  }, []);

  useEffect(() => {
    if (!source || ready) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin === 'https://calendly.com' && READY_EVENTS.has((e.data as { event?: string } | null)?.event ?? '')) setReady(true);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [source, ready]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeBooking();
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || ready) return;
    const timer = window.setTimeout(() => setSlow(true), 10_000);
    return () => window.clearTimeout(timer);
  }, [open, ready]);

  if (!source) return null;

  return (
    <div
      ref={dialogRef}
      className={`fixed inset-0 z-[70] bg-ink/85 backdrop-blur-sm transition-opacity duration-200 ${
        open ? 'opacity-100' : 'pointer-events-none invisible opacity-0'
      }`}
      onClick={closeBooking}
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
      aria-hidden={!open}
      inert={!open}
    >
      <div
        className="absolute inset-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-[min(720px,calc(100%-64px))] sm:w-[min(1000px,calc(100%-48px))] sm:-translate-x-1/2 sm:-translate-y-1/2"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={url}
          title={copy.title}
          onLoad={() => window.setTimeout(() => setReady(true), 2500)}
          className={`h-full w-full border-0 transition-opacity duration-300 ${ready ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          // Calendly's page is light: a dark iframe (the site's color-scheme) would be painted opaque.
          style={{ colorScheme: 'light' }}
        />

        {!ready && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-brand-mint" aria-hidden="true" />
            <div>
              <p className="font-display text-base font-semibold text-white">{copy.loading}</p>
              <p className="mt-1 text-sm text-slate-400">{copy.details}</p>
            </div>
            {slow && (
              <p className="pointer-events-auto text-sm text-slate-300">
                {copy.slow}{' '}
                <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-brand-mint underline-offset-2 hover:underline">
                  {copy.newTab} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Top-left on phones so it does not cover Calendly's corner ribbon. */}
      <button
        ref={closeRef}
        type="button"
        onClick={closeBooking}
        className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-ink/80 text-slate-200 backdrop-blur transition-colors hover:text-white sm:left-auto sm:right-5 sm:top-5"
        aria-label={copy.close}
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default BookingModal;
