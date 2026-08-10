const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");
router.get("/", getAllCategories);
router.post("/",authMiddleware, adminMiddleware, createCategory);
router.put("/:id",authMiddleware,adminMiddleware, updateCategory);
router.delete("/:id",authMiddleware,adminMiddleware, deleteCategory);
module.exports = router;