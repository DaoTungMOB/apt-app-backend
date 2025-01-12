const express = require("express");
const { isAuth, isAdmin } = require("../../../middlewares/auth");
const AdminUserController = require("../../../controllers/admin/adminUserController");
const UserValidation = require("../../../validations/userValidation");
const AdminContractController = require("../../../controllers/admin/adminContractController");

const Router = express.Router();

// users/:id/apartments
Router.route("/:id/apartments").get(
  isAuth,
  isAdmin,
  AdminUserController.getApts
);

// users/:id/contracts
Router.route("/:id/contracts").get(isAuth, isAdmin, AdminContractController.getUserContracts);

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
