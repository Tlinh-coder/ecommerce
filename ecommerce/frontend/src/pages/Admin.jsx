import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAllCategories, 
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getAllOrders,
  getAllUsers
} from '../services/api';
import './Admin.css';

function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [error, setError] = useState(null);

  // Dashboard stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStockItems: 0,
    monthlyOrders: 0,
    totalOrders: 0,
    monthlyRevenue: 0,
    totalRevenue: 0
  });

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

  // Hàm load tất cả dữ liệu
  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load tất cả dữ liệu song song
      const [categoriesData, productsData, ordersData, usersData] = await Promise.all([
        getAllCategories(),
        getAllProducts(),
        getAllOrders(),
        getAllUsers()
      ]);
      
      setCategories(categoriesData || []);
      setProducts(productsData || []);
      setOrders(ordersData || []);
      setUsers(usersData || []);
      
      // Tính toán stats
      calculateStats(productsData || [], ordersData || []);
      
      // Set default category
      if (categoriesData && categoriesData.length > 0 && !formData.category) {
        setFormData((prev) => ({ ...prev, category: categoriesData[0]._id }));
      }
    } catch (err) {
      console.error('Lỗi load dữ liệu:', err);
      setError('Không thể tải dữ liệu từ server. Vui lòng kiểm tra kết nối!');
      
      // Vẫn hiển thị dữ liệu đã có nếu có
      if (products.length === 0) {
        // Nếu chưa có dữ liệu nào, thử load từng cái một
        try {
          const categoriesData = await getAllCategories();
          setCategories(categoriesData || []);
        } catch (e) {}
        
        try {
          const productsData = await getAllProducts();
          setProducts(productsData || []);
        } catch (e) {}
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm tính toán thống kê
  const calculateStats = (productsData, ordersData) => {
    try {
      const totalProducts = productsData?.length || 0;
      const totalStock = productsData?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0;
      const lowStockItems = productsData?.filter(p => (p.quantity || 0) < 5).length || 0;
      
      // Tính đơn hàng tháng này
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const monthlyOrders = ordersData?.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= firstDayOfMonth;
      }).length || 0;
      
      const totalOrders = ordersData?.length || 0;
      
      // Tính doanh thu
      const monthlyRevenue = ordersData?.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= firstDayOfMonth;
      }).reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0;
      
      const totalRevenue = ordersData?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0;
      
      setStats({
        totalProducts,
        totalStock,
        lowStockItems,
        monthlyOrders,
        totalOrders,
        monthlyRevenue,
        totalRevenue
      });
    } catch (err) {
      console.error('Lỗi tính toán stats:', err);
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
    loadAllData();
  }, [navigate]);

  // Reset form
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
        alert(`Cập nhật sản phẩm "${formData.name}" thành công!`);
      } else {
        await createProduct(productData);
        alert(`Thêm sản phẩm "${formData.name}" thành công!`);
      }
      resetForm();
      await loadAllData();
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
    setActiveSection('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (productId, productName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}" không?`)) {
      try {
        await deleteProduct(productId);
        alert(`Đã xóa thành công: ${productName}`);
        await loadAllData();
      } catch (error) {
        console.error(error);
        alert("Lỗi không thể xóa sản phẩm này!");
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING': { label: 'Chờ xử lý', class: 'status-pending' },
      'PROCESSING': { label: 'Đang xử lý', class: 'status-processing' },
      'SHIPPED': { label: 'Đã giao hàng', class: 'status-shipped' },
      'DELIVERED': { label: 'Hoàn thành', class: 'status-delivered' },
      'CANCELLED': { label: 'Đã hủy', class: 'status-cancelled' }
    };
    const statusInfo = statusMap[status] || { label: status || 'Chờ xử lý', class: 'status-pending' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Render Dashboard
  const renderDashboard = () => {
    return (
      <div className="admin-dashboard-content">
        <h3>Tổng quan</h3>
        {error && <div className="error-banner">{error}</div>}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <h4>Sản phẩm</h4>
              <p className="stat-number">{stats.totalProducts}</p>
              <span className="stat-sub">Tồn kho: {stats.totalStock}</span>
              {stats.lowStockItems > 0 && (
                <span className="stat-warning">⚠️ {stats.lowStockItems} sản phẩm sắp hết</span>
              )}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h4>Đơn hàng</h4>
              <p className="stat-number">{stats.monthlyOrders}</p>
              <span className="stat-sub">Tháng này</span>
              <p className="stat-total">Tổng: {stats.totalOrders}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h4>Doanh thu</h4>
              <p className="stat-number">{formatPrice(stats.monthlyRevenue)}</p>
              <span className="stat-sub">Tháng này</span>
              <p className="stat-total">Tổng: {formatPrice(stats.totalRevenue)}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h4>Người dùng</h4>
              <p className="stat-number">{users.length}</p>
              <span className="stat-sub">Đang hoạt động</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Products Management (giữ nguyên như cũ)
  const renderProductsManagement = () => {
    return (
      <div className="admin-products-content">
        <form onSubmit={handleSubmit} className="admin-product-form">
          <h3>{isEditing ? `✏️ Chỉnh sửa: ${formData.name}` : "Thêm sản phẩm công nghệ mới"}</h3>
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
            <label>Đường dẫn hình ảnh (URL)</label>
            <input
              type="text"
              name="thumbnail"
              placeholder="Dán link ảnh đại diện sản phẩm..."
              value={formData.thumbnail}
              onChange={handleInputChange}
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
              {loading ? "Processing..." : isEditing ? "Update Product" : "Add Product"}
            </button>
            {isEditing && (
              <button type="button" className="admin-cancel-edit-btn" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="admin-products-list">
          <h3>📱 Danh sách sản phẩm hiện có ({products.length})</h3>
          {loading ? (
            <div className="loading-spinner">Đang tải...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">Chưa có sản phẩm nào. Hãy thêm sản phẩm mới!</div>
          ) : (
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
                    <tr key={prod._id} className={(prod.quantity || 0) < 5 ? 'low-stock' : ''}>
                      <td>
                        <img src={prod.thumbnail || "https://placehold.co/50x50/e0e0e0/999?text=No+Image"} alt={prod.name} className="admin-table-img" />
                      </td>
                      <td className="admin-table-name-cell">{prod.name}</td>
                      <td><code>{prod.sku}</code></td>
                      <td className="admin-table-price-cell">{formatPrice(prod.price)}</td>
                      <td>
                        <span className={(prod.quantity || 0) < 5 ? 'stock-badge low' : 'stock-badge'}>
                          {(prod.quantity || 0)}
                        </span>
                      </td>
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
          )}
        </div>
      </div>
    );
  };

  // Render Orders Management
  const renderOrdersManagement = () => {
    return (
      <div className="admin-orders-content">
        <h3>Quản lý đơn hàng</h3>
        {error && <div className="error-banner">{error}</div>}
        <div className="orders-stats">
          <div className="order-stat-item">
            <span className="stat-label">Tổng đơn hàng:</span>
            <span className="stat-value">{orders.length}</span>
          </div>
          <div className="order-stat-item">
            <span className="stat-label">Đang xử lý:</span>
            <span className="stat-value">{orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').length}</span>
          </div>
          <div className="order-stat-item">
            <span className="stat-label">Hoàn thành:</span>
            <span className="stat-value">{orders.filter(o => o.status === 'DELIVERED').length}</span>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-spinner">Đang tải...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">Chưa có đơn hàng nào</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Khách hàng</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td><code>#{order._id.slice(-6)}</code></td>
                    <td>{order.user?.name || order.user?.email || 'N/A'}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td className="admin-table-price-cell">{formatPrice(order.totalAmount || 0)}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <button className="action-btn-view">Xem</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // Render Users Management
  const renderUsersManagement = () => {
    return (
      <div className="admin-users-content">
        <h3>👥 Quản lý người dùng</h3>
        {error && <div className="error-banner">{error}</div>}
        <div className="users-stats">
          <div className="user-stat-item">
            <span className="stat-label">Tổng người dùng:</span>
            <span className="stat-value">{users.length}</span>
          </div>
          <div className="user-stat-item">
            <span className="stat-label">Admin:</span>
            <span className="stat-value">{users.filter(u => u.role === 'admin').length}</span>
          </div>
          <div className="user-stat-item">
            <span className="stat-label">Người dùng:</span>
            <span className="stat-value">{users.filter(u => u.role !== 'admin').length}</span>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-spinner">Đang tải...</div>
        ) : users.length === 0 ? (
          <div className="empty-state">Chưa có người dùng nào</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Tên người dùng</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Ngày tham gia</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=random`} 
                        alt={user.name} 
                        className="admin-table-avatar" 
                      />
                    </td>
                    <td className="admin-table-name-cell">{user.name || 'N/A'}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <button className="action-btn-edit">Sửa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // Main render switch
  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'products':
        return renderProductsManagement();
      case 'orders':
        return renderOrdersManagement();
      case 'users':
        return renderUsersManagement();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="admin-page">
      <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="sidebar-header">
            <h2 className={sidebarCollapsed ? 'hidden' : ''}>Admin Panel</h2>
            <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
              {sidebarCollapsed ? '☰' : '<'}
            </button>
          </div>
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              <span className="nav-icon">📊</span>
              {!sidebarCollapsed && <span className="nav-label">Tổng quan</span>}
            </button>
            <button 
              className={`nav-item ${activeSection === 'products' ? 'active' : ''}`}
              onClick={() => setActiveSection('products')}
            >
              <span className="nav-icon">📱</span>
              {!sidebarCollapsed && <span className="nav-label">Quản lý sản phẩm</span>}
            </button>
            <button 
              className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveSection('orders')}
            >
              <span className="nav-icon">📋</span>
              {!sidebarCollapsed && <span className="nav-label">Quản lý đơn hàng</span>}
            </button>
            <button 
              className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
              onClick={() => setActiveSection('users')}
            >
              <span className="nav-icon">👥</span>
              {!sidebarCollapsed && <span className="nav-label">Quản lý người dùng</span>}
            </button>
          </nav>
          <div className="sidebar-footer">
            <button className="nav-item" onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}>
              <span className="nav-icon">🚪</span>
              {!sidebarCollapsed && <span className="nav-label">Đăng xuất</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;