import Joi from 'joi';

const JobStatus = ['APPLIED', 'SAVED', 'HIDDEN'];

export default Joi.object({
  status: Joi.string()
    .uppercase()
    .valid(...JobStatus),
  bookmarked: Joi.boolean(),
}).or('status', 'bookmarked');
