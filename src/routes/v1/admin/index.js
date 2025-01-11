const express = require("express");
const AdminUserRoute = require("./adminUserRoute");
const AdminApartmentRoute = require("./adminApartmentRoute");
const AdminUtilityRoute = require("./adminUtilityRoute");
const AdminInvoiceRoute = require("./adminInvoiceRoute");
const AdminContactRoute = require("./adminContactRoute");
const { isAuth, isAdmin } = require("../../../middlewares/auth");

const Router = express.Router();

Router.use("/users", AdminUserRoute);

Router.use("/apartments", AdminApartmentRoute);

Router.use("/utilities", AdminUtilityRoute);

Router.use("/invoices", AdminInvoiceRoute);

Router.use("/contacts", isAuth, isAdmin, AdminContactRoute);

module.exports = Router;
