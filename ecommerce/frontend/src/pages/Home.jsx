import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import { getAllProducts, getAllCategories, getProductsByCategory } from "../services/api";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); 

  // 1. LẤY DANH SÁCH DANH MỤC KHI TẢI TRANG
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

  // 2. LẮNG NGHE URL ĐỂ TẢI SẢN PHẨM PHÙ HỢP
  useEffect(() => {
    const fetchProductsData = async () => {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams(location.search);
      const searchParam = queryParams.get("search");
      const categoryParam = queryParams.get("category");

      try {
        if (searchParam) {
          const response = await axios.get(`http://localhost:8080/api/products?search=${encodeURIComponent(searchParam)}`);
          setProducts(response.data);
          setSelectedCategory(null); 
        } else if (categoryParam) {
          const data = await getProductsByCategory(categoryParam);
          setProducts(data);
          setSelectedCategory(categoryParam);
        } else {
          const data = await getAllProducts();
          setProducts(data);
          setSelectedCategory(null);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || "Không thể tải danh sách sản phẩm!");
        setLoading(false);
      }
    };

    fetchProductsData();
  }, [location.search]); 

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      navigate("/"); 
    } else {
      navigate(`/?category=${categoryId}`); 
    }
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
      <section className="hero" id="home-section">
        <div className="hero-content">
          <p className="hero-subtitle">CÔNG NGHỆ MỚI NHẤT</p>
          <h1>Khám phá<br />công nghệ mới.</h1>
          <p className="hero-description">Những sản phẩm công nghệ mới nhất, chính hãng và chất lượng cao.</p>
          <button className="hero-button"
            onClick={() => {
              const element = document.getElementById('products-section');
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Khám phá sản phẩm
          </button>
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
              <div className="category-icon-wrapper">
                <img 
                  src={
                    category.image ? category.image :
                    category.name.toLowerCase().includes("thoại") || category.name.toLowerCase().includes("phone")
                      ? "https://cdn-icons-png.flaticon.com/128/644/644458.png"
                    : category.name.toLowerCase().includes("bảng") || category.name.toLowerCase().includes("tablet")
                      ? "https://cdn-icons-png.flaticon.com/128/3458/3458780.png"
                    : category.name.toLowerCase().includes("laptop") || category.name.toLowerCase().includes("máy tính")
                      ? "https://cdn-icons-png.flaticon.com/128/2888/2888704.png"
                    : category.name.toLowerCase().includes("kiện") || category.name.toLowerCase().includes("accessory")
                      ? "https://cdn-icons-png.flaticon.com/128/8488/8488889.png"
                    : "https://flaticon.com"
                  } 
                  alt={category.name} 
                  className="category-custom-img"
                />
              </div>
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
      <section className="products-section" id="featured-products-section" >
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
