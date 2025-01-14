const express = require("express");
const AuthValidation = require("../../validations/authValidation");
const AuthController = require("../../controllers/authController");
const { canResetPassword } = require("../../middlewares/auth");
const AuthMiddleware = require("../../middlewares/auth");

const Router = express.Router();

Router.route("/register").post(
  AuthValidation.createNew,
  AuthController.register
);

Router.route("/login").post(AuthValidation.login, AuthController.login);
Router.route("/refresh-token").post(AuthController.refreshToken);
Router.route("/forgot-password").post(
  AuthValidation.forgotPassword,
  AuthController.forgotPassword
);
Router.route("/verify-forgot-password").post(
  AuthValidation.verifyForgotPassword,
  AuthController.verifyForgotPasswordOTP
);
Router.route("/reset-password").post(
  canResetPassword,
  AuthMiddleware.canResetPassword,
  AuthValidation.resetPassword,
  AuthController.resetPassword
);

module.exports = Router;
