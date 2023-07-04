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
  firstName: Joi.string().max(maxFirstNameLength), //required
  lastName: Joi.string().max(maxLastNameLength), //required
  pronouns: Joi.string().valid(...Pronouns),
  preferredEmail: Joi.string()
    .max(maxEmailLength)
    .email({ minDomainSegments: 2, tlds: { allow: false } }),
  phoneNumber: Joi.number().integer().positive().min(1000000000).max(99999999999),
  bio: Joi.string().max(maxBioLength),
  major: Joi.string()
    //.required()
    .valid(...Majors),
  additionalMajor: Joi.string().valid(...Majors),
  graduationDate: Joi.string().max(maxGradDateLength), //required
  gpa: Joi.string(), //.required(),
  majorGpa: Joi.string(), //.required(),
});
