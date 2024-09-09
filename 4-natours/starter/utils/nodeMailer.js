const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
  ////Create a transporter
  const transporter = nodeMailer.createTransport({
    service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },

    ///Active in gmail "less secure app" options
  });

  //Define the email options
  const mailOptions = {
    from: 'tuosama1234@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
