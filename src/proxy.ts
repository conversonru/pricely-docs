import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const slug = request.headers.get('x-client-slug')

  if (!slug) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  const pathname = url.pathname

  url.pathname = `/catalog/${slug}${pathname === '/' ? '' : pathname}`

  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico).*)',
  ],
}
