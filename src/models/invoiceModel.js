const { ObjectId } = require("mongodb");
const { getDB } = require("../config/mongodb");

const INVOICE_COLLECTION_NAME = "invoices";

const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

const InvoiceModel = {
  create: async (data) => {
    const fullData = {
      ...data,
      utilityId: new ObjectId(data.utilityId),
      userId: new ObjectId(data.userId),
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

  getAll: async (utilityId) => {
    return await getDB()
      .collection(INVOICE_COLLECTION_NAME)
      .find({
        utilityId: new ObjectId(utilityId),
      })
      .sort({ year: -1, month: -1 })
      .toArray();
  },

  getWithYearAndMonth: async (utilityId, userId, year, month) => {
    return await getDB()
      .collection(INVOICE_COLLECTION_NAME)
      .findOne({
        utilityId: new ObjectId(utilityId),
        userId: new ObjectId(userId),
        year,
        month,
      });
  },

  getPaidWithYearAndMonth: async (userId, utilityId, year, month) => {
    const invoice = await getDB()
      .collection(INVOICE_COLLECTION_NAME)
      .findOne({
        userId: new ObjectId(userId),
        utilityId: new ObjectId(utilityId),
        year,
        month,
        status: true,
        deletedAt: null,
      });

    return invoice;
  },

  getMonthlyInvoices: async (startOfMonth, endOfMonth) => {
    return await getDB()
      .collection(INVOICE_COLLECTION_NAME)
      .find({
        activatedAt: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
        status: true,
      })
      .sort({ year: -1, month: -1 })
      .toArray();
  },

  getOne: async (invoiceId) => {
    return await getDB()
      .collection(INVOICE_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(invoiceId),
      });
  },

  update: async (_id, updateData, unsetData) => {
    INVALID_UPDATE_FIELDS.forEach((field) => {
      if (updateData.hasOwnProperty(field)) {
        delete updateData[field];
      }
    });
    if (updateData && Object.keys(updateData).length > 0) {
      updateData.updatedAt = Date.now();
    }

    if (updateData.utilityId) {
      updateData.utilityId = new ObjectId(updateData.utilityId);
    }
    if (updateData.userId) {
      updateData.userId = new ObjectId(updateData.userId);
    }

    let updateCommand = {
      $set: { ...updateData },
    };
    if (unsetData) {
      updateCommand = {
        ...updateCommand,
        $unset: { ...unsetData },
      };
    }

    const result = await getDB()
      .collection(INVOICE_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(_id) }, updateCommand, {
        returnDocument: "after",
      });

    return result;
  },
};

module.exports = InvoiceModel;
