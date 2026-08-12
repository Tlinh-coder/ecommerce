const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy tài khoản người dùng!" });
        }

        // ⚡ KHÓA LỖI: Ép cả quyền trong DB về chữ thường để so sánh chuẩn xác (ADMIN hay admin đều được)
        const currentRole = user.role ? user.role.toString().trim().toLowerCase() : "";

        if (currentRole === "admin") {
            return next(); // Khớp chuẩn chữ admin, cho phép đi tiếp!
        }

        // Nếu thất bại thì mới trả về lỗi
        return res.status(403).json({ 
            message: `Từ chối truy cập! Quyền hiện tại của bạn là "${user.role}". Bạn không phải Admin.` 
        });

    } catch (error) {
        return res.status(500).json({ message: "Lỗi phân quyền hệ thống: " + error.message });
    }
};

module.exports = adminMiddleware;
