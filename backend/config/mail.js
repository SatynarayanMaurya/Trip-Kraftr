import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});


transporter.verify((error, success) => {
    if (error) {
        console.log("SMTP Connection Error:", error);
    } else {
        console.log("SMTP Server Connected");
    }
});


export default transporter;