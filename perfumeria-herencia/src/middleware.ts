import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { verifySessionToken, COOKIE_NAME } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(COOKIE_NAME)?.value
    const valid = token ? await verifySessionToken(token) : false
    if (!valid) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
