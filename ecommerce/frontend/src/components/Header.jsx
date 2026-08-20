import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDBUserCart } from "../services/api";  
import "./Header.css";

function Header() {
  const [clickedTab, setClickedTab] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();

  const updateCartCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCartCount(0);
      return;
    }
    try {
      const cartData=await getDBUserCart();
      const productsList = cartData?.products || cartData?.data?.products || [];
      const totalItems = productsList.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdate", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    return () => {
      window.removeEventListener("cartUpdate", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCartCount(0);
    alert("Đã đăng xuất tài khoản thành công!");
    navigate("/login");
  };

  const handleNavClick = (e, sectionId, tabName) => {
    e.preventDefault();
    setClickedTab(tabName);
    navigate({ pathname: "/", search: ""});
    setTimeout(() => {
      if (tabName === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 50);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/?search=${searchKeyword.trim()}`);
      setSearchKeyword("");
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={() => setClickedTab(null)}>
          LinhTran-Shop
        </Link>

        <nav className="header-nav">
          <Link to="/#home-section" className={`nav-link ${clickedTab === "home" ? "clicked-active" : ""}`} onClick={(e) => handleNavClick(e, "home-section", "home")}>Trang chủ</Link>
          <Link to="/#products-section" className={`nav-link ${clickedTab === "products" ? "clicked-active" : ""}`} onClick={(e) => handleNavClick(e, "products-section", "products")}>Sản phẩm</Link>
          <Link to="/#category-section" className={`nav-link ${clickedTab === "category" ? "clicked-active" : ""}`} onClick={(e) => handleNavClick(e, "category-section", "category")}>Danh mục</Link>
        </nav>

        <div className="header-actions">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn"></button>
          </form>

          <button className="header-icon-cart-wrapper" onClick={() => navigate('/cart')}>
            <span className="cart-icon-symbol">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          
          <div className="auth-buttons">
            {user ? (
              <div className="user-logged-in-wrapper">
                <span className="user-welcome-text">
                  Hi, <span>{user.username || user.name}</span>
                </span>
         
          {user?.role === "ADMIN"  && (
            <Link to="/admin" className="admin-shortcut-btn" onClick={() => setClickedTab(null)}>
              Quản lý 
            </Link>
          )}


                <button onClick={handleLogout} className="logout-button">
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="login-button" onClick={() => setClickedTab(null)}>Đăng nhập</Link>
                <Link to="/register" className="register-button" onClick={() => setClickedTab(null)}>Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 

export default Header;
