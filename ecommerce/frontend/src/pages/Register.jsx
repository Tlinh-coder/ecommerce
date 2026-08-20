import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isOtpStep, setIsOtpStep] = useState(false); 
  const [otp, setOtp] = useState('');


  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();


  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
   
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username: username, 
        name: name,
        email: email,
        password: password
      });

      if (response.status === 201 || response.data.success) {
        setSuccessMessage(response.data.message);
        setIsOtpStep(true);
      }
    } catch (error) {
      console.error("Lỗi đăng ký cụ thể:", error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Không thể kết nối đến hệ thống máy chủ!");
      }
    }
  };


  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/verify-email', {
        email: email,
        otp: otp
      });

      if (response.status === 200 || response.data.success) {
        alert("Xác thực Email thành công! Bạn có thể đăng nhập ngay.");
        navigate('/login'); 
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Mã OTP xác thực không chính xác hoặc hết hạn!");
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        

        {errorMessage && (
          <p style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '8px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px', fontWeight: '500' }}>
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p style={{ color: '#388e3c', backgroundColor: '#e8f5e9', padding: '8px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px', fontWeight: '500' }}>
            {successMessage}
          </p>
        )}


        {!isOtpStep ? (
          <>
            <h2 className="register-title">Tạo Tài Khoản</h2>
            <p className="register-subtitle">Tham gia mua sắm công nghệ cùng LinhTran-Shop</p>

            <form onSubmit={handleRegisterSubmit} className="register-form">
           
              <div className="input-group">
                <label htmlFor="username">Tên tài khoản (Username)</label>
                <input 
                  type="text" 
                  id="username" 
                  placeholder="Ví dụ: linhtran123" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>


              <div className="input-group">
                <label htmlFor="name">Họ và tên</label>
                <input 
                  type="text" 
                  id="name" 
                  placeholder="Nhập họ và tên của bạn" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>


              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="example@gmail.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>


              <div className="input-group">
                <label htmlFor="password">Mật khẩu</label>
                <div className="password-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    placeholder="Tạo mật khẩu an toàn" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <button type="submit" className="submit-register-btn">
                Đăng Ký
              </button>
            </form>

            <p className="redirect-login">
              Bạn đã có tài khoản rồi? <Link to="/login">Đăng nhập</Link>
            </p>
          </>
        ) : (

          <>
            <h2 className="register-title">Xác Thực Email</h2>
            <p className="register-subtitle">Chúng tôi đã gửi mã OTP gồm 6 chữ số đến email <b>{email}</b> của bạn.</p>

            <form onSubmit={handleVerifyOtpSubmit} className="register-form">
              <div className="input-group" style={{ textAlign: 'center' }}>
                <label htmlFor="otp" style={{ textAlign: 'center', display: 'block' }}>Mã OTP (Hết hạn sau 5 phút)</label>
                <input 
                  type="text" 
                  id="otp" 
                  placeholder="------" 
                  maxLength="6"
                  style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px', fontWeight: 'bold' }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="submit-register-btn">
                Xác Nhận Kích Hoạt
              </button>
            </form>
            
            <p className="redirect-login">
              Không nhận được mã? <span style={{ cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }} onClick={() => setIsOtpStep(false)}>Quay lại sửa thông tin</span>
            </p>
          </>
        )}

      </div>
    </div>
  );
}

export default Register;
