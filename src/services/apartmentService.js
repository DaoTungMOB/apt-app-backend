const { StatusCodes } = require("http-status-codes");
const ApartmentModel = require("../models/apartmentModel");
const UserModel = require("../models/userModel");

const APARTMENT_STATUS = {
  UNAVAILABLE: "unavailable",
  AVAILABLE: "available",
  RENTED: "rented",
  SOLD: "sold",
};

const ApartmentService = {
  createNew: async (reqBody) => {
    try {
      const newApartment = {
        ...reqBody,
      };

      if (newApartment.status === APARTMENT_STATUS.RENTED || newApartment.status === APARTMENT_STATUS.SOLD) {
        if (!newApartment.userId) {
          throw new ApiError(StatusCodes.BAD_REQUEST, "Thiếu dữ liệu của người thuê hoặc mua");
        } else {
          const existUser = await UserModel.findOne(newApartment?.userId);
          if (!existUser) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Tài khoản không tồn tại");
          }
        }
      }

      const createdApartment = await ApartmentModel.createNew(newApartment);

      return createdApartment;
    } catch (error) {
      throw error;
    }
  },

  getAll: async () => {
    try {
      const apartments = await ApartmentModel.findAll();
      if (!apartments) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No apartments found");
      }

      return apartments;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const apartment = await ApartmentModel.findOne(id);
      if (!apartment) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No apartment found");
      }

      return apartment;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = ApartmentService;
