import Joi from 'joi';
import { Majors, Minors } from '@lib/globals';

const maxFirstNameLength = 80;
const maxLastNameLength = 80;
const maxEmailLength = 100;
const maxBioLength = 500;
const maxLabExperienceLength = 1000;
const maxLinksLength = 200;
const maxGradDateLength = 12;
const maxCourseworkLength = 800;

// TODO: use prisma schema enums
const Pronouns = ['HE_HIM', 'SHE_HER', 'THEY_THEM', 'NOT_LISTED'];

const allowedMajors = Majors.map((m) => m.value);
const allowedMinors = Minors.map((m) => m.value);
const graduationDates = new Array();

export default Joi.object({
  firstName: Joi.string().required().max(maxFirstNameLength),
  lastName: Joi.string().required().max(maxLastNameLength),
  pronouns: Joi.string()
    .empty('')
    .valid(...Pronouns),
  // preferredEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: true } }),
  preferredEmail: Joi.string()
    .empty('')
    .email({ minDomainSegments: 2, tlds: { allow: false } }),
  phoneNumber: Joi.string()
    .empty('')
    .max(15)
    .pattern(/^[0-9)(+ -]+$/), // maybe change later or use a package
  bio: Joi.string().empty('').max(maxBioLength),
  major: Joi.string()
    .required()
    .valid(...allowedMajors),
  // prevent additionalMajor from being the same as major
  // https://github.com/hapijs/joi/issues/2759#issuecomment-1097735655
  additionalMajor: Joi.alternatives()
    .invalid(Joi.ref('major'))
    .try(
      Joi.string()
        .empty('')
        .valid(...allowedMajors)
    ),
  minor: Joi.string()
    .empty('')
    .valid(...allowedMinors),
  additionalMinor: Joi.alternatives()
    .invalid(Joi.ref('minor'))
    .try(
      Joi.string()
        .empty('')
        .valid(...allowedMinors)
    ),
  graduationDate: Joi.string().required().max(maxGradDateLength), // TODO: require a season and a year, make sure year is in the future
  gpa: Joi.string().required(), // TODO: limit range of float/int
  majorGpa: Joi.string().required(),
  showPicture: Joi.boolean().required(),
}); // TODO: .with('additionaMinor', 'minor'), use minor mapping func and disallow empty minor
