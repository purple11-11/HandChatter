const nodemailer = require("nodemailer");
require("dotenv").config();

exports.transporter = nodemailer.createTransport({
    service: "naver",
    host: "pop.naver.com",
    port: 995,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
