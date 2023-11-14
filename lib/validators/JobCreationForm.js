import Joi from 'joi';
import { tlds } from '@hapi/tlds';

const maxTitleLength = 50;
const maxDescriptionLength = 15_000;
const maxWeeklyHours = 24 * 7;
const maxLinkLength = 200;

const Durations = ['QUARTERLY', 'SUMMER', 'ACADEMIC_YEAR', 'YEAR_ROUND'];

import { Departments } from '@lib/globals';
const allowedDepartments = Departments.map((d) => d.value);
const Locations = ['ON_CAMPUS', 'OFF_CAMPUS', 'REMOTE'];

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

export default Joi.object({
  title: Joi.string().required().max(maxTitleLength),
  description: Joi.string().required().max(maxDescriptionLength),
  startDate: Joi.date().required(),
  closingDate: Joi.date().required().min(yesterday),
  weeklyHours: Joi.number().integer().required().max(maxWeeklyHours).min(0),
  duration: Joi.string()
    .valid(...Durations)
    .required(),
  department: Joi.string()
    .uppercase()
    .valid(...allowedDepartments)
    .required(),
  credit: Joi.boolean().required(),
  creditDescription: Joi.string().allow(''),
  paid: Joi.boolean().required(),
  location: Joi.string()
    .valid(...Locations)
    .required(),
  lab: Joi.string().required().guid({ version: 'uuidv4', separator: '-' }),
  applicationType: Joi.string().required().valid('internal', 'external', 'email'),
  externalLink: Joi.string()
    .max(maxLinkLength)
    .uri({
      scheme: [/https?/],
      domain: {
        allowUnicode: false,
        tlds: {
          allow: tlds,
        },
      },
    })
    .allow(''),
});
