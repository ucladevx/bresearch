import { Prisma } from 'prisma/prisma-client';
import ApiRoute from '@lib/ApiRoute';

class CloseJobRoute extends ApiRoute {
  /**
   * close job endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} req
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async patch(req, res, prisma) {
    try {
      if (req.token.accountType !== 'researcher') {
        return res
          .status(403)
          .json({ message: 'You are not a researcher', accountType: req.token.accountType });
      }

      const jobId = parseInt(req.query.jobId, 10);

      // TODO: maybe use an interactive transaction https://www.prisma.io/docs/concepts/components/prisma-client/transactions#interactive-transactions

      const job = await prisma.job.findUnique({
        where: {
          id: jobId,
        },
        select: { poster: { select: { email: true } }, closed: true },
      });
      if (job === null || job.poster.email !== req.session.user.email) {
        return res.status(400).json({ message: '' });
      }
      if (job.closed) {
        return res.status(400).json({ message: 'Job is already closed' });
      }

      const updatedJob = await prisma.job.update({
        where: {
          id: jobId,
        },
        // data: value.closed ? { closed: true, closingDate: new Date() } : value,
        data: {
          closingDate: new Date(),
          closed: true,
        },
      });

      await res.revalidate(`/job/${updatedJob.id}`);
      await res.revalidate('/');

      res.status(200).json(updatedJob);
    } catch (e) {
      console.error({ e });
      // check for Node.js errors (data integrity, etc)
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res
          .status(500)
          .json({ message: 'Researcher already exists for user', accountType: 'researcher' });
      } else if (e instanceof Prisma.PrismaClientValidationError) {
        res.status(400).json({ message: 'Invalid data format' });
      } else {
        res.status(500).json({ message: 'something went wrong' });
      }
    } finally {
      res.end();
    }
  }
}

export default new CloseJobRoute().as_handler();
