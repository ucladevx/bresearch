import { Prisma } from 'prisma/prisma-client';

import ApiRoute from '@lib/ApiRoute';

class ApplicationsUnsaveRoute extends ApiRoute {
  /**
   * application update endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} req
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async delete(req, res, prisma) {
    try {
      const jobId = parseInt(req.query.jobId, 10);

      if (jobId === NaN) {
        return res.status(400).json({ message: 'invalid request' });
      }
      // TODO: combine queries into interactive prisma transaction
      const job = await prisma.labeledJob.findUnique({
        where: {
          jobId_applicantEmail: {
            jobId,
            applicantEmail: req.session.user?.email,
          },
        },
      });
      if (job === null) {
        return res
          .status(404)
          .json({ message: "Already unsaved job or job doesn't exist", unsaved: true });
      }
      if (job.status !== 'SAVED') {
        return res.status(403).json({ message: 'Cannot unsave this job' });
      }
      await prisma.labeledJob.delete({
        where: {
          jobId_applicantEmail: {
            jobId,
            applicantEmail: req.session.user?.email,
          },
        },
      });
      return res.status(200).json({ unsaved: true });
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

export default new ApplicationsUnsaveRoute().as_handler();
