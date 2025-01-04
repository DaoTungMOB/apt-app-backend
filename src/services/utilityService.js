const UtilityModel = require("../models/utilityModel");

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
};

module.exports = UtilityService;
