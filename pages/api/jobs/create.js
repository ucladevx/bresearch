import { Prisma } from 'prisma/prisma-client';

import { JobCreationValidator, isValidationError } from '@lib/validators';
// import { sanitize } from 'isomorphic-dompurify';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const window = new JSDOM('').window;
const purify = DOMPurify(window);
import ApiRoute from '@lib/ApiRoute';

/* example POST request body
{
    "closingDate": "2023-03-18T23:28:19.179Z",
    "title": "my first job post",
    "description": "<p>description for my first job post</p>",
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
      if (req.token.accountType !== 'researcher') {
        return res
          .status(403)
          .json({ message: 'You are not a researcher', accountType: req.token.accountType });
      }

      const { error, value } = JobCreationValidator.validate(req.body);

      if (error) {
        throw error;
      }
      const sanitizedHTML = purify.sanitize(req.body.description, {
        ALLOWED_TAGS: ['p', 'br', 'ul', 'ol', 'li', 'strong', 'em', 'u', '#text'],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: false,
      });
      if (sanitizedHTML !== req.body.description) {
        return res.status(400).json({
          message: 'Invalid job description',
        });
      }

      const {
        closingDate,
        title,
        description,
        paid,
        duration,
        departments,
        weeklyHours,
        credit,
        location,
        lab: labId,
      } = value;

      // TODO: what if closingDate is not passed in request body
      let closeDate = null;
      if (closingDate) {
        closeDate = new Date(closingDate);
      }

      // TODO: ensure researcher is in the lab and # of jobs < 50
      const result = await prisma.job.create({
        data: {
          closingDate: closeDate,
          closed: closeDate ? closeDate < new Date() : false,
          title,
          description,
          poster: {
            connect: { email: req.session.user.email },
          },
          lab: {
            connect: { id: labId },
          },
          paid,
          duration,
          departments,
          weeklyHours,
          credit,
          location,
        },
      });

      await res.revalidate(`/job/${result.id}`);
      await res.revalidate('/');

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
        console.error(e);
        res.status(500).json({ message: 'something went wrong' });
      }
    } finally {
      res.end();
    }
  }
}

export default new JobCreationRoute().as_handler();
