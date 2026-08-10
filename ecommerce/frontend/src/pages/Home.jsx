import React, { useState, useEffect } from "react";
import { getAllProducts, getAllCategories, getProductsByCategory } from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // ⚡ Lưu danh mục từ BE
  const [selectedCategory, setSelectedCategory] = useState(null); // ⚡ Lưu danh mục đang chọn để lọc
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Tự động tải danh sách Danh mục và Sản phẩm khi vừa vào trang
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getAllCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // 2. Hàm xử lý khi người dùng click chọn 1 Danh mục để lọc
  const handleCategoryClick = async (categoryId) => {
    setLoading(true);
    try {
      if (selectedCategory === categoryId) {
        // Nếu bấm lại vào danh mục đang chọn -> Hủy lọc, hiển thị lại tất cả sản phẩm
        const data = await getAllProducts();
        setProducts(data);
        setSelectedCategory(null);
      } else {
        // Lọc sản phẩm theo danh mục vừa bấm
        const data = await getProductsByCategory(categoryId);
        setProducts(data);
        setSelectedCategory(categoryId);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Hàm định nghĩa icon tương ứng cho từng tên danh mục (Nếu DB của bạn không lưu icon)
  const getCategoryEmoji = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("thoại") || lowerName.includes("phone")) return "📱";
    if (lowerName.includes("laptop") || lowerName.includes("máy tính")) return "💻";
    if (lowerName.includes("đồng hồ") || lowerName.includes("watch")) return "⌚";
    if (lowerName.includes("kiện") || lowerName.includes("accessory")) return "🎧";
    return "📦"; // Mặc định
  };

  if (loading && products.length === 0) {
    return <div className="home-message">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="home-message error">Lỗi: {error}</div>;
  }

  return (
    <div className="home">
      {/* HERO SECTION - Giữ nguyên của bạn */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-subtitle">CÔNG NGHỆ MỚI NHẤT</p>
          <h1>Khám phá<br />công nghệ mới.</h1>
          <p className="hero-description">Những sản phẩm công nghệ mới nhất, chính hãng và chất lượng cao.</p>
          <button className="hero-button">Khám phá sản phẩm</button>
        </div>
      </section>

      {/* ⚡ CATEGORY SECTION (ĐÃ BIẾN THÀNH ĐỘNG) */}
      <section className="category-section">
        <div className="section-header">
          <p>DANH MỤC</p>
          <h2>Khám phá theo nhu cầu</h2>
        </div>

        <div className="category-list">
          {categories.map((category) => (
            <div 
              key={category._id} 
              /* Thêm class 'active' nếu danh mục này đang được chọn để đổi màu CSS */
              className={`category-item ${selectedCategory === category._id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category._id)}
              style={{ cursor: 'pointer' }}
            >
              <span>{getCategoryEmoji(category.name)}</span>
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS SECTION - Hiển thị danh sách sản phẩm sau khi lọc */}
      <section className="products-section">
        <div className="section-header">
          <p>SẢN PHẨM</p>
          <h2>{selectedCategory ? "Kết quả lọc sản phẩm" : "Sản phẩm mới nhất"}</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', width: '100%' }}>Đang lọc...</div>
        ) : (
          <div className="product-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p style={{ textAlign: 'center', width: '100%', color: '#666' }}>Không có sản phẩm nào thuộc danh mục này.</p>
            )}
          </div>
        )}
      </section>

      {/* PROMOTION SECTION - Giữ nguyên của bạn */}
      <section className="promotion">
        <div>
          <p>ƯU ĐÃI ĐẶC BIỆT</p>
          <h2>Công nghệ mới.<br />Giá tốt hơn.</h2>
          <button>Xem ưu đãi</button>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION - Giữ nguyên của bạn */}
      <section className="products-section">
        <div className="section-header">
          <p>ĐƯỢC QUAN TÂM</p>
          <h2>Sản phẩm nổi bật</h2>
        </div>
        <div className="product-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
