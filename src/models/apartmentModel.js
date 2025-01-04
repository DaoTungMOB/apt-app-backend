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
  },

  findAll: async () => {
    const apartments = await getDB()
      .collection(APARTMENT_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userProfile",
          },
        },
        {
          $unwind: {
            path: "$userProfile",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();

    return apartments;
  },

  findAllDeleted: async () => {
    const apartments = await getDB()
      .collection(APARTMENT_COLLECTION_NAME)
      .find({
        deletedAt: {
          $ne: null,
        },
      })
      .toArray();

    return apartments;
  },

  findAllWithDeleted: async () => {
    const apartments = await getDB()
      .collection(APARTMENT_COLLECTION_NAME)
      .find()
      .toArray();

    return apartments;
  },

  findOne: async (id) => {
    const apartment = await getDB()
      .collection(APARTMENT_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
      });

    return apartment;
  },

  update: async (_id, updateData, unsetData) => {
    INVALID_UPDATE_FIELDS.forEach((field) => {
      if (updateData.hasOwnProperty(field)) {
        delete updateData[field];
      }
    });
    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = Date.now();
    }

    let updateCommand = {
      $set: { ...updateData },
    };
    if (unsetData) {
      updateCommand = {
        ...updateCommand,
        $unset: { ...unsetData },
      };
    }

    const result = await getDB()
      .collection(APARTMENT_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(_id) }, updateCommand, {
        returnDocument: "after",
      });

    return result;
  },

  softDelete: async (id) => {
    await getDB()
      .collection(APARTMENT_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { deletedAt: Date.now() } }
      );
  },
};

module.exports = ApartmentModel;
