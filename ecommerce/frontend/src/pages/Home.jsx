import React, { useState, useEffect } from "react";
import { getAllProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="home-message">
        Đang tải sản phẩm...
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-message error">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-subtitle">
            CÔNG NGHỆ MỚI NHẤT
          </p>

          <h1>
            Khám phá<br />
            công nghệ mới.
          </h1>

          <p className="hero-description">
            Những sản phẩm công nghệ mới nhất,
            chính hãng và chất lượng cao.
          </p>

          <button className="hero-button">
            Khám phá sản phẩm
          </button>
        </div>
      </section>


      {/* CATEGORY */}
      <section className="category-section">

        <div className="section-header">
          <p>DANH MỤC</p>
          <h2>Khám phá theo nhu cầu</h2>
        </div>

        <div className="category-list">
          <div className="category-item">
            <span>📱</span>
            <h3>Điện thoại</h3>
          </div>

          <div className="category-item">
            <span>💻</span>
            <h3>Laptop</h3>
          </div>

          <div className="category-item">
            <span>⌚</span>
            <h3>Smartwatch</h3>
          </div>

          <div className="category-item">
            <span>🎧</span>
            <h3>Phụ kiện</h3>
          </div>
        </div>

      </section>


      {/* PRODUCTS */}
      <section className="products-section">

        <div className="section-header">
          <p>SẢN PHẨM</p>
          <h2>Sản phẩm mới nhất</h2>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>

      </section>


      {/* PROMOTION */}
      <section className="promotion">

        <div>
          <p>ƯU ĐÃI ĐẶC BIỆT</p>

          <h2>
            Công nghệ mới.
            <br />
            Giá tốt hơn.
          </h2>

          <button>
            Xem ưu đãi
          </button>
        </div>

      </section>


      {/* FEATURED PRODUCTS */}
      <section className="products-section">

        <div className="section-header">
          <p>ĐƯỢC QUAN TÂM</p>
          <h2>Sản phẩm nổi bật</h2>
        </div>

        <div className="product-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>

      </section>

    </div>
  );
}

export default Home;