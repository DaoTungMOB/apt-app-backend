const { StatusCodes } = require("http-status-codes");
const UserService = require("../services/userService");

const UserController = {
  getProfile: async (req, res, next) => {
    try {
      const userId = req.payload.userId;
      const user = await UserService.getById(userId);

      return res.status(StatusCodes.OK).json(user);
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const userId = req.payload.userId;
      const updatedUser = await UserService.update(userId, req.body);

      return res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const userId = req.payload.userId;
      const result = await UserService.changeUserPassword(userId, req.body);

      return res
        .status(StatusCodes.OK)
        .json({ message: "Password changed successfully" });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = UserController;
