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

  findAllAvailableStatus: async (filter) => {
    let command = {
      status: APARTMENT_STATUS.AVAILABLE,
    };
    console.log("filter", filter);

    if (Object.keys(filter.sellFilter).length > 0) {
      command = {
        ...command,
        sellPrice: filter.sellFilter,
      };
    }

    if (Object.keys(filter.rentFilter).length > 0) {
      command = {
        ...command,
        rentPrice: filter.rentFilter,
      };
    }

    console.log("command", command);

    return await getDB()
      .collection(APARTMENT_COLLECTION_NAME)
      .find(command)
      .toArray();
  },

  findByUserId: async (userId) => {
    const apartments = await getDB()
      .collection(APARTMENT_COLLECTION_NAME)
      .find({
        userId: new ObjectId(userId),
      })
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

  findMonthlySignedApt: async (startTime, endTime) => {
    return await getDB()
      .collection(APARTMENT_COLLECTION_NAME)
      .find({
        startOfTenancy: {
          $gte: startTime,
          $lte: endTime,
        },
      })
      .toArray();
  },

  findOne: async (id) => {
    const apartment = await getDB()
      .collection(APARTMENT_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
      });

    return apartment;
  },

  update: async (_id, updateData, unsetData, session) => {
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
    if (Object.keys(unsetData).length > 0) {
      updateCommand = {
        ...updateCommand,
        $unset: { ...unsetData },
      };
    }
    let result;
    if (session) {
      result = await getDB()
        .collection(APARTMENT_COLLECTION_NAME)
        .findOneAndUpdate({ _id: new ObjectId(_id) }, updateCommand, {
          session,
          returnDocument: "after",
        });
    } else {
      result = await getDB()
        .collection(APARTMENT_COLLECTION_NAME)
        .findOneAndUpdate({ _id: new ObjectId(_id) }, updateCommand, {
          returnDocument: "after",
        });
    }

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
