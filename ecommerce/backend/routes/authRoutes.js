const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { 
    register,
    verifyEmail,
    login,
    getMe,
    forgotPassword,
    resetPassword,

 } = require("../controllers/authController");

router.post("/register", register);

router.post("/verify-email", verifyEmail);

router.post("/login", login);

router.get("/me", authMiddleware, getMe);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

module.exports = router;
