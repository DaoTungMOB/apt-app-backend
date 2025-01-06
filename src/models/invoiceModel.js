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
    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = Date.now();
    }

    if (updateData.utilityId) {
      updateData.utilityId = new ObjectId(updateData.utilityId);
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
