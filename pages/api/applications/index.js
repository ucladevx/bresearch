import { Prisma } from 'prisma/prisma-client';

import { isValidationError } from '@lib/validators';
import ApiRoute from '@lib/ApiRoute';

/* example POST request body
{
    "closingDate": "2023-03-18T23:28:19.179Z",
    "title": "my first job post",
    "description": "description for my first job post",
    "paid": false,
    "duration": "QUARTERLY",
    "departments": [
        "ENGINEERING"
    ],
    "weeklyHours": 30,
    "credit": true
}
*/

class ApplicationsRoute extends ApiRoute {
  /**
   * job creation endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} req see above example request body
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async get(req, res, prisma) {
    try {
      const result = await prisma.labeledJob.findMany({
        where: {
          applicantEmail: req.session.user?.email,
        },
        select: {
          status: true,
          // bookmarked: true,
          job: {
            select: {
              id: true,
              title: true,
            },
          },
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
        res.status(500).json({ message: 'Invalid data format' });
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

export default new ApplicationsRoute().as_handler();
