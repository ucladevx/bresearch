import Joi from 'joi';

const maxFirstNameLength = 20; //does this need to be restricted?
const maxLastNameLength = 20;
const maxEmailLength = 50;
const maxBioLength = 250;
const maxLabExperienceLength = 250;
const maxLinksLength = 250;

//use prisma schema enums?
const Pronouns = ['he/him', 'she/her', 'they/them', 'other'];

const Majors = [''];

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
  bio: Joi.string().max(bioLength),
  major: Joi.string()
    .required()
    .valid(...Majors),
  additionalMajor: Joi.string().valid(...Majors),
  graduation: Joi.string().required(), //require Month Year format?
  gpa: Joi.number().required().positive().min(0.0).max(5.0),
  majorGpa: Joi.number().required().positive().min(0.0).max(5.0),
  labExperience: Joi.string().max(maxLabExperienceLength),
  coursework: Joi.string().max(maxCourseworkLength),
  links: Joi.string().max(maxLinksLength),
});
