import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDBUserCart, addToDBCart, removeFromDBCart } from '../services/api'; // Dùng bộ API gọi sang cổng 8080
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCartFromDB = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await getDBUserCart();

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


  const handleQuantityChange = async (productId, change) => {
    try {
      const currentItem = cartItems.find(item => item.product._id === productId);

      if (currentItem.quantity + change < 1) return;


      await addToDBCart(productId, change); 
      

      loadCartFromDB(); 
      

      window.dispatchEvent(new Event("cartUpdate")); 
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
    }
  };


  const handleRemoveItem = async (productId) => {
    try {
      await removeFromDBCart(productId);
      loadCartFromDB(); 
      window.dispatchEvent(new Event("cartUpdate")); 
    } catch (error) {
      console.error("Lỗi xóa sản phẩm khỏi giỏ:", error);
    }
  };


  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {

      const finalPrice = item.product.discount > 0
        ? item.product.price - (item.product.price * item.product.discount) / 100
        : item.product.price;
      return sum + (finalPrice * item.quantity);
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };


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
          <p>Giỏ hàng của tài khoản đang trống. Hãy chọn thêm sản phẩm nhé!</p>
          <Link to="/" className="shop-now-btn">Quay lại mua sắm</Link>
        </div>
      ) : (
        <div className="cart-container">
          

          <div className="cart-items-list">
            {cartItems.map((item) => {
              if (!item.product)
                return null;
              const finalPrice = item.product.discount > 0
                ? item.product.price - (item.product.price * item.product.discount) / 100
                : item.product.price;

              return (
                <div className="cart-item-row" key={item.product._id}>
                  <img src={item.product.thumbnail || "https://placehold.co"} alt={item.product.name} className="cart-item-img" />
                                    <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.product.name}</h4>
                    <p className="cart-item-price">{formatPrice(finalPrice)}</p>
                  </div>


                  <div className="cart-item-quantity">
                    <button onClick={() => handleQuantityChange(item.product._id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.product._id, 1)}>+</button>
                  </div>

       
                  <p className="cart-item-subtotal">{formatPrice(finalPrice * item.quantity)}</p>


                  <button className="cart-item-delete" onClick={() => handleRemoveItem(item.product._id)}>✕</button>
                </div>
              );
            })}
          </div>

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
