'use client';

import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  if (typeof window === 'undefined') {
    console.warn('Supabase client called server-side');
    return null;
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase env vars missing - cannot create browser client');
    return null;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
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
    }
  );
};

// Don't create singleton during SSR/static export
export const supabase = null;
