const { StatusCodes } = require("http-status-codes");
const ApartmentService = require("../services/apartmentService");
const UtilityService = require("../services/utilityService");

const UtilityController = {
  get: async (req, res, next) => {
    try {
      const { id } = req.params;

      const utility = await UtilityService.get(id);

      return res.status(StatusCodes.OK).json(utility);
    } catch (error) {
      next(error);
    }
  },

  getAptUtilities: async (req, res, next) => {
    try {
      const { id: apartmentId } = req.params;
      const { userId, role } = req.payload;

      const result = await UtilityService.getAptUtilities(apartmentId, {
        userId,
        role,
      });

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = UtilityController;
