const UtilityModel = require("../models/utilityModel");

const UtilityService = {
  update: async (id, reqBody) => {
    const updatedApartment = await UtilityModel.update(id, reqBody);

    return updatedApartment;
  },
};

module.exports = UtilityService;
