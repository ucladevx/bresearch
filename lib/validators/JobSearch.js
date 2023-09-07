import Joi from 'joi';

const maxQueryLength = 100;

export default Joi.object({
  jobSearchQuery: Joi.string().required().max(maxQueryLength),
});
