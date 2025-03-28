const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const articleController = require("../controllers/articleController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

// Import Middleware
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

// =========================
// Routes cho Category
// =========================
router.get("/categories", isAuthenticated, categoryController.getAllCategories);
router.get("/categories/add", isAdmin, categoryController.showAddCategoryForm);
router.post("/categories/add", isAdmin, categoryController.createCategory);
router.get("/categories/edit/:id", isAdmin, categoryController.showUpdateCategoryForm);
router.post("/categories/edit/:id", isAdmin, categoryController.updateCategory);
router.post("/categories/delete/:id", isAdmin, categoryController.deleteCategory);

// =========================
// Routes cho Article
// =========================
router.get("/articles", isAuthenticated, articleController.getAllArticles);

router.get("/articles/add", isAuthenticated, articleController.showAddArticleForm);
router.post("/articles/add", isAuthenticated, articleController.createArticle);
router.get("/articles/:id", isAuthenticated, articleController.getArticleById);
router.get("/articles/edit/:id", isAuthenticated, articleController.showUpdateArticleForm);
router.post("/articles/edit/:id", isAuthenticated, articleController.updateArticle);
router.post("/articles/delete/:id", isAdmin, articleController.deleteArticle);
// Routes cho Authentication
// =========================
router.get("/login", (req, res) => res.render("login"));
router.post("/login", authController.login);

router.get("/logout", authController.logout);
// =========================
// Routes cho User (Chỉ Admin mới được quản lý)
// =========================

router.get("/",  userController.getAllUsers);
router.get("/add",  userController.showAddUserForm);
router.post("/add", userController.createUser);
router.get("/:id",  userController.getUserById);
router.get("/edit/:id", userController.showUpdateUserForm);
router.post("/edit/:id",  userController.updateUser);
router.post("/delete/:id",  userController.deleteUser);
// router.post("/delete/:id", isAdmin, userController.deleteUser);
// =========================


module.exports = router;
