const express = require("express");
const { isAuth } = require("../../middlewares/auth");
const UserController = require("../../controllers/userController");
const UserValidation = require("../../validations/userValidation");
const ApartmentController = require("../../controllers/apartmentController");

const Router = express.Router();

// TODO: add change pass, forgot pass, update profile
Router.get("/profile", isAuth, UserController.getProfile);
Router.put(
  "/profile",
  isAuth,
  UserValidation.updateProfile,
  UserController.updateProfile
);

Router.get("/apartments", isAuth, ApartmentController.getUserApts);

module.exports = Router;
