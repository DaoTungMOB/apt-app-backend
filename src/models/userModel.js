const Joi = require("joi");
const { getDB } = require("../config/mongodb");
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");

const USER_COLLECTION_NAME = "users";

const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

const UserModel = {
  createNew: async (data) => {
    try {
      const fullData = {
        ...data,
        role: "user",
        createdAt: Date.now(),
        updatedAt: null,
        deletedAt: null,
      };

      return await getDB().collection(USER_COLLECTION_NAME).insertOne(fullData);
    } catch (error) {
      throw error;
    }
  },

  getByEmail: async (email) => {
    try {
      const result = getDB()
        .collection(USER_COLLECTION_NAME)
        .findOne({ email: email });

      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = UserModel;
