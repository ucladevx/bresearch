import { Prisma } from 'prisma/prisma-client';

import { SecondUpdateProfileValidator, isValidationError } from '@lib/validators';
import ApiRoute from '@lib/ApiRoute';

class SecondProfileUpdateRoute extends ApiRoute {
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

      if (error) {
        throw error;
      }

      const { experience, coursework, links } = value;

      const student = await prisma.student.findUnique({
        where: {
          email: req.session.user.email,
        },
      });

      const result = await prisma.studentProfile.update({
        where: {
          studentId: student.id,
        },
        data: {
          experience: experience || undefined,
          coursework: coursework || undefined,
          links: links || undefined,
        },
      });

      return res.json(result);
    } catch (e) {
      // check for Node.js errors (data integrity, etc)
      if (isValidationError(e)) {
        console.log(e);
        res.status(400).json({ message: e.message });
      } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
        res.status(500).json({ message: e.meta });
        console.error(e);
      } else if (e instanceof Prisma.PrismaClientValidationError) {
        console.log(e);
        res.status(400).json({ message: 'invalid request' });
        console.error(e);
      } else {
        console.log(e);
        console.error(e);
        res.status(500).json({ message: 'something went wrong' });
      }
    } finally {
      res.end();
    }
  }
}

export default new SecondProfileUpdateRoute().as_handler();
