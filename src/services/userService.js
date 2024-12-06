const { StatusCodes } = require("http-status-codes")
const userModel = require("../models/userModel")
const ApiError = require("../utils/ApiError")

const userService = {
  createNew: async (reqBody) => {
    try {
      const newUser = {
        ...reqBody
      }

      const createdUser = await userModel.createNew(newUser)

      return createdUser
    } catch (error) {
      throw error
    }
  }
}

module.exports = userService
