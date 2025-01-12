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
};

module.exports = ContractModel;
