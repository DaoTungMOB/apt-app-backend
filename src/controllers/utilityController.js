const { StatusCodes } = require("http-status-codes");
const UtilityService = require("../services/utilityService");

const UtilityController = {
  get: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { userId } = req.payload;

      const utility = await UtilityService.get(id, userId);

      return res.status(StatusCodes.OK).json(utility);
    } catch (error) {
      next(error);
    }
  },

  getAptUtilities: async (req, res, next) => {
    try {
      const { id: apartmentId } = req.params;
      const { userId, role } = req.payload;
      console.log(userId);
      console.log(role);

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
