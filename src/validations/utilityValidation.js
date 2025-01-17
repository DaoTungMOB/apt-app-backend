const Joi = require("joi");
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");
const {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} = require("../utils/validators");

const UtilityValidation = {
  add: async (req, res, next) => {
    try {
      const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        unit: Joi.string().required(),
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
        title: Joi.string(),
        description: Joi.string(),
        price: Joi.number(),
        unit: Joi.string(),
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

module.exports = UtilityValidation;
