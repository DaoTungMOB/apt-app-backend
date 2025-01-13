const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const AuthService = require("../services/authService");
const UserService = require("../services/userService");

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

  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;

      await AuthService.forgotPassword(email);

      return res.status(StatusCodes.OK).json({
        message: "OTP sent successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  verifyForgotPasswordOTP: async (req, res, next) => {
    try {
      const result = await AuthService.verifyForgotPasswordOTP(req.body);

      return res.status(StatusCodes.OK).json();
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { newPassword } = req.body;
      const { email } = req.payload;

      const user = await UserService.getByEmail(email);
      const hash = bcrypt.hashSync(newPassword, 12);

      await UserService.update(user._id, { password: hash });

      return res.status(StatusCodes.OK).json({
        message: "Password changed successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AuthController;
