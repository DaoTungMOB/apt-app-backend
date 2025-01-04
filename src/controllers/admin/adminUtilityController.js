const { StatusCodes } = require("http-status-codes");
const UtilityService = require("../../services/utilityService");

const AdminUtilityController = {
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await UtilityService.update(id, req.body);

      return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AdminUtilityController;
