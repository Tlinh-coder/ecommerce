import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories, getAllProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import './Admin.css';

function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [formData, setFormData] = useState({
    brand: 'Apple',
    name: '',
    sku: '',
    price: '',
    discount: 0,
    quantity: 10,
    description: '',
    chip: '',
    ram: '',
    rom: '',
    battery: '',
    screen: '',
    thumbnail: '',
    category: '',
  });

  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesData, productsData] = await Promise.all([
        getAllCategories(),
        getAllProducts(),
      ]);
      setCategories(categoriesData);
      setProducts(productsData);
      if (categoriesData.length > 0 && !formData.category) {
        setFormData((prev) => ({ ...prev, category: categoriesData[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const userRole = savedUser?.role || savedUser?.user?.role || "";

    if (!token || !savedUser || userRole.toLowerCase() !== 'admin') {
      alert("Bạn không có quyền truy cập trang quản trị!");
      navigate('/');
      return;
    }
    loadData();
  }, [navigate]);

  const resetForm = () => {
    setFormData({
      brand: 'Apple',
      name: '',
      sku: '',
      price: '',
      discount: 0,
      quantity: 10,
      description: '',
      chip: '',
      ram: '',
      rom: '',
      battery: '',
      screen: '',
      thumbnail: '',
      category: categories[0]?._id || '',
    });
    setIsEditing(false);
    setEditingProductId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const productData = {
      ...formData,
      price: Number(formData.price),
      discount: Number(formData.discount),
      quantity: Number(formData.quantity),
      ram: Number(formData.ram),
      rom: Number(formData.rom),
      battery: Number(formData.battery),
      status: "AVAILABLE",
    };

    try {
      if (isEditing) {
        await updateProduct(editingProductId, productData);
        alert(`🎉 Cập nhật sản phẩm "${formData.name}" thành công!`);
      } else {
        await createProduct(productData);
        alert(`🎉 Thêm sản phẩm "${formData.name}" thành công!`);
      }
      resetForm();
      loadData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Lỗi xử lý dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setEditingProductId(product._id);
    setFormData({
      brand: product.brand || 'Apple',
      name: product.name || '',
      sku: product.sku || '',
      price: product.price || '',
      discount: product.discount || 0,
      quantity: product.quantity || product.stock || 10,
      description: product.description || '',
      chip: product.chip || '',
      ram: product.ram || '',
      rom: product.rom || '',
      battery: product.battery || '',
      screen: product.screen || '',
      thumbnail: product.thumbnail || '',
      category: product.category?._id || product.category || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (productId, productName) => {
    if (window.confirm(`⚠️ Bạn có chắc chắn muốn xóa sản phẩm "${productName}" không?`)) {
      try {
        await deleteProduct(productId);
        alert(`Đã xóa thành công: ${productName}`);
        loadData();
      } catch (error) {
        console.error(error);
        alert("Lỗi không thể xóa sản phẩm này!");
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  return (
    <div className="admin-page">
      <h2 className="admin-title">Admin Dashboard</h2>
      <div className="admin-container">
        
        <form onSubmit={handleSubmit} className="admin-product-form">
          <h3>{isEditing ? `Chỉnh sửa: ${formData.name} ` : "Thêm sản phẩm công nghệ mới"}</h3>
          <div className="admin-grid-inputs">
            {[
              { label: "Tên sản phẩm *", name: "name", type: "text" },
              { label: "Mã sản phẩm (SKU) *", name: "sku", type: "text" },
              { label: "Giá tiền (VND) *", name: "price", type: "number"},
              { label: "Giảm giá (%)", name: "discount", type: "number" },
              { label: "Số lượng kho *", name: "quantity", type: "number" },
              { label: "Hãng sản xuất", name: "brand", type: "text" },
              { label: "Chip vi xử lý", name: "chip", type: "text"},
              { label: "RAM (GB)", name: "ram", type: "number" },
              { label: "ROM (GB)", name: "rom", type: "number" },
              { label: "Dung lượng Pin (mAh)", name: "battery", type: "number" },
              { label: "Màn hình hiển thị", name: "screen", type: "text" },
            ].map((input) => (
              <div className="admin-input-group" key={input.name}>
                <label>{input.label}</label>
                <input
                  type={input.type}
                  name={input.name}
                  placeholder={input.placeholder}
                  value={formData[input.name]}
                  onChange={handleInputChange}
                  required={input.label.includes("*")}
                />
              </div>
            ))}
            <div className="admin-input-group">
              <label>Danh mục phân loại *</label>
              <select name="category" value={formData.category} onChange={handleInputChange} required>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="admin-input-group comprehensive">
            <label>Đường dẫn hình ảnh (URL) *</label>
            <input
              type="text"
              name="thumbnail"
              placeholder="Dán link ảnh đại diện sản phẩm..."
              value={formData.thumbnail}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="admin-input-group comprehensive">
            <label>Mô tả chi tiết sản phẩm</label>
            <textarea
              name="description"
              rows="3"
              placeholder="Nhập thông tin giới thiệu tính năng nổi bật..."
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="admin-form-buttons-wrapper">
            <button type="submit" className="admin-submit-btn" disabled={loading}>
              {loading ? "Processing..." : isEditing ? "Update Product 🛠️" : "Add Product 🚀"}
            </button>
            {isEditing && (
              <button type="button" className="admin-cancel-edit-btn" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="admin-products-management-list">
          <h3>Danh sách sản phẩm hiện có ({products.length})</h3>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Mã SKU</th>
                  <th>Giá gốc</th>
                  <th>Kho</th>
                  <th>Danh mục</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      <img src={prod.thumbnail || "https://placehold.co"} alt={prod.name} className="admin-table-img" />
                    </td>
                    <td className="admin-table-name-cell">{prod.name}</td>
                    <td><code>{prod.sku}</code></td>
                    <td className="admin-table-price-cell">{formatPrice(prod.price)}</td>
                    <td>{prod.quantity || prod.stock || 0}</td>
                    <td>{prod.category?.name || "Chưa phân loại"}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button type="button" className="action-btn-edit" onClick={() => handleEditClick(prod)}>Sửa</button>
                        <button type="button" className="action-btn-delete" onClick={() => handleDeleteClick(prod._id, prod.name)}>Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
