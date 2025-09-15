const nodemailer = require("nodemailer");

async function sendEmail(email, otp){
    const transporter = nodemailer.createTransport({
  service: "gmail",
  
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const info = await transporter.sendMail({
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: "Hello ✔",
    text: "Verification Code", // plain‑text body
    html: `<b> Your Verification code is ${otp}</b` , // HTML body
  });
}
module.exports = sendEmail