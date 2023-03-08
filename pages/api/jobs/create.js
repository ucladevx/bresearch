import { Prisma } from 'prisma/prisma-client';

import ApiRoute from '@lib/ApiRoute';
import BaseError, { MaximumSizeExceededError } from '@lib/Errors';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

/* example POST request body
{
    "closingDate": "2023-02-24T01:48:47.344Z",
    "title": "my first job post",
    "description": "description for my first job post",
    "labId": "d6ded724-b13b-47e1-b8e1-64ecc8808948",
    "paid": false,
    "duration": "QUARTERLY",
    "departments": ["ENGINEERING"],
    "weeklyHours": 30,
    "credit": true
}
*/

class JobCreationRoute extends ApiRoute {
  /**
   * job creation endpoint
   * @param {import('next').NextApiRequest} req see above example request body
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async post(req, res, prisma) {
    const maxDescriptionLength = 15_000;
    const maxWeeklyHours = 24 * 7;
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: 'Not logged in' });
      return;
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
    } = req.body;

    try {
      if (description.length > maxDescriptionLength)
        throw new MaximumSizeExceededError(
          `description field exceeds ${maxDescriptionLength} character limit`
        );
      if (weeklyHours > maxWeeklyHours)
        throw new MaximumSizeExceededError(
          `weekly hours field exceeds ${maxWeeklyHours} maximum hours per week`
        );
      const closeDate = new Date(closingDate);

      const result = await prisma.job.create({
        data: {
          closingDate: closeDate,
          closed: closeDate < new Date(),
          title,
          description,
          lab: { connect: { id: labId } },
          posters: {
            connect: [{ email: session.user.email }],
          },
          paid,
          duration,
          departments: [...new Set(departments)],
          weeklyHours,
          credit,
        },
      });

      res.json(result);
    } catch (e) {
      // check for Node.js errors (data integrity, etc)
      switch (e.name) {
        case 'RangeError':
          return res.status(400).json({ message: 'Invalid closing date' });
        default: // exceptions
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(500).json({ message: e.meta });
          } else if (e instanceof Prisma.PrismaClientValidationError) {
            res.status(400).json({ message: 'Invalid data format' });
          } else if (e instanceof BaseError) {
            res.status(400).json({ message: e.message });
          } else {
            res.status(500);
          }
      }
    } finally {
      res.end();
    }
  }
}

export default new JobCreationRoute().as_handler();
