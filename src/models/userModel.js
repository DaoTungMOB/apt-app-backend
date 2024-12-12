const Joi = require("joi");
const { getDB } = require("../config/mongodb");
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");
const { ObjectId } = require("mongodb");

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

  findAll: async () => {
    try {
      const users = await getDB()
        .collection(USER_COLLECTION_NAME)
        .find()
        .toArray();

      return users;
    } catch (error) {
      throw error;
    }
  },

  findOne: async (id) => {
    try {
      const user = await getDB()
        .collection(USER_COLLECTION_NAME)
        .findOne({
          _id: new ObjectId(id),
        });

      return user;
    } catch (error) {
      throw error;
    }
  },

  fineOneByEmail: async (email) => {
    try {
      const user = getDB()
        .collection(USER_COLLECTION_NAME)
        .findOne({ email: email });

      return user;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = UserModel;
