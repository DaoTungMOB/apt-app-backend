const express = require("express");
const AdminApartmentController = require("../../../controllers/admin/adminApartmentController");
const AdminInvoiceController = require("../../../controllers/admin/adminInvoiceController");

const Router = express.Router();

// /apartments
Router.get(
  "/monthly-signed-statistics",
  AdminApartmentController.getMonthlySignedApt
);

// invoices
Router.get(
  "/monthly-paid-invoices",
  AdminInvoiceController.getMonthlyPaidInvoices
);

module.exports = Router;
