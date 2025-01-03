const express = require("express");
const { isAuth, isAdmin } = require("../../../middlewares/auth");
const ApartmentController = require("../../../controllers/admin/adminApartmentController");
const AparmentValidation = require("../../../validations/apartmentValidation");

const Router = express.Router();

// /apartments/:apartmentId/users
Router.route("/:id/users").post(
  isAuth,
  isAdmin,
  AparmentValidation.addUser,
  ApartmentController.addUser
);

// /apartments/:apartmentId
Router.route("/:id")
  .get(isAuth, isAdmin, ApartmentController.getOne)
  .put(isAuth, isAdmin, AparmentValidation.update, ApartmentController.update);

// /apartments
Router.route("/")
  .post(
    isAuth,
    isAdmin,
    AparmentValidation.createNew,
    ApartmentController.createNew
  )
  .get(isAuth, isAdmin, ApartmentController.getAll);

module.exports = Router;
