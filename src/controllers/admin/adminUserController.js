const { StatusCodes } = require("http-status-codes");
const UserService = require("../../services/userService");

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

  updateOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedUser = await UserService.update(id, req.body);

      return res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      await UserService.delete(id);

      return res.status(StatusCodes.OK).json({
        message: "Deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AdminUserController;
