const { StatusCodes } = require("http-status-codes");
const ApartmentService = require("../../services/apartmentService");
const UserService = require("../../services/userService");

const AdminApartmentController = {
  createNew: async (req, res, next) => {
    try {
      const newApartment = await ApartmentService.createNew(req.body);

      return res.status(StatusCodes.CREATED).json(newApartment);
    } catch (error) {
      next(error);
    }
  },

  addUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { userId, status, startDate, endDate } = req.body;
      const apartment = await ApartmentService.addUser(id, userId, {
        status,
        startDate,
        endDate,
      });

      return res.status(StatusCodes.OK).json(apartment);
    } catch (error) {
      next(error);
    }
  },

  changeUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      const apartment = await ApartmentService.changeUser(id, userId);

      return res.status(StatusCodes.OK).json(apartment);
    } catch (error) {
      next(error);
    }
  },

  changeStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const apartment = await ApartmentService.changeStatus(id, req.body);

      return res.status(StatusCodes.OK).json(apartment);
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

  getMonthlySignedApt: async (req, res, next) => {
    try {
      const result = await ApartmentService.getMonthlySignedApt();

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  },

  getAptWithUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const apartment = await ApartmentService.getAptWithUser(id);

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

  getAllAvailable: async (req, res, next) => {
    try {
      const apartments = await ApartmentService.getAllAvailable();

      return res.status(StatusCodes.OK).json(apartments);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedApartment = await ApartmentService.update(id, req.body);

      return res.status(StatusCodes.OK).json(updatedApartment);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AdminApartmentController;
