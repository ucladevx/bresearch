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

const Majors = [''];

export default Joi.object({
  firstName: Joi.string().max(maxFirstNameLength),
  lastName: Joi.string().max(maxLastNameLength),
  pronouns: Joi.string().valid(...Pronouns),
  preferredEmail: Joi.string()
    .max(maxEmailLength)
    .email({ minDomainSegments: 2, tlds: { allow: false } }),
  phoneNumber: Joi.number().integer().positive().min(1000000000).max(99999999999),
  bio: Joi.string().max(maxBioLength),
  major: Joi.string().valid(...Majors),
  additionalMajor: Joi.string().valid(...Majors),
  graduation: Joi.string().max(maxGradDateLength), //require Month Year format?
  gpa: Joi.number().positive().min(0.0).max(5.0),
  majorGpa: Joi.number().positive().min(0.0).max(5.0),
  experience: Joi.string().max(maxLabExperienceLength),
  coursework: Joi.string().max(maxCourseworkLength),
  links: Joi.string().max(maxLinksLength),
});
