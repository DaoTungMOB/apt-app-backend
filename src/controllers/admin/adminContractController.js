const { StatusCodes } = require("http-status-codes");
const ContractService = require("../../services/contractService");

const AdminContractController = {
  getAll: async (req, res, next) => {
    try {
      const { id: apartmentId } = req.params;
      const contracts = await ContractService.getAllApartmentContracts(
        apartmentId
      );

      return res.status(StatusCodes.OK).json(contracts);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AdminContractController;
