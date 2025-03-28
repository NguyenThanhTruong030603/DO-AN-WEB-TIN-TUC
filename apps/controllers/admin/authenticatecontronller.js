var express = require("express");
var router = express.Router();


router.use("/login", function(req, res){
    res.render("admin/login.ejs");
});
module.exports = router;
