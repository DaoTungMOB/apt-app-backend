class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)

    // custom name
    this.name = 'ApiError'

    this.statusCode = statusCode

    // Ghi lại Stack Trace
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = ApiError