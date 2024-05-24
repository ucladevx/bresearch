// export { default } from 'next-auth/middleware'; // locks down whole site, only for JWT
// https://github.com/nextauthjs/next-auth/discussions/4265
// https://github.com/nextauthjs/next-auth/blob/next-auth%404.22.1/packages/next-auth/src/next/middleware.ts

import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const signinPaths = [
    '/api/auth/signin',
    '/api/auth/signin/google',
    '/api/auth/callback/google',
    '/api/auth/error',
    '/auth/signin',
    '/login',
  ];
  const publicPaths = ['/_next', '/favicon.ico'];
  const { pathname, basePath, origin, search } = req.nextUrl;

  if (
    signinPaths.includes(pathname) ||
    publicPaths.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith('/api/auth/')
  ) {
    return NextResponse.next();
  }
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const signInPage = '/auth/signin';
    const signInUrl = new URL(`${basePath}${signInPage}`, origin);
    console.log(signInUrl);
    signInUrl.searchParams.append('callbackUrl', `${basePath}${pathname}${search}`);
    console.log(signInUrl);
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  const url = req.nextUrl.clone();
  if (
    url.pathname !== '/api/auth/signout' &&
    url.pathname !== '/api/auth/session' &&
    url.pathname !== '/api/student/create' &&
    url.pathname !== '/api/researcher/create' &&
    url.pathname !== '/account-type' &&
    !token.accountType
  ) {
    url.pathname = '/account-type';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
