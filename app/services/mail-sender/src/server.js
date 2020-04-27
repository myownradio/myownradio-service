const nodemailer = require("nodemailer")
const config = require("./config")
const logger = require("./logger")

// eslint-disable-next-line no-unused-vars
const transport = nodemailer.createTransport({
  host: config.EMAIL_SENDER_SMTP_HOST,
  port: config.EMAIL_SENDER_SMTP_PORT,
  secure: config.EMAIL_SENDER_SMTP_SECURE,
  auth: {
    user: config.EMAIL_SENDER_SMTP_USER,
    pass: config.EMAIL_SENDER_SMTP_PASSWORD,
  },
})
