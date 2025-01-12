const ContractModel = require("../models/contractModel");

const ContractService = {
  getAllApartmentContracts: async (apartmentId) => {
    return await ContractModel.findAll(apartmentId);
  },

  getAllForUser: async (apartmentId, userId) => {
    return await ContractModel.findAllForUser(apartmentId, userId);
  },
};

module.exports = ContractService;
