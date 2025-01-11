const { StatusCodes } = require("http-status-codes");
const ContactService = require("../services/contactService");

const ContactController = {
  create: async (req, res, next) => {
    try {
      const { userId } = req.payload;
      const result = await ContactService.create(userId, req.body);

      return res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ContactController;
