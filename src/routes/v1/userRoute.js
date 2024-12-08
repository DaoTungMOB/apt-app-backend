const express = require("express");
const UserValidation = require("../../validations/userValidation");
const UserController = require("../../controllers/userController");

const Router = express.Router();

Router.route("/").post(UserValidation.createNew, UserController.createNew);

module.exports = Router;
