const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // Đảm bảo đúng tên thư mục và tệp middleware của bạn
const { getCart, addToCart, removeFromCart } = require("../controllers/cartController");

// Các tuyến đường xử lý giỏ hàng yêu cầu token bảo mật
router.get("/", authMiddleware, getCart);
router.post("/add", authMiddleware, addToCart);
router.delete("/remove/:productId", authMiddleware, removeFromCart);

module.exports = router;
