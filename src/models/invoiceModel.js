const { ObjectId } = require("mongodb");
const { getDB } = require("../config/mongodb");

const INVOICE_COLLECTION_NAME = "invoices";

const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

const InvoiceModel = {
  create: async (data) => {
    const fullData = {
      ...data,
      utilityId: new ObjectId(data.utilityId),
      activatedAt: data.activatedAt || null,
      status: data.status || false,
      createdAt: Date.now(),
      updatedAt: null,
      deletedAt: null,
    };

    return await getDB()
      .collection(INVOICE_COLLECTION_NAME)
      .insertOne(fullData);
  },

  getWithYearAndMonth: async (utilityId, year, month) => {
    return await getDB()
      .collection(INVOICE_COLLECTION_NAME)
      .findOne({
        utilityId: new ObjectId(utilityId),
        year,
        month,
      });
  },
};

module.exports = InvoiceModel;
