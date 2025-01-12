const ContractModel = require("../models/contractModel");

const ContractService = {
  getAllApartmentContracts: async (apartmentId) => {
    return await ContractModel.findAll(apartmentId);
  },
};

module.exports = ContractService;
