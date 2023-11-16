import { Prisma } from 'prisma/prisma-client';

import ApiRoute from '@lib/ApiRoute';

class ApplicationsApplyRoute extends ApiRoute {
  /**
   * application update endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} req
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async patch(req, res, prisma) {
    try {
      if (req.token.accountType !== 'student') {
        return res
          .status(403)
          .json({ message: 'You are not a student', accountType: req.token.accountType });
      }
      const jobId = parseInt(req.query.jobId, 10);

      if (Number.isNaN(jobId)) {
        return res.status(400).json({ message: 'invalid request' });
      }

      // How this query works:
      // If there's a labeledJob with status other than APPLIED,
      // it updates status to APPLIED
      // If no labeledJob exists or status === APPLIED,
      // it attempts to create a labeledJob with status APPLIED
      // Because labeledJob's Primary Key is @@id([jobId, applicantEmail]),
      // it only creates a new labeledJob when it doesn't exist.
      // If status === APPLIED, it attempts to create another labeledJob but the
      // table's contraints causes the create to fail

      const result = await prisma.labeledJob.upsert({
        where: {
          jobId_applicantEmail: {
            jobId,
            applicantEmail: req.session.user?.email,
          },
          status: { not: 'APPLIED' },
        },
        update: {
          status: 'APPLIED',
          piStatus: 'CONSIDERING',
          lastUpdated: new Date(),
        },
        create: {
          status: 'APPLIED',
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
      await res.revalidate(`/job/${jobId}`);
      await res.revalidate('/');

      return res.json(result);
    } catch (e) {
      // check for Node.js errors (data integrity, etc)
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(403).json({ message: 'You have already applied to this job' });
        // res.status(500).json({ message: e.meta });
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

export default new ApplicationsApplyRoute().as_handler();
