const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // Nhớ kiểm tra đúng tên file/thư mục middleware của bạn
const { createOrder } = require("../controllers/orderController");

// Tuyến đường xử lý đặt hàng yêu cầu phải đăng nhập tài khoản
router.post("/create", authMiddleware, createOrder);

module.exports = router;
