import { Prisma } from 'prisma/prisma-client';
import { JobCreationValidator, isValidationError } from '@lib/validators';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const window = new JSDOM('').window;
const purify = DOMPurify(window);
import ApiRoute from '@lib/ApiRoute';
import { Paths } from '@lib/globals';

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
    "credit": "SRP-99"
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
        console.log(
          `${req.session.user.email} tried creating a job with this invalid description:\n${req.body.description}`
        );
        return res.status(400).json({
          message: 'Invalid job description',
        });
      }

      const {
        startDate,
        closingDate,
        title,
        description,
        paid,
        duration,
        departments,
        weeklyHours,
        creditDescription,
        location,
        lab: labId,
        applicationType,
        externalLink,
      } = value;

      const lab = await prisma.lab.findUnique({
        where: { id: labId },
        select: { contactEmail: true, adminResearchers: { select: { email: true } } },
      });
      if (lab === null) {
        return res.status(404).json({
          message: 'Lab not found',
        });
      }
      if (!lab.adminResearchers.some((r) => r.email === req.session.user.email)) {
        return res.status(403).json({
          message: "You aren't in this lab",
        });
      }

      const closeDate = new Date(closingDate);

      let applicationLink = null;
      if (applicationType === 'email') {
        applicationLink = lab.contactEmail;
      } else if (applicationType === 'external') {
        applicationLink = externalLink;
      }

      // TODO: ensure researcher hasn't posted too many jobs
      const result = await prisma.job.create({
        data: {
          closingDate: closeDate,
          closed: closeDate ? closeDate < new Date() : false,
          title,
          location,
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
          credit: creditDescription ?? null,
          location,
          externalLink: applicationLink,
          startDate,
        },
      });

      await res.revalidate(`/job/${result.id}`);
      await res.revalidate(Paths.PostsPage);

      res.status(200).json(result);
    } catch (e) {
      // check for Node.js errors (data integrity, etc)
      console.error(e);
      if (isValidationError(e)) {
        res.status(400).json({ message: e.message });
      } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.error(e);
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
