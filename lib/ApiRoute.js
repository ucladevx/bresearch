import { getServerSession } from 'next-auth';

import prisma from '@lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';

/**
 * @callback ApiHandler
 * @param {import('next').NextApiRequest} req the HTTP request object
 * @param {import('next').NextApiResponse} res the HTTP response object
 * @param {PrismaClient} prisma the prisma client
 */

/**
 * Route Options Type
 * @typedef {{ ignore: { [route]: boolean = false }, excludeSessionInfo: { [route]: boolean = false } }} RouteOptions
 */

class ApiRoute {
  /**
   * constructs new api route which requires authentication
   * @param {RouteOptions} [options]
   */
  constructor(options) {
    this.options = options;
  }

  /**
   * @type {ApiHandler}
   */
  get(_, res, __) {
    res.status(404).end();
  }

  /**
   * @type {ApiHandler}
   */
  post(_, res, __) {
    res.status(404).end();
  }

  /**
   * @type {ApiHandler}
   */
  patch(_, res, __) {
    res.status(404).end();
  }

  /**
   * @type {ApiHandler}
   */
  delete(_, res, __) {
    res.status(404).end();
  }

  /**
   * @override
   */
  as_handler() {
    console.log(this);
    return async (req, res) => {
      const defaultHandler = (_, res, __) => res.status(404).end();
      const method = req.method?.toLowerCase();
      if (method === 'as_handler') {
        return defaultHandler;
      } else if (this.options?.ignore?.[method]) {
        // don't care about authentication, just do normal thing
        return (this[method] ?? defaultHandler)(req, res, prisma);
      } else {
        // we care about authentication
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
          // user is not logged in
          return res
            .status(401)
            .json({ message: 'You must be logged in to access this API method' });
        }
        if (!this.options?.excludeSessionInfo?.[method]) {
          req.session = session;
        }
        return (this[method] ?? defaultHandler)(req, res, prisma);
      }
    };
  }
}

export default ApiRoute;
