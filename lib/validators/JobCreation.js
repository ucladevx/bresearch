import Joi from 'joi';
import { tlds } from '@hapi/tlds';
import { Durations, Departments } from '@lib/globals';

const maxTitleLength = 50;
const maxDescriptionLength = 15_000;
const maxWeeklyHours = 24 * 7;
const maxLinkLength = 200;

const allowedDurations = Durations.map((d) => d.value);

const allowedDepartments = Departments.map((d) => d.value);

const Locations = ['ON_CAMPUS', 'OFF_CAMPUS', 'REMOTE'];

export default Joi.object({
  title: Joi.string().required().max(maxTitleLength),
  description: Joi.string().required().max(maxDescriptionLength),
  startDate: Joi.date().required(),
  closingDate: Joi.date()
    .required()
    .custom((value) => {
      const newClosingDate = new Date(value.getTime());
      newClosingDate.setHours(23, 59, 59, 999);
      if (newClosingDate.getTime() > new Date().getTime()) {
        return newClosingDate;
      }
      throw new Error('closingDate is in the past');
    }),
  weeklyHours: Joi.number().integer().required().max(maxWeeklyHours),
  duration: Joi.string()
    .valid(...allowedDurations)
    .required(),
  departments: Joi.array()
    .items(
      Joi.string()
        .uppercase()
        .valid(...allowedDepartments)
    )
    .length(1)
    .required()
    .unique(),
  creditDescription: Joi.string().allow(''),
  paid: Joi.boolean().required(),
  location: Joi.string()
    .valid(...Locations)
    .required(),
  lab: Joi.string().required().guid({ version: 'uuidv4', separator: '-' }),
  applicationType: Joi.string().required().valid('internal', 'external', 'email'),
  externalLink: Joi.string().when('applicationType', {
    switch: [
      {
        is: 'external',
        then: Joi.string()
          .max(maxLinkLength)
          .uri({
            scheme: [/https?/],
            domain: {
              allowUnicode: false,
              tlds: {
                allow: tlds,
              },
            },
          }),
        otherwise: Joi.forbidden(),
      },
    ],
  }),
});
