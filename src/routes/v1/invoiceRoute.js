const express = require("express");
const { isAuth } = require("../../middlewares/auth");
const UtilityController = require("../../controllers/utilityController");
const InvoiceController = require("../../controllers/invoiceController");

const Router = express.Router();

Router.get("/:id", isAuth, InvoiceController.get);

// TODO: get apartment's invoices history

module.exports = Router;
