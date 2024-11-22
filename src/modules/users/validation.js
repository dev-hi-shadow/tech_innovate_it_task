const Joi = require("joi");

module.exports = {
  registerJoiValidation: Joi.object().keys({
    username: Joi.string().required().label("Username"),
    first_name: Joi.string().required().label("First Name"),
    last_name: Joi.string().required().label("Last Name"),
    email: Joi.string().required().label("Email"),
    password: Joi.string().required().min(8).label("Password"),
    role: Joi.string().valid("admin", "user").required().label("R ole"),
  }),
  loginJoiValidation: Joi.object().keys({
    credential: Joi.string().required().label("Email or Username"),
    password: Joi.string().required().label("Password"),
  }),
};
