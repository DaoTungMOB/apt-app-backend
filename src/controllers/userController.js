const { StatusCodes } = require("http-status-codes")
const userService = require("../services/userService")

const userController = {
  createNew: async (req, res, next) => {
    try {
      const createdUser = await userService.createNew(req.body)

      return res.status(StatusCodes.CREATED).json(createdUser)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
