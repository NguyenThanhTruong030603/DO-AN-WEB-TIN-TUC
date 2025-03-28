module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.session.user) {
            return next(); // Cho phép truy cập nếu đã đăng nhập
        }
        res.redirect("/login"); // Chưa đăng nhập, chuyển hướng về trang đăng nhập
    },

    isAdmin: (req, res, next) => {
        if (req.session.user && req.session.user.role === "admin") {
            return next(); // Chỉ admin mới có thể tiếp tục
        }
        res.status(403).send("Bạn không có quyền truy cập!");
    }
};
