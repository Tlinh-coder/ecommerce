const User = require("../models/User");
const bcrypt = require("bcrypt");

// 1. LẤY THÔNG TIN CÁ NHÂN (Hàm phục vụ API /api/users/me)
const getMe = async (req, res) => {
    try {
        // req.user.userId được gán bởi authMiddleware sau khi giải mã Token thành công
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy thông tin tài khoản"
            });
        }

        // Trả về gói dữ liệu sạch, giấu mật khẩu bảo mật đi
        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                address: user.address || "",
                avatar: user.avatar || "",
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi hệ thống lấy thông tin: " + error.message
        });
    }
};

// 2. CẬP NHẬT THÔNG TIN HỒ SƠ (Đổi tên, SĐT, Địa chỉ, Avatar)
const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, avatar } = req.body;
        const userId = req.user.userId;

        // Tiến hành tìm và cập nhật các trường thông tin mới của người dùng
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name,
                phone,
                address,
                avatar
            },
            {
                returnDocument: "after", // Cú pháp Mongoose chuẩn mới dọn sạch Warning cũ
                runValidators: true
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "Cập nhật thất bại! Không tìm thấy người dùng."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cập nhật thông tin hồ sơ thành công!",
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone || "",
                address: updatedUser.address || "",
                avatar: updatedUser.avatar || "",
                role: updatedUser.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi cập nhật thông tin: " + error.message
        });
    }
};

// 3. ĐỔI MẬT KHẨU (Xử lý kiểm tra mật khẩu cũ và băm mã hóa mật khẩu mới)
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
        }

        // Kiểm tra xem mật khẩu cũ nhập vào có khớp với mật khẩu băm trong DB không
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu cũ không chính xác!" });
        }

        // Tiến hành băm mã hóa mật khẩu mới với độ muối 10 vòng
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Đổi mật khẩu tài khoản thành công!"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi đổi mật khẩu: " + error.message
        });
    }
};

module.exports = {
    getMe,
    updateProfile,
    changePassword
};
