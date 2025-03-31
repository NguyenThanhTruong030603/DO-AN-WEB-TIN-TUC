const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.showLoginForm = (req, res) => {
    res.render("login.ejs");
};

exports.login = async (req, res) => {
    try {
         
        const { username, password } = req.body;

        if (!username || !password) {
            return res.render("login", { error: "Vui lòng nhập đủ thông tin!" });
        }

        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.render("login", { error: "Sai tên đăng nhập hoặc mật khẩu!" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            "NGUYENTHANHTRUONG333",
            { expiresIn: "1h" }
        );
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Để test trên localhost, nếu deploy thì đặt thành true
            sameSite: "Lax"
        });
        res.redirect("/");
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        res.status(500).json({ message: "Lỗi đăng nhập!" });
    }
};


exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
};
