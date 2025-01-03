const { getDB } = require("../config/mongodb");
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");
const { ObjectId } = require("mongodb");
const { ROLE } = require("../utils/auth");

const USER_COLLECTION_NAME = "users";

const INVALID_UPDATE_FIELDS = ["_id", "password", "createdAt"];

const UserModel = {
  createNew: async (data) => {
    const fullData = {
      ...data,
      role: data.role || ROLE.USER,
      createdAt: Date.now(),
      updatedAt: null,
      deletedAt: null,
    };

    return await getDB().collection(USER_COLLECTION_NAME).insertOne(fullData);
  },

  findAll: async () => {
    const users = await getDB()
      .collection(USER_COLLECTION_NAME)
      .find({
        deletedAt: {
          $eq: null,
        },
      })
      .toArray();

    return users;
  },

  findAllDeleted: async () => {
    const users = await getDB()
      .collection(USER_COLLECTION_NAME)
      .find({
        deletedAt: {
          $ne: null,
        },
      })
      .toArray();

    return users;
  },

  findAllWithDeleted: async () => {
    const users = await getDB()
      .collection(USER_COLLECTION_NAME)
      .find()
      .toArray();

    return users;
  },

  findOne: async (id) => {
    const user = await getDB()
      .collection(USER_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
      });

    return user;
  },

  fineOneByEmail: async (email) => {
    const user = await getDB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ email: email });

    return user;
  },

  update: async (_id, updateData) => {
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
  },

  softDelete: async (id) => {
    await getDB()
      .collection(USER_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { deletedAt: Date.now() } }
      );
  },
};

module.exports = UserModel;
