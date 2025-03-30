const jwt = require("jsonwebtoken");

exports.isAuthenticated = (req, res, next) => {
    
    const token = req.cookies.token;

    if (!token) {
        console.log("❌ Không tìm thấy token!");
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, "NGUYENTHANHTRUONG333");
        req.user = decoded;
        
        next();
    } catch (error) {
        console.log("❌ Token không hợp lệ!", error);
        return res.redirect("/login");
    }
};

exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
    }
    next();
};
