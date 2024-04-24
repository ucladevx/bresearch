import { Prisma } from 'prisma/prisma-client';

import { ResearcherProfileCreationValidator, isValidationError } from '@lib/validators';
import ApiRoute from '@lib/ApiRoute';

class ResearcherProfileEditingRoute extends ApiRoute {
  /**
   * researcher profile editing endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} req see above example request body
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async put(req, res, prisma) {
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

      const { firstName, lastName, labName, showPicture, labContactEmail, department } = value;

      // Query below doesn't work because researcherProfile's where requires unique fields
      // const result = await prisma.researcherProfile.update({
      //   where: {
      //     researcher: { email: req.session.user.email },
      //   },
      //   data: {
      //     firstName,
      //     lastName,
      //     profilePicture: showPicture ? req.token.picture : null,
      //   },
      // });

      // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#update-an-existing-user-record-by-updating-the-profile-record-its-connected-to
      const result = await prisma.researcher.update({
        where: {
          email: req.session.user.email,
        },
        data: {
          researcherProfile: {
            update: {
              firstName,
              lastName,
              profilePicture: showPicture ? req.token.picture : null,
            },
          },
        },
      });

      // TODO: Revalidate every job that they've posted + home page? if we show name
      //get all jobs they posted
      //first get their id

      const researcher_id = await prisma.researcher.findUnique({
        where: { email: req.session.user.email },
        select: {
          id: true,
        },
      });
      // if (researcher_id === null) {
      //   return res.status(403).json({
      //     message: 'You have not created your profile',
      //   });
      // }

      const job_ids = await prisma.job.findMany({
        where: {
          posterId: researcher_id,
        },
        select: {
          id: true,
        },
        take: 50,
      });

      // for(const job_id of job_ids){
      //   await res.revalidate(`/job/${job_id}`);
      // }
      await Promise.all(
        job_ids.map(async (job_id) => {
          try {
            res.revalidate(`/job/${job_id}`);
          } catch (e) {
            console.log(e);
          }
        })
      );

      res.revalidate('/');

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

export default new ResearcherProfileEditingRoute().as_handler();
