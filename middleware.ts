import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/settings'];
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/callback'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('refresh_token')?.value || request.headers.get('Authorization')?.split(' ')[1];
  const { pathname } = request.nextUrl;

  // 1. If trying to access protected route without token, redirect to login
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If logged in and trying to access auth/root routes, redirect to dashboard
  if ((authRoutes.some(route => pathname.startsWith(route)) || pathname === '/') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/profile/:path*', '/settings/:path*', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email'],
};
