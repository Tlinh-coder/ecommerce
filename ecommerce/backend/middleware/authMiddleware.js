const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Bạn chưa đăng nhập"
        });
    }

    const jwtToken = token.split(" ")[1];

    try {
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token không hợp lệ"
        });
    }
};

module.exports = authMiddleware;