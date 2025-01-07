const express = require("express");
const { isAuth, isAdmin } = require("../../../middlewares/auth");
const AdminUtilityController = require("../../../controllers/admin/adminUtilityController");
const UtilityValidation = require("../../../validations/utilityValidation");
const AdminInvoiceController = require("../../../controllers/admin/adminInvoiceController");
const InvoiceValidation = require("../../../validations/invoiceValidation");
const Router = express.Router();

// /utilities/:id/invoice
Router.route("/:id/invoices")
  .post(
    isAuth,
    isAdmin,
    InvoiceValidation.create,
    AdminInvoiceController.create
  )
  .get(isAuth, isAdmin, AdminInvoiceController.getUtilityInvoices);

// /utilities/:id
Router.route("/:id").put(
  isAuth,
  isAdmin,
  UtilityValidation.update,
  AdminUtilityController.update
);

module.exports = Router;
