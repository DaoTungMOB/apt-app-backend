const express = require("express");
const { isAuth } = require("../../middlewares/auth");
const UtilityController = require("../../controllers/utilityController");

const Router = express.Router();

Router.get("/:id", isAuth, UtilityController.get);

module.exports = Router;
