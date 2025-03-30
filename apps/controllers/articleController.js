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
        let imagePath = "";
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        const article = new Article({
            title: req.body.title,
            content: req.body.content,
            image: imagePath, // Lưu đường dẫn ảnh vào DB
            author: req.body.author,
            category: req.body.category
        });

        await article.save();
        res.redirect("/admin/articles");
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
        const existingArticle = await Article.findById(req.params.id);
        if (!existingArticle) {
            return res.status(404).json({ message: "Bài viết không tồn tại!" });
        }

        // Nếu có ảnh mới thì cập nhật, nếu không thì giữ nguyên
        let imagePath = existingArticle.image;
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        await Article.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content,
            image: imagePath, // Cập nhật ảnh nếu có ảnh mới
            author: req.body.author,
            category: req.body.category
        });

        res.redirect("/admin/articles");
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật bài viết!", error });
    }
};


// Xóa bài viết
const deleteArticle = async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.redirect("/admin/articles"); // Chuyển hướng sau khi xóa thành công
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

