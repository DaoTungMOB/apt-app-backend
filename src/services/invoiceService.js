const { StatusCodes } = require("http-status-codes");
const InvoiceModel = require("../models/invoiceModel");
const UtilityModel = require("../models/utilityModel");
const ApiError = require("../utils/ApiError");
const UserModel = require("../models/userModel");
const dayjs = require("dayjs");
const UserService = require("./userService");
const ApartmentService = require("./apartmentService");

const InvoiceService = {
  create: async (utilityId, reqBody) => {
    const utility = await UtilityModel.findOne(utilityId);
    if (!utility) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No utility found");
    }

    const apartment = await ApartmentService.getById(utility.apartmentId);

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

    const invoiceExist = await InvoiceModel.getWithYearAndMonth(
      utilityId,
      apartment.userId,
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
      userId: apartment.userId,
    });

    return newInvoice;
  },

  get: async (invoiceId) => {
    const invoice = await InvoiceModel.getOne(invoiceId);

    return invoice;
  },

  getAll: async (utilityId) => {
    const invoices = await InvoiceModel.getAll(utilityId);

    return invoices;
  },

  getMonthlyPaidInvoices: async () => {
    const now = dayjs();
    const startOfMonth = now.startOf("month").valueOf();
    const endOfMonth = now.endOf("month").valueOf();

    const invoices = await InvoiceModel.getMonthlyInvoices(
      startOfMonth,
      endOfMonth
    );

    return invoices;
  },

  update: async (invoiceId, reqBody) => {
    const userExist = await UserModel.findOne(reqBody.userId);
    if (!userExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No user found");
    }

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

  pay: async (invoiceId) => {
    const now = dayjs();

    await InvoiceModel.update(invoiceId, {
      activatedAt: now.valueOf(),
      status: true,
    });
  },

  cancelPayment: async (invoiceId) => {
    const now = dayjs();

    await InvoiceModel.update(invoiceId, {
      activatedAt: null,
      status: false,
    });
  },
};

module.exports = InvoiceService;
