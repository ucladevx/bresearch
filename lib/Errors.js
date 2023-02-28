class BaseError extends Error {}

export class MaximumSizeExceededError extends BaseError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    // add more fields if needed
  }
}

export default BaseError;
