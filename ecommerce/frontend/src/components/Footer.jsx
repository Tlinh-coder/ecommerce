import React from 'react';
import './Footer.css'; // Đảm bảo bạn tạo file Footer.css chung thư mục

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Cột 1: Giới thiệu */}
        <div className="footer-column">
          <h3 className="footer-logo">LinhTran<span>Shop</span></h3>
          <p className="footer-desc">
            Chuyên cung cấp các thiết bị công nghệ, điện thoại chính hãng với giá cả và dịch vụ tốt nhất thị trường.
          </p>
        </div>

        {/* Cột 2: Đường dẫn nhanh */}
        <div className="footer-column">
          <h4>Mua sắm</h4>
          <ul>
            <li><a href="#">Trang chủ</a></li>
            <li><a href="#">Sản phẩm</a></li>
            <li><a href="#">Danh mục</a></li>
            <li><a href="#">Khuyến mãi</a></li>
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ */}
        <div className="footer-column">
          <h4>Hỗ trợ khách hàng</h4>
          <ul>
            <li><a href="#">Chính sách bảo hành</a></li>
            <li><a href="#">Hình thức thanh toán</a></li>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Liên hệ hỗ trợ</a></li>
          </ul>
        </div>

        {/* Cột 4: Liên hệ */}
        <div className="footer-column">
          <h4>Liên hệ với chúng tôi</h4>
          <p className="contact-info">📍 Địa chỉ: Quận 1, TP. Hồ Chí Minh</p>
          <p className="contact-info">📞 Hotline: 1900 1234</p>
          <p className="contact-info">✉️ Email: support@linhtran.com</p>
        </div>
      </div>

      {/* Dòng bản quyền phía dưới cùng */}
      <div className="footer-bottom">
        <p>© 2026 LinhTran-Shop. All rights reserved. Designed by Linh.</p>
      </div>
    </footer>
  );
}

export default Footer;
