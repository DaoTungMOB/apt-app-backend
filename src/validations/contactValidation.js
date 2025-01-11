const Joi = require("joi");
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");
const {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} = require("../utils/validators");

const ContactValidation = {
  create: async (req, res, next) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        content: Joi.string().required(),
        status: Joi.string(),
      });

      await schema.validateAsync(req.body, {
        abortEarly: false,
        convert: false,
      });

      next();
    } catch (error) {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
    }
  },

  update: async (req, res, next) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email(),
        userId: Joi.string()
          .pattern(OBJECT_ID_RULE)
          .message(OBJECT_ID_RULE_MESSAGE),
        phone: Joi.string(),
        content: Joi.string(),
        status: Joi.string(),
      });

      await schema.validateAsync(req.body, {
        abortEarly: false,
        convert: false,
      });

      next();
    } catch (error) {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
    }
  },
};

module.exports = ContactValidation;
