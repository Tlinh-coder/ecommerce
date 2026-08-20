import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/api";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    getProductById(id)
      .then((data) => {
        setProduct(data);

        const firstImage =
          data.thumbnail ||
          data.images?.[0] ||
          "https://placehold.co/800x800?text=No+Image";

        setSelectedImage(firstImage);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  if (loading) {
    return (
      <div className="product-detail-message">
        Đang tải sản phẩm...
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-message error">
        {error}
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const discountPrice =
    product.discount > 0
      ? product.price -
        (product.price * product.discount) / 100
      : product.price;

  const images = [
    product.thumbnail,
    ...(product.images || [])
  ].filter(Boolean);

  return (
    <div className="product-detail">
      <div className="product-detail-container">

        {/* =========================
            IMAGE
        ========================= */}

        <div className="product-gallery">

          {/* Ảnh chính */}

          <div className="product-detail-image">

            {product.discount > 0 && (
              <span className="detail-discount">
                -{product.discount}%
              </span>
            )}

            <img
              src={selectedImage}
              alt={product.name}
            />

          </div>


          {/* Ảnh nhỏ */}

          {images.length > 0 && (
            <div className="product-thumbnails">

              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    selectedImage === image
                      ? "thumbnail active"
                      : "thumbnail"
                  }
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                  />
                </button>
              ))}

            </div>
          )}

        </div>


        {/* =========================
            INFO
        ========================= */}

        <div className="product-detail-info">

          <p className="detail-category">
            {product.category?.name || "Sản phẩm"}
          </p>

          <h1>{product.name}</h1>


          {/* PRICE */}

          <div className="detail-price">

            <span className="detail-current-price">
              {formatPrice(discountPrice)}
            </span>

            {product.discount > 0 && (
              <span className="detail-old-price">
                {formatPrice(product.price)}
              </span>
            )}

          </div>


          <div className="detail-divider" />


          {/* DESCRIPTION */}

          <div className="detail-description">

            <h3>Mô tả</h3>

            <p>
              {product.description ||
                "Sản phẩm chưa có mô tả."}
            </p>

          </div>


          {/* SPECIFICATIONS */}

          <div className="specifications">

            <div>
              <span>Chip</span>
              <strong>
                {product.chip || "-"}
              </strong>
            </div>

            <div>
              <span>Màn hình</span>
              <strong>
                {product.screen || "-"}
              </strong>
            </div>

            <div>
              <span>Camera</span>
              <strong>
                {product.camera || "-"}
              </strong>
            </div>

            <div>
              <span>Sạc nhanh</span>
              <strong>
                {product.fastCharge
                  ? "Có"
                  : "Không"}
              </strong>
            </div>

            <div>
              <span>Bảo hành</span>
              <strong>
                {product.warranty || 0} tháng
              </strong>
            </div>

            <div>
              <span>Xuất xứ</span>
              <strong>
                {product.origin || "-"}
              </strong>
            </div>

          </div>


          <div className="detail-divider" />


          {/* STOCK */}

          <div className="detail-stock">

            {product.status === "AVAILABLE"
              ? "Còn hàng"
              : "Hết hàng"}

          </div>


          {/* ADD CART */}

          <button
            className="add-cart-button"
            disabled={
              product.status !== "AVAILABLE"
            }
          >
            Thêm vào giỏ hàng
          </button>

        </div>

      </div>
    </div>
  );
}

export default ProductDetail;