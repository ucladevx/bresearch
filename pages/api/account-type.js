import { getToken } from 'next-auth/jwt';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'GET') {
    return new Response('', {
      status: 405,
      headers: {
        Allow: 'GET',
      },
    });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { accountType } = token;

  return new Response(
    JSON.stringify({
      accountType,
    }),
    {
      status: 200,
    }
  );
}
