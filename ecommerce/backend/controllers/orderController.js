const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Cart = require("../models/Cart");

const createOrder = async (req, res) => {
    try {
        const { receiverName, phone, address, paymentMethod } = req.body;
        const userId = req.user.userId;


        const cart = await Cart.findOne({ user: userId }).populate("products.product");
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: "Giỏ hàng của bạn đang trống, không thể đặt hàng!" });
        }

        let totalPrice = 0;
        cart.products.forEach(item => {
            const finalPrice = item.product.discount > 0
                ? item.product.price - (item.product.price * item.product.discount) / 100
                : item.product.price;
            totalPrice += finalPrice * item.quantity;
        });


        const orderCode = `LT-${Math.floor(100000 + Math.random() * 900000)}`;


        const order = await Order.create({
            user: userId,
            orderCode,
            receiverName,
            phone,
            address,
            totalPrice,
            paymentMethod: paymentMethod || "COD",
            paymentStatus: "UNPAID",
            orderStatus: "PENDING"
        });


        const orderItemPromises = cart.products.map(item => {
            const finalPrice = item.product.discount > 0
                ? item.product.price - (item.product.price * item.product.discount) / 100
                : item.product.price;
                
            return OrderItem.create({
                order: order._id,
                product: item.product._id,
                quantity: item.quantity,
                price: finalPrice
            });
        });
        await Promise.all(orderItemPromises);

        // 6. Đặt hàng thành công -> Dọn sạch toàn bộ mảng sản phẩm trong giỏ hàng Database
        cart.products = [];
        await cart.save();

        return res.status(201).json({
            success: true,
            message: "Đặt hàng thành công!",
            orderCode: order.orderCode,
            orderId: order._id
        });

    } catch (error) {
        return res.status(500).json({ message: "Lỗi tạo đơn hàng: " + error.message });
    }
};

module.exports = { createOrder };
