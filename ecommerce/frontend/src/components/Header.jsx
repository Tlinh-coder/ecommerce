import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">

      <div className="header-container">

        {/* LOGO */}
        <Link to="/" className="logo">
          E-Shop
        </Link>


        {/* NAVIGATION */}
        <nav className="header-nav">

          <Link to="/" className="nav-link">
            Trang chủ
          </Link>

          <Link to="/" className="nav-link">
            Sản phẩm
          </Link>

          <Link to="/" className="nav-link">
            Danh mục
          </Link>

        </nav>


        {/* ACTIONS */}
        <div className="header-actions">

          <button className="header-icon">
            🔍
          </button>

          <button className="header-icon">
            🛒
          </button>

          <Link to="/login" className="login-button">
            Đăng nhập
          </Link>

        </div>

      </div>

    </header>
  );
}

export default Header;