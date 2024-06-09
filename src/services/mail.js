const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.email_id,
        pass: process.env.email_pw
    }
});

exports.sendMail = async (mailOptions) => {
    try {
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.log(error)
        return null
    }
}