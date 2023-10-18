import { JobSearchValidator, isValidationError } from '@lib/validators';
import ApiRoute from '@lib/ApiRoute';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

class JobSearchRoute extends ApiRoute {
  /**
   * job search endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} re
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async get(req, res, prisma) {
    try {
      const { error, value } = JobSearchValidator.validate(req.query);

      if (error) {
        throw error;
      }
      const { jobSearchQuery } = value;
      const queryTokens = jobSearchQuery.split(/\s/);

      const session = await getServerSession(req, res, authOptions);

      const result = await prisma.job.findMany({
        where: {
          title: {
            search: queryTokens.join(' | '),
          },
          description: {
            search: queryTokens.join(' & '),
          },
        },
        select: {
          id: true,
          title: true,
          description: true,
          departments: true,
          duration: true,
          location: true,
          lab: { select: { name: true } },
          created: true,
          startDate: true,
          closingDate: true,
          credit: true,
          weeklyHours: true,
          paid: true,
          _count: {
            select: {
              applicants: true,
            },
          },
          applicants: {
            where: {
              applicantEmail: session.user?.email,
            },
            select: {
              status: true,
            },
          },
        },
        take: 50,
      });

      res.status(200).json(result.map((e) => ({ ...e, status: e.applicants[0].status })));
    } catch (e) {
      // check for Node.js errors (data integrity, etc)
      console.error(e);
      if (isValidationError(e)) {
        res.status(400).json({ message: e.message });
      } else {
        console.error(e);
        res.status(500).json({ message: 'something went wrong' });
      }
    } finally {
      res.end();
    }
  }
}

export default new JobSearchRoute().as_handler();
