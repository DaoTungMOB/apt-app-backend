const express = require("express");
const { isAuth, isAdmin } = require("../../../middlewares/auth");
const InvoiceValidation = require("../../../validations/invoiceValidation");
const AdminInvoiceController = require("../../../controllers/admin/adminInvoiceController");
const Router = express.Router();

// /invoices/:id/cancal-payment
Router.route("/:id/cancel-payment").put(isAuth, isAdmin, AdminInvoiceController.cancelPayment);

// /invoices/:id/payment
Router.route("/:id/payment").put(isAuth, isAdmin, AdminInvoiceController.pay);

// /invoices/:id
Router.route("/:id")
  .put(isAuth, isAdmin, InvoiceValidation.update, AdminInvoiceController.update)
  .get(isAuth, isAdmin, AdminInvoiceController.get);

module.exports = Router;
