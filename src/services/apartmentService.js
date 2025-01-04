const { StatusCodes } = require("http-status-codes");
const ApartmentModel = require("../models/apartmentModel");
const UserModel = require("../models/userModel");
const { update } = require("./userService");
const ApiError = require("../utils/ApiError");

const APARTMENT_STATUS = {
  UNAVAILABLE: "unavailable",
  AVAILABLE: "available",
  RENTED: "rented",
  SOLD: "sold",
};

const ApartmentService = {
  createNew: async (reqBody) => {
    const newApartment = {
      ...reqBody,
    };

    if (
      newApartment.status === APARTMENT_STATUS.RENTED ||
      newApartment.status === APARTMENT_STATUS.SOLD
    ) {
      if (!newApartment.userId) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Thiếu dữ liệu của người thuê hoặc mua"
        );
      } else {
        const existUser = await UserModel.findOne(newApartment?.userId);
        if (!existUser) {
          throw new ApiError(StatusCodes.NOT_FOUND, "Tài khoản không tồn tại");
        }
      }
    }

    const createdApartment = await ApartmentModel.createNew(newApartment);

    return createdApartment;
  },

  addUser: async (apartmentId, userId, status) => {
    const userExist = await UserModel.findOne(userId);
    if (!userExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
    }

    const apartmentExist = await ApartmentModel.findOne(apartmentId);
    if (apartmentExist.status !== APARTMENT_STATUS.AVAILABLE) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Apartment is not available to rent or buy"
      );
    }

    const updatedApartment = await ApartmentModel.update(apartmentId, {
      userId: userExist._id,
      status,
    });
    if (!updatedApartment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No apartment found");
    }

    return updatedApartment;
  },

  changeUser: async (apartmentId, userId) => {
    const userExist = await UserModel.findOne(userId);
    if (!userExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
    }

    const apartmentExist = await ApartmentModel.findOne(apartmentId);
    if (
      apartmentExist.status !== APARTMENT_STATUS.RENTED &&
      apartmentExist.status !== APARTMENT_STATUS.SOLD
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Aparment is not rented or sold"
      );
    }

    const updatedApartment = await ApartmentModel.update(apartmentId, {
      userId: userExist._id,
    });
    if (!updatedApartment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No apartment found");
    }

    return updatedApartment;
  },

  getAll: async () => {
    const apartments = await ApartmentModel.findAll();
    if (!apartments) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No apartments found");
    }

    return apartments;
  },

  getById: async (id) => {
    const apartment = await ApartmentModel.findOne(id);
    if (!apartment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No apartment found");
    }

    return apartment;
  },

  update: async (id, reqBody) => {
    const updatedApartment = await ApartmentModel.update(id, reqBody);

    if (!updatedApartment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No apartment found");
    }

    return updatedApartment;
  },
};

module.exports = ApartmentService;
