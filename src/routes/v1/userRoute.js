const express = require('express')
const userController = require("../../controllers/userController")

const Router = express.Router()

Router.route('/')
  .post(userController.createNew)

module.exports = Router
