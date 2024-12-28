const express = require("express");
const { isAuth, isAdmin } = require("../../../middlewares/auth");
const AdminUserController = require("../../../controllers/admin/adminUserController");
const UserValidation = require("../../../validations/userValidation");

const Router = express.Router();

Router.route("/:id")
  .get(isAuth, isAdmin, AdminUserController.getOne)
  .put(
    isAuth,
    isAdmin,
    UserValidation.updateOne,
    AdminUserController.updateOne
  );

Router.route("/").get(isAuth, isAdmin, AdminUserController.getAll);

module.exports = Router;
