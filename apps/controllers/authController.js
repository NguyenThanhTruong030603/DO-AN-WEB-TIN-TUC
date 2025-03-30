const User = require("../models/User");

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log("Session trước khi lưu:", req.session); // ✅ Kiểm tra session

        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send("Tên đăng nhập hoặc mật khẩu không đúng!");
        }

        // ✅ Kiểm tra req.session đã tồn tại
        if (!req.session) {
            console.error("❌ req.session chưa được khởi tạo!");
            return res.status(500).json({ message: "Lỗi session!" });
        }

        // Lưu user vào session
        req.session.user = { id: user._id, username: user.username, role: user.role };
        
        // console.log("Session sau khi lưu:", req.session); // ✅ Kiểm tra lại session

        res.redirect("/articles");
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
        res.status(500).json({ message: "Lỗi đăng nhập!", error: error.message });
    }
};



exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};


