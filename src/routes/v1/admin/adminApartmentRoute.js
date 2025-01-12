const express = require("express");
const { isAuth, isAdmin } = require("../../../middlewares/auth");
const AdminApartmentController = require("../../../controllers/admin/adminApartmentController");
const AparmentValidation = require("../../../validations/apartmentValidation");
const AdminApartmentUtilityController = require("../../../controllers/admin/adminApartmentUtilityController");
const UtilityValidation = require("../../../validations/utilityValidation");

const Router = express.Router();

// /apartments
Router.route("/monthly-signed-statistics").get(
  isAuth,
  isAdmin,
  AdminApartmentController.getMonthlySignedApt
);

// /apartments/:apartmentId/utilities
Router.route("/:id/utilities").post(
  isAuth,
  isAdmin,
  UtilityValidation.add,
  AdminApartmentUtilityController.addUtility
);

// /apartments/:apartmentId/status
Router.route("/:id/status").put(
  isAuth,
  isAdmin,
  AparmentValidation.changeStatus,
  AdminApartmentController.changeStatus
);

// /apartments/:apartmentId/users
Router.route("/:id/users")
  .post(
    isAuth,
    isAdmin,
    AparmentValidation.addUser,
    AdminApartmentController.addUser
  )
  .put(
    isAuth,
    isAdmin,
    AparmentValidation.changeUser,
    AdminApartmentController.changeUser
  )
  .delete(isAuth, isAdmin, AdminApartmentController.removeUser);

// /apartments/:apartmentId
Router.route("/:id")
  .get(isAuth, isAdmin, AdminApartmentController.getAptWithUser)
  .put(
    isAuth,
    isAdmin,
    AparmentValidation.update,
    AdminApartmentController.update
  );

// /apartments
// TODO: Thêm filter cho api get apartments
Router.route("/")
  .post(
    isAuth,
    isAdmin,
    AparmentValidation.createNew,
    AdminApartmentController.createNew
  )
  .get(isAuth, isAdmin, AdminApartmentController.getAll);

// TODO: get apartment rental history

module.exports = Router;
