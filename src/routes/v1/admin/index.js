const express = require("express");
const AdminUserRoute = require("./adminUserRoute");
const AdminApartmentRoute = require("./adminApartmentRoute");

const Router = express.Router();

Router.use("/users", AdminUserRoute);

Router.use("/apartments", AdminApartmentRoute);

module.exports = Router;
