const express = require("express");
const AdminContactController = require("../../../controllers/admin/adminContactController");
const ContactValidation = require("../../../validations/contactValidation");
const Router = express.Router();

Router.route("/").get(AdminContactController.getAll);

Router.route("/:id").get(AdminContactController.getOne).put(
  ContactValidation.update,
  AdminContactController.updateOne
);

module.exports = Router;
