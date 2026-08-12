const Cart = require("../models/Cart");

// 1. LẤY GIỎ HÀNG CỦA USER ĐANG ĐĂNG NHẬP
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId }).populate("products.product");
    if (!cart) {
      cart = await Cart.create({ user: req.user.userId, products: [] });
    }
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 2. THÊM HOẶC CẬP NHẬT SỐ LƯỢNG SẢN PHẨM TRONG GIỎ
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.userId;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, products: [] });
    }

    const itemIndex = cart.products.findIndex(p => p.product.toString() === productId);

    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += Number(quantity);
    } else {
      cart.products.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    const updatedCart = await cart.populate("products.product");
    return res.status(200).json(updatedCart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 3. XÓA MỘT SẢN PHẨM KHỎI GIỎ HÀNG
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    
    await cart.save();
    const updatedCart = await cart.populate("products.product");
    return res.status(200).json(updatedCart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart };
