import Joi from 'joi';

const maxFirstNameLength = 80;
const maxLastNameLength = 80;
const maxEmailLength = 100;
const maxBioLength = 500;
const maxLabExperienceLength = 1000;
const maxLinksLength = 200;
const maxGradDateLength = 12;
const maxCourseworkLength = 800;

// TODO: use prisma schema enums
const Pronouns = ['he/him', 'she/her', 'they/them', 'other', 'NOT_LISTED'];

const Majors = ['COMPUTER_SCIENCE', 'COGNITIVE_SCIENCE', 'AEROSPACE_ENGINEERING'];
const Minors = ['COMPUTER_SCIENCE', 'COGNITIVE_SCIENCE', 'AEROSPACE_ENGINEERING'];

export default Joi.object({
  firstName: Joi.string().required().max(maxFirstNameLength),
  lastName: Joi.string().required().max(maxLastNameLength),
  pronouns: Joi.string()
    .empty('')
    .valid(...Pronouns),
  // preferredEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: true } }),
  preferredEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }),
  phoneNumber: Joi.string()
    .empty('')
    .max(15)
    .pattern(/^[0-9)(+ -]+$/), // maybe change later or use a package
  bio: Joi.string().empty('').max(maxBioLength),
  major: Joi.string()
    .required()
    .valid(...Majors),
  // prevent additionalMajor from being the same as major
  // https://github.com/hapijs/joi/issues/2759#issuecomment-1097735655
  additionalMajor: Joi.alternatives()
    .invalid(Joi.ref('major'))
    .try(
      Joi.string()
        .empty('')
        .valid(...Majors)
    ),
  minor: Joi.string()
    .empty('')
    .valid(...Minors),
  additionalMinor: Joi.alternatives()
    .invalid(Joi.ref('minor'))
    .try(
      Joi.string()
        .empty('')
        .valid(...Minors)
    ),
  graduationDate: Joi.string().required().max(maxGradDateLength), // TODO: require a season and a year, make sure year is in the future
  gpa: Joi.string().required(), // TODO: limit range of float/int
  majorGpa: Joi.string().required(),
  labExperience: Joi.string().max(maxLabExperienceLength),
  coursework: Joi.string().max(maxCourseworkLength),
  links: Joi.string().max(maxLinksLength), // TODO: change to array and check links
});
