import { Prisma } from 'prisma/prisma-client';

import { SecondProfileCreationValidator, isValidationError } from '@lib/validators';
import ApiRoute from '@lib/ApiRoute';

/* example POST request body
{
  "firstName": "Joe",
  "lastName": "Bruin",
  "pronouns": "he/him",
  "uclaEmail": "joebruin@g.ucla.edu",
  "preferredEmail": "joe@gmail.com",
  "phoneNumber": 1111111111,
  "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "major": "Computer Science",
  "additionalMajor": "Math",
  "graduation": "June 2025",
  "gpa": "4.0",
  "majorGpa": "3.9",
  "labExperience": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "coursework": "Math 31, CS 35L",
  "links": "linkedin.com/joe-bruin"
}
*/

class SecondProfileCreationRoute extends ApiRoute {
  /**
   * profile creation endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} req see above example request body
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async post(req, res, prisma) {
    try {
      const { error, value } = SecondProfileCreationValidator.validate(req.body);

      if (error) {
        throw error;
      }
      const { labExperience, coursework, links, skills } = value;

      const student = await prisma.student.findUnique({
        where: {
          email: req.session.user.email,
        },
      });
      const result = await prisma.studentProfile.update({
        where: {
          studentId: student.id,
        },
        data: {
          experience: labExperience?.trim() || null,
          coursework: coursework?.trim() || null,
          links,
          skills,
        },
      });

      const slug = `/student/profile/${result.id.replaceAll('-', '')}`;
      await res.revalidate(slug);

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

export default new SecondProfileCreationRoute().as_handler();
