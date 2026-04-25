import { createServerClient } from '@supabase/ssr'

const getUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const getKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 👉 Server (for middleware only)
export function createServerSupabase(req: any) {
  const url = getUrl()
  const key = getKey()
  if (!url || !key) {
    console.warn('Supabase env vars missing - cannot create server client')
    return null
  }

  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value
      },
    },
  })
}

