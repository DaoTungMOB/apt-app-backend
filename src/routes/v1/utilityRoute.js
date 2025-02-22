const express = require("express");
const { isAuth } = require("../../middlewares/auth");
const UtilityController = require("../../controllers/utilityController");
const InvoiceController = require("../../controllers/invoiceController");

const Router = express.Router();

Router.get("/:id/invoices", isAuth, InvoiceController.getUtilityInvoices);

Router.get("/:id", isAuth, UtilityController.get);

module.exports = Router;
