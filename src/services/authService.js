const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");
const AuthUtil = require("../utils/auth");
const UserService = require("./userService");
const bcrypt = require("bcryptjs");
const { env } = require("../config/environment");
const UserModel = require("../models/userModel");

const accessTokenLife = "86400000";
const refreshTokenLife = "2592000000";

const AuthService = {
  register: async (reqBody) => {
    try {
      const newUser = {
        ...reqBody,
      };

      const existUser = await UserModel.fineOneByEmail(newUser?.email);
      if (existUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Email đã tồn tại");
      }

      const hash = bcrypt.hashSync(newUser.password, 12);
      newUser.password = hash;

      const createdUser = await UserModel.createNew(newUser);

      return createdUser;
    } catch (error) {
      throw error;
    }
  },
  login: async (reqBody) => {
    try {
      const { email, password } = reqBody;

      const existUser = await UserService.getByEmail(email);
      if (!existUser) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Email hoặc mật khẩu không chính xác!",
        );
      }

      const checkPass = bcrypt.compareSync(password, existUser.password);
      if (!checkPass) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Email hoặc mật khẩu không chính xác!",
        );
      }

      const accessToken = AuthUtil.generateToken(
        {
          email,
          role: existUser.role,
          firstName: existUser.firstName,
          lastName: existUser.lastName,
        },
        env.ACCESS_SECRET_KEY,
        accessTokenLife,
      );
      if (!accessToken) {
        console.log("Tạo mã thất bại");
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal server error",
        );
      }

      const refreshToken = AuthUtil.generateToken(
        {
          email,
        },
        env.REFRESH_SERCET_KEY,
        refreshTokenLife,
      );
      if (!refreshToken) {
        console.log("Tạo mã thất bại");
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal server error",
        );
      }

      return {
        accessToken,
        expiresIn: parseInt(accessTokenLife),
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      if (!refreshToken) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Thiếu tham số đầu vào");
      }

      const verifyRefreshToken = AuthUtil.verifyToken(
        refreshToken,
        env.REFRESH_SERCET_KEY,
      );

      if (!verifyRefreshToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Token không hợp lệ");
      }

      const existUser = await UserService.getByEmail(
        verifyRefreshToken?.payload?.email,
      );

      // Tạo mã
      const newAccessToken = AuthUtil.generateToken(
        {
          email: existUser.email,
          role: existUser.role,
          firstName: existUser.firstName,
          lastName: existUser.lastName,
        },
        env.ACCESS_SECRET_KEY,
        accessTokenLife,
      );
      if (!newAccessToken) {
        console.log("Tạo mã thất bại");
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal server error",
        );
      }

      const newRefreshToken = AuthUtil.generateToken(
        {
          email: existUser.email,
        },
        env.REFRESH_SERCET_KEY,
        refreshTokenLife,
      );
      if (!newRefreshToken) {
        console.log("Tạo mã thất bại");
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal server error",
        );
      }

      return {
        token: newAccessToken,
        expiresIn: parseInt(accessTokenLife),
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = AuthService;
