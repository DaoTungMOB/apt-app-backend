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

  getOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const apartment = await ApartmentService.getById(id);

      return res.status(StatusCodes.OK).json(apartment);
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const apartments = await ApartmentService.getAll();

      return res.status(StatusCodes.OK).json(apartments);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ApartmentController;
