import { getToken } from 'next-auth/jwt';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const config = {
  runtime: 'edge',
};

/**
 * Returns the presigned upload PDF URL for a Student
 * @param {import('next/server').NextRequest} req
 * @returns {Response}
 */
export default async function handler(req) {
  if (req.method !== 'GET') {
    return new Response('', {
      status: 405,
    });
  }

  // const session = await getServerSession(req, res, authOptions);
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // if (!token.isStudent) {
  if (token.accountType !== 'student') {
    return new Response('', {
      status: 401,
    });
  }
  const { searchParams } = new URL(req.url);
  const fileSize = searchParams.get('size');
  if (!fileSize || fileSize > 100000) {
    return new Response('', {
      status: 400,
    });
  }
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.RESUMES_BUCKET_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.RESUMES_BUCKET_ACCESS_KEY_ID,
      secretAccessKey: process.env.RESUMES_BUCKET_SECRET_ACCESS_KEY,
    },
  });
  const command = new PutObjectCommand({
    Bucket: process.env.RESUMES_BUCKET,
    Key: `${token.email}.pdf`,
    // Key: 'a.pdf',
    ContentType: 'application/pdf',
    ContentLength: fileSize,
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
