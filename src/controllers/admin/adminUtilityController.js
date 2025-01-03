const { StatusCodes } = require("http-status-codes");
const UtilityService = require("../../services/utilityService");

const AdminUtilityController = {
  createNew: async (req, res, next) => {
    try {
      const result = await UtilityService.createNew(req.body);

      return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AdminUtilityController;
