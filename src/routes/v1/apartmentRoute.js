const express = require("express");
const { isAuth } = require("../../middlewares/auth");
const ApartmentController = require("../../controllers/apartmentController");

const Router = express.Router();

Router.get("/:id", isAuth, ApartmentController.getOne)

module.exports = Router;
