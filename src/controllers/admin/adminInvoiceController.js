const { StatusCodes } = require("http-status-codes");
const InvoiceService = require("../../services/invoiceService");

const AdminInvoiceController = {
  create: async (req, res, next) => {
    try {
      const { id: utilityId } = req.params;

      const result = await InvoiceService.create(utilityId, req.body);

      return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AdminInvoiceController;
