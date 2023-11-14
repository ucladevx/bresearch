import { Prisma } from 'prisma/prisma-client';
import { JobCreationValidator, isValidationError } from '@lib/validators';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const window = new JSDOM('').window;
const purify = DOMPurify(window);
import ApiRoute from '@lib/ApiRoute';

class EditJobRoute extends ApiRoute {
  /**
   * edit job endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} req
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async put(req, res, prisma) {
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

      // TODO: maybe use an interactive transaction https://www.prisma.io/docs/concepts/components/prisma-client/transactions#interactive-transactions

      const jobId = parseInt(req.query.jobId, 10);

      // TODO: maybe use an interactive transaction https://www.prisma.io/docs/concepts/components/prisma-client/transactions#interactive-transactions

      const job = await prisma.job.findUnique({
        where: {
          id: jobId,
        },
        select: { poster: { select: { email: true } } },
      });
      if (job === null || job.poster.email !== req.session.user.email) {
        return res.status(400).json({ message: '' });
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

      // TODO: check if researcher should have permission without this query
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

      const updatedJob = await prisma.job.update({
        where: {
          id: jobId,
        },
        // data: value.closed ? { closed: true, closingDate: new Date() } : value,
        data: {
          closingDate: closeDate,
          closed: closeDate ? closeDate < new Date() : false,
          title,
          location,
          description,
          // poster: {
          //   connect: { email: req.session.user.email },
          // },
          // lab: {
          //   connect: { id: labId },
          // },
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

      await res.revalidate(`/job/${updatedJob.id}`);
      await res.revalidate('/');

      res.status(200).json(updatedJob);
    } catch (e) {
      console.error({ e });
      // check for Node.js errors (data integrity, etc)
      if (isValidationError(e)) {
        res.status(400).json({ message: e.message });
      } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res
          .status(500)
          .json({ message: 'Researcher already exists for user', accountType: 'researcher' });
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

export default new EditJobRoute().as_handler();
