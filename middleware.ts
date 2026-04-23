import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerSupabase } from './lib/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerSupabase(req)

  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = req.nextUrl

  // ✅ Allow login
  if (pathname.startsWith('/admin/login')) {
    return res
  }

  // 🔒 Protect admin
  if (pathname.startsWith('/admin')) {
    if (!session) {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}
