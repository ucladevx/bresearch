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
  title: Joi.string().max(maxTitleLength),
  description: Joi.string().max(maxDescriptionLength),
  closed: Joi.boolean(),
  closingDate: Joi.date().iso().greater('now'),
  weeklyHours: Joi.number().integer().max(maxWeeklyHours),
  duration: Joi.string().valid(...Durations),
  departments: Joi.array()
    .items(
      Joi.string()
        .uppercase()
        .valid(...Departments)
    )

    .unique(),
  credit: Joi.boolean(),
  paid: Joi.boolean(),
  location: Joi.string().valid(...Locations),
  lab: Joi.string().guid({ version: 'uuidv4', separator: '-' }),
});
