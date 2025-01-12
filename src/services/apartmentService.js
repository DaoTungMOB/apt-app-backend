const { StatusCodes } = require("http-status-codes");
const ApartmentModel = require("../models/apartmentModel");
const UserModel = require("../models/userModel");
const { update } = require("./userService");
const ApiError = require("../utils/ApiError");
const dayjs = require("dayjs");
const { CONTRACT_STATUS } = require("../utils/contract");
const ContractModel = require("../models/contractModel");
const { getClientInstance } = require("../config/mongodb");

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

  addUser: async (apartmentId, userId, data) => {
    const client = getClientInstance();
    const session = client.startSession();
    session.startTransaction();

    try {
      const userExist = await UserModel.findOne(userId);
      if (!userExist) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
      }

      const apartmentExist = await ApartmentModel.findOne(apartmentId);
      if (!apartmentExist) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No apartment found");
      }
      if (apartmentExist.status !== APARTMENT_STATUS.AVAILABLE) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Apartment is not available to rent or buy"
        );
      }

      // update apartment
      const updatedApartment = await ApartmentModel.update(
        apartmentId,
        {
          userId: userExist._id,
          status: data.status,
        },
        {},
        session
      );

      // create contract
      await ContractModel.createNew({
        userId: userExist._id,
        apartmentId: updatedApartment._id,
        ...data,
        type: data.status,
        status: CONTRACT_STATUS.EFFECTIVE,
      });

      await session.commitTransaction();

      return updatedApartment;
    } catch (error) {
      await session.abortTransaction();
      console.log("Transaction aborted:", error);
      throw error;
    } finally {
      session.endSession();
    }
  },

  changeUser: async (apartmentId, data) => {
    const client = getClientInstance();
    const session = client.startSession();
    session.startTransaction();

    try {
      const apartmentExist = await ApartmentModel.findOne(apartmentId);
      if (!apartmentExist) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No apartment found");
      }

      const userExist = await UserModel.findOne(data.userId);
      if (!userExist) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
      }

      if (
        apartmentExist.status !== APARTMENT_STATUS.RENTED &&
        apartmentExist.status !== APARTMENT_STATUS.SOLD
      ) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Aparment is not rented or sold"
        );
      }

      const updatedApartment = await ApartmentModel.update(
        apartmentId,
        {
          userId: data.userId,
        },
        {},
        session
      );

      const latestContract = await ContractModel.getLatestContract(apartmentId);
      if (latestContract.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No contract found");
      }
      const now = new Date().getTime();

      await ContractModel.update(
        latestContract[0]._id,
        { actualEndDate: now, status: CONTRACT_STATUS.ENDED },
        {},
        session
      );

      await ContractModel.createNew(
        {
          userId: data.userId,
          apartmentId: apartmentId,
          type: latestContract[0].type,
          status: latestContract[0].status,
          startDate: now,
          endDate: data.endDate,
        },
        session
      );

      await session.commitTransaction();

      return updatedApartment;
    } catch (error) {
      await session.abortTransaction();
      console.log("Transaction aborted:", error);
      throw error;
    } finally {
      session.endSession();
    }
  },

  changeStatus: async (apartmentId, reqBody) => {
    const existApt = await ApartmentModel.findOne(apartmentId);
    if (!existApt) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No apartment found");
    }

    let updatedApartment;

    // Nếu status là rented hoặc sold thì kiểm tra user
    if (
      reqBody.status === APARTMENT_STATUS.RENTED ||
      reqBody.status === APARTMENT_STATUS.SOLD
    ) {
      const userExist = await UserModel.findOne(reqBody.userId);
      if (!userExist) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
      }

      updatedApartment = await ApartmentModel.update(apartmentId, {
        userId: userExist._id,
        status: reqBody.status,
      });
    } else {
      updatedApartment = await ApartmentModel.update(
        apartmentId,
        {
          status: reqBody.status,
        },
        { userId: null }
      );
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

  getMonthlySignedApt: async () => {
    const now = dayjs();
    const startOfMonth = now.startOf("month").valueOf();
    const endOfMonth = now.endOf("month").valueOf();

    const aptStatistics = await ApartmentModel.findMonthlySignedApt(
      startOfMonth,
      endOfMonth
    );
    if (!aptStatistics) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No statistics found");
    }

    return aptStatistics;
  },

  getAllAvailable: async (reqQuery) => {
    const { minSellPrice, maxSellPrice, minRentPrice, maxRentPrice } = reqQuery;
    let filter = {
      sellFilter: {},
      rentFilter: {},
    };

    // sell price
    if (minSellPrice) {
      filter.sellFilter = {
        ...filter.sellFilter,
        $gte: parseFloat(minSellPrice),
      };
    }
    if (maxSellPrice) {
      filter.sellFilter = {
        ...filter.sellFilter,
        $lte: parseFloat(maxSellPrice),
      };
    }

    // rent price
    if (minRentPrice) {
      filter.rentFilter = {
        ...filter.rentFilter,
        $gte: parseFloat(minRentPrice),
      };
    }
    if (maxRentPrice) {
      filter.rentFilter = {
        ...filter.rentFilter,
        $lte: parseFloat(maxRentPrice),
      };
    }

    const apartments = await ApartmentModel.findAllAvailableStatus(filter);
    if (!apartments) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No apartments found");
    }

    return apartments;
  },

  getUserApts: async (userId) => {
    const apts = await ApartmentModel.findByUserId(userId);

    return apts;
  },

  getById: async (id) => {
    const apartment = await ApartmentModel.findOne(id);
    if (!apartment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No apartment found");
    }

    return apartment;
  },

  getAptWithUser: async (apartmentId) => {
    const apartment = await ApartmentModel.findOne(apartmentId);
    if (!apartment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No apartment found");
    }
    const user = await UserModel.findOne(apartment.userId);
    if (user) {
      apartment.userProfile = user;
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
