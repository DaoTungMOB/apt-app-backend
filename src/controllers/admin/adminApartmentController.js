const { StatusCodes } = require("http-status-codes");
const ApartmentService = require("../../services/apartmentService");

const ApartmentController = {
  createNew: async (req, res, next) => {
    try {
      const newApartment = await ApartmentService.createNew(req.body);

      return res.status(StatusCodes.CREATED).json(newApartment);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ApartmentController;
