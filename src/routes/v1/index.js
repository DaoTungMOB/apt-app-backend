const express = require("express");
const { StatusCodes } = require("http-status-codes");
const UserRoute = require("./userRoute");
const ApartmentRoute = require("./apartmentRoute");
const UtilityRoute = require("./utilityRoute");
const InvoiceRoute = require("./invoiceRoute");
const AuthRoute = require("./authRoute");
const AdminRoute = require("./admin");

const Router = express.Router();

// Check APIs v1/status
Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({
    message: "APIs v1 are ready to use.",
  });
});

Router.use("/auth", AuthRoute);

Router.use("/admin", AdminRoute);

Router.use("/users", UserRoute);

Router.use("/apartments", ApartmentRoute);

Router.use("/utilities", UtilityRoute);

Router.use("/invoices", InvoiceRoute);

module.exports = Router;
