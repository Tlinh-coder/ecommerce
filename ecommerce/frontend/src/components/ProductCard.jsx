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

  return (
    <Link
      to={`/product/${product._id}`}
      className="product-card"
    >
      <div className="product-image-wrapper">

        {product.discount > 0 && (
          <span className="product-discount">
            -{product.discount}%
          </span>
        )}

        <img
          src={
            product.thumbnail ||
            "https://placehold.co/600x600?text=No+Image"
          }
          alt={product.name}
          className="product-image"
        />

        <button
          className="product-heart"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          ♡
        </button>
      </div>

      <div className="product-info">

        <div className="product-category">
          {product.category?.name || "Sản phẩm"}
        </div>

        <h3 className="product-name">
          {product.name}
        </h3>

        <div className="product-price">

          <span className="current-price">
            {formatPrice(discountPrice)}
          </span>

          {product.discount > 0 && (
            <span className="old-price">
              {formatPrice(product.price)}
            </span>
          )}

        </div>

        <div className="product-status">
          {product.status === "AVAILABLE"
            ? "Còn hàng"
            : "Hết hàng"}
        </div>

      </div>
    </Link>
  );
}

export default ProductCard;