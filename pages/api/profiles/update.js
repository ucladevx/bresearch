import { Prisma } from 'prisma/prisma-client';

import { UpdateProfileValidator, isValidationError } from '@lib/validators';
import ApiRoute from '@lib/ApiRoute';

/* example PATCH request body
{
  
}

Request body can contain one or both of the fields, but not neither.
*/

class ProfileUpdateRoute extends ApiRoute {
  /**
   * profile update endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} req
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async patch(req, res, prisma) {
    try {
      const { error, value } = UpdateProfileValidator.validate(req.body);

      if (error) throw error;

      const {
        firstName,
        lastName,
        email,
        preferredEmail,
        pronouns,
        phoneNumber,
        bio,
        major,
        additionalMajor,
        graduationDate,
        gpa,
        majorGpa,
      } = value;

      const student = await prisma.student.findUnique({
        where: {
          email: req.session.user.email,
        },
      });

      let phone = null;
      if (phoneNumber) {
        phone = phoneNumber.toString();
      }
      const result = await prisma.studentProfile.update({
        where: {
          studentId: student.id,
        },
        data: {
          preferredEmail: preferredEmail || undefined,
          pronouns: pronouns || undefined,
          bio: bio || undefined,
          major: major || undefined,
          additionalMajor: additionalMajor || undefined,
          graduationDate: graduationDate || undefined,
          gpa: gpa || undefined,
          majorGpa: majorGpa || undefined,
          phoneNumber: phone || undefined,
        },
      });
      const result2 = await prisma.student.update({
        where: {
          email: req.session.user.email,
        },
        data: {
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          email: email || undefined,
        },
      });

      return res.json(result);
    } catch (e) {
      // check for Node.js errors (data integrity, etc)
      if (isValidationError(e)) {
        console.log(e);
        res.status(400).json({ message: e.message });
      } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
        res.status(500).json({ message: e.meta });
        console.error(e);
      } else if (e instanceof Prisma.PrismaClientValidationError) {
        console.log(e);
        res.status(400).json({ message: 'invalid request' });
        console.error(e);
      } else {
        console.log(e);
        console.error(e);
        res.status(500).json({ message: 'something went wrong' });
      }
    } finally {
      res.end();
    }
  }
}

export default new ProfileUpdateRoute().as_handler();
