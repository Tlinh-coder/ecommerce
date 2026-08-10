import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Bổ sung useNavigate để chuyển trang
import axios from 'axios'; // 2. Bổ sung thư viện axios để gọi API
import './Login.css';

function Login() {
  // 3. THÊM STATE ĐỂ LƯU DỮ LIỆU NGƯỜI DÙNG GÕ VÀO
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Lưu thông báo lỗi nếu đăng nhập sai

  const navigate = useNavigate(); // Dùng để chuyển hướng sau khi đăng nhập thành công

  // 4. CẬP NHẬT HÀM XỬ LÝ ĐĂNG NHẬP KẾT NỐI BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Xóa thông báo lỗi cũ trước khi gửi yêu cầu mới

    try {
      // Gọi API sang chính xác cổng 8080 của Backend bạn đang chạy
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email,
        password: password
      });

      // Nếu Backend trả về thành công (success: true)
      if (response.data.success||response.status === 200) {
        alert("Đăng nhập thành công!");
        
        // Lưu token xác thực và thông tin user vào bộ nhớ trình duyệt (localStorage)
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Chuyển hướng người dùng về trang chủ
        navigate('/');
        
        // Làm mới trang để thanh Header nhận diện trạng thái đã đăng nhập (Ẩn nút Đăng nhập/Đăng ký)
        window.location.reload();
      }
    } catch (error) {
      // Nhận thông báo lỗi từ file authController của Backend trả về
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message); // Ví dụ: "Tài khoản hoặc mật khẩu không chính xác!"
      } else {
        setErrorMessage("Không thể kết nối đến máy chủ Backend!");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        {/* Tiêu đề */}
        <h2 className="login-title">Đăng Nhập</h2>
        <p className="login-subtitle">Chào mừng bạn quay trở lại với LinhTran-Shop</p>

        {/* 5. HIỂN THỊ DÒNG THÔNG BÁO LỖI NẾU CÓ */}
        {errorMessage && (
          <p style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '8px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px', fontWeight: '500' }}>
            {errorMessage}
          </p>
        )}

        {/* Form điền thông tin */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Ô nhập Email */}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="example@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Cập nhật chữ khi gõ
              required 
            />
          </div>

          {/* Ô nhập Mật khẩu */}
          <div className="input-group">
            <div className="label-wrapper">
              <label htmlFor="password">Mật khẩu</label>
              <a href="#" className="forgot-password">Quên mật khẩu?</a>
            </div>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                placeholder="Nhập mật khẩu của bạn" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Cập nhật chữ khi gõ
                required 
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Nút Đăng nhập */}
          <button type="submit" className="submit-login-btn">
            Đăng Nhập
          </button>
        </form>

        {/* Chuyển sang trang Đăng ký */}
        <p className="redirect-register">
          Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
