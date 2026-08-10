const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


const sendOTPEmail = async (email, otp) => {

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Mã OTP xác nhận tài khoản",
        html: `
            <h2>Xác nhận tài khoản</h2>
            <p>Mã OTP của bạn là:</p>
            <h1>${otp}</h1>
            <p>Mã có hiệu lực trong 5 phút.</p>
        `
    });

    console.log("Đã gửi OTP tới:", email);
};


module.exports = {
    sendOTPEmail
};