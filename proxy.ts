import { NextRequest, NextResponse } from 'next/server'

export default function proxy(request: NextRequest) {
  // Check if this is a login route
  const pathname = request.nextUrl.pathname

  // Allow auth routes to pass through (they have their own checks)
  // For now, it just calls NextResponse.next()
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all pathnames except for:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
