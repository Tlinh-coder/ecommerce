const Product = require("../models/Product");
const mongoose = require("mongoose");

const getAllProducts = async (req, res) => {
    try {
        let filter = {};

        if (req.query.category && req.query.category.trim() !== "") {
            const categoryId = req.query.category.trim();
            
            if (mongoose.Types.ObjectId.isValid(categoryId)) {
                filter.category = new mongoose.Types.ObjectId(categoryId);
            } else {
                filter.category = categoryId; 
            }
        }

        if (req.query.search && req.query.search.trim() !== "") {
            const keyword = req.query.search.trim();
            filter.name = new RegExp(keyword, "i");
        }

        const products = await Product.find(filter).populate("category");
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category");

        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createProduct = async (req, res) => {
    try { 
        console.log(req.body);
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm"
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm"
            });
        }

        res.json({
            message: "Xóa sản phẩm thành công"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
