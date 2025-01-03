const express = require("express");
const { isAuth, isAdmin } = require("../../../middlewares/auth");
const AdminUserController = require("../../../controllers/admin/adminUserController");
const UserValidation = require("../../../validations/userValidation");

const Router = express.Router();

// users/:id
Router.route("/:id")
  .get(isAuth, isAdmin, AdminUserController.getOne)
  .put(isAuth, isAdmin, UserValidation.updateOne, AdminUserController.updateOne)
  .delete(isAuth, isAdmin, AdminUserController.softDelete);

// users
Router.route("/")
  .post(
    isAuth,
    isAdmin,
    UserValidation.createNew,
    AdminUserController.createNew
  )
  .get(isAuth, isAdmin, AdminUserController.getAll);

module.exports = Router;
