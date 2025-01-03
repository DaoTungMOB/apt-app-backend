const UtilityModel = require("../models/utilityModel");

const UtilityService = {
  createNew: async (reqBody) => {
    const newUtility = {
      ...reqBody,
    };

    const createdApartment = await UtilityModel.createNew(newUtility);

    return createdApartment;
  },
};

module.exports = UtilityService;
