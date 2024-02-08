import { Prisma } from 'prisma/prisma-client';

import { isValidationError } from '@lib/validators';
import ApiRoute from '@lib/ApiRoute';

/* example PATCH request body
{
  "applicantEmail": "janedoe@g.ucla.edu"
  "status": "REVIEWING",
}
*/

class ApplicationsUpdatePIStatusRoute extends ApiRoute {
  /**
   * application update endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} req
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async patch(req, res, prisma) {
    try {
      // const { error, value } = UpdateApplicationValidator.validate(req.body);

      // if (error) throw error;

      const jobId = parseInt(req.query.jobId, 10);

      if (Number.isNaN(jobId)) {
        return res.status(400).json({ message: 'invalid request' });
      }
      const { applicantEmail, status } = req.body;
      const result = await prisma.labeledJob.update({
        where: {
          jobId_applicantEmail: {
            jobId,
            applicantEmail,
          },
          job: {
            poster: { email: req.session.user.email },
          },
        },
        data: {
          // ...value,
          piStatus: status,
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

export default new ApplicationsUpdatePIStatusRoute().as_handler();
