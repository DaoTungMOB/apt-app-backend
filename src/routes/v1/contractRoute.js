const express = require("express");
const { isAuth } = require("../../middlewares/auth");
const ContractController = require("../../controllers/contractController");

const Router = express.Router();

Router.get("/", isAuth, ContractController.getAllForUser);

module.exports = Router;
