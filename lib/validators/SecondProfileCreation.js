import Joi from 'joi';

const maxSkillLength = 50;
const maxLabExperienceLength = 1000;
const maxLinkLength = 200;
const maxCourseworkLength = 800;

export default Joi.object({
  skills: Joi.array()
    .items(Joi.string().max(maxSkillLength))
    .unique((a, b) => a.toLowerCase() === b.toLowerCase()),
  labExperience: Joi.string().max(maxLabExperienceLength).empty(''),
  coursework: Joi.string().max(maxCourseworkLength).empty(''),
  links: Joi.array()
    .items(
      Joi.string()
        .max(maxLinkLength)
        .uri({
          scheme: [/https?/],
          domain: {
            allowUnicode: false,
            tlds: {
              allow: false, // TODO: change to use @hapi/tlds list
            },
          },
        })
    )
    .unique((a, b) => a.toLowerCase() === b.toLowerCase()), // TODO: check links
});
