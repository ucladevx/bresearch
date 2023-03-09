import { Prisma } from 'prisma/prisma-client';

import { JobCreationValidator, isValidationError } from '@lib/validators';
import ApiRoute from '@lib/ApiRoute';

/* example POST request body
{
    "closingDate": "2023-03-18T23:28:19.179Z",
    "title": "my first job post",
    "description": "description for my first job post",
    "labId": "d6ded724-b13b-47e1-b8e1-64ecc8808948",
    "paid": false,
    "duration": "QUARTERLY",
    "departments": [
        "ENGINEERING"
    ],
    "weeklyHours": 30,
    "credit": true
}
*/

class JobCreationRoute extends ApiRoute {
  /**
   * job creation endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} req see above example request body
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async post(req, res, prisma) {
    try {
      const { error, value } = JobCreationValidator.validate(req.body);

      if (error) {
        throw error;
      }

      const {
        closingDate,
        title,
        description,
        labId,
        paid,
        duration,
        departments,
        weeklyHours,
        credit,
      } = value;

      const closeDate = new Date(closingDate);

      const result = await prisma.job.create({
        data: {
          closingDate: closeDate,
          closed: closeDate < new Date(),
          title,
          description,
          lab: { connect: { id: labId } },
          posters: {
            connect: [{ email: req.session.user.email }],
          },
          paid,
          duration,
          departments,
          weeklyHours,
          credit,
        },
      });

      res.status(200).json(result);
    } catch (e) {
      // check for Node.js errors (data integrity, etc)
      if (isValidationError(e)) {
        res.status(400).json({ message: e.message });
      } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({ message: e.meta });
      } else if (e instanceof Prisma.PrismaClientValidationError) {
        res.status(400).json({ message: 'Invalid data format' });
      } else {
        console.error(e);
        res.status(500).json({ message: 'something went wrong' });
      }
    } finally {
      res.end();
    }
  }
}

export default new JobCreationRoute().as_handler();
