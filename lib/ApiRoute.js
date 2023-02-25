/**
 * @callback ApiHandler
 * @param {import('next').NextApiRequest} req the HTTP request object
 * @param {import('next').NextApiResponse} res the HTTP response object
 * @param {PrismaClient} prisma the prisma client
 */

import { PrismaClient } from 'prisma/prisma-client';

const prisma = new PrismaClient();

class ApiRoute {
  /**
   * @type {ApiHandler}
   */
  get(_, res, __) {
    res.status(404).send({ message: '404 not found' });
  }

  /**
   * @type {ApiHandler}
   */
  post(_, res, __) {
    res.status(404).send({ message: '404 not found' });
  }

  /**
   * @type {ApiHandler}
   */
  patch(_, res, __) {
    res.status(404).send({ message: '404 not found' });
  }

  /**
   * @type {ApiHandler}
   */
  delete(_, res, __) {
    res.status(404).send({ message: '404 not found' });
  }

  /**
   * converts class-based route handlers to Next API handler
   * @returns {ApiHandler}
   */
  as_handler() {
    return (req, res) =>
      (this[req.method?.toLowerCase()] ?? ((_, res) => res.status(404)))(req, res, prisma);
  }
}

export default ApiRoute;
