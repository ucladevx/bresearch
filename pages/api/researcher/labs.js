import ApiRoute from '@lib/ApiRoute';
class ResearcherLabsRoute extends ApiRoute {
  /**
   * researcher labs endpoint
   * @param {import('next').NextApiRequest & { session: import('next-auth').Session?}} req see above example request body
   * @param {import('next').NextApiResponse} res
   * @param {import('prisma/prisma-client').PrismaClient} prisma
   * @returns
   */
  async get(req, res, prisma) {
    try {
      if (req.token.accountType !== 'researcher') {
        return res
          .status(403)
          .json({ message: 'You are not a researcher', accountType: req.token.accountType });
      }
      const labs = await prisma.researcher.findUnique({
        where: {
          email: req.session.user.email,
        },
        select: {
          labs: {
            select: {
              id: true,
              name: true,
              contactEmail: true,
            },
          },
        },
      });
      return res.status(200).json(labs);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'something went wrong' });
    }
  }
}

export default new ResearcherLabsRoute().as_handler();
