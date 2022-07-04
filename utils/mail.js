const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

const sendResetToken = async (options) => {
  const { to, subject, text } = options;
  const message = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    text,
  };
  if (process.env.NODE_ENV == "production") {
    // for production use sendgrid
    sgMail.setApiKey(process.env.SENDGRID_PASS);
    await sgMail.send(message);
  } else {
    // for development use mailtrap
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail(message);
  }
};

module.exports = sendResetToken;
