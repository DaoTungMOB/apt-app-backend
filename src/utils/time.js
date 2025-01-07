module.exports = {
  getLastMonthAndYearFor: () => {
    const date = new Date();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const month = currentMonth === 0 ? 12 : currentMonth - 1;
    const year = currentMonth === 0 ? currentYear - 1 : currentYear;
    return { month, year };
  },
};
