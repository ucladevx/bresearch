import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { createClient } from '@supabase/supabase-js';

const USE_SUPABASE = process.env.USE_SUPABASE === 'true';

const supabase = USE_SUPABASE
  ? createClient(process.env.SUPABASE_DATABASE_URL, process.env.SUPABASE_DATABASE_KEY, {
      auth: { persistSession: false },
    })
  : null;

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
      // user, account, profile and isNewUser are only passed during signin https://next-auth.js.org/configuration/callbacks#jwt-callback
      if (account || (token && !token.accountType)) {
        const prisma = !USE_SUPABASE ? (await import('@lib/prisma')).default : null;

        const currentStudent = USE_SUPABASE
          ? (await supabase.from('Student').select().eq('email', token.email).limit(1).single())
              ?.data
          : await prisma.student.findUnique({
              where: { email: token.email },
            });
        if (currentStudent) {
          token.accountType = 'student';
        } else {
          const currentResearcher = USE_SUPABASE
            ? (
                await supabase
                  .from('Researcher')
                  .select()
                  .eq('email', token.email)
                  .limit(1)
                  .single()
              )?.data
            : await prisma.researcher.findUnique({
                where: { email: token.email },
              });
          if (currentResearcher) {
            token.accountType = 'researcher';
          } else {
            token.accountType = null;
          }
        }
      }
      return token;
    },
  },
};
export default NextAuth(authOptions);
