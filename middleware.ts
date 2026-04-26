import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // ⚠️ Static export does not support server-side middleware with cookies.
  // Admin protection is handled client-side via AdminGuard components.
  // This middleware is kept for SPA routing support only.
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
