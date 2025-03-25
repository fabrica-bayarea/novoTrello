const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "testebayarea@gmail.com",
      pass: "jpwn clhc rozd fzbu",
    },
  });

  const mailOptions = {
    from: "testebayarea@gmail.com",
    to: "gabrielfernandes21251@gmail.com",
    subject: "Teste de envio de e-mail",
    text: "Teste, e-mail enviado por node.js",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });