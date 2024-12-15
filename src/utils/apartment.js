const APARTMENT_STATUS = {
  UNAVAILABLE: "unavailable",
  AVAILABLE: "available",
  RENTED: "rented",
  SOLD: "sold",
};

const isValidApartmentStatus = (value) =>
  Object.values(APARTMENT_STATUS).includes(value);

module.exports = {
  APARTMENT_STATUS,
  isValidApartmentStatus,
};
