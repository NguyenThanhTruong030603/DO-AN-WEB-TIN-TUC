const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    article: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true }, // Bài viết được bình luận
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người bình luận
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", commentSchema);
