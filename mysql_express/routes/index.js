var express = require("express");
var router = express.Router();
var multer = require("multer");
const upload = multer();
var conn = require("./db");
router.get("/", function (req, res, next) {
  res.render("index", { title: "MySQL" });
});
router.get("/getRecipe", function (req, res, next) {
  conn.query("select * from recipes;", function (err, rows, fields) {
    if (err) throw err;
    if (rows !== undefined) {
      res.header({ "content-type": "application/json" });
      res.send(rows);
    } else res.json({ success: true });
  });
});
router.post("/insertRecipe", upload.none(), function (req, res, next) {
  if (req.session.isLogined) {
    console.log(req.body);
    const currdate = new Date().toISOString().slice(0, 19).replace("T", " ");
    conn.query(
      `INSERT INTO recipes(name, recipe, author, uploadDate) 
      Value(?,?,?,?);`,
      [req.body.recipeName, req.body.recipeBody, req.session.userID, currdate],
      function (err, result, fields) {
        if (err) {
          console.log(err);
          res.status(200).json({ success: false, message: "not logined.", errs: ["에러가 발생하였습니다."] });
        } else {
          console.log(result);
          res.header({ "content-type": "application/json" });
          res.json({
            success: true,
            message: "Upload success.",
          });
        }
      }
    );
  } else
    res.json({
      success: false,
      message: "not logined.",
      errs: ["로그인이 필요한 서비스입니다."],
    });
});
module.exports = router;
