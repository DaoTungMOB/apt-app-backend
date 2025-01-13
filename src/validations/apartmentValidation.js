const Joi = require("joi");
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");
const { APARTMENT_STATUS } = require("../utils/apartment");
const {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} = require("../utils/validators");

const AparmentValidation = {
  createNew: async (req, res, next) => {
    try {
      const schema = Joi.object({
        userId: Joi.string()
          .pattern(OBJECT_ID_RULE)
          .message(OBJECT_ID_RULE_MESSAGE),
        description: Joi.string(),
        code: Joi.string().required(),
        thumbnail: Joi.string(),
        imageUrls: Joi.array(),
        floorNumber: Joi.number().required(),
        area: Joi.number().required(),
        rentPrice: Joi.number().required(),
        sellPrice: Joi.number().required(),
        startOfTenancy: Joi.date().timestamp("javascript"),
        status: Joi.string().valid(...Object.values(APARTMENT_STATUS)),
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

  addUser: async (req, res, next) => {
    try {
      const schema = Joi.object({
        userId: Joi.string()
          .pattern(OBJECT_ID_RULE)
          .message(OBJECT_ID_RULE_MESSAGE)
          .required(),
        status: Joi.string()
          .valid(
            ...Object.values([APARTMENT_STATUS.RENTED, APARTMENT_STATUS.SOLD])
          )
          .required(),
        startDate: Joi.date().timestamp("javascript").required(),
        endDate: Joi.when("status", {
          is: APARTMENT_STATUS.RENTED,
          then: Joi.date().timestamp("javascript").required(),
          otherwise: Joi.date().timestamp("javascript"),
        }),
      });

      await schema.validateAsync(req.body, {
        abortEarly: false,
      });

      next();
    } catch (error) {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
    }
  },

  changeUser: async (req, res, next) => {
    try {
      const schema = Joi.object({
        userId: Joi.string()
          .pattern(OBJECT_ID_RULE)
          .message(OBJECT_ID_RULE_MESSAGE)
          .required(),
        endDate: Joi.date().timestamp("javascript").required(),
      });

      await schema.validateAsync(req.body, { abortEarly: false });

      next();
    } catch (error) {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
    }
  },

  changeStatus: async (req, res, next) => {
    try {
      const schema = Joi.object({
        status: Joi.string()
          .valid(
            ...Object.values([
              APARTMENT_STATUS.AVAILABLE,
              APARTMENT_STATUS.UNAVAILABLE,
            ])
          )
          .required(),
      });

      await schema.validateAsync(req.body, { abortEarly: false });

      next();
    } catch (error) {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
    }
  },

  update: async (req, res, next) => {
    try {
      const schema = Joi.object({
        description: Joi.string(),
        code: Joi.string(),
        thumbnail: Joi.string(),
        floorNumber: Joi.number(),
        area: Joi.number(),
        rentPrice: Joi.number(),
        sellPrice: Joi.number(),
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

module.exports = AparmentValidation;
