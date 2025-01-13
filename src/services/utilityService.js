const { StatusCodes } = require("http-status-codes");
const UtilityModel = require("../models/utilityModel");
const { ROLE } = require("../utils/auth");
const ApartmentService = require("./apartmentService");
const ApiError = require("../utils/ApiError");
const InvoiceModel = require("../models/invoiceModel");
const { getLastMonthAndYearFor } = require("../utils/time");
const { ObjectId } = require("mongodb");

const UtilityService = {
  get: async (utilityId) => {
    const utility = await UtilityModel.findOne(utilityId);
    if (!utility) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Utility not found");
    }

    return utility;
  },

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

  getAptUtilities: async (apartmentId, reqData) => {
    const apartment = await ApartmentService.getById(apartmentId);
    if (reqData.role === ROLE.USER) {
      if (apartment.userId.toString() !== reqData.userId.toString()) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          "You are not allowed to access this resource"
        );
      }
    }

    const utilities = await UtilityModel.findAptUtilities(apartmentId);
    if (utilities.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No utilities found");
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
