import { Prisma } from 'prisma/prisma-client';
import ApiRoute from '@lib/ApiRoute';

class PostsRoute extends ApiRoute {
  /**
   * posts endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} req
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async get(req, res, prisma) {
    try {
      if (req.token.accountType !== 'researcher') {
        return res
          .status(403)
          .json({ message: 'You are not a researcher', accountType: req.token.accountType });
      }

      // TODO: maybe move this permission check to middleware
      const currentResearcher = await prisma.researcher.findUnique({
        where: { email: req.session.user.email },
        select: {
          researcherProfile: { select: { id: true } },
        },
      });
      if (currentResearcher === null || !currentResearcher.researcherProfile) {
        return res.status(403).json({
          message: 'You have not created your profile',
        });
      }

      // TODO: maybe use an interactive transaction https://www.prisma.io/docs/concepts/components/prisma-client/transactions#interactive-transactions

      const posts = await prisma.job.findMany({
        where: {
          poster: { email: req.session.user.email },
        },
        select: {
          id: true,
          title: true,
          closingDate: true,
          lab: { select: { name: true } },
          _count: {
            select: {
              applicants: { where: { status: 'APPLIED' } },
            },
          },
        },
        orderBy: [{ closingDate: 'asc' }],
      });

      res.status(200).json(posts);
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

export default new PostsRoute().as_handler();
