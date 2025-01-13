const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY,
  REFRESH_SERCET_KEY: process.env.REFRESH_SERCET_KEY,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  SEND_MAIL_ACCESS_KEY: process.env.SEND_MAIL_ACCESS_KEY,
};

module.exports = { env };
