// export { default } from 'next-auth/middleware'; // locks down whole site, only for JWT
// https://github.com/nextauthjs/next-auth/discussions/4265
// https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/next/middleware.ts#L99

import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_DATABASE_URL,
  process.env.SUPABASE_DATABASE_KEY,
  { auth: { persistSession: false } }
);

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
  if (url.pathname === '/api/auth/signout' || url.pathname === '/api/auth/session') {
    return NextResponse.next();
  }

  if (!token.accountType) {
    if (
      url.pathname === '/account-type' ||
      url.pathname === '/api/student/create' ||
      url.pathname === '/api/researcher/create'
    ) {
      return NextResponse.next();
    }
    url.pathname = '/account-type';
    return NextResponse.redirect(url);
  }

  if (token.accountType === 'student') {
    if (!token.accountStage) {
    } else {
    }
  } else if (token.accountType === 'researcher') {
  }
  if (url.pathname === '/profile') {
    if (token.accountType === 'researcher') {
      return NextResponse.next();
    }
    // console.log('here');
    url.pathname = `/student/profile/${token.studentProfileId.replaceAll('-', '')}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
