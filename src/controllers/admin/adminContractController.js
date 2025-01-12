const { StatusCodes } = require("http-status-codes");
const ContractService = require("../../services/contractService");

const AdminContractController = {
  getAptContracts: async (req, res, next) => {
    try {
      const { id: apartmentId } = req.params;
      const result = await ContractService.getAllApartmentContracts(
        apartmentId
      );

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  },

  getUserContracts: async (req, res, next) => {
    try {
      const { id: userId } = req.params;
      const result = await ContractService.getAllUserContracts(userId);

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AdminContractController;
