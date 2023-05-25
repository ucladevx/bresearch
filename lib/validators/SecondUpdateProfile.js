import Joi from 'joi';

const maxLabExperienceLength = 1000;
const maxLinksLength = 200;
const maxCourseworkLength = 800;

export default Joi.object({
  experience: Joi.string().max(maxLabExperienceLength),
  coursework: Joi.string().max(maxCourseworkLength),
  links: Joi.string().max(maxLinksLength),
});
