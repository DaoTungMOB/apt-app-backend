const express = require("express");
const { isAuth, isAdmin } = require("../../../middlewares/auth");
const AdminApartmentController = require("../../../controllers/admin/adminApartmentController");
const AparmentValidation = require("../../../validations/apartmentValidation");
const AdminApartmentUtilityController = require("../../../controllers/admin/adminApartmentUtilityController");
const UtilityValidation = require("../../../validations/utilityValidation");
const AdminContractController = require("../../../controllers/admin/adminContractController");
const AdminUtilityController = require("../../../controllers/admin/adminUtilityController");

const Router = express.Router();

// /apartments
Router.route("/monthly-signed-statistics").get(
  isAuth,
  isAdmin,
  AdminApartmentController.getMonthlySignedApt
);

// /apartments/:apartmentId/utilities
Router.route("/:id/utilities")
  .post(
    isAuth,
    isAdmin,
    UtilityValidation.add,
    AdminApartmentUtilityController.addUtility
  )
  .get(isAuth, isAdmin, AdminUtilityController.getAptUtilities);

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

// /apartments/:apartmentId/contracts
Router.route("/:id/contracts").get(
  isAuth,
  isAdmin,
  AdminContractController.getAptContracts
);

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

module.exports = Router;
