const { ObjectId } = require("mongodb");
const { getDB } = require("../config/mongodb");
const { APARTMENT_STATUS } = require("../utils/apartment");
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");

const APARTMENT_COLLECTION_NAME = "apartments";
const UNAVAILABLE_STATUS = APARTMENT_STATUS.AVAILABLE;

const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

const ApartmentModel = {
  createNew: async (data) => {
    try {
      const fullData = {
        ...data,
        status: data.status || UNAVAILABLE_STATUS,
        createdAt: Date.now(),
        updatedAt: null,
        deletedAt: null,
      };

      return await getDB()
        .collection(APARTMENT_COLLECTION_NAME)
        .insertOne(fullData);
    } catch (error) {
      throw error;
    }
  },

  findAll: async () => {
    try {
      const apartments = await getDB()
        .collection(APARTMENT_COLLECTION_NAME)
        .find({
          deletedAt: {
            $eq: null,
          },
        })
        .toArray();

      return apartments;
    } catch (error) {
      throw error;
    }
  },

  findAllDeleted: async () => {
    try {
      const apartments = await getDB()
        .collection(APARTMENT_COLLECTION_NAME)
        .find({
          deletedAt: {
            $ne: null,
          },
        })
        .toArray();

      return apartments;
    } catch (error) {
      throw error;
    }
  },

  findAllWithDeleted: async () => {
    try {
      const apartments = await getDB()
        .collection(APARTMENT_COLLECTION_NAME)
        .find()
        .toArray();

      return apartments;
    } catch (error) {
      throw error;
    }
  },

  findOne: async (id) => {
    try {
      const apartment = await getDB()
        .collection(APARTMENT_COLLECTION_NAME)
        .findOne({
          _id: new ObjectId(id),
        });

      return apartment;
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
        .collection(APARTMENT_COLLECTION_NAME)
        .findOneAndUpdate(
          { _id: new ObjectId(_id) },
          {
            $set: { ...updateData },
          },
          {
            returnDocument: "after",
          }
        );

      return result;
    } catch (error) {
      throw error;
    }
  },

  softDelete: async (id) => {
    try {
      await getDB()
        .collection(APARTMENT_COLLECTION_NAME)
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: { deletedAt: Date.now() } }
        );
    } catch (error) {
      throw error;
    }
  },
};

module.exports = ApartmentModel;
