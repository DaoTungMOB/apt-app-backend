const { ObjectId } = require("mongodb");
const { getDB } = require("../config/mongodb");
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");

const CONTRACT_COLLECTION_NAME = "contracts";

const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

const ContractModel = {
  createNew: async (data, session) => {
    const fullData = {
      ...data,
      userId: new ObjectId(data.userId),
      apartmentId: new ObjectId(data.apartmentId),
      createdAt: Date.now(),
      updatedAt: null,
      deletedAt: null,
    };

    if (session) {
      return await getDB()
        .collection(CONTRACT_COLLECTION_NAME)
        .insertOne(fullData, session);
    } else {
      return await getDB()
        .collection(CONTRACT_COLLECTION_NAME)
        .insertOne(fullData);
    }
  },

  findLatestContract: async (apartmentId) => {
    return await getDB()
      .collection(CONTRACT_COLLECTION_NAME)
      .find({ apartmentId: new ObjectId(apartmentId) })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();
  },

  findAll: async (apartmentId) => {
    return await getDB()
      .collection(CONTRACT_COLLECTION_NAME)
      .aggregate([
        { $match: { apartmentId: new ObjectId(apartmentId) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userProfile",
          },
        },
        { $unwind: { path: "$userProfile", preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();
  },

  findAllUserContracts: async (userId) => {
    return await getDB()
      .collection(CONTRACT_COLLECTION_NAME)
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();
  },

  findAptContractsForUser: async (apartmentId, userId) => {
    return await getDB()
      .collection(CONTRACT_COLLECTION_NAME)
      .find({
        apartmentId: new ObjectId(apartmentId),
        userId: new ObjectId(userId),
      })
      .sort({ createdAt: -1 })
      .toArray();
  },

  findAllForUser: async (userId) => {
    return await getDB()
      .collection(CONTRACT_COLLECTION_NAME)
      .find({
        userId: new ObjectId(userId),
      })
      .sort({ createdAt: -1 })
      .toArray();
  },

  update: async (id, updateData, unsetData, session) => {
    INVALID_UPDATE_FIELDS.forEach((field) => {
      if (updateData.hasOwnProperty(field)) {
        delete updateData[field];
      }
    });
    if (updateData && Object.keys(updateData).length > 0) {
      updateData.updatedAt = Date.now();
    }

    let updateCommand = {
      $set: { ...updateData },
    };
    if (unsetData && Object.keys(unsetData).length > 0) {
      updateCommand = {
        ...updateCommand,
        $unset: { ...unsetData },
      };
    }

    if (session) {
      return await getDB()
        .collection(CONTRACT_COLLECTION_NAME)
        .updateOne({ _id: new ObjectId(id) }, updateCommand, { session });
    }
    return await getDB()
      .collection(CONTRACT_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(id) }, updateCommand);
  },
};

module.exports = ContractModel;
