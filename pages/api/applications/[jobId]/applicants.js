import { Prisma } from 'prisma/prisma-client';

import { isValidationError } from '@lib/validators';
import ApiRoute from '@lib/ApiRoute';

/* example GET response
{
  "applicants": [
    {
      "applicant": {
        "firstName": "Jane",
        "lastName": "Doe",
        "preferredName": "Jane",
        "studentProfile": null
      },
      "piStatus": "CONSIDERING",
      "lastUpdated": "2023-05-16T02:56:28.621Z"
    },
    {
      "applicant": {
        "firstName": "John",
        "lastName": "Doe",
        "preferredName": null,
        "studentProfile": null
      },
      "piStatus": "REJECTED",
      "lastUpdated": "2023-05-16T03:02:54.515Z"
    }
  ]
}
*/

class ApplicationApplicants extends ApiRoute {
  /**
   * application applicants fetch endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} req
   * @param {import('next').NextApiResponse} res see above example response
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async get(req, res, prisma) {
    try {
      const result = await prisma.job.findFirst({
        where: {
          id: parseInt(req.query?.jobId),
          poster: {
            is: {
              email: req.session.user.email,
            },
          },
        },
        select: {
          applicants: {
            select: {
              applicant: {
                select: {
                  id: true,
                  studentProfile: true,
                },
              },
              piStatus: true,
              lastUpdated: true,
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

export default new ApplicationApplicants().as_handler();
