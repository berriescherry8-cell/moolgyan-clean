'use client';

import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config';

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

// Browser client factory (for client components) — returns singleton
export const createClient = () => {
  if (typeof window === 'undefined') {
    console.warn('Supabase client called server-side');
    return null;
  }

  if (!browserClient) {
    browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
  }

  return browserClient;
};

// Static server client (for build-time / non-React contexts) — lazy to avoid client-side duplicate
let _staticClient: ReturnType<typeof createSupabaseClient> | null = null;
export const supabaseStatic = () => {
  if (!_staticClient) {
    _staticClient = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _staticClient;
};

// Don't create singleton during SSR/static export
export const supabase = null;

