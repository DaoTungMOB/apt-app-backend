const { StatusCodes } = require("http-status-codes");
const InvoiceModel = require("../models/invoiceModel");
const UtilityModel = require("../models/utilityModel");
const ApiError = require("../utils/ApiError");

const InvoiceService = {
  create: async (utilityId, reqBody) => {
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
    let quantity = reqBody.quantity;
    if (
      reqBody.previousReading &&
      reqBody.currentReading &&
      reqBody.currentReading > reqBody.previousReading
    ) {
      quantity = reqBody.currentReading - reqBody.previousReading;
    }

    const newInvoice = await InvoiceModel.create({
      ...reqBody,
      unitPrice: unitPrice,
      quantity,
      totalPrice: quantity * utility.price,
      utilityId,
    });

    return newInvoice;
  },
};

module.exports = InvoiceService;
