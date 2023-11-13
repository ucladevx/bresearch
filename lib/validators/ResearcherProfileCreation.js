import Joi from 'joi';
import { Departments } from '@lib/globals';

const maxFirstNameLength = 80;
const maxLastNameLength = 80;
const maxLabNameLength = 50;
const maxEmailLength = 100;

export default Joi.object({
  labName: Joi.string().required().max(maxLabNameLength),
  firstName: Joi.string().required().max(maxFirstNameLength),
  lastName: Joi.string().required().max(maxLastNameLength),
  showPicture: Joi.boolean().required(),
  department: Joi.string()
    .required()
    .valid(...Departments.map((d) => d.value)),
  labContactEmail: Joi.string()
    .required()
    .max(maxEmailLength)
    .email({ minDomainSegments: 2, tlds: { allow: false } }),
});
