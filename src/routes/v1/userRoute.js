const express = require("express");
const { isAuth } = require("../../middlewares/auth");
const UserController = require("../../controllers/userController");
const UserValidation = require("../../validations/userValidation");

const Router = express.Router();

Router.get("/profile", isAuth, UserController.getProfile);
Router.put(
  "/profile",
  isAuth,
  UserValidation.updateProfile,
  UserController.updateProfile
);

module.exports = Router;
