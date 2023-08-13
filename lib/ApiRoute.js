import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';

import prisma from '@lib/prisma';
import { authOptions } from 'pages/api/auth/[...nextauth]';

/**
 * @callback ApiHandler
 * @param {import('next').NextApiRequest} req the HTTP request object
 * @param {import('next').NextApiResponse} res the HTTP response object
 * @param {PrismaClient} prisma the prisma client
 */

class ApiRoute {
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
  put(_, res, __) {
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
    const allowedMethods = ['post', 'get', 'delete', 'patch', 'put'];

    return async (req, res) => {
      const defaultHandler = (_, res, __) => res.status(404).end();
      const method = req.method?.toLowerCase();

      if (!allowedMethods.includes(method)) {
        return defaultHandler;
      } else {
        // we care about authentication
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
          // user is not logged in
          return res
            .status(401)
            .json({ message: 'You must be logged in to access this API method' });
        }
        req.session = session;
        req.token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        return (this[method] ?? defaultHandler)(req, res, prisma);
      }
    };
  }
}

export default ApiRoute;
