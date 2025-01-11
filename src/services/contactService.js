const { StatusCodes } = require("http-status-codes");
const ContactModel = require("../models/contactModel");
const UserModel = require("../models/userModel");
const ApiError = require("../utils/ApiError");

const ContactService = {
  create: async (userId, reqBody) => {
    const userEx = await UserModel.findOne(userId);
    if (!userEx) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
    }

    return await ContactModel.createNew({ ...reqBody, userId });
  },

  getAll: async () => {
    return await ContactModel.findAll();
  },

  updateOne: async (contactId, reqBody) => {
    if (reqBody.userId) {
      const existUser = await UserModel.findOne(reqBody.userId);
      if (!existUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
      }
    }
    return await ContactModel.updateOne(contactId, reqBody);
  },
};

module.exports = ContactService;
