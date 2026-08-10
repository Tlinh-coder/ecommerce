const User = require("../models/User");
const bcrypt = require("bcrypt");

const { sendOTPEmail } = require("../utils/email");
const jwt = require("jsonwebtoken");


const register = async (req, res) => {
    try {

        // 1. Lấy dữ liệu từ client gửi lên
        const {
            username,
            email,
            password,
            
        } = req.body;


        // 2. Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email đã được sử dụng"
            });
        }


        // 3. Mã hóa password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // 4. Tạo OTP 6 số
        const otp = Math.floor(
            Math.random() * 900000
        ) + 100000;

        // 5. Mã hóa OTP trước khi lưu DB
        const hashedOtp = await bcrypt.hash(
            otp.toString(),
            10
        );


        // 6. Tạo user trong database
        const user = await User.create({

            username,

            email,

            password: hashedPassword,


            // chưa xác nhận email
            isVerified: false,


            // lưu OTP đã hash
            verificationCodeHash: hashedOtp,


            // OTP hết hạn sau 5 phút
            verificationCodeExpires:
                Date.now() + 5 * 60 * 1000
        });


        // 7. Gửi OTP về email người dùng
        await sendOTPEmail(
            email,
            otp
        );


        // 8. Trả kết quả
        res.status(201).json({

            message:
                "Đăng ký thành công, vui lòng kiểm tra email để xác nhận",

            userId: user._id

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
const verifyEmail = async (req, res) => {
    try {

        const {
            email,
            otp
        } = req.body;


        // tìm user theo email
        const user = await User.findOne({
            email
        });


        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy tài khoản"
            });
        }


        // kiểm tra OTP hết hạn
        if (
            user.verificationCodeExpires < Date.now()
        ) {
            return res.status(400).json({
                message: "OTP đã hết hạn"
            });
        }


        // so sánh OTP người dùng nhập
        const isMatch = await bcrypt.compare(
            otp.toString(),
            user.verificationCodeHash
        );


        if (!isMatch) {
            return res.status(400).json({
                message: "OTP không đúng"
            });
        }


        // xác nhận email
        user.isVerified = true;

        // xoá OTP sau khi dùng
        user.verificationCodeHash = undefined;
        user.verificationCodeExpires = undefined;


        await user.save();


        res.json({
            message: "Xác nhận email thành công"
        });


    } catch(error) {

        res.status(500).json({
            message: error.message
        });

    }
};
const login = async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy tài khoản"
            });
        }

        if (!user.isVerified) {
            return res.status(400).json({
                message: "Vui lòng xác nhận email trước khi đăng nhập"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Mật khẩu không đúng"
            });
        }

        const token = jwt.sign(
            { userId: user._id,
                role: user.role
             },
            process.env.JWT_SECRET,
            { expiresIn: "7d" })
            return res.json({
                message: "Đăng nhập thành công",
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        );
    
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getMe = async (req, res) => {
    try {

        // req.user được gán bởi authMiddleware
        // chứa { userId } từ JWT
        const user = await User.findById(
            req.user.userId
        );

        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy tài khoản"
            });
        }

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                address: user.address,
                avatar: user.avatar,
                role: user.role,
                status: user.status,
                isVerified: user.isVerified,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy tài khoản"
            });
        }
        const otp = Math.floor(Math.random() * 900000) + 100000;

        const hashedOtp = await bcrypt.hash(otp.toString(), 10);

        user.resetPasswordCodeHash = hashedOtp;
        user.resetPasswordCodeExpires = Date.now() + 5 * 60 * 1000;

        await user.save();
        await sendOTPEmail(email, otp);
        res.json({
            message: "Đã gửi OTP về email của bạn",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
    const resetPassword = async (req, res) => {
        try { 
            const { email, otp, newPassword } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    message: "Không tìm thấy tài khoản"
                });
            }
            if (user.resetPasswordCodeExpires < Date.now()) {
                return res.status(400).json({
                    message: "OTP đã hết hạn"
                });
            }
            console.log("OTP từ client:", otp);
            console.log("Hash OTP trong DB:", user.resetPasswordCodeHash);
            const isMatch = await bcrypt.compare(
                otp.toString(), 
                user.resetPasswordCodeHash
            );
            if (!isMatch) {
                return res.status(400).json({
                    message: "OTP không đúng"
                });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.resetPasswordCodeHash = undefined;
            user.resetPasswordCodeExpires = undefined;
            await user.save();
            return res.json({
                message: "Đặt lại mật khẩu thành công"
            });
        }
        catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }



module.exports = {
    register,
    verifyEmail,
    login,
    getMe,
    forgotPassword,
    resetPassword           
};
