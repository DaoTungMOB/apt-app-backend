const express = require("express");
const AdminUserRoute = require("./adminUserRoute");
const AdminApartmentRoute = require("./adminApartmentRoute");
const AdminUtilityRoute = require("./adminUtilityRoute");

const Router = express.Router();

Router.use("/users", AdminUserRoute);

Router.use("/apartments", AdminApartmentRoute);

Router.use("/utilities", AdminUtilityRoute);

module.exports = Router;
