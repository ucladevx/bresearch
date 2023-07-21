import { Prisma } from 'prisma/prisma-client';
import ApiRoute from '@lib/ApiRoute';

class StudentCreationRoute extends ApiRoute {
  /**
   * profile creation endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} req see above example request body
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async post(req, res, prisma) {
    try {
      if (req.token.accountType) {
        return res
          .status(403)
          .json({ message: 'User already exists for user', accountType: req.token.accountType });
      }
      // TODO: maybe use an interactive transaction https://www.prisma.io/docs/concepts/components/prisma-client/transactions#interactive-transactions
      const researcher = await prisma.researcher.findUnique({
        where: {
          email: req.session.user.email,
        },
      });
      if (researcher !== null) {
        return res
          .status(403)
          .json({ message: 'Researcher already exists for user', accountType: 'researcher' });
      }
      const result = await prisma.student.create({
        data: {
          email: req.session.user.email,
        },
      });

      res.status(200).json(result);
    } catch (e) {
      console.error({ e });
      // check for Node.js errors (data integrity, etc)
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({ message: 'Student already exists for user' });
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

export default new StudentCreationRoute().as_handler();
