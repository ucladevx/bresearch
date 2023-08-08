import Joi from 'joi';

const maxTitleLength = 50;
const maxDescriptionLength = 15_000;
const maxWeeklyHours = 24 * 7;

const Durations = ['QUARTERLY', 'SUMMER', 'ACADEMIC_YEAR', 'YEAR_ROUND'];

const Departments = [
  'ENGINEERING',
  'HUMANITIES',
  'LIFE_SCIENCES',
  'PHYSICAL_SCIENCES',
  'SOCIAL_SCIENCES',
];

const Locations = ['ON_CAMPUS', 'OFF_CAMPUS', 'REMOTE'];

export default Joi.object({
  title: Joi.string().required().max(maxTitleLength),
  description: Joi.string().required().max(maxDescriptionLength),
  // closingDate: Joi.date().iso().greater('now'),
  closingDate: Joi.string(),
  startDate: Joi.string(),
  department: Joi.string(),
  weeklyHours: Joi.number().integer().required().max(maxWeeklyHours),
  // duration: Joi.string()
  //   .valid(...Durations)
  //   .required(),
  // departments: Joi.array()
  //   .items(
  //     Joi.string()
  //       .uppercase()
  //       .valid(...Departments)
  //   )
  //   .required()
  //   .unique(),
  credit: Joi.boolean().required(),
  // paid: Joi.boolean().required(),
  location: Joi.string()
    .valid(...Locations)
    .required(),
});
