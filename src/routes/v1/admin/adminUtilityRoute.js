const express = require("express");
const { isAuth, isAdmin } = require("../../../middlewares/auth");
const AdminUtilityController = require("../../../controllers/admin/adminUtilityController");
const UtilityValidation = require("../../../validations/utilityValidation");
const Router = express.Router();

Router.route("/:id").put(
  isAuth,
  isAdmin,
  UtilityValidation.update,
  AdminUtilityController.update
);

module.exports = Router;
