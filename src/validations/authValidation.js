const Joi = require("joi");
const {
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  CCCD_RULE,
  CCCD_MESSAGE,
  PHONE_RULE,
  PHONE_MESSAGE,
  ONLY_UNICODE_RULE,
  ONLY_UNICODE_MESSAGE,
} = require("../utils/validators");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");

const AuthValidation = {
  createNew: async (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().required().email(),
      password: Joi.string().required().pattern(PASSWORD_RULE).messages({
        "string.pattern.base": PASSWORD_RULE_MESSAGE,
        "string.empty": "Mật khẩu không thể rỗng",
      }),
      cccd: Joi.string().required().pattern(CCCD_RULE).messages({
        "string.pattern.base": CCCD_MESSAGE,
      }),
      birthDay: Joi.date().required(),
      phone: Joi.string().required().pattern(PHONE_RULE).messages({
        "string.pattern.base": PHONE_MESSAGE,
      }),
      firstName: Joi.string()
        .pattern(ONLY_UNICODE_RULE)
        .message(ONLY_UNICODE_MESSAGE)
        .required(),
      lastName: Joi.string()
        .pattern(ONLY_UNICODE_RULE)
        .message(ONLY_UNICODE_MESSAGE)
        .required(),
    });

    try {
      await schema.validateAsync(req.body, {
        abortEarly: false,
        allowUnknown: false,
      });

      next();
    } catch (error) {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
    }
  },

  login: async (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().required().email(),
      password: Joi.string().required().pattern(PASSWORD_RULE).messages({
        "string.pattern.base": PASSWORD_RULE_MESSAGE,
        "string.empty": "Mật khẩu không thể rỗng",
      }),
    });
    try {
      await schema.validateAsync(req.body, { abortEarly: false });

      next();
    } catch (error) {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
    }
  },

  forgotPassword: async (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().required().email(),
    });
    try {
      await schema.validateAsync(req.body, { abortEarly: false });

      next();
    } catch (error) {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
    }
  },

  resetPassword: async (req, res, next) => {
    const schema = Joi.object({
      newPassword: Joi.string().required().pattern(PASSWORD_RULE).messages({
        "string.pattern.base": PASSWORD_RULE_MESSAGE,
        "string.empty": "Mật khẩu không thể rỗng",
      }),
    });
    try {
      await schema.validateAsync(req.body, { abortEarly: false });

      next();
    } catch (error) {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
    }
  },
};

module.exports = AuthValidation;
