const express = require("express");
const { isAuth, isAdmin } = require("../../../middlewares/auth");
const AdminUserController = require("../../../controllers/admin/adminUserController");

const Router = express.Router();

Router.route("/:id").get(isAuth, isAdmin, AdminUserController.getOne);

Router.route("/").get(isAuth, isAdmin, AdminUserController.getAll);

module.exports = Router;
