import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const createClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('Client created on server')
  }

  // Return null if environment variables are not configured
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return null
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

