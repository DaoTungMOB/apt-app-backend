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
};

module.exports = AdminUserController;
