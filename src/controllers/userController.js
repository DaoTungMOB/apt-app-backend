const { StatusCodes } = require("http-status-codes");
const UserService = require("../services/userService");
const ApartmentService = require("../services/apartmentService");

const UserController = {
  getProfile: async (req, res, next) => {
    try {
      const userId = req.payload.userId;
      console.log("userId", userId);
      const user = await UserService.getById(userId);

      return res.status(StatusCodes.OK).json(user);
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

  updateProfile: async (req, res, next) => {
    try {
      const userId = req.payload.userId;
      const updatedUser = await UserService.update(userId, req.body);

      return res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = UserController;
