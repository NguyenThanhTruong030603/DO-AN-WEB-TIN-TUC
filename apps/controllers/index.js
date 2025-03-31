const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const articleController = require("../controllers/articleController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const multer = require("multer");
const path = require("path");
const Article = require("../models/Article");
const Category = require("../models/Category");
const User = require("../models/User");
// Import Middleware
const { isAuthenticated, isAdmin,checkAuth } = require("../middlewares/authMiddleware");
// Cấu hình Multer để upload ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
// =========================
// Routes cho Category
// =========================
router.get("/admin/categories", isAuthenticated,isAdmin, categoryController.getAllCategories);
router.get("/admin/categories/add",isAuthenticated, isAdmin, categoryController.showAddCategoryForm);
router.post("/admin/categories/add",isAuthenticated, isAdmin, categoryController.createCategory);
router.get("/admin/categories/edit/:id", isAuthenticated,isAdmin, categoryController.showUpdateCategoryForm);
router.post("/admin/categories/edit/:id", isAuthenticated,isAdmin, categoryController.updateCategory);
router.post("/admin/categories/delete/:id",isAuthenticated, isAdmin, categoryController.deleteCategory);

// =========================
// Routes cho Article
// =========================
router.get("/admin/articles", isAuthenticated,isAdmin, articleController.getAllArticles);
router.get("/admin", isAuthenticated,isAdmin, articleController.getAllArticles);
router.get("/admin/articles/add", isAuthenticated,isAdmin, articleController.showAddArticleForm);
router.post("/admin/articles/add",isAuthenticated,isAdmin, upload.single("image"), articleController.createArticle);
router.get("/admin/articles/:id", isAuthenticated,isAdmin, articleController.getArticleById);
router.get("/admin/articles/edit/:id", isAuthenticated,isAdmin, articleController.showUpdateArticleForm);
router.post("/admin/articles/edit/:id", isAuthenticated,isAdmin,upload.single("image"), articleController.updateArticle);
router.post("/admin/articles/delete/:id",isAuthenticated, isAdmin, articleController.deleteArticle);
// Routes cho Authentication
router.get("/search",checkAuth, async (req, res) => {
    try {
        const categories = await Category.find();
        const query = req.query.query.trim(); // Lấy từ khóa tìm kiếm
        if (!query) {
            return res.redirect("/"); // Nếu không nhập gì thì quay về trang chủ
        }

        // Tìm bài viết có tiêu đề hoặc nội dung chứa từ khóa (không phân biệt hoa thường)
        const articles = await Article.find({
            $or: [
                { title: { $regex: query, $options: "i" } }, // Tìm trong tiêu đề
                { content: { $regex: query, $options: "i" } } // Tìm trong nội dung
            ]
        });

        res.render("Search", { articles, query,categories });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
});
// =========================
router.get("/login", authController.showLoginForm);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
// =========================
// Routes cho User (Chỉ Admin mới được quản lý)
// =========================
router.get("/register",  async (req, res) => {
    res.render("addUser")
});
router.post("/register/add",  async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const newUser = new User({ username, email, password, role });
        await newUser.save();
        res.redirect("/login");
    } catch (error) {
        res.status(400).json({ message: "Lỗi tạo người dùng!", error });
    }
});

router.get("/admin/user",isAuthenticated, isAdmin,  userController.getAllUsers);
router.get("/admin/user/add",isAuthenticated, isAdmin,  userController.showAddUserForm);
router.post("/admin/user/add",isAuthenticated, isAdmin, userController.createUser);
router.get("/admin/user/:id",isAuthenticated, isAdmin,  userController.getUserById);
router.get("/admin/user/edit/:id",isAuthenticated, isAdmin, userController.showUpdateUserForm);
router.post("/admin/user/edit/:id",isAuthenticated, isAdmin,  userController.updateUser);
router.post("/admin/user/delete/:id",isAuthenticated, isAdmin,  userController.deleteUser);
// router.post("/delete/:id", isAdmin, userController.deleteUser);
// =========================
router.get("/",checkAuth,async (req, res) => {
    try {
        const articles = await Article.find().populate("author", "username").populate("category", "name");
        const categories = await Category.find();
        res.render("home", { articles,categories });
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách bài viết!", error });
    }
})

router.get("/category/:id",checkAuth, async (req, res) => {
    const category = await Category.findById(req.params.id);
    const categories = await Category.find();
    if (!category) {
        return res.status(404).send("Category not found");
    }
    const articles = await Article.find({ category: category._id }).populate("author");
    res.render("categorySearch", { category, articles,categories});
});
router.get("/articles/:id",checkAuth,async (req, res) => {
    try {
        const categories = await Category.find();
        const articles = await Article.find().populate("author", "username").populate("category", "name");
        const article = await Article.findById(req.params.id).populate("author", "username").populate("category", "name");
        if (!article) return res.status(404).json({ message: "Không tìm thấy bài viết!" });
        res.render("articleDetail", { article ,articles,categories});
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy bài viết!", error });
    }
})

module.exports = router;
