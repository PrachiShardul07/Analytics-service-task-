const Joi = require('joi');

const eventSchema = Joi.object({
  site_id: Joi.string().required(),
  event_type: Joi.string().required(),
  path: Joi.string().allow('', null),
  user_id: Joi.string().allow('', null),
  timestamp: Joi.string().isoDate().required()
});

module.exports = {
  validateEvent: (obj) => eventSchema.validate(obj, { convert: true })
};
