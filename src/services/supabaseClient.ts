import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let clientPromise: Promise<SupabaseClient | null> | null = null;

/**
 * Lazy Supabase client: the SDK (~120 kB) is only downloaded when a form is
 * submitted or the admin panel is opened, not on first paint.
 * Resolves to null when Supabase is not configured (public site still works).
 */
export function getSupabase(): Promise<SupabaseClient | null> {
  if (!clientPromise) {
    clientPromise = isSupabaseConfigured
      ? import('@supabase/supabase-js').then(({ createClient }) =>
          createClient(supabaseUrl as string, supabaseAnonKey as string)
        )
      : Promise.resolve(null).then((c) => {
          // Non-fatal: forms and admin features gracefully degrade.
          // eslint-disable-next-line no-console
          console.warn('[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — backend features disabled.');
          return c;
        });
  }
  return clientPromise;
}
