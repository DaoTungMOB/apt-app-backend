const { StatusCodes } = require("http-status-codes");
const InvoiceModel = require("../models/invoiceModel");
const UtilityModel = require("../models/utilityModel");
const ApiError = require("../utils/ApiError");

const InvoiceService = {
  create: async (utilityId, reqBody) => {
    let quantity = reqBody.quantity;
    if (reqBody.previousReading && reqBody.currentReading) {
      if (reqBody.currentReading >= reqBody.previousReading) {
        quantity = reqBody.currentReading - reqBody.previousReading;
      } else {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Current reading should be greater than previous reading"
        );
      }
    }

    const utility = await UtilityModel.findOne(utilityId);
    if (!utility) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No utility found");
    }

    const invoiceExist = await InvoiceModel.getWithYearAndMonth(
      utilityId,
      reqBody.year,
      reqBody.month
    );
    if (invoiceExist) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Invoice already exist for this month"
      );
    }

    const unitPrice = utility.price;

    const newInvoice = await InvoiceModel.create({
      ...reqBody,
      unitPrice: unitPrice,
      quantity,
      totalPrice: quantity * utility.price,
      utilityId,
    });

    return newInvoice;
  },

  getWithYearAndMonth: async (utilityId, year, month) => {
    const invoice = await InvoiceModel.getWithYearAndMonth(
      utilityId,
      year,
      month
    );
    if (!invoice) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No invoice found");
    }

    return invoice;
  },

  update: async (invoiceId, reqBody) => {
    const invoiceExist = await InvoiceModel.getOne(invoiceId);
    if (!invoiceExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No invoice found");
    }

    if (reqBody.utilityId) {
      const utility = await UtilityModel.findOne(reqBody.utilityId);
      reqBody.unitPrice = utility.price;
      if (!utility) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No utility found");
      }
    }

    // Kiểm tra nếu có thông số tiêu thụ trước và sau
    if (reqBody.previousReading || reqBody.currentReading) {
      const previousReading =
        reqBody.previousReading || invoiceExist.previousReading;
      const currentReading =
        reqBody.currentReading || invoiceExist.currentReading;

      if (currentReading > previousReading) {
        reqBody.quantity = currentReading - previousReading;
      } else {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Current reading should be greater than previous reading"
        );
      }
    }

    if (reqBody.quantity || reqBody.unitPrice) {
      const unitPrice = reqBody.unitPrice || invoiceExist.unitPrice;
      reqBody.totalPrice = reqBody.quantity * unitPrice;
    }

    const newInvoice = await InvoiceModel.update(invoiceId, {
      ...reqBody,
    });

    return newInvoice;
  },
};

module.exports = InvoiceService;
