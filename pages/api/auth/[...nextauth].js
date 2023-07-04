import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@lib/prisma';

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
        // only truthy during signin https://next-auth.js.org/configuration/callbacks#jwt-callback
        const currentStudent = await prisma.student.findUnique({
          where: { email: profile.email },
        });
        if (currentStudent) {
          token.accountType = 'student';
        } else {
          const currentResearcher = await prisma.researcher.findUnique({
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
          const currentStudent = await prisma.student.findUnique({
            where: { email: token.email },
          });
          if (currentStudent) {
            token.accountType = 'student';
          } else {
            const currentResearcher = await prisma.researcher.findUnique({
              where: { email: token.email },
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
