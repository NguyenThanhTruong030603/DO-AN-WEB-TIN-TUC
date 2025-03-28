const Category = require("../models/Category");

// Lấy tất cả danh mục và hiển thị trang
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.render("category", { categories });
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh mục!", error });
    }
};

// Hiển thị form thêm danh mục
const showAddCategoryForm = (req, res) => {
    res.render("categoryAdd");
};

// Thêm danh mục mới
const createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.redirect("/categories");
    } catch (error) {
        res.status(400).json({ message: "Lỗi tạo danh mục!", error });
    }
};

// Hiển thị form chỉnh sửa danh mục
const showUpdateCategoryForm = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục!" });
        res.render("categoryEdit", { category });
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh mục!", error });
    }
};

// Cập nhật danh mục theo ID
const updateCategory = async (req, res) => {
    try {
        await Category.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/categories");
    } catch (error) {
        res.status(400).json({ message: "Lỗi cập nhật danh mục!", error });
    }
};

// Xóa danh mục theo ID
const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.redirect("/categories");
    } catch (error) {
        res.status(500).json({ message: "Lỗi xóa danh mục!", error });
    }
};

module.exports = {
    getAllCategories,
    showAddCategoryForm,
    createCategory,
    showUpdateCategoryForm,
    updateCategory,
    deleteCategory
};
