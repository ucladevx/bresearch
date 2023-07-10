import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_DATABASE_URL, process.env.SUPABASE_DATABASE_KEY);

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (
        account.provider !== 'google' ||
        !profile.email_verified ||
        (!profile.email.endsWith('@ucla.edu') && !profile.email.endsWith('.ucla.edu'))
      ) {
        return false;
      }

      return true;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        // user, account, profile and isNewUser are only passed during signin https://next-auth.js.org/configuration/callbacks#jwt-callback
        const currentStudent = process.env.USE_SUPABASE
          ? (await supabase.from('Student').select().eq('email', profile.email).limit(1).single())
              ?.data
          : await prisma.student.findUnique({
              where: { email: profile.email },
            });
        if (currentStudent) {
          token.accountType = 'student';
        } else {
          const currentResearcher = process.env.USE_SUPABASE
            ? (
                await supabase
                  .from('Researcher')
                  .select()
                  .eq('email', profile.email)
                  .limit(1)
                  .single()
              )?.data
            : await prisma.researcher.findUnique({
                where: { email: profile.email },
              });
          if (currentResearcher) {
            token.accountType = 'researcher';
          } else {
            // console.log('signin unselected');
            token.accountType = null;
          }
        }
      } else if (token) {
        if (!token.accountType) {
          const currentStudent = process.env.USE_SUPABASE
            ? (await supabase.from('Student').select().eq('email', profile.email).limit(1).single())
                ?.data
            : await prisma.student.findUnique({
                where: { email: profile.email },
              });
          if (currentStudent) {
            token.accountType = 'student';
          } else {
            const currentResearcher = process.env.USE_SUPABASE
              ? (
                  await supabase
                    .from('Researcher')
                    .select()
                    .eq('email', profile.email)
                    .limit(1)
                    .single()
                )?.data
              : await prisma.researcher.findUnique({
                  where: { email: profile.email },
                });
            if (currentResearcher) {
              token.accountType = 'researcher';
            } else {
              token.accountType = null;
              // console.log('not signin unselected');
            }
          }
        }
      }
      // console.log({ account, profile, token }, 'jwt');
      return token;
    },
  },
};
export default NextAuth(authOptions);
