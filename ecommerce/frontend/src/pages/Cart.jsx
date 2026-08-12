import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDBUserCart, addToDBCart, removeFromDBCart } from '../services/api'; // Dùng bộ API gọi sang cổng 8080
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hàm tải dữ liệu giỏ hàng thực tế từ Database MongoDB về
  const loadCartFromDB = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await getDBUserCart();
      // Dữ liệu từ Backend trả về mảng nằm trong thuộc tính data.products
      setCartItems(data.products || []);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng từ DB:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartFromDB();
  }, []);

  // Thay đổi số lượng tăng hoặc giảm sản phẩm (+1 hoặc -1)
  const handleQuantityChange = async (productId, change) => {
    try {
      const currentItem = cartItems.find(item => item.product._id === productId);
      // Nếu số lượng bằng 1 mà khách bấm nút giảm (-) thì chặn không cho giảm nữa
      if (currentItem.quantity + change < 1) return;

      // Gọi API gửi lên Backend (Backend tự động cộng dồn số lượng)
      await addToDBCart(productId, change); 
      
      // Tải lại dữ liệu mới từ Database để cập nhật màn hình
      loadCartFromDB(); 
      
      // Bắn sự kiện ép thanh Header nhảy lại số chấm đỏ lập tức
      window.dispatchEvent(new Event("cartUpdate")); 
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
    }
  };

  // Xóa hẳn một sản phẩm ra khỏi giỏ hàng
  const handleRemoveItem = async (productId) => {
    try {
      await removeFromDBCart(productId);
      loadCartFromDB(); // Tải lại giỏ hàng
      window.dispatchEvent(new Event("cartUpdate")); // Cập nhật số đếm Header
    } catch (error) {
      console.error("Lỗi xóa sản phẩm khỏi giỏ:", error);
    }
  };

  // Tính tổng tiền của toàn bộ giỏ hàng
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      // Tính giá đã giảm nếu sản phẩm có discount
      const finalPrice = item.product.discount > 0
        ? item.product.price - (item.product.price * item.product.discount) / 100
        : item.product.price;
      return sum + (finalPrice * item.quantity);
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  // Nếu chưa đăng nhập, bắt người dùng đi đăng nhập
  const token = localStorage.getItem("token");
  if (!token) {
    return (
      <div className="cart-page-empty-wrapper">
        <div className="empty-cart">
          <p>Vui lòng đăng nhập tài khoản để xem giỏ hàng của bạn.</p>
          <Link to="/login" className="shop-now-btn">Đăng nhập ngay</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="cart-loading">Đang tải giỏ hàng tài khoản...</div>;
  }

  return (
    <div className="cart-page">
      <h2 className="cart-title">Giỏ Hàng Của Bạn</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Giỏ hàng của tài khoản đang trống rỗng. Hãy chọn thêm sản phẩm nhé!</p>
          <Link to="/" className="shop-now-btn">Quay lại mua sắm</Link>
        </div>
      ) : (
        <div className="cart-container">
          
          {/* BẢNG DANH SÁCH SẢN PHẨM MUA BÊN TRÁI */}
          <div className="cart-items-list">
            {cartItems.map((item) => {
              const finalPrice = item.product.discount > 0
                ? item.product.price - (item.product.price * item.product.discount) / 100
                : item.product.price;

              return (
                <div className="cart-item-row" key={item.product._id}>
                  <img src={item.product.thumbnail || "https://placehold.co"} alt={item.product.name} className="cart-item-img" />
                  
                  {/* Thông tin tên và giá đơn lẻ */}
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.product.name}</h4>
                    <p className="cart-item-price">{formatPrice(finalPrice)}</p>
                  </div>

                  {/* Bộ nút tăng giảm số lượng */}
                  <div className="cart-item-quantity">
                    <button onClick={() => handleQuantityChange(item.product._id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.product._id, 1)}>+</button>
                  </div>

                  {/* Tổng tiền của riêng sản phẩm đó (Giá x Số lượng) */}
                  <p className="cart-item-subtotal">{formatPrice(finalPrice * item.quantity)}</p>

                  {/* Nút xóa sản phẩm */}
                  <button className="cart-item-delete" onClick={() => handleRemoveItem(item.product._id)}>✕</button>
                </div>
              );
            })}
          </div>

          {/* KHỐI KHÓA TỔNG TIỀN BÊN PHẢI */}
          <div className="cart-summary">
            <h3>Tóm tắt đơn hàng</h3>
            <div className="summary-row">
              <span>Tổng số lượng:</span>
              <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} món</span>
            </div>
            <div className="summary-row total">
              <span>Tổng tiền thanh toán:</span>
              <span className="total-amount">{formatPrice(calculateTotal())}</span>
            </div>
            {/* ⚡ BẤM NÚT SẼ CHUYỂN HƯỚNG SANG TRANG THANH TOÁN RIÊNG Checkout.jsx */}
            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
              Tiến Hành Đặt Hàng
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default Cart;
