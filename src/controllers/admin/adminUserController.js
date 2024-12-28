const { StatusCodes } = require("http-status-codes");
const UserService = require("../../services/userService");

const AdminUserController = {
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

  updateOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedUser = await UserService.updateOne(id, req.body);

      return res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AdminUserController;
