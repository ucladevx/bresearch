import { getToken } from 'next-auth/jwt';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'GET') {
    return new Response('', {
      status: 405,
    });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // if (!token.isStudent) {
  if (token.accountType !== 'student') {
    return new Response('', {
      status: 401,
    });
  }
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.RESUMES_BUCKET_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
  });
  const command = new GetObjectCommand({
    Bucket: process.env.RESUMES_BUCKET,
    Key: `${token.email}.pdf`,
    ContentType: 'application/pdf',
  });

  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  return new Response(
    JSON.stringify({
      url,
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
}
