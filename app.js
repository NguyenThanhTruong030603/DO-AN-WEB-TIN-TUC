var express = require("express");
var mongoose = require("mongoose"); // Import mongoose
var app = express();
app.use(express.urlencoded({ extended: true })); // Cho phép đọc dữ liệu từ form HTML
app.use(express.json());
var controller = require(__dirname + "/apps/controllers");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const multer = require("multer");
const path = require("path");

// Kết nối tới MongoDB
mongoose.connect("mongodb+srv://truongleu7:123123123@cluster0.tfv6c.mongodb.net/TinTucDB?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Kết nối MongoDB thành công"))
.catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

app.use(session({
    secret: "AHEKTDMBBCLRNT123", // Thay bằng secret thực tế
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb+srv://truongleu7:123123123@cluster0.tfv6c.mongodb.net/TinTucDB?retryWrites=true&w=majority&appName=Cluster0" }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 ngày
}));

app.set("views", __dirname + "/apps/views");
app.set("view engine", "ejs");
app.use("/static", express.static(__dirname + "/public"));
app.use(controller);

// 📌 **Cấu hình multer để upload ảnh**
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/"); // Lưu ảnh vào thư mục public/uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file theo timestamp
    }
});
const upload = multer({ storage: storage });

// 📌 **API xử lý upload ảnh**
app.post("/upload-image", upload.single("upload"), (req, res) => {
    console.log("File nhận được:", req.file); // Xem file có nhận được không

    if (!req.file) {
        return res.status(400).json({ error: "Không có ảnh được tải lên" });
    }
    res.json({ url: `/uploads/${req.file.filename}` });
});

// 📌 **Cho phép truy cập ảnh từ thư mục uploads**
app.use("/uploads", express.static("public/uploads"));

var server = app.listen(3000, () => {
   console.log("🚀 Server đang chạy tại cổng 3000");
});
