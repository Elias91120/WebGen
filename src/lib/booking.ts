/**
 * Free 30-min discovery call, booked in the Calendly calendar shown by <BookingModal />.
 * Nothing loads on page view. The calendar starts loading as soon as a visitor shows intent
 * (points at, touches or focuses a [data-booking] button, or the assistant offers a call),
 * so it is usually ready by the click, and it stays loaded after closing.
 */
export const CALENDLY_URL = 'https://calendly.com/e-elloumi15/let-s-discuss-your-project';

export interface BookingState {
  open: boolean;
  /** First button that showed intent (sent as utm_content), null until then. */
  source: string | null;
}

let state: BookingState = { open: false, source: null };
const listeners = new Set<() => void>();

function emit(next: BookingState) {
  state = next;
  listeners.forEach((listener) => listener());
}

export const getBookingState = () => state;

export function subscribeBooking(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Starts loading the calendar without showing it. */
export function prepareBooking(source: string) {
  if (!state.source) emit({ ...state, source });
}

/** `source` tells which button was used (visible in Calendly as utm_content). */
export function openBooking(source: string) {
  emit({ open: true, source: state.source ?? source });
}

export function closeBooking() {
  if (state.open) emit({ ...state, open: false });
}

export function bookingUrl(source: string) {
  const params = new URLSearchParams({
    embed_domain: window.location.hostname,
    embed_type: 'PopupWidget',
    // Calendly's cookie banner covered the calendar. Without consent Calendly only sets its
    // technical Cloudflare cookies (__cf_bm, _cfuvid), as the privacy policy says.
    hide_gdpr_banner: '1',
    utm_source: '3geeks.fr',
    utm_medium: 'website',
    utm_content: source,
  });
  return `${CALENDLY_URL}?${params}`;
}
