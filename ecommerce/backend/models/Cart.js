const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    // Liên kết với bảng người dùng (Mỗi user chỉ có duy nhất 1 giỏ hàng)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true 
    },
    // Mảng chứa danh sách các sản phẩm được thêm vào giỏ
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: [1, "Số lượng vật phẩm không được nhỏ hơn 1"]
        }
      }
    ]
  },
  { 
    timestamps: true // Tự động tạo trường ngày thêm, ngày sửa (createdAt, updatedAt)
  }
);

module.exports = mongoose.model("Cart", cartSchema);
