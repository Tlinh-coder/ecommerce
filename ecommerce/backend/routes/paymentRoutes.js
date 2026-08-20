const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createVNPayPayment,
    vnpayReturn
} = require("../controllers/paymentController");

router.post(
    "/vnpay/create",
    authMiddleware,
    createVNPayPayment
);

router.get(
    "/vnpay-return",
    vnpayReturn
);

module.exports = router;