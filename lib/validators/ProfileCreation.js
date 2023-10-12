import Joi from 'joi';
import { tlds } from '@hapi/tlds';

const maxFirstNameLength = 80;
const maxLastNameLength = 80;
const maxEmailLength = 100;
const maxBioLength = 500;
const maxLabExperienceLength = 1000;
const maxLinksLength = 200;
const maxGradDateLength = 12;
const maxCourseworkLength = 800;
let currentYear = new Date().getFullYear();
let maxGradYear = new Date().getFullYear() + 8;

// TODO: use prisma schema enums
const Pronouns = ['HE_HIM', 'SHE_HER', 'THEY_THEM', 'NOT_LISTED'];

const Majors = ['COMPUTER_SCIENCE', 'COGNITIVE_SCIENCE'];
const Minors = ['LINGUISTICS'];

export default Joi.object({
  firstName: Joi.string().required().max(maxFirstNameLength),
  lastName: Joi.string().required().max(maxLastNameLength),
  pronouns: Joi.string()
    .empty('')
    .valid(...Pronouns),
  // preferredEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: true } }),
  preferredEmail: Joi.string()
    .empty('')
    .email({ minDomainSegments: 2, tlds: { allow: tlds } }),
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
  graduationDate: Joi.string()
    .max(maxGradDateLength)
    .pattern(/^((SPRING)|(SUMMER)|(FALL)|(WINTER)\b)\s([0-9]{4})$/)
    .custom((value) => {
      console.log('current year: ' + currentYear + ' and input year: ' + value);

      if (
        !value.includes(currentYear) &&
        !value.includes(currentYear + 1) &&
        !value.includes(currentYear + 2) &&
        !value.includes(currentYear + 3) &&
        !value.includes(currentYear + 4) &&
        !value.includes(currentYear + 5) &&
        !value.includes(currentYear + 6) &&
        !value.includes(currentYear + 7) &&
        !value.includes(maxGradYear)
      )
        throw new Error('Graduation Year must be between ' + currentYear + ' and ' + maxGradYear);
      else {
        console.log('grad year is valid');
      }
    })
    .required(), // TODO: require a season and a year, make sure year is in the future
  gpa: Joi.string()
    .max(5)
    .min(2)
    .pattern(/^([0-3]\.\d\d?\d?\d?)|(4\.00?0?0?)$/)
    .required(), // TODO: limit range of float/int
  majorGpa: Joi.string().required(),
}); // TODO: .with('additionaMinor', 'minor'), use minor mapping func and disallow empty minor
