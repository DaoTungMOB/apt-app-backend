const express = require("express");
const { isAuth, isAdmin } = require("../../../middlewares/auth");
const ApartmentController = require("../../../controllers/admin/adminApartmentController");
const AparmentValidation = require("../../../validations/apartmentValidation");

const Router = express.Router();

Router.route("/").post(isAuth, isAdmin, AparmentValidation.createNew, ApartmentController.createNew);

module.exports = Router;
