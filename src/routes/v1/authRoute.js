const express = require("express");
const AuthValidation = require("../../validations/authValidation");
const AuthController = require("../../controllers/authController");

const Router = express.Router();

Router.route("/register").post(
  AuthValidation.createNew,
  AuthController.register,
);

Router.route("/login").post(AuthValidation.login, AuthController.login);
Router.route("/refresh-token").post(AuthController.refreshToken);

module.exports = Router;
