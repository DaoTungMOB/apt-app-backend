const { StatusCodes } = require("http-status-codes");
const UserModel = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");

const UserService = {
  createNew: async (reqBody) => {
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

  getAll: async () => {
    try {
      const users = await UserModel.findAll();
      if (!users) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No users found");
      }

      return users;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const user = await UserModel.findOne(id);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
      }

      return user;
    } catch (error) {
      throw error;
    }
  },

  getByEmail: async (email) => {
    try {
      const existUser = await UserModel.fineOneByEmail(email);
      if (!existUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Tài khoản không tồn tại");
      }

      return existUser;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, reqBody) => {
    try {
      const updatedUser = await UserModel.update(id, reqBody);

      return updatedUser;
    } catch (error) {
      throw error;
    }
  },

  softDelete: async (id) => {
    try {
      const userExist = await UserModel.findOne(id);
      if (!userExist) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
      }

      await UserModel.softDelete(id);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = UserService;
