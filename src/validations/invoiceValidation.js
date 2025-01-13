const Joi = require("joi");
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");
const {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} = require("../utils/validators");

const InvoiceValidation = {
  create: async (req, res, next) => {
    try {
      const schema = Joi.object({
        title: Joi.string().required(),
        previousReading: Joi.number().min(1),
        currentReading: Joi.number().min(1),
        quantity: Joi.number().required().min(1),
        month: Joi.number().required().min(1).max(12),
        year: Joi.number().required().min(2000),
        activatedAt: Joi.date().timestamp("javascript"),
        status: Joi.boolean(),
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
        previousReading: Joi.number().min(1),
        currentReading: Joi.number().min(1),
        quantity: Joi.number().min(1),
        unitPrice: Joi.number().min(1),
        month: Joi.number().min(1).max(12),
        year: Joi.number().min(2000),
        utilityId: Joi.string()
          .pattern(OBJECT_ID_RULE)
          .message(OBJECT_ID_RULE_MESSAGE),
        userId: Joi.string()
          .pattern(OBJECT_ID_RULE)
          .message(OBJECT_ID_RULE_MESSAGE),
        activatedAt: Joi.date().timestamp("javascript"),
        status: Joi.boolean(),
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

module.exports = InvoiceValidation;
