const express = require("express");
const { StatusCodes } = require("http-status-codes");
const UserRoute = require("./userRoute");
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

Router.use("/users", UserRoute);

Router.use("/admin", AdminRoute);

module.exports = Router;
