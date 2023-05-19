import Joi from 'joi';

const maxFirstNameLength = 80;
const maxLastNameLength = 80;
const maxEmailLength = 100;
const maxBioLength = 500;
const maxLabExperienceLength = 1000;
const maxLinksLength = 200;
const maxGradDateLength = 12;
const maxCourseworkLength = 800;

//use prisma schema enums?
const Pronouns = ['he/him', 'she/her', 'they/them', 'other', 'NOT_LISTED'];

const Majors = ['COMPUTER_SCIENCE', 'COGNITIVE_SCIENCE  '];

export default Joi.object({
  firstName: Joi.string().required().max(maxFirstNameLength),
  lastName: Joi.string().required().max(maxLastNameLength),
  pronouns: Joi.string().valid(...Pronouns),
  uclaEmail: Joi.string()
    .required()
    .max(maxEmailLength)
    .email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['edu'] } }),
  preferredEmail: Joi.string().max(maxEmailLength).email({ minDomainSegments: 2 }),
  phoneNumber: Joi.number().integer().positive().min(1000000000).max(99999999999),
  bio: Joi.string().max(maxBioLength),
  major: Joi.string()
    .required()
    .valid(...Majors),
  additionalMajor: Joi.string().valid(...Majors),
  graduationDate: Joi.string().required().max(maxGradDateLength), //require a season and a year, make sure year is in the future
  // gpa: Joi.number().required().positive().min(0.0).max(5.0),
  // majorGpa: Joi.number().required().positive().min(0.0).max(5.0),
  gpa: Joi.string().required(),
  majorGpa: Joi.string().required(),
  labExperience: Joi.string().max(maxLabExperienceLength),
  coursework: Joi.string().max(maxCourseworkLength),
  links: Joi.string().max(maxLinksLength),
});
