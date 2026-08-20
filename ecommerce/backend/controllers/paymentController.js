const crypto = require("crypto");
const qs = require("qs");
const Order = require("../models/Order");

const createVNPayPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
        if (order.paymentMethod !== "VNPAY") {
            return res.status(400).json({ message: "Đơn hàng không sử dụng VNPAY" });
        }

        const tmnCode = process.env.VNPAY_TMN_CODE;
        const secretKey = process.env.VNPAY_HASH_SECRET;
        const vnpUrl = process.env.VNPAY_URL;
        const returnUrl = process.env.VNPAY_RETURN_URL;

        if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
            return res.status(500).json({ message: "Thiếu cấu hình VNPAY trong .env" });
        }

        const now = new Date();
        const vietnamTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));

        const createDate =
            vietnamTime.getFullYear().toString() +
            String(vietnamTime.getMonth() + 1).padStart(2, "0") +
            String(vietnamTime.getDate()).padStart(2, "0") +
            String(vietnamTime.getHours()).padStart(2, "0") +
            String(vietnamTime.getMinutes()).padStart(2, "0") +
            String(vietnamTime.getSeconds()).padStart(2, "0");

        const expire = new Date(vietnamTime.getTime() + 15 * 60 * 1000);
        const expireDate =
            expire.getFullYear().toString() +
            String(expire.getMonth() + 1).padStart(2, "0") +
            String(expire.getDate()).padStart(2, "0") +
            String(expire.getHours()).padStart(2, "0") +
            String(expire.getMinutes()).padStart(2, "0") +
            String(expire.getSeconds()).padStart(2, "0");

        const txnRef = `${order.orderCode}-${Date.now()}`;

        let ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
        if (ipAddr.includes(",")) {
            ipAddr = ipAddr.split(",")[0].trim();
        }
        if (ipAddr === "::1") {
            ipAddr = "127.0.0.1";
        }

        let vnp_Params = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode: tmnCode,
            vnp_Amount: Math.round(Number(order.totalPrice) * 100),
            vnp_CurrCode: "VND",
            vnp_TxnRef: txnRef,
            vnp_OrderInfo: `Thanh toan don hang ${order.orderCode}`,
            vnp_OrderType: "other",
            vnp_Locale: "vn",
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate,
            vnp_ExpireDate: expireDate
        };

        // Sắp xếp các tham số theo bảng chữ cái từ A-Z dựa trên key
        vnp_Params = Object.keys(vnp_Params)
            .sort()
            .reduce((result, key) => {
                result[key] = vnp_Params[key];
                return result;
            }, {});

        // Sử dụng tùy chọn RFC3986 kết hợp mã hóa khoảng trắng thành ký tự dấu cộng (+) đồng nhất với VNPAY
        const signData = qs.stringify(vnp_Params, { encode: true, format: 'RFC3986' }).replace(/%20/g, '+');
        
        const secureHash = crypto
            .createHmac("sha512", secretKey)
            .update(Buffer.from(signData, "utf-8"))
            .digest("hex");

        vnp_Params.vnp_SecureHash = secureHash;

        const paymentUrl = vnpUrl + "?" + qs.stringify(vnp_Params, { encode: true, format: 'RFC3986' }).replace(/%20/g, '+');

        return res.json({ success: true, paymentUrl });
    } catch (error) {
        console.error("VNPAY CREATE ERROR:", error);
        return res.status(500).json({ message: "Không thể tạo thanh toán VNPAY" });
    }
};

const vnpayReturn = async (req, res) => {
    try {
        let vnp_Params = { ...req.query };
        const secureHash = vnp_Params.vnp_SecureHash;

        delete vnp_Params.vnp_SecureHash;
        delete vnp_Params.vnp_SecureHashType;

        vnp_Params = Object.keys(vnp_Params)
            .sort()
            .reduce((result, key) => {
                result[key] = vnp_Params[key];
                return result;
            }, {});

        const secretKey = process.env.VNPAY_HASH_SECRET;
        const signData = qs.stringify(vnp_Params, { encode: true, format: 'RFC3986' }).replace(/%20/g, '+');
        
        const checkHash = crypto
            .createHmac("sha512", secretKey)
            .update(Buffer.from(signData, "utf-8"))
            .digest("hex");

        if (secureHash === checkHash) {
            if (vnp_Params['vnp_ResponseCode'] === '00') {
                return res.json({ success: true, message: "Thanh toán thành công", data: vnp_Params });
            } else {
                return res.json({ success: false, message: "Thanh toán thất bại", responseCode: vnp_Params['vnp_ResponseCode'] });
            }
        } else {
            return res.status(400).json({ success: false, message: "Sai chữ ký bảo mật (Invalid Checksum)" });
        }
    } catch (error) {
        console.error("VNPAY RETURN ERROR:", error);
        return res.status(500).json({ message: "Lỗi xử lý kết quả VNPAY" });
    }
};

module.exports = {
    createVNPayPayment,
    vnpayReturn
};
