const { StatusCodes } = require("http-status-codes");
const UserModel = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");

const UserService = {
  createNew: async (reqBody) => {
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
  },

  getAll: async () => {
    const users = await UserModel.findAll();
    if (!users) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No users found");
    }

    return users;
  },

  getById: async (id) => {
    const user = await UserModel.findOne(id);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
    }

    return user;
  },

  getByEmail: async (email) => {
    const existUser = await UserModel.fineOneByEmail(email);
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tài khoản không tồn tại");
    }

    return existUser;
  },

  update: async (id, reqBody) => {
    const updatedUser = await UserModel.update(id, reqBody);

    return updatedUser;
  },

  softDelete: async (id) => {
    const userExist = await UserModel.findOne(id);
    if (!userExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
    }

    await UserModel.softDelete(id);
  },
};

module.exports = UserService;
