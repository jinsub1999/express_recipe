var express = require("express");
var router = express.Router();
var multer = require("multer");
const upload = multer();
var mysql = require("mysql2");

// nodemon app.js
var conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});
conn.connect();
conn.query("USE marketdb;");
router.get("/", function (req, res, next) {
  conn.query("select * from items;", function (err, rows, fields) {
    if (err) throw err;
  });
  res.render("index", { title: "MySQL" });
});
router.get("/getDBInfo", function (req, res, next) {
  conn.query("select * from items;", function (err, rows, fields) {
    if (err) throw res.send(err);
    res.header({ "content-type": "application/json" });
    res.send(rows);
  });
});
router.post("/insertProductInfo", upload.none(), function (req, res, next) {
  // console.log(req.headers);
  conn.query(
    `INSERT INTO items(name, price, groupname) 
    Value(?,?,?);`,
    [req.body.itemName, req.body.itemPrice, req.body.itemGroup],
    function (err, result, fields) {
      if (err) {
        res.status(400).send({ err: "404 ERROR, Wrong Request." });
      } else {
        console.log(result);
        res.header({ "content-type": "application/json" });
        res.send(result);
      }
    }
  );
});
module.exports = router;
