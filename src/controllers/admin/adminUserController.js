const { StatusCodes } = require("http-status-codes");
const UserService = require("../../services/userService");
const ApartmentService = require("../../services/apartmentService");

const AdminUserController = {
  createNew: async (req, res, next) => {
    try {
      const newUser = await UserService.createNew(req.body);

      return res.status(StatusCodes.OK).json(newUser);
    } catch (error) {
      next(error);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await UserService.getById(id);

      return res.status(StatusCodes.OK).json(user);
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const users = await UserService.getAll();

      return res.status(StatusCodes.OK).json(users);
    } catch (error) {
      next(error);
    }
  },

  getApts: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userApts = await ApartmentService.getUserApts(id);

      return res.status(StatusCodes.OK).json(userApts);
    } catch (error) {
      next(error);
    }
  },

  updateOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedUser = await UserService.update(id, req.body);

      return res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },

  softDelete: async (req, res, next) => {
    try {
      const { id } = req.params;
      await UserService.softDelete(id);

      return res.status(StatusCodes.OK).json({
        message: "Deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AdminUserController;
