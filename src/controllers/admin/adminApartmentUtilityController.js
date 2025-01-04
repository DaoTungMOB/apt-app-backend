const { StatusCodes } = require("http-status-codes");
const UtilityService = require("../../services/utilityService");

const AdminApartmentUtilityController = {
  createNew: async (req, res, next) => {
    try {
      const { id: apartmentId } = req.params;
      const result = await UtilityService.createNew(apartmentId, req.body);

      return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AdminApartmentUtilityController;
