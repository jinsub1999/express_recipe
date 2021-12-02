var express = require("express");
var router = express.Router();
var multer = require("multer");
const upload = multer();
var conn = require("./db");
router.get("/", function (req, res, next) {
  res.render("index", { title: "MySQL" });
});
router.get("/getDBInfo", function (req, res, next) {
  conn.query("select * from producttable;", function (err, rows, fields) {
    if (err) throw err;
    if (rows !== undefined) {
      res.header({ "content-type": "application/json" });
      res.send(rows);
    } else res.json({ success: true });
  });
});
router.post("/insertProductInfo", upload.none(), function (req, res, next) {
  conn.query(
    `INSERT INTO producttable(itemName, itemPrice, itemGroup) 
    Value(?,?,?);`,
    [req.body.itemName, req.body.itemPrice, req.body.itemGroup],
    function (err, result, fields) {
      if (err) {
        res.status(404).send({ err: "404 ERROR, Wrong Request." });
      } else {
        console.log(result);
        res.header({ "content-type": "application/json" });
        res.send(result);
      }
    }
  );
});
module.exports = router;
