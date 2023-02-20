/**
 * @typedef {import('next').NextApiHandler<void>} ApiHandler
 */

class ApiRoute {
  /**
   * @type {ApiHandler}
   */
  get(_, res) {
    res.status(404).send({ message: '404 not found' });
  }

  /**
   * @type {ApiHandler}
   */
  post(_, res) {
    res.status(404).send({ message: '404 not found' });
  }

  /**
   * @type {ApiHandler}
   */
  patch(_, res) {
    res.status(404).send({ message: '404 not found' });
  }

  /**
   * @type {ApiHandler}
   */
  delete(_, res) {
    res.status(404).send({ message: '404 not found' });
  }

  /**
   * converts class-based route handlers to Next API handler
   * @returns {ApiHandler}
   */
  as_handler() {
    return (req, res) =>
      (this[req.method?.toLowerCase()] ?? ((_, res) => res.status(404)))(req, res);
  }
}

export default ApiRoute;
