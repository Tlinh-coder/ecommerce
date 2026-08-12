import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css'; 

function Footer() {
  const navigate = useNavigate();

  const handleFooterNavClick = (e, sectionId, isHome = false) => {
    e.preventDefault();
    
    navigate("/"); 

    setTimeout(() => {
      if (isHome) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 50);
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3 className="footer-logo">LinhTran<span>Shop</span></h3>
          <p className="footer-desc">
            Chuyên cung cấp các thiết bị công nghệ, điện thoại chính hãng với giá cả và dịch vụ tốt nhất thị trường.
          </p>
        </div>

        <div className="footer-column">
          <h4>Mua sắm</h4>
          <ul>
            <li>
              <a href="#home-section" onClick={(e) => handleFooterNavClick(e, "home-section", true)}>
                Trang chủ
              </a>
            </li>
            <li>
              <a href="#products-section" onClick={(e) => handleFooterNavClick(e, "products-section")}>
                Sản phẩm
              </a>
            </li>
            <li>
              <a href="#category-section" onClick={(e) => handleFooterNavClick(e, "category-section")}>
                Danh mục
              </a>
            </li>
            <li><a href="#">Khuyến mãi</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Hỗ trợ khách hàng</h4>
          <ul>
            <li><a href="#">Chính sách bảo hành</a></li>
            <li><a href="#">Hình thức thanh toán</a></li>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Liên hệ hỗ trợ</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Liên hệ với chúng tôi</h4>
          <p className="contact-info">📍 Địa chỉ: Quận 1, TP. Hồ Chí Minh</p>
          <p className="contact-info">📞 Hotline: 1900 1234</p>
          <p className="contact-info">✉️ Email: support@linhtran.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 LinhTran-Shop. All rights reserved. Designed by Linh.</p>
      </div>
    </footer>
  );
}

export default Footer;
