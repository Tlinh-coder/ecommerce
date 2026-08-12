import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";


const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

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

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    if (response.data && response.data.length > 0) {
      return response.data;
    }
    return [
      { _id: "6a701b0b34fe939e982e5555", name: "Điện thoại" },
      { _id: "6a79899cc073a188d1a79dab", name: "Phụ kiện" },
      { _id: "6a7996b5c41125145bf019cb", name: "Laptop" },
      { _id: "6a79a0f5c41125145bf019cc", name: "Đồng hồ thông minh" }
    ];
  } catch (error) {
    console.error("Lỗi kết nối Backend, nạp danh mục dự phòng:", error);
    return [
      { _id: "6a701b0b34fe939e982e5555", name: "Điện thoại" },
      { _id: "6a79899cc073a188d1a79dab", name: "Phụ kiện" }
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

export const createOrder = async (orderData) => {
  const response = await axios.post(`${API_BASE_URL}/orders/create`, orderData, getAuthHeaders());
  return response.data;
};
export const updateProduct = async (productId, updatedData) => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.put(`${API_BASE_URL}/products/${productId}`, updatedData, { headers });
  return response.data;
};
export const deleteProduct = async (productId) => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.delete(`${API_BASE_URL}/products/${productId}`, { headers });
  return response.data;
};
export const createProduct = async (productData) => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error('Failed to create product');
  }

  return await response.json();
};