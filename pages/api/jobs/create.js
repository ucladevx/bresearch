import { Prisma } from 'prisma/prisma-client';

import ApiRoute from '@lib/ApiRoute';

// temporary session mock
const getServerSession = async (..._) => ({
  user: {
    name: 'John Doe',
    email: 'johndoe@g.ucla.edu',
    image: null,
  },
  expires: new Date(new Date().getDate() + 1).toISOString(),
});

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
    const session = await getServerSession(req, res);
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
      const result = await prisma.job.create({
        data: {
          closingDate: new Date(closingDate),
          closed: false, // this can be changed, but as far as I know the default behavior would be to open
          title,
          description,
          lab: { connect: { id: labId } },
          posters: {
            connect: [{ email: session.user.email }],
          },
          paid,
          duration,
          departments,
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
          }
          console.error(e);
      }
    } finally {
      res.end();
    }
  }
}

export default new JobCreationRoute().as_handler();
