const express = require("express");
const { isAuth } = require("../../middlewares/auth");
const UserController = require("../../controllers/userController");
const UserValidation = require("../../validations/userValidation");
const ApartmentController = require("../../controllers/apartmentController");

const Router = express.Router();

// TODO: forgot pass
Router.get("/profile", isAuth, UserController.getProfile);
Router.put(
  "/profile",
  isAuth,
  UserValidation.updateProfile,
  UserController.updateProfile
);

Router.put(
  "/change-password",
  isAuth,
  UserValidation.changePassword,
  UserController.changePassword
);

Router.get("/apartments", isAuth, ApartmentController.getUserApts);

module.exports = Router;
