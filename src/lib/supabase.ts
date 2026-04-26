'use client';

import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config';

// Browser client factory (for client components)
export const createClient = () => {
  if (typeof window === 'undefined') {
    console.warn('Supabase client called server-side');
    return null;
  }

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });
};

// Static server client (for build-time / non-React contexts)
export const supabaseStatic = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Don't create singleton during SSR/static export
export const supabase = null;

