// export { default } from 'next-auth/middleware'; // locks down whole site, only for JWT
// https://github.com/nextauthjs/next-auth/discussions/4265
// https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/next/middleware.ts#L99

import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const signinPaths = [
    '/api/auth/signin',
    '/api/auth/signin/google',
    '/api/auth/callback/google',
    '/api/auth/error',
  ];
  const publicPaths = ['/_next', '/favicon.ico'];
  const { pathname, basePath, origin, search } = req.nextUrl;

  if (signinPaths.includes(pathname) || publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const signInPage = '/api/auth/signin';
    const signInUrl = new URL(`${basePath}${signInPage}`, origin);
    signInUrl.searchParams.append('callbackUrl', `${basePath}${pathname}${search}`);
    return NextResponse.redirect(signInUrl);
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
