const Joi = require("joi");
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");
const { APARTMENT_STATUS } = require("../utils/apartment");
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require("../utils/validators");

const AparmentValidation = {
  createNew: async (req, res, next) => {
    try {
      const schema = Joi.object({
        userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        code: Joi.string().required(),
        thumbnail: Joi.string(),
        floorNumber: Joi.number().required(),
        area: Joi.number().required(),
        rentPrice: Joi.number().required(),
        sellPrice: Joi.number().required(),
        status: Joi.string().valid(...Object.values(APARTMENT_STATUS)),
      });

      await schema.validateAsync(req.body, { abortEarly: false });

      next();
    } catch (error) {
      next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
    }
  },
};

module.exports = AparmentValidation;
