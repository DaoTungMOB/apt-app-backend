const express = require("express");
const { isAuth, isAdmin } = require("../../../middlewares/auth");
const ApartmentController = require("../../../controllers/admin/adminApartmentController");
const AparmentValidation = require("../../../validations/apartmentValidation");

const Router = express.Router();

Router.route("/:id").post(isAuth, isAdmin, ApartmentController.getOne);

Router.route("/")
  .post(
    isAuth,
    isAdmin,
    AparmentValidation.createNew,
    ApartmentController.createNew
  )
  .get(isAuth, isAdmin, ApartmentController.getAll);

module.exports = Router;
