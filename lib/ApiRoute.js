/**
 * @callback ApiHandler
 * @param {import('next').NextApiRequest} req the HTTP request object
 * @param {import('next').NextApiResponse} res the HTTP response object
 * @param {PrismaClient} prisma the prisma client
 */

import prisma from '@lib/prisma';

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
  delete(_, res, __) {
    res.status(404).end();
  }

  /**
   * converts class-based route handlers to Next API handler
   * @returns {ApiHandler}
   */
  as_handler() {
    return (req, res) => {
      const defaultHandler = (_, res, __) => res.status(404).end();
      if (req.method?.toLowerCase() === 'as_handler') return defaultHandler;
      return (this[req.method?.toLowerCase()] ?? defaultHandler)(req, res, prisma);
    };
  }
}

export default ApiRoute;
