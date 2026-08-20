import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ============== PRODUCT APIs ==============
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy tất cả sản phẩm:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy chi tiết sản phẩm:", error);
    throw error;
  }
};

export const searchProducts = async (keyword) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products?search=${keyword}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tìm kiếm sản phẩm');
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products`, productData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi tạo sản phẩm:", error);
    throw error;
  }
};

export const updateProduct = async (productId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/products/${productId}`, updatedData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật sản phẩm:", error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/products/${productId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi xóa sản phẩm:", error);
    throw error;
  }
};

// ============== CATEGORY APIs ==============
export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    if (response.data && response.data.length > 0) {
      return response.data;
    }
    return [
      { _id: "6a701b0b34fe939e982e5555", name: "Điện thoại", image:"https://cdn-icons-png.flaticon.com/128/644/644458.png" },
      { _id: "6a868c280eded8c1ff9f35fe", name: "Máy Tính Bảng", image:"https://cdn-icons-png.flaticon.com/128/3458/3458780.png" },
      { _id: "6a7996b5c41125145bf019cb", name: "Laptop", image:"https://cdn-icons-png.flaticon.com/128/2888/2888704.png" },
      { _id: "6a79a0f5c41125145bf019cc", name: "Phụ Kiện", image:"https://cdn-icons-png.flaticon.com/128/8488/8488889.png" }
    ];
  } catch (error) {
    console.error("Lỗi kết nối Backend, nạp danh mục dự phòng:", error);
    return [
      { _id: "6a701b0b34fe939e982e5555", name: "Điện thoại" },
      { _id: "6a868c280eded8c1ff9f35fe", name: "Máy Tính Bảng" },
      { _id: "6a7996b5c41125145bf019cb", name: "Laptop" },
      { _id: "6a79a0f5c41125145bf019cc", name: "Phụ Kiện" }
    ];
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products?category=${categoryId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể tải sản phẩm theo danh mục');
  }
};

// ============== CART APIs ==============
export const getDBUserCart = async () => {
  const token = localStorage.getItem("token");
  if (!token) return { products: [] }; 
  const response = await axios.get(`${API_BASE_URL}/cart`, getAuthHeaders());
  return response.data;
};

export const addToDBCart = async (productId, quantity = 1) => {
  const response = await axios.post(`${API_BASE_URL}/cart/add`, { productId, quantity }, getAuthHeaders());
  return response.data;
};

export const removeFromDBCart = async (productId) => {
  const response = await axios.delete(`${API_BASE_URL}/cart/remove/${productId}`, getAuthHeaders());
  return response.data;
};

export const updateCartQuantity = async (productId, quantity) => {
  const response = await axios.put(`${API_BASE_URL}/cart/update`, { productId, quantity }, getAuthHeaders());
  return response.data;
};

export const clearCart = async () => {
  const response = await axios.delete(`${API_BASE_URL}/cart/clear`, getAuthHeaders());
  return response.data;
};

// ============== ORDER APIs ==============
export const getAllOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách đơn hàng:", error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy chi tiết đơn hàng:", error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  const response = await axios.post(`${API_BASE_URL}/orders/create`, orderData, getAuthHeaders());
  return response.data;
};

export const updateOrderStatus = async (orderId, statusData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, statusData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/cancel`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi hủy đơn hàng:", error);
    throw error;
  }
};

export const getMyOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/my-orders`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy đơn hàng của tôi:", error);
    throw error;
  }
};

// ============== USER APIs ==============
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách người dùng:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy chi tiết người dùng:", error);
    throw error;
  }
};

export const updateUserRole = async (userId, roleData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}/role`, roleData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật vai trò người dùng:", error);
    throw error;
  }
};

export const updateUserStatus = async (userId, statusData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}/status`, statusData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái người dùng:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi xóa người dùng:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật thông tin người dùng:", error);
    throw error;
  }
};

// ============== PAYMENT APIs ==============
export const createVNPayPayment = async (orderId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    "http://localhost:8080/api/payment/vnpay/create",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ orderId })
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Không thể tạo thanh toán VNPAY");
  }
  return data;
};

// ============== DASHBOARD STATS APIs ==============
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy thống kê dashboard:", error);
    // Trả về dữ liệu mẫu nếu API chưa có
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      monthlyOrders: 0,
      lowStockItems: 0,
      totalStock: 0
    };
  }
};

export const getMonthlyRevenue = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/revenue/monthly`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy doanh thu tháng:", error);
    return 0;
  }
};

export const getTotalRevenue = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/revenue/total`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy tổng doanh thu:", error);
    return 0;
  }
};

export const getRevenueByPeriod = async (period) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/revenue/${period}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error(`Lỗi lấy doanh thu theo ${period}:`, error);
    return [];
  }
};

// ============== AUTH APIs ==============
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/logout`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
    throw error;
  }
};

// ============== REVIEW APIs ==============
export const getProductReviews = async (productId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reviews/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy đánh giá sản phẩm:", error);
    throw error;
  }
};

export const createReview = async (reviewData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reviews`, reviewData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi tạo đánh giá:", error);
    throw error;
  }
};

export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/reviews/${reviewId}`, reviewData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật đánh giá:", error);
    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/reviews/${reviewId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Lỗi xóa đánh giá:", error);
    throw error;
  }
};

// Export default để sử dụng import api from './api'
export default {
  // Products
  getAllProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // Categories
  getAllCategories,
  getProductsByCategory,
  
  // Cart
  getDBUserCart,
  addToDBCart,
  removeFromDBCart,
  updateCartQuantity,
  clearCart,
  
  // Orders
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getMyOrders,
  
  // Users
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  updateUserProfile,
  
  // Payment
  createVNPayPayment,
  
  // Dashboard
  getDashboardStats,
  getMonthlyRevenue,
  getTotalRevenue,
  getRevenueByPeriod,
  
  // Auth
  login,
  register,
  logout,
  
  // Reviews
  getProductReviews,
  createReview,
  updateReview,
  deleteReview
};