import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductDetail from "../pages/ProductDetail";
import Profile from "../pages/Profile";
import Admin from "../pages/Admin";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/product/:id" element={<ProductDetail />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/admin" element={<Admin />} />

      <Route path="/cart" element={<Cart />} />

      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}

export default AppRoutes;