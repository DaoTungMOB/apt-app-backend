const { StatusCodes } = require("http-status-codes");
const UtilityModel = require("../models/utilityModel");
const { ROLE } = require("../utils/auth");
const ApartmentService = require("./apartmentService");
const ApiError = require("../utils/ApiError");
const InvoiceModel = require("../models/invoiceModel");
const { getLastMonthAndYearFor } = require("../utils/time");
const { ObjectId } = require("mongodb");

const UtilityService = {
  createNew: async (apartmentId, reqBody) => {
    const newUtility = await UtilityModel.createNew({
      ...reqBody,
      apartmentId,
    });

    return newUtility;
  },

  update: async (id, reqBody) => {
    const updatedUtility = await UtilityModel.update(id, reqBody);

    return updatedUtility;
  },

  get: async (utilityId, userId) => {
    const utility = await UtilityModel.findOne(utilityId);
    if (!utility) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Utility not found");
    }
    if (utility.userId !== userId) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "You are not allowed to access this resource"
      );
    }

    return utility;
  },

  getOneByAdmin: async (utilityId) => {
    const utility = await UtilityModel.findOne(utilityId);
    if (!utility) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Utility not found");
    }

    const latestInvoice = await InvoiceModel.getLatestOfUtility(utilityId);
    if (latestInvoice.length > 0) {
      utility.lastestInvoice = latestInvoice[0];
      utility.paid = true;
    } else {
      utility.paid = false;
    }

    return utility;
  },

  getAptUtilities: async (apartmentId, reqData) => {
    const apartment = await ApartmentService.getById(apartmentId);

    const utilities = await UtilityModel.findAptUtilities(apartmentId);
    if (utilities.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No utilities found");
    }

    if (reqData.role === ROLE.USER) {
      if (!apartment.userId) {
        return utilities;
      }

      if (apartment.userId.toString() !== reqData.userId.toString()) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          "You are not allowed to access this resource"
        );
      }
    }

    const { month, year } = getLastMonthAndYearFor();

    const invoices = await Promise.allSettled(
      utilities.map((item) =>
        InvoiceModel.getPaidWithYearAndMonth(
          apartment.userId,
          item._id,
          year,
          month
        )
      )
    );

    const resp = utilities.map((item, index) => {
      if (invoices[index].status === "fulfilled" && invoices[index].value) {
        item.lastestInvoice = invoices[index].value;
        item.paid = true;
      } else {
        item.paid = false;
      }

      return item;
    });

    return resp;
  },

  softDelete: async (id) => {
    await UtilityModel.softDelete(id);
  },

  restore: async (id) => {
    await UtilityModel.restore(id);
  },
};

module.exports = UtilityService;
