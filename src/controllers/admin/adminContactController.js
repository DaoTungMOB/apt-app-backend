const { StatusCodes } = require("http-status-codes");
const ContactService = require("../../services/contactService");

const AdminContactController = {
  getAll: async (req, res, next) => {
    try {
      const contacts = await ContactService.getAll();

      return res.status(StatusCodes.OK).json(contacts);
    } catch (error) {
      next(error);
    }
  },

  updateOne: async (req, res, next) => {
    try {
      const contact = await ContactService.updateOne(req.params.id, req.body);

      return res.status(StatusCodes.OK).json(contact);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AdminContactController;
