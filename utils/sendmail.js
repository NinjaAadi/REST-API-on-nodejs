const nodemailer = require("nodemailer");

const sendEmail  = async (options) => {

    
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD 
    }
  });

  // send mail with defined transport object
  const messege = {
    from: `${process.env.FROM_NAME}<${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.messege,
  };

  const info = await transporter.sendMail(messege);

  console.log("Message sent: %s", info.messageId);

}

module.exports = sendEmail;

