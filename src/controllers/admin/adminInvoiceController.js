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

  getMonthlyPaidInvoices: async (req, res, next) => {
    try {
      const result = await InvoiceService.getMonthlyPaidInvoices();

      return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  },

  pay: async (req, res, next) => {
    try {
      const { id: invoiceId } = req.params;

      await InvoiceService.pay(invoiceId);

      return res.status(StatusCodes.CREATED).json({
        message: "Invoice paid successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  cancelPayment: async (req, res, next) => {
    try {
      const { id: invoiceId } = req.params;

      await InvoiceService.cancelPayment(invoiceId);

      return res.status(StatusCodes.CREATED).json({
        message: "Invoice cancel payment successfully",
      });
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
