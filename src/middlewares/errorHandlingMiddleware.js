const { StatusCodes } = require("http-status-codes")

const errorHandlingMiddleware = (err, req, res, next) => {

  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack
  }

  return res.status(responseError.statusCode).json(responseError)
}

module.exports = errorHandlingMiddleware
