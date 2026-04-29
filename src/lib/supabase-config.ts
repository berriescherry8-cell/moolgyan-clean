// Centralized Supabase configuration with fallback values
// These are NEXT_PUBLIC_ vars so they're safe to expose to the client

function normalizeSupabaseUrl(url: string): string {
  return url
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/$/, '');
}

export const SUPABASE_URL = normalizeSupabaseUrl(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lqymwrhfirszrakuevqm.supabase.co'
)
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeW13cmhmaXJzenJha3VldnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjQ4MzEsImV4cCI6MjA4OTkwMDgzMX0.Qlkjm13UTPm6NCwwTTJqAC_cLSoJHPscKYEse6gRYYA'
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

