const express = require ("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    getMe,
    updateProfile,
    changePassword
    }=require("../controllers/userController");

router.get("/me", authMiddleware, getMe);
router.get("/update", authMiddleware, updateProfile);
router.get("/changepassword", authMiddleware, changePassword);

module.exports = router;

