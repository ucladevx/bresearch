import Joi from 'joi';

const maxSkillLength = 50;
const maxLabExperienceLength = 1000;
const maxLinksLength = 200;
const maxCourseworkLength = 800;

export default Joi.object({
  skills: Joi.array()
    .items(Joi.string().max(maxSkillLength))
    .unique((a, b) => a.toLowerCase() === b.toLowerCase()), // TODO: change to array and check links
  labExperience: Joi.string().max(maxLabExperienceLength),
  coursework: Joi.string().max(maxCourseworkLength),
  links: Joi.string().max(maxLinksLength), // TODO: change to array and check links
});
