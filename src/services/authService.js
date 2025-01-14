const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");
const UserService = require("./userService");
const bcrypt = require("bcryptjs");
const { env } = require("../config/environment");
const UserModel = require("../models/userModel");
const { generateToken, verifyToken, ROLE } = require("../utils/auth");
const { generateOTP, forgotPassOtpHtml } = require("../utils/mail");
const { getTransporter } = require("../config/mail");
const { sendMail } = require("./mailService");

const accessTokenLife = "86400000";
const refreshTokenLife = "2592000000";

const AuthService = {
  register: async (reqBody) => {
    try {
      const newUser = {
        ...reqBody,
        role: ROLE.USER,
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
          "Email hoặc mật khẩu không chính xác!"
        );
      }

      const checkPass = bcrypt.compareSync(password, existUser.password);
      if (!checkPass) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Email hoặc mật khẩu không chính xác!"
        );
      }

      const accessToken = generateToken(
        {
          userId: existUser._id,
          role: existUser.role,
          firstName: existUser.firstName,
          lastName: existUser.lastName,
        },
        env.ACCESS_SECRET_KEY,
        accessTokenLife
      );
      if (!accessToken) {
        console.log("Tạo mã thất bại");
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal server error"
        );
      }

      const refreshToken = generateToken(
        {
          userId: existUser._id,
        },
        env.REFRESH_SERCET_KEY,
        refreshTokenLife
      );
      if (!refreshToken) {
        console.log("Tạo mã thất bại");
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal server error"
        );
      }

      return {
        accessToken,
        expiresIn: parseInt(accessTokenLife),
        refreshToken,
        userProlile: existUser,
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

      const verifyRefreshToken = verifyToken(
        refreshToken,
        env.REFRESH_SERCET_KEY
      );

      if (!verifyRefreshToken || typeof verifyRefreshToken === "string") {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Token không hợp lệ");
      }

      const existUser = await UserService.getByEmail(
        verifyRefreshToken?.payload?.email
      );

      // Tạo mã
      const newAccessToken = generateToken(
        {
          userId: existUser._id,
          role: existUser.role,
          firstName: existUser.firstName,
          lastName: existUser.lastName,
        },
        env.ACCESS_SECRET_KEY,
        accessTokenLife
      );
      if (!newAccessToken) {
        console.log("Tạo mã thất bại");
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal server error"
        );
      }

      const newRefreshToken = generateToken(
        {
          userId: existUser._id,
        },
        env.REFRESH_SERCET_KEY,
        refreshTokenLife
      );
      if (!newRefreshToken) {
        console.log("Tạo mã thất bại");
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal server error"
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

  forgotPassword: async (email) => {
    const existUser = await UserModel.fineOneByEmail(email);
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tài khoản không tồn tại");
    }

    const otp = generateOTP();
    const transporter = getTransporter();
    let mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Forgot password",
      html: forgotPassOtpHtml(otp),
    };

    let [info, updatedUser] = await Promise.all([
      sendMail(transporter, mailOptions),
      UserModel.update(existUser._id, {
        otp: otp,
        otpExpiresAt: Date.now() + 1000 * 60 * 5,
      }),
    ]);
  },

  verifyForgotPasswordOTP: async (reqBody) => {
    const { email, otp } = reqBody;

    const existUser = await UserService.getByEmail(email);
    if (otp !== existUser.otp) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid OTP");
    }

    if (Date.now() > existUser.otpExpiresAt) {
      await UserModel.update(existUser._id, { otp: null, otpExpiresAt: null });
      throw new ApiError(StatusCodes.BAD_REQUEST, "OTP has expired");
    }

    const token = generateToken(
      {
        email: existUser.email,
      },
      env.SEND_MAIL_ACCESS_KEY,
      "1h"
    );
    await UserModel.update(existUser._id, { otp: null, otpExpiresAt: null });

    return {
      message: "OTP verified successfully",
      canResetPassword: true,
      token,
    };
  },
};

module.exports = AuthService;
