const nodemailer = require("nodemailer");
const config = require("./config");

const transport = nodemailer.createTransport({
  host: config.EMAIL_SENDER_SMTP_HOST,
  port: config.EMAIL_SENDER_SMTP_PORT,
  secure: config.EMAIL_SENDER_SMTP_SECURE,
  auth: {
    user: config.EMAIL_SENDER_SMTP_USER,
    pass: config.EMAIL_SENDER_SMTP_PASSWORD,
  },

});

