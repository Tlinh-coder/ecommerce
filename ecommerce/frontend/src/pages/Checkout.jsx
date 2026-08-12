import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDBUserCart, createOrder } from '../services/api';
import './Checkout.css';

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Các state lưu thông tin Form nhập liệu khớp chuẩn Backend của bạn
  const [receiverName, setReceiverName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const navigate = useNavigate();

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const data = await getDBUserCart();
        // Nếu giỏ hàng trống rỗng, không cho ở lại trang thanh toán
        if (!data.products || data.products.length === 0) {
          alert("Giỏ hàng của bạn đang trống!");
          navigate('/cart');
          return;
        }
        setCartItems(data.products);
        setLoading(false);
      } catch (error) {
        console.error(error);
        navigate('/cart');
      }
    };
    loadCheckoutData();
  }, [navigate]);

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.product.discount > 0
        ? item.product.price - (item.product.price * item.product.discount) / 100
        : item.product.price;
      return sum + (price * item.quantity);
    }, 0);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        receiverName,
        phone,
        address,
        paymentMethod
      };

      const response = await createOrder(orderData);

      if (response.success) {
        alert(`🎉 Đặt hàng thành công! Mã đơn hàng của bạn là: ${response.orderCode}`);
        
        // Phát sự kiện ép thanh Header reset số đếm giỏ hàng về 0 lập tức
        window.dispatchEvent(new Event("cartUpdate"));
        
        // Chuyển hướng người dùng về trang chủ (hoặc trang lịch sử đơn hàng sau này)
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng!");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  if (loading) return <div className="checkout-loading">Đang chuẩn bị hóa đơn...</div>;

  return (
    <div className="checkout-page">
      <h2 className="checkout-page-title">Thanh Toán Đơn Hàng</h2>
      
      <div className="checkout-container">
        {/* KHỐI BÊN TRÁI: FORM ĐIỀN THÔNG TIN NHẬN HÀNG */}
        <form onSubmit={handlePlaceOrder} className="checkout-form">
          <h3>Thông tin giao hàng</h3>
          
          <div className="checkout-input-group">
            <label>Họ và tên người nhận</label>
            <input 
              type="text" 
              placeholder="Nhập họ tên đầy đủ" 
              value={receiverName} 
              onChange={(e) => setReceiverName(e.target.value)} 
              required 
            />
          </div>

          <div className="checkout-input-group">
            <label>Số điện thoại liên hệ</label>
            <input 
              type="tel" 
              placeholder="Nhập số điện thoại nhận hàng" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
            />
          </div>

          <div className="checkout-input-group">
            <label>Địa chỉ nhận hàng chi tiết</label>
            <input 
              type="text" 
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/TP" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              required 
            />
          </div>

          <div className="checkout-input-group">
            <label>Phương thức thanh toán</label>
            <div className="payment-methods-wrapper">
              <label className="payment-method-option">
                <input 
                  type="radio" 
                  name="payment" 
                  value="COD" 
                  checked={paymentMethod === 'COD'} 
                  onChange={() => setPaymentMethod('COD')} 
                />
                <span>Thanh toán khi nhận hàng (COD)</span>
              </label>
              
              <label className="payment-method-option">
                <input 
                  type="radio" 
                  name="payment" 
                  value="BANKING" 
                  checked={paymentMethod === 'BANKING'} 
                  onChange={() => setPaymentMethod('BANKING')} 
                />
                <span>Chuyển khoản ngân hàng (Banking)</span>
              </label>
            </div>
          </div>

          <button type="submit" className="confirm-order-btn">
            Xác Nhận Đặt Mua
          </button>
        </form>

        {/* KHỐI BÊN PHẢI: TÓM TẮT SẢN PHẨM & TỔNG TIỀN */}
        <div className="checkout-summary-box">
          <h3>Đơn hàng của bạn</h3>
          <div className="checkout-products-list">
            {cartItems.map((item) => {
              const finalPrice = item.product.discount > 0
                ? item.product.price - (item.product.price * item.product.discount) / 100
                : item.product.price;
              return (
                <div className="checkout-product-item" key={item.product._id}>
                  <div className="product-item-left">
                    <span className="product-item-qty">{item.quantity}x</span>
                    <span className="product-item-name">{item.product.name}</span>
                  </div>
                  <span className="product-item-price">{formatPrice(finalPrice * item.quantity)}</span>
                </div>
              );
            })}
          </div>

          <div className="checkout-total-row">
            <span>Tổng số tiền cần trả:</span>
            <span className="checkout-final-price">{formatPrice(calculateTotal())}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
