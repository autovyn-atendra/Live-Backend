const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "automailerautovyn@gmail.com",
    pass: "azucvdumhwegelzg",
  },
});
let transporter2 = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "AUTOVYN.MAILER@gmail.com",
    pass: "lamdgvthpjetawtr",
  },
});

async function sendmail(EMAIL, subject, html) {
  if (EMAIL) {
    var BCCMAIL = ["ayushi@autovyn.com"];
    let mailOptions = {
      from: "AUTOVYN.MAILER@gmail.com",
      to: EMAIL,
      bcc: BCCMAIL,
      subject: subject,
      html: html,
      // attachments: [
      //     {
      //         filename: 'favicon.png',
      //         path: 'public/favicon.png',
      //         cid: 'favicon'
      //     }
      // ]
    };
    let mailOptions2 = {
      from: "automailerautovyn@gmail.com",
      to: EMAIL,
      bcc: BCCMAIL,
      subject: subject,
      html: html,
      // attachments: [
      //     {
      //         filename: 'favicon.png',
      //         path: 'public/favicon.png',
      //         cid: 'favicon'
      //     }
      // ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        transporter2.sendMail(mailOptions2, (error, info1) => {
          if (error) {
        console.log(error);

            return false;
          }
          return true;
        });
        return false;
      }
      return true;
    });
  }
}

exports.sendmail = sendmail;
