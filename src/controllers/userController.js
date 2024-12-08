const { StatusCodes } = require("http-status-codes");
const UserService = require("../services/userService");

const UserController = {
  createNew: async (req, res, next) => {
    try {
      const createdUser = await UserService.createNew(req.body);

      return res.status(StatusCodes.CREATED).json(createdUser);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = UserController;
