const User = require("../models/User");

// Lấy danh sách tất cả người dùng
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render("admin/user", { users });
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách người dùng!", error });
    }
};

// Lấy thông tin người dùng theo ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        res.render("admin/userDetail", { user });
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy thông tin người dùng!", error });
    }
};

// Hiển thị form thêm người dùng
const showAddUserForm = (req, res) => {
    res.render("admin/addUser");
};

// Thêm người dùng mới
const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const newUser = new User({ username, email, password, role });
        await newUser.save();
        res.redirect("/admin/user");
    } catch (error) {
        res.status(400).json({ message: "Lỗi tạo người dùng!", error });
    }
};

// Hiển thị form cập nhật người dùng
const showUpdateUserForm = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("Không tìm thấy người dùng!");
        res.render("admin/updateUser", { user });
    } catch (error) {
        res.status(500).send("Lỗi hiển thị form cập nhật người dùng!");
    }
};

// Cập nhật thông tin người dùng
const updateUser = async (req, res) => {
    try {
        const { username, email, role } = req.body;
        await User.findByIdAndUpdate(req.params.id, { username, email, role });
        res.redirect("/admin/user");
    } catch (error) {
        res.status(400).json({ message: "Lỗi cập nhật người dùng!", error });
    }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect("/admin/user");
    } catch (error) {
        res.status(500).json({ message: "Lỗi xóa người dùng!", error });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    showAddUserForm,
    createUser,
    showUpdateUserForm,
    updateUser,
    deleteUser
};
