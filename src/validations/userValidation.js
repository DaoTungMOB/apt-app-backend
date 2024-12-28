const Joi = require("joi");
const ApiError = require("../utils/ApiError");

const {
  PASSWORD_RULE,
  ONLY_UNICODE_RULE,
  ONLY_UNICODE_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  CCCD_MESSAGE,
  CCCD_RULE,
  PHONE_RULE,
  PHONE_MESSAGE,
} = require("../utils/validators");
const { StatusCodes } = require("http-status-codes");
const { ROLE } = require("../utils/auth");

const UserValidation = {
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
      await schema.validateAsync(req.body, { abortEarly: false });

      next();
    } catch (error) {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
    }
  },

  updateOne: async (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email(),
      cccd: Joi.string().pattern(CCCD_RULE).messages({
        "string.pattern.base": CCCD_MESSAGE,
      }),
      birthDay: Joi.date(),
      phone: Joi.string().pattern(PHONE_RULE).messages({
        "string.pattern.base": PHONE_MESSAGE,
      }),
      role: Joi.string().valid(...Object.values(ROLE)),
      firstName: Joi.string()
        .pattern(ONLY_UNICODE_RULE)
        .message(ONLY_UNICODE_MESSAGE),
      lastName: Joi.string()
        .pattern(ONLY_UNICODE_RULE)
        .message(ONLY_UNICODE_MESSAGE),
    });

    try {
      await schema.validateAsync(req.body, { abortEarly: false });

      next();
    } catch (error) {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
    }
  },
};

module.exports = UserValidation;
