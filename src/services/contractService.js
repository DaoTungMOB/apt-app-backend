const ContractModel = require("../models/contractModel");

const ContractService = {
  getAllApartmentContracts: async (apartmentId) => {
    return await ContractModel.findAll(apartmentId);
  },

  getAllForUser: async (userId) => {
    return await ContractModel.findAllForUser(userId);
  },

  getAptContractsForUser: async (apartmentId, userId) => {
    return await ContractModel.findAptContractsForUser(apartmentId, userId);
  },
};

module.exports = ContractService;
