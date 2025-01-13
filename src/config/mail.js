const nodemailer = require("nodemailer");
const { env } = require("./environment");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
});

const getTransporter = () => {
  if (!transporter) {
    throw new Error("Transporter is not created");
  }
  return transporter;
};

module.exports = { getTransporter };
