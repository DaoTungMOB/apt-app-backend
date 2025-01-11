const express = require("express");
const { isAuth } = require("../../middlewares/auth");
const ContactController = require("../../controllers/contactController");
const ContactValidation = require("../../validations/contactValidation");

const Router = express.Router();

Router.post("/", isAuth, ContactValidation.create, ContactController.create);

module.exports = Router;
