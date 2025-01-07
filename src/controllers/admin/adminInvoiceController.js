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

  get: async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await InvoiceService.get(id);

      return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  },

  getUtilityInvoices: async (req, res, next) => {
    try {
      const { id: utilityId } = req.params;

      const result = await InvoiceService.getAll(utilityId);

      return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await InvoiceService.update(id, req.body);

      return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AdminInvoiceController;
