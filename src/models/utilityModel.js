const { ObjectId } = require("mongodb");
const { getDB } = require("../config/mongodb");

const UTILITY_COLLECTION_NAME = "utilities";

const UtilityModel = {
  createNew: async (data) => {
    const fullData = {
      ...data,
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

  update: async () => {
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

    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No utility found");
    }

    return result;
  },

  softDelete: async () => {
    await getDB()
      .collection(APARTMENT_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { deletedAt: Date.now() } }
      );
  },
};

module.exports = UtilityModel;
