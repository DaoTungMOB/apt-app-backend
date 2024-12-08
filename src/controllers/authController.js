const { StatusCodes } = require("http-status-codes");
const AuthService = require("../services/authService");
const AuthUtil = require("../utils/auth");

const AuthController = {
  register: async (req, res, next) => {
    try {
      const createdUser = await AuthService.register(req.body);

      return res.status(StatusCodes.CREATED).json(createdUser);
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const result = await AuthService.login(req.body);

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      const result = await AuthService.refreshToken(refreshToken);

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AuthController;
