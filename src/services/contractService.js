const { StatusCodes } = require("http-status-codes");
const ContractModel = require("../models/contractModel");
const UserModel = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const ApartmentService = require("./apartmentService");

const ContractService = {
  getAllApartmentContracts: async (apartmentId) => {
    const apartment = await ApartmentService.getById(apartmentId);
    if (!apartment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Apartment not found");
    }

    return await ContractModel.findAll(apartmentId);
  },

  getAllUserContracts: async (userId) => {
    const user = await UserModel.findOne(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const contracts = await ContractModel.findAllUserContracts(userId);

    return {
      user,
      contracts,
    };
  },

  getAllForUser: async (userId) => {
    const user = await UserModel.findOne(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const contracts = await ContractModel.findAllForUser(userId);

    return contracts;
  },

  getAptContractsForUser: async (apartmentId, userId) => {
    const user = await UserModel.findOne(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const apartment = await ContractModel.findOne(apartmentId);
    if (!apartment) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Apartment not found");
    }

    const contracts = await ContractModel.findAptContractsForUser(
      apartmentId,
      userId
    );

    return contracts;
  },
};

module.exports = ContractService;
