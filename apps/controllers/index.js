const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const articleController = require("../controllers/articleController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const multer = require("multer");
const path = require("path");
// Import Middleware
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");
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
router.get("/categories", isAuthenticated, categoryController.getAllCategories);
router.get("/categories/add",isAuthenticated, isAdmin, categoryController.showAddCategoryForm);
router.post("/categories/add",isAuthenticated, isAdmin, categoryController.createCategory);
router.get("/categories/edit/:id", isAuthenticated,isAdmin, categoryController.showUpdateCategoryForm);
router.post("/categories/edit/:id", isAuthenticated,isAdmin, categoryController.updateCategory);
router.post("/categories/delete/:id",isAuthenticated, isAdmin, categoryController.deleteCategory);

// =========================
// Routes cho Article
// =========================
router.get("/admin/articles", isAuthenticated, articleController.getAllArticles);

router.get("/admin/articles/add", isAuthenticated, articleController.showAddArticleForm);
router.post("/admin/articles/add",isAuthenticated, upload.single("image"), articleController.createArticle);
router.get("/admin/articles/:id", isAuthenticated, articleController.getArticleById);
router.get("/admin/articles/edit/:id", isAuthenticated, articleController.showUpdateArticleForm);
router.post("/admin/articles/edit/:id", isAuthenticated,upload.single("image"), articleController.updateArticle);
router.post("/admin/articles/delete/:id",isAuthenticated, isAdmin, articleController.deleteArticle);
// Routes cho Authentication

// =========================
router.get("/login", authController.showLoginForm);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
// =========================
// Routes cho User (Chỉ Admin mới được quản lý)
// =========================

router.get("/admin/user",  userController.getAllUsers);
router.get("/admin/user/add",  userController.showAddUserForm);
router.post("/admin/user/add", userController.createUser);
router.get("/admin/user/:id",  userController.getUserById);
router.get("/admin/user/edit/:id", userController.showUpdateUserForm);
router.post("/admin/user/edit/:id",  userController.updateUser);
router.post("/admin/user/delete/:id",  userController.deleteUser);
// router.post("/delete/:id", isAdmin, userController.deleteUser);
// =========================


module.exports = router;
