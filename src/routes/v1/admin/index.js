const express = require("express");
const AdminUserRoute = require("./adminUserRoute");

const Router = express.Router();

Router.use("/users", AdminUserRoute);

module.exports = Router;
