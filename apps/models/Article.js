const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    image: { type: String, default: "" }, // Thêm trường hình ảnh
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Liên kết tác giả
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // Liên kết danh mục
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Article", articleSchema);
