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

      const currentUser = await prisma.user.findUnique({ where: { email: profile.email } });
      if (!currentUser) {
        await prisma.user.create({ data: { email: profile.email } });
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        // only truthy during signin https://next-auth.js.org/configuration/callbacks#jwt-callback
        const currentUser = await prisma.user.findUnique({
          where: { email: profile.email },
          select: {
            student: true,
            researcher: true,
          },
        });
        if (currentUser.student || currentUser.studentId) {
          token.accountType = 'student';
        } else if (currentUser.researcher || currentUser.researcherId) {
          token.accountType = 'researcher';
        } else {
        }
        console.log({ currentUser, accountType: token.accountType }, 'jwt');
      } else if (token && !token.accountType) {
        const currentUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: {
            student: true,
            researcher: true,
          },
        });

        if (currentUser.student || currentUser.studentId) {
          token.accountType = 'student';
        } else if (currentUser.researcher || currentUser.researcherId) {
          token.accountType = 'researcher';
        }

        console.log({ currentUser, accountType: token.accountType }, 'jwt');
      }
      console.log({ account, profile }, 'jwt');
      return token;
    },
  },
};
export default NextAuth(authOptions);
