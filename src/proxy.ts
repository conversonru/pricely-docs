import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Only lowercase letters, digits and hyphens; 1–63 chars; must start with letter or digit
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,62}$/

export function proxy(request: NextRequest): NextResponse {
  const slug = request.headers.get('x-client-slug')

  // No slug header — not a subdomain request, pass through
  if (!slug) {
    return NextResponse.next()
  }

  // Reject invalid slugs to prevent path traversal attacks
  if (!SLUG_RE.test(slug)) {
    return new NextResponse(null, { status: 400 })
  }

  const url = request.nextUrl.clone()
  const suffix = url.pathname === '/' ? '' : url.pathname
  url.pathname = `/catalog/${slug}${suffix}`

  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico).*)',
  ],
}
