const { StatusCodes } = require("http-status-codes");
const ContractService = require("../services/contractService");

const ContractController = {
  getAllForUser: async (req, res, next) => {
    try {
      const { userId } = req.payload;

      const result = await ContractService.getAllForUser(userId);

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  },

  getAptContracts: async (req, res, next) => {
    try {
      const { id: apartmentId } = req.params;
      const { userId } = req.payload;

      const result = await ContractService.getAptContractsForUser(
        apartmentId,
        userId
      );

      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ContractController;
