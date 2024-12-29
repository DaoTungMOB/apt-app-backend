const { getDB } = require("../config/mongodb");
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");
const { ObjectId } = require("mongodb");

const USER_COLLECTION_NAME = "users";

const INVALID_UPDATE_FIELDS = ["_id", "password", "createdAt"];

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
        .find({
          deletedAt: {
            $eq: null,
          },
        })
        .toArray();

      return users;
    } catch (error) {
      throw error;
    }
  },

  findAllDeleted: async () => {
    try {
      const users = await getDB()
        .collection(USER_COLLECTION_NAME)
        .find({
          deletedAt: {
            $ne: null,
          },
        })
        .toArray();

      return users;
    } catch (error) {
      throw error;
    }
  },

  findAllWithDeleted: async () => {
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
      const user = await getDB()
        .collection(USER_COLLECTION_NAME)
        .findOne({ email: email });

      return user;
    } catch (error) {
      throw error;
    }
  },

  update: async (_id, updateData) => {
    try {
      INVALID_UPDATE_FIELDS.forEach((field) => {
        if (updateData.hasOwnProperty(field)) {
          delete updateData[field];
        }
      });
      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = Date.now();
      }

      const result = await getDB()
        .collection(USER_COLLECTION_NAME)
        .findOneAndUpdate(
          { _id: new ObjectId(_id) },
          {
            $set: { ...updateData },
          },
          {
            returnDocument: "after",
          }
        );

      if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
      }

      return result;
    } catch (error) {
      throw error;
    }
  },

  softDelete: async (id) => {
    try {
      await getDB()
        .collection(USER_COLLECTION_NAME)
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: { deletedAt: Date.now() } }
        );
    } catch (error) {
      throw error;
    }
  },
};

module.exports = UserModel;
