const express = require("express");
const { isAuth, isAdmin } = require("../../../middlewares/auth");
const AdminUtilityController = require("../../../controllers/admin/adminUtilityController");
const UtilityValidation = require("../../../validations/utilityValidation");
const Router = express.Router();

Router.route("/")
  .post(
    isAuth,
    isAdmin,
    UtilityValidation.createNew,
    AdminUtilityController.createNew
  )
  // .get(isAuth, isAdmin);

module.exports = Router;
