import { createSupabaseServerClient as createServerClient } from './src/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from './src/lib/database.types'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next({
    request,
    headers: {
      ...request.headers,
      'x-robots-tag': 'noindex, nofollow'
    }
  })

  const pathname = request.nextUrl.pathname

  // Allow public access to admin login
  if (pathname === '/admin/login') {
    return res
  }

  // Protect all /admin routes
  if (pathname.startsWith('/admin/')) {
    const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Check admin role from DB
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile?.role || profile.role !== 'admin') {
      await supabase.auth.signOut()
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(loginUrl)
    }
  }

  return res
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}

