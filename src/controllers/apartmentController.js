const { StatusCodes } = require("http-status-codes");
const ApartmentService = require("../services/apartmentService");

const ApartmentController = {
  getOne: async (req, res, next) => {
    try {
      const { id } = req.params;

      const apartment = await ApartmentService.getById(id);

      return res.status(StatusCodes.OK).json(apartment);
    } catch (error) {
      next(error);
    }
  },

  getUserApts: async (req, res, next) => {
    try {
      const userId = req.payload.userId;
      const result = await ApartmentService.getUserApts(userId);

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ApartmentController;
