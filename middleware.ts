import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0].toLowerCase();
  const { pathname } = request.nextUrl;

  if (host === 'software.sagitarius.cc' && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/software';
    return NextResponse.rewrite(url);
  }

  if (host === 'wl.sagitarius.cc') {
    const slug = pathname.replace(/^\//, '') || 'freedom';
    const url = request.nextUrl.clone();
    url.pathname = `/freedom/${slug}`;
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith('/dashboard')) {
    return await updateSession(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/freedom', '/freedom/:path*', '/dashboard/:path*'],
};
