const mongoose = require("mongoose");

// Bản thiết kế của Product
const ProductSchema = new mongoose.Schema(
{
    // Danh mục sản phẩm
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },

    // Thương hiệu
    brand: {
        type: String,
        // required: true,
        trim: true
    },

    // Tên sản phẩm
    name: {
        type: String,
        required: true,
        trim: true
    },

    // Mã sản phẩm
    sku: {
        type: String,
        // required: true,
        unique: true,
        trim: true
    },

    // Giá bán
    price: {
        type: Number,
        required: true,
        min: 0
    },

    // Giảm giá (%)
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    // Số lượng còn trong kho
    quantity: {
        type: Number,
        default: 0,
        min: 0
    },

    // Đã bán bao nhiêu
    sold: {
        type: Number,
        default: 0,
        min: 0
    },

    // Mô tả ngắn
    description: {
        type: String,
        default: ""
    },

    // Chip
    chip: {
        type: String,
        default: ""
    },

    // RAM (GB)
    ram: {
        type: Number,
        min: 0
    },

    // Bộ nhớ trong (GB)
    rom: {
        type: Number,
        min: 0
    },

    // Pin (mAh)
    battery: {
        type: Number,
        min: 0
    },

    // Màn hình
    screen: {
        type: String,
        default: ""
    },

    // Camera
    camera: {
        type: String,
        default: ""
    },

    // Có hỗ trợ sạc nhanh không
    fastCharge: {
        type: Boolean,
        default: false
    },

    // Thời gian bảo hành (tháng)
    warranty: {
        type: Number,
        default: 12
    },

    // Xuất xứ
    origin: {
        type: String,
        default: ""
    },

    // Các màu của sản phẩm
    colors: [
        {
            type: String
        }
    ],

    // Ảnh đại diện
    thumbnail: {
        type: String,
        default: ""
    },

    // Danh sách ảnh
    images: [
        {
            type: String
        }
    ],

    // Trạng thái sản phẩm
    status: {
        type: String,
        enum: [
            "AVAILABLE",
            "OUT_OF_STOCK",
            "COMING_SOON"
        ],
        default: "AVAILABLE"
    }
},
{
    timestamps: true
}
);

// Tạo Model Product
const Product = mongoose.model("Product", ProductSchema);

// Export để các file khác sử dụng
module.exports = Product;