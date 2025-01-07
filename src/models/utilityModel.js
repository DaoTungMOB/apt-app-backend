const { ObjectId } = require("mongodb");
const { getDB } = require("../config/mongodb");
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");

const UTILITY_COLLECTION_NAME = "utilities";

const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

const UtilityModel = {
  createNew: async (data) => {
    const fullData = {
      ...data,
      apartmentId: new ObjectId(data.apartmentId),
      createdAt: Date.now(),
      updatedAt: null,
      deletedAt: null,
    };

    return await getDB()
      .collection(UTILITY_COLLECTION_NAME)
      .insertOne(fullData);
  },

  findOne: async (id) => {
    return await getDB()
      .collection(UTILITY_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
  },

  findAptUtilities: async (apartmentId) => {
    const utilities = await getDB()
      .collection(UTILITY_COLLECTION_NAME)
      .find({
        apartmentId: new ObjectId(apartmentId),
        deletedAt: null,
      })
      .toArray();

    return utilities;
  },

  update: async (id, updateData) => {
    INVALID_UPDATE_FIELDS.forEach((field) => {
      if (updateData.hasOwnProperty(field)) {
        delete updateData[field];
      }
    });
    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = Date.now();
    }

    const result = await getDB()
      .collection(UTILITY_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: { ...updateData },
        },
        {
          returnDocument: "after",
        }
      );

    return result;
  },

  softDelete: async (id) => {
    await getDB()
      .collection(UTILITY_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { deletedAt: Date.now() } }
      );
  },
};

module.exports = UtilityModel;
