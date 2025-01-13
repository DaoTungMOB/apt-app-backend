const { JsonWebTokenError } = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");
const { env } = require("../config/environment");
const { ROLE, verifyToken } = require("../utils/auth");

const AuthMiddleware = {
  isAuth: async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Missing token");
      }
      const accessToken = token.split(" ")[1];

      const verifiedToken = verifyToken(accessToken, env.ACCESS_SECRET_KEY);
      if (!verifiedToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
      }
      req.payload = verifiedToken.payload;

      next();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        next(new ApiError(StatusCodes.UNAUTHORIZED, error.message));
      }
      next(error);
    }
  },

  canResetPassword: async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Missing token");
      }
      const accessToken = token.split(" ")[1];

      const verifiedToken = verifyToken(accessToken, env.SEND_MAIL_ACCESS_KEY);
      if (!verifiedToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
      }
      req.payload = verifiedToken.payload;

      next();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        next(new ApiError(StatusCodes.UNAUTHORIZED, error.message));
      }
      next(error);
    }
  },

  isAdmin: async (req, res, next) => {
    try {
      if (req.payload.role !== ROLE.ADMIN) {
        next(
          new ApiError(
            StatusCodes.FORBIDDEN,
            "You do not have permission to access this resource!"
          )
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AuthMiddleware;
