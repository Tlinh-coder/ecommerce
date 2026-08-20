const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);

        const [
            productStats,
            monthlyOrders,
            monthlyRevenue,
            totalRevenue,
            lowStockItems,
            totalOrders,
            totalUsers,
            activeUsers
        ] = await Promise.all([
            // Tổng số sản phẩm + tổng tồn kho (quantity) trong MongoDB
            Product.aggregate([
                { $group: { _id: null, totalProducts: { $sum: 1 }, totalStock: { $sum: "$quantity" } } }
            ]),

            // Số đơn hàng tạo trong tháng này
            Order.countDocuments({ createdAt: { $gte: startOfMonth } }),

            // Doanh số tháng này (loại đơn đã hủy)
            Order.aggregate([
                { $match: { createdAt: { $gte: startOfMonth }, orderStatus: { $ne: "CANCELLED" } } },
                { $group: { _id: null, total: { $sum: "$totalPrice" } } }
            ]),

            // Doanh số tất cả các tháng (loại đơn đã hủy)
            Order.aggregate([
                { $match: { orderStatus: { $ne: "CANCELLED" } } },
                { $group: { _id: null, total: { $sum: "$totalPrice" } } }
            ]),

            // Số sản phẩm sắp hết hàng (tồn kho < 5)
            Product.countDocuments({ quantity: { $lt: 5 } }),

            // Tổng số đơn hàng
            Order.countDocuments(),

            // Tổng số người dùng
            User.countDocuments(),

            // Số người dùng ước tính đang hoạt động (trạng thái ACTIVE)
            User.countDocuments({ status: "ACTIVE" })
        ]);

        return res.json({
            totalProducts: productStats[0]?.totalProducts || 0,
            totalStock: productStats[0]?.totalStock || 0,
            lowStockItems,
            monthlyOrders,
            totalOrders,
            monthlyRevenue: monthlyRevenue[0]?.total || 0,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalUsers,
            activeUsers
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi lấy thống kê: " + error.message });
    }
};

module.exports = { getDashboardStats };
