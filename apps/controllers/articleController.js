const Article = require("../models/Article");
const Category = require("../models/Category");
const User = require("../models/User");

// Lấy tất cả bài viết
const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().populate("author", "username").populate("category", "name");
        res.render("admin/article", { articles });
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách bài viết!", error });
    }
};

// Lấy bài viết theo ID
const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate("author", "username").populate("category", "name");
        if (!article) return res.status(404).json({ message: "Không tìm thấy bài viết!" });
        res.render("admin/articleDetail", { article });
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy bài viết!", error });
    }
};

// Hiển thị form thêm bài viết
const showAddArticleForm = async (req, res) => {
    try {
        const categories = await Category.find();
        const users = await User.find();
        res.render("admin/addArticle", { categories, users });
    } catch (error) {
        res.status(500).json({ message: "Lỗi hiển thị form thêm bài viết!", error });
    }
};

// Thêm bài viết mới
const createArticle = async (req, res) => {
    try {
        const article = new Article(req.body);
        await article.save();
        res.redirect("articles"); // Chuyển hướng sau khi thêm thành công
    } catch (error) {
        res.status(500).json({ message: "Lỗi tạo bài viết!", error });
    }
};

// Hiển thị form cập nhật bài viết
const showUpdateArticleForm = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        const categories = await Category.find();
        const users = await User.find();
        if (!article) return res.status(404).send("Không tìm thấy bài viết!");
        res.render("admin/updateArticle", { article, categories, users });
    } catch (error) {
        res.status(500).send("Lỗi hiển thị form cập nhật bài viết!");
    }
};

// Cập nhật bài viết
const updateArticle = async (req, res) => {
    try {
        await Article.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/articles"); // Chuyển hướng sau khi cập nhật thành công
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật bài viết!", error });
    }
};

// Xóa bài viết
const deleteArticle = async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.redirect("/articles"); // Chuyển hướng sau khi xóa thành công
    } catch (error) {
        res.status(500).json({ message: "Lỗi xóa bài viết!", error });
    }
};

module.exports = {
    getAllArticles,
    getArticleById,
    showAddArticleForm,
    createArticle,
    showUpdateArticleForm,
    updateArticle,
    deleteArticle
};

