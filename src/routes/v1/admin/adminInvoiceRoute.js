const express = require("express");
const { isAuth, isAdmin } = require("../../../middlewares/auth");
const InvoiceValidation = require("../../../validations/invoiceValidation");
const AdminInvoiceController = require("../../../controllers/admin/adminInvoiceController");
const Router = express.Router();

// /invoices/:id
Router.route("/:id")
  .put(isAuth, isAdmin, InvoiceValidation.update, AdminInvoiceController.update)
  .get(isAuth, isAdmin, AdminInvoiceController.get);

// TODO: get apartment's invoices history

module.exports = Router;
