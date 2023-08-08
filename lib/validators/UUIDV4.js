import Joi from 'joi';

export default Joi.string().guid({ version: 'uuidv4', separator: '-' });
