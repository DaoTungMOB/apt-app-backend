const { getDB } = require("../config/mongodb");
const { APARTMENT_STATUS } = require("../utils/apartment");

const APARTMENT_COLLECTION_NAME = "apartments";
const UNAVAILABLE_STATUS = APARTMENT_STATUS.AVAILABLE;

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
};

module.exports = ApartmentModel;
