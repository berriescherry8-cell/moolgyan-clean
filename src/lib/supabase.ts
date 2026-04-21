<<<<<<< HEAD
 'use client';

import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const supabase = createClient();
=======
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
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

// Don't create singleton during SSR/static export
export const supabase = null;
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
