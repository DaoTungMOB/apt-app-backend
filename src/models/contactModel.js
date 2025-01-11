const { ObjectId } = require("mongodb");
const { getDB } = require("../config/mongodb");
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");
const UserModel = require("./userModel");

const CONTACT_COLLECTION_NAME = "contacts";

const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

const ContactModel = {
  createNew: async (data) => {
    const fullData = {
      ...data,
      userId: new ObjectId(data.userId),
      createdAt: Date.now(),
      updatedAt: null,
      deletedAt: null,
    };

    return await getDB()
      .collection(CONTACT_COLLECTION_NAME)
      .insertOne(fullData);
  },

  findOne: async (contactId) => {
    return await getDB()
      .collection(CONTACT_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(contactId),
      });
  },

  findAll: async () => {
    return await getDB()
      .collection(CONTACT_COLLECTION_NAME)
      .find()
      .sort({ createdAt: -1 })
      .toArray();
  },

  updateOne: async (contactId, data) => {
    if (data.userId) {
      data.userId = new ObjectId(data.userId);
    }

    return await getDB()
      .collection(CONTACT_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(contactId) },
        { $set: data },
        { returnDocument: "after" }
      );
  },
};

module.exports = ContactModel;
