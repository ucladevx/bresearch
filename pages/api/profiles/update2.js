import { Prisma } from 'prisma/prisma-client';

import { UpdateProfileValidator, isValidationError } from '@lib/validators';
import ApiRoute from '@lib/ApiRoute';

/* example PATCH request body
{
  
}

Request body can contain one or both of the fields, but not neither.
*/

class ProfileUpdateRoute extends ApiRoute {
  /**
   * profile update endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} req
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async patch(req, res, prisma) {
    try {
      const { error, value } = SecondUpdateProfileValidator.validate(req.body);

      if (error) throw error;

      const studentId = parseInt(req.query.studentId);

      if (studentId === NaN) {
        return res.status(400).json({ message: 'invalid request' });
      }

      const result = await prisma.studentprofile.update({
        where: {
          studentId: {
            studentId,
          },
        },
        data: {
          ...value,
        },
      });

      return res.json(result);
    } catch (e) {
      // check for Node.js errors (data integrity, etc)
      if (isValidationError(e)) {
        res.status(400).json({ message: e.message });
      } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
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

export default new ApplicationsUpdateRoute().as_handler();
