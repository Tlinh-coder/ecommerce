import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // ⚡ 1. Bổ sung useLocation để bắt từ khóa trên URL
import { getAllProducts, getAllCategories, getProductsByCategory } from "../services/api";
import ProductCard from "../components/ProductCard";
import axios from "axios"; // Bổ sung axios để gọi API tìm kiếm
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation(); // Lấy thông tin URL hiện tại của trình duyệt

  // 1. Tự động tải danh sách Danh mục một lần duy nhất khi mở trang
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Lỗi lấy danh mục:", err.message);
      }
    };
    fetchCategoriesData();
  }, []);

  // 2. ⚡ LẮNG NGHE SỰ KIỆN TÌM KIẾM HOẶC TẢI SẢN PHẨM MỚI
  useEffect(() => {
    const fetchProductsData = async () => {
      setLoading(true);
      setError(null);

      // Đọc tham số ?search=... từ thanh địa chỉ URL của trình duyệt
      const queryParams = new URLSearchParams(location.search);
      const searchParam = queryParams.get("search");

      try {
        if (searchParam) {
          // Nếu có từ khóa tìm kiếm: Gọi API lọc theo từ khóa sang Backend cổng 8080
          const response = await axios.get(`http://localhost:8080/api/products?search=${encodeURIComponent(searchParam)}`);
          setProducts(response.data);
          setSelectedCategory(null); // Hủy trạng thái chọn danh mục nếu đang tìm kiếm toàn sàn
        } else {
          // Nếu không có tìm kiếm: Tải tất cả sản phẩm như bình thường
          const data = await getAllProducts();
          setProducts(data);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || "Không thể tải danh sách sản phẩm!");
        setLoading(false);
      }
    };

    fetchProductsData();
  }, [location.search]); // ⚡ Chạy lại hàm này mỗi khi tham số tìm kiếm trên URL thay đổi

  // 3. Hàm xử lý khi người dùng click chọn 1 Danh mục để lọc
  const handleCategoryClick = async (categoryId) => {
    setLoading(true);
    try {
      if (selectedCategory === categoryId) {
        const data = await getAllProducts();
        setProducts(data);
        setSelectedCategory(null);
      } else {
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

  // Hàm định nghĩa icon tương ứng cho từng tên danh mục
  const getCategoryEmoji = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("thoại") || lowerName.includes("phone")) return "📱";
    if (lowerName.includes("laptop") || lowerName.includes("máy tính")) return "💻";
    if (lowerName.includes("đồng hồ") || lowerName.includes("watch")) return "⌚";
    if (lowerName.includes("kiện") || lowerName.includes("accessory") || lowerName.includes("tai nghe") || lowerName.includes("loa")) return "🎧";
    return "📦"; 
  };

  if (loading && products.length === 0 && categories.length === 0) {
    return <div className="home-message">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="home-message error">Lỗi: {error}</div>;
  }

  return (
    <div className="home">
      {/* HERO SECTION */}
      <section className="hero" id="home-section"> {/* Đã sửa id đồng bộ với Header */}
        <div className="hero-content">
          <p className="hero-subtitle">CÔNG NGHỆ MỚI NHẤT</p>
          <h1>Khám phá<br />công nghệ mới.</h1>
          <p className="hero-description">Những sản phẩm công nghệ mới nhất, chính hãng và chất lượng cao.</p>
          <button className="hero-button">Khám phá sản phẩm</button>
        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section className="category-section" id="category-section">
        <div className="section-header">
          <p>DANH MỤC</p>
          <h2>Khám phá theo nhu cầu</h2>
        </div>

        <div className="category-list">
          {categories.map((category) => (
            <div 
              key={category._id} 
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

      {/* PRODUCTS SECTION */}
      <section className="products-section" id="products-section">
        <div className="section-header">
          <p>SẢN PHẨM</p>
          <h2>
            {new URLSearchParams(location.search).get("search") 
              ? `Kết quả tìm kiếm cho: "${new URLSearchParams(location.search).get("search")}"` 
              : selectedCategory 
              ? "Kết quả lọc sản phẩm" 
              : "Sản phẩm mới nhất"}
          </h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', width: '100%' }}>Đang quét dữ liệu...</div>
        ) : (
          <div className="product-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p style={{ textAlign: 'center', width: '100%', color: '#666', padding: '40px 0' }}>Không tìm thấy sản phẩm nào khớp với yêu cầu.</p>
            )}
          </div>
        )}
      </section>

      {/* PROMOTION SECTION */}
      <section className="promotion">
        <div>
          <p>ƯU ĐÃI ĐẶC BIỆT</p>
          <h2>Công nghệ mới.<br />Giá tốt hơn.</h2>
          <button>Xem ưu đãi</button>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
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
