import Joi from 'joi';

const maxFirstNameLength = 80;
const maxLastNameLength = 80;
// const maxLabNameLength = 50;
// const maxLabAreaLength = 50;

export default Joi.object({
  name: Joi.string()
    .required()
    .max(maxFirstNameLength + maxLastNameLength + 1),
  // area: Joi.string().required().max(maxLabAreaLength),
  // labContactEmail: Joi.string()
  //   .required()
  //   .email({ minDomainSegments: 2, tlds: { allow: false } }),
});
