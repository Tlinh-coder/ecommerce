import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  const discountPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

  const handleAddToCart = (e) => {
    e.preventDefault(); // 🛑 Ngăn chặn hành vi click thẻ Link làm chuyển hướng trang
    
    // Tạo cấu trúc một món đồ bỏ vào giỏ
    const cartItem = {
      _id: product._id,
      name: product.name,
      price: discountPrice, // Lưu giá sau khi đã giảm
      thumbnail: product.thumbnail || "https://placehold.co/600x600?text=No+Image",
      quantity: 1 // Mặc định bấm ngoài card là thêm 1 sản phẩm
    };

    // Lấy giỏ hàng hiện tại trong máy ra (nếu chưa có thì tạo mảng rỗng)
    let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

    // Kiểm tra xem sản phẩm này đã nằm trong giỏ hàng từ trước chưa
    const existingItemIndex = cart.findIndex((item) => item._id === product._id);

    if (existingItemIndex > -1) {
      // Nếu có rồi thì tăng số lượng lên 1
      cart[existingItemIndex].quantity += 1;
    } else {
      // Nếu chưa có thì đẩy món mới này vào mảng
      cart.push(cartItem);
    }

    // Ghi đè giỏ hàng mới cập nhật lại vào localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
    window.dispatchEvent(new Event("storage")); 
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image-wrapper">
        {product.discount > 0 && (
          <span className="product-discount">-{product.discount}%</span>
        )}

        <img
          src={product.thumbnail || "https://placehold.co/600x600?text=No+Image"}
          alt={product.name}
          className="product-image"
        />

        <button
          className="product-heart"
          onClick={(e) => {
            e.preventDefault();
            alert("Đã thêm vào danh sách yêu thích!");
          }}
        >
          ♡
        </button>

        {/* ⚡ NÚT THÊM VÀO GIỎ HÀNG HIỆN ĐẠI (ẨN DƯỚI ẢNH, HOVER MỚI HIỆN) */}
        <button 
          className="add-to-cart-overlay-btn" 
          onClick={handleAddToCart}
          disabled={product.status !== "AVAILABLE"} // Khóa nút nếu hết hàng
        >
          {product.status === "AVAILABLE" ? "Thêm vào giỏ 🛒" : "Hết hàng"}
        </button>
      </div>

      <div className="product-info">
        <div className="product-category">
          {product.category?.name || "Sản phẩm"}
        </div>

        <h3 className="product-name">{product.name}</h3>

        <div className="product-price">
          <span className="current-price">{formatPrice(discountPrice)}</span>
          {product.discount > 0 && (
            <span className="old-price">{formatPrice(product.price)}</span>
          )}
        </div>

        <div className={`product-status-tag ${product.status === "AVAILABLE" ? "in-stock" : "out-of-stock"}`}>
          {product.status === "AVAILABLE" ? "Còn hàng" : "Hết hàng"}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
