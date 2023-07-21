import { Prisma } from 'prisma/prisma-client';

import { ResearcherProfileCreationValidator, isValidationError } from '@lib/validators';
import ApiRoute from '@lib/ApiRoute';

class ResearcherProfileCreationRoute extends ApiRoute {
  /**
   * researcher profile creation endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} req see above example request body
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async post(req, res, prisma) {
    if (req.token.accountType !== 'researcher') {
      return res
        .status(403)
        .json({ message: 'You are not a researcher', accountType: req.token.accountType });
    }

    try {
      const { error, value } = ResearcherProfileCreationValidator.validate(req.body);
      if (error) {
        throw error;
      }

      const { name } = value;

      const result = await prisma.researcherProfile.create({
        data: {
          name,
          researcher: {
            connect: { email: req.session.user.email },
          },
        },
      });

      res.status(200).json(result);
    } catch (e) {
      // check for Node.js errors (data integrity, etc)
      console.error(e);
      if (isValidationError(e)) {
        res.status(400).json({ message: e.message });
      } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({ message: e.meta });
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

export default new ResearcherProfileCreationRoute().as_handler();
