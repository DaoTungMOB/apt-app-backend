const { StatusCodes } = require("http-status-codes");
const InvoiceService = require("../services/invoiceService");

const InvoiceController = {
  get: async (req, res, next) => {
    try {
      const { id: invoiceId } = req.params;

      const invoices = await InvoiceService.get(invoiceId);

      return res.status(StatusCodes.OK).json(invoices);
    } catch (error) {
      next(error);
    }
  },

  getUtilityInvoices: async (req, res, next) => {
    try {
      const { id: utilityId } = req.params;

      const invoices = await InvoiceService.getAll(utilityId);

      return res.status(StatusCodes.OK).json(invoices);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = InvoiceController;