import ApiRoute from '@lib/ApiRoute';

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// TODO: use edge route
class StudentResumeRoute extends ApiRoute {
  /**
   * application update endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} req
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async get(req, res, prisma) {
    try {
      const profileId = req.query.profileId;

      if (profileId === undefined) {
        return res.status(400).json({ message: 'Invalid request' });
      }
      let resumeId = '';
      if (req.token.accountType === 'student') {
        const result = await prisma.student.findUnique({
          where: {
            email: req.session.user.email,
          },
          select: {
            studentProfile: { select: { id: true } },
          },
        });
        const viewerProfileId = result?.studentProfile?.id;
        if (viewerProfileId === null || viewerProfileId === undefined) {
          return res.status(404).json({ message: `You do not have a profile` });
        }
        if (viewerProfileId !== profileId) {
          return res.status(403).json({ message: `You cannot view other students' résumés.` });
        }
        resumeId = req.session.user.email;
      } else if (req.token.accountType === 'researcher') {
        const appliedJob = await prisma.labeledJob.findFirst({
          where: {
            status: 'APPLIED',
            job: { poster: { email: req.session.user.email } },
            applicant: { studentProfile: { id: profileId } },
          },
          select: { applicantEmail: true },
        });
        if (appliedJob === null) {
          return res.status(403).json({
            message: `You cannot view this résumé because this student has not applied to one of your posts.`,
          });
        }
        resumeId = appliedJob.applicantEmail;
      } else {
        return res.status(403);
      }
      const client = new S3Client({
        region: 'auto',
        endpoint: `https://${process.env.RESUMES_BUCKET_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.RESUMES_BUCKET_ACCESS_KEY_ID,
          secretAccessKey: process.env.RESUMES_BUCKET_SECRET_ACCESS_KEY,
        },
      });
      const command = new GetObjectCommand({
        Bucket: process.env.RESUMES_BUCKET,
        Key: `${resumeId}.pdf`,
        ContentType: 'application/pdf',
      });
      const url = await getSignedUrl(client, command, { expiresIn: 3600 });

      return res.status(200).json({ url });
    } catch (e) {
      // check for Node.js errors (data integrity, etc)
      console.error(e);
      res.status(500).json({ message: 'something went wrong' });
    } finally {
      res.end();
    }
  }
}

export default new StudentResumeRoute().as_handler();
