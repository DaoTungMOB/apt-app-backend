const express = require("express");
const { isAuth } = require("../../middlewares/auth");
const ApartmentController = require("../../controllers/apartmentController");
const UtilityController = require("../../controllers/utilityController");
const ContractController = require("../../controllers/contractController");

const Router = express.Router();

Router.get("/:id/utilities", isAuth, UtilityController.getAptUtilities);

Router.get("/:id/contracts", isAuth, ContractController.getAptContracts);

Router.get("/:id", isAuth, ApartmentController.getOne);

Router.get("/", isAuth, ApartmentController.getAllAvailable);

module.exports = Router;
