import { Prisma } from 'prisma/prisma-client';

import ApiRoute from '@lib/ApiRoute';

class ApplicationsSaveRoute extends ApiRoute {
  /**
   * application update endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} req
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async put(req, res, prisma) {
    try {
      const jobId = parseInt(req.query.jobId, 10);

      if (jobId === NaN) {
        return res.status(400).json({ message: 'invalid request' });
      }

      const job = await prisma.labeledJob.findUnique({
        where: {
          jobId_applicantEmail: {
            jobId,
            applicantEmail: req.session.user?.email,
          },
        },
      });
      if (job?.status === 'APPLIED') {
        return res.status(403).json({ message: 'Cannot save a job you already applied to' });
      }
      await prisma.labeledJob.upsert({
        where: {
          jobId_applicantEmail: {
            jobId,
            applicantEmail: req.session.user?.email,
          },
        },
        update: { status: 'SAVED', lastUpdated: new Date() },
        create: {
          status: 'SAVED',
          piStatus: 'CONSIDERING',
          lastUpdated: new Date(),
          job: {
            connect: {
              id: jobId,
            },
          },
          applicant: { connect: { email: req.session.user.email } },
        },
      });
      return res.json({ saved: true });
    } catch (e) {
      // check for Node.js errors (data integrity, etc)
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({ message: e.meta });
        console.error(e);
      } else if (e instanceof Prisma.PrismaClientValidationError) {
        res.status(400).json({ message: 'invalid request' });
        console.error(e);
      } else {
        console.error(e);
        res.status(500).json({ message: 'something went wrong' });
      }
    } finally {
      res.end();
    }
  }
}

export default new ApplicationsSaveRoute().as_handler();
