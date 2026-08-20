import React from "react";
import { Link } from "react-router-dom";
import { addToDBCart } from "../services/api"; 
import "./ProductCard.css";

function ProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  const discountPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

  
  const handleAddToCart = async (e) => {
    e.preventDefault(); 
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập tài khoản trước khi thêm sản phẩm vào giỏ hàng!");
      return;
    }

    try {
     
      const updatedCartData = await addToDBCart(product._id, 1);
      
      alert(`Đã thêm ${product.name} vào giỏ hàng tài khoản thành công!`);
      
      
      window.dispatchEvent(new Event("cartUpdate")); 
    } catch (error) {
      console.error("Lỗi thêm giỏ hàng Database:", error);
      alert("Có lỗi xảy ra: " + (error.response?.data?.message || "Không thể kết nối đến server"));
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image-wrapper">
        {product.discount > 0 && (
          <span className="product-discount">-{product.discount}%</span>
        )}

        <img
          src={product.thumbnail || "https://placehold.co"}
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


        <button 
          className="add-to-cart-overlay-btn" 
          onClick={handleAddToCart}
          disabled={product.status !== "AVAILABLE"} 
        >
          {product.status === "AVAILABLE" ? "Thêm vào giỏ" : "Hết hàng"}
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
